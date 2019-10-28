import { get } from 'svelte/store'
import userStore from '../store/user'
import { signTx, encryptData, decryptData } from '../crypto'
import config from '../config'
import { createTx, claimKey, scanQr } from './cosmos.msgs'

const broadcastMsg = async (msg, address, cosmosKey) => {
  const accRes = await fetch(`${config.chainEndpoint}/auth/accounts/${address}`)
  const {
    result: { value },
  } = await accRes.json()
  const tx = createTx(value.account_number, value.sequence, msg)
  const signedTx = await signTx(tx, cosmosKey)

  const res = await fetch(`${config.chainEndpoint}/longy/txs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(signedTx),
  })

  if (!res.ok) {
    throw new Error(`Failed to broadcast tx: ${msg.typee}`)
  }

  const json = await res.json()
  if (json.code) {
    throw new Error(`Cosmos request failed with code: ${json.code}`)
  }
}

export default {
  async isBadgeClaimed(badgeId) {
    const contact = await this.getContactByBadge(badgeId)
    return contact.claimed
  },

  async claimBadge(address, secret, profile) {
    const user = get(userStore)
    const { cosmosKey, rsaKeyPair } = user
    const encryptedInfo = await encryptData(profile, rsaKeyPair.publicKey)
    const msg = claimKey({
      attendeeAddress: address,
      secret,
      rsaPublicKey: rsaKeyPair.publicKey,
      name: profile.name,
      encryptedInfo,
    })
    await broadcastMsg(msg, address, cosmosKey)
    userStore.set({ address, ...user, profile })
  },

  async getContactByBadge(badgeId) {
    const res = await fetch(
      `${config.chainEndpoint}/longy/attendees/${badgeId}`
    )
    const { result } = await res.json()
    return result.value || {}
  },

  async getContactByAddr(address) {
    const res = await fetch(
      `${config.chainEndpoint}/longy/attendees/address/${address}`
    )
    const { result } = await res.json()
    return result.value || {}
  },

  async getContactNameByBadge(badgeId) {
    const contact = await this.getContactByBadge(badgeId)
    return contact.name
  },

  async getContactNameByAddr(address) {
    const contact = await this.getContactByAddr(address)
    return contact.name
  },

  async scanContact(badgeId, sharePayload) {
    const { address, cosmosKey } = get(userStore)
    const contact = await this.getContactByBadge(badgeId)

    let data
    if (sharePayload) {
      data = await encryptData(sharePayload, contact.rsaPublicKey)
    }

    const msg = scanQr({
      sender: address,
      scannedQR: badgeId,
      data,
    })

    await broadcastMsg(msg, address, cosmosKey)
  },

  async getPlayerScore() {
    const { address } = get(userStore)
    const contact = await this.getContactByAddr(address)
    return contact.rep
  },

  async getScan(scanId, decrypt = false) {
    const { address, rsaKeyPair } = get(userStore)
    const scanRes = await fetch(`${config.chainEndpoint}/longy/scans/${scanId}`)
    const {
      result: {
        value: { s1, s2, d1, d2, p1, p2, unixTimeSec, accepted },
      },
    } = await scanRes.json()

    const isSelfInitiated = s1 === address
    const [contactAddr, encryptedData, points] = isSelfInitiated
      ? [s2, d2, p2]
      : [s1, d1, p1]
    const name = await this.getContactNameByAddr(contactAddr)

    let profile = {}
    if (accepted && decrypt && encryptedData) {
      const { sharedAttrs, message } = await decryptData(
        encryptedData,
        rsaKeyPair.privateKey
      )
      profile = { sharedAttrs, message }
    }

    const contact = await this.getContactByAddr(contactAddr)

    return {
      scanId,
      id: contact.id,
      address: contactAddr,
      ...profile,
      accepted,
      points,
      name,
      imageUrl: `${config.contentEndpoint}/avatars/${contact.id}`,
      timestamp: unixTimeSec * 1000,
      isSelfInitiated,
    }
  },

  async getPlayer() {
    const { address } = get(userStore)
    const contact = await this.getContactByAddr(address)
    const scanIds = contact.scanIds || []
    const scans = await Promise.all(scanIds.map(id => this.getScan(id)))

    return {
      id: contact.id,
      address,
      name: contact.name,
      score: contact.rep,
      claimedAt: contact.unixTimeSecClaimed * 1000,
      scans,
    }
  },

  async getPrizes() {
    const res = await fetch(`${config.chainEndpoint}/longy/prizes`)
    const { result } = await res.json()
    return result
  },

  async getWinnings(address) {
    const res = await fetch(
      `${config.chainEndpoint}/longy/winnings?address_id=${address}`
    )
    const { result } = await res.json()
    return result
  },

  async claimWinnings(address, sig) {
    await fetch(`${config.chainEndpoint}/longy/claim`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address, sig }),
    })
  },

  async getLeaderboard() {
    const res = await fetch(`${config.chainEndpoint}/longy/leader`)
    const { result } = await res.json()

    const processTier = (name, tier) => {
      const attendees = tier.attendees || []
      const rep = attendees.map(a => parseInt(a.rep, 10))

      return {
        ...tier,
        attendees,
        name,
        prizePerAttendee:
          rep.length && Math.floor(tier.prizeAmount / rep.length),
        numAttendees: attendees.length,
        minRep: rep.length && Math.min(...rep),
        maxRep: rep.length && Math.max(...rep),
      }
    }

    const tiers = [
      processTier('Platinum', result.value.tier1),
      processTier('Gold', result.value.tier2),
    ]

    return tiers
  },
}
