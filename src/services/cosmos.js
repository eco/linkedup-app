import { get } from 'svelte/store'
import userStore from '../store/user'
import { signTx, encryptData, decryptData, signExport } from '../crypto'
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
    throw new Error(`Failed to broadcast tx: ${msg.type}`)
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

  async getScan(scanId) {
    const { address } = get(userStore)
    const scanRes = await fetch(`${config.chainEndpoint}/longy/scans/${scanId}`)
    const {
      result: {
        value: { s1, s2, d1, d2, p1, p2, unixTimeSec, accepted },
      },
    } = await scanRes.json()

    const isSelfInitiated = s1 === address
    const [contactAddr, encryptedData, points] = isSelfInitiated
      ? [s2, d2, p1]
      : [s1, d1, p2]
    const contact = await this.getContactByAddr(contactAddr)

    return {
      scanId,
      id: contact.id,
      address: contactAddr,
      accepted,
      points,
      name: contact.name,
      imageUrl: `${config.contentEndpoint}/avatars/${contact.id}`,
      timestamp: unixTimeSec * 1000,
      isSelfInitiated,
      encryptedData,
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
    return result || []
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

    const processTier = (name, tier, offset) => {
      const attendees = tier.attendees || []
      const rep = attendees.filter(a => a.rep).map(a => parseInt(a.rep, 10))

      return {
        ...tier,
        attendees,
        name,
        prizePerAttendee:
          rep.length && Math.floor(tier.prizeAmount / rep.length),
        numAttendees: attendees.length,
        minRep: rep.length && Math.min(...rep),
        maxRep: rep.length && Math.max(...rep),
        offset,
      }
    }

    const tier1 = processTier('Top Ten', result.value.tier1, 0)
    const tier2 = processTier(
      'Runner Up',
      result.value.tier2,
      tier1.numAttendees
    )
    return [tier1, tier2]
  },

  async getBonus() {
    const res = await fetch(`${config.chainEndpoint}/longy/bonus`)
    if (res.status === 404) {
      return { active: false }
    }
    if (!res.ok) {
      throw new Error('Failed to fetch bonus')
    }
    const json = await res.json()
    return {
      active: true,
      multiplier: parseFloat(json.value.multiplier, 10),
    }
  },

  async exportContacts() {
    const { cosmosKey, rsaKeyPair } = get(userStore)
    const player = await this.getPlayer()

    // decrypt all shared data
    const contacts = await Promise.all(
      player.scans.map(async scan => {
        let data = {}
        if (scan.encryptedData) {
          data = await decryptData(scan.encryptedData, rsaKeyPair.privateKey)
        }
        return { ...scan, ...data }
      })
    )

    // create signature
    const signature = await signExport(cosmosKey)

    console.log({ contacts, signature })
  },
}
