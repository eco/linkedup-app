import { get } from 'svelte/store'
import { user } from '../store'
import { signTx, encryptData, decryptData } from '../crypto'
import { createTx, claimKey, scanQr } from './cosmos.msgs'

const broadcastMsg = async msg => {
  const { address, cosmosKey } = get(user)
  const accRes = await fetch(`/auth/accounts/${address}`)
  const {
    result: { value },
  } = await accRes.json()
  const tx = createTx(value.account_number, value.sequence, msg)
  const signedTx = await signTx(tx, Buffer.from(cosmosKey, 'hex'))

  const res = await fetch('/longy/txs', {
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
    const res = await fetch(`/longy/attendees/${badgeId}`)
    const { result } = await res.json()
    return result.value.Claimed
  },

  async claimBadge(address, secret, name) {
    const { rsaKeyPair } = get(user)
    const msg = claimKey({
      attendeeAddress: address,
      secret,
      rsaPublicKey: rsaKeyPair.publicKey,
      encryptedInfo: 'todo',
      name,
    })
    user.set({ address, ...get(user) })
    await broadcastMsg(msg)
  },

  async getContactNameByBadge(badgeId) {
    const res = await fetch(`/longy/attendees/${badgeId}`)
    const { result } = await res.json()
    return result.value.Name || 'Mr Ed'
  },

  async getContactNameByAddr(address) {
    const res = await fetch(`/longy/attendees/address/${address}`)
    const { result } = await res.json()
    return result.value.Name || 'Mr Ed'
  },

  async scanContact(badgeId, sharePayload) {
    const { address } = get(user)
    const res = await fetch(`/longy/attendees/${badgeId}`)
    const { result } = await res.json()

    let data = null
    if (sharePayload) {
      data = await encryptData(sharePayload, result.value.RsaPublicKey)
    }

    const msg = scanQr({
      sender: address,
      scannedQR: badgeId,
      data,
    })

    await broadcastMsg(msg)
  },

  async getPlayerScore() {
    const { address } = get(user)
    const res = await fetch(`/longy/attendees/address/${address}`)
    const { result } = await res.json()
    return result.value.Rep
  },

  async getScan(scanId, decrypt = false) {
    const { address, rsaKeyPair } = get(user)
    const scanRes = await fetch(`/longy/scans/${scanId}`)
    const {
      result: { S1, S2, D1, D2, P1, P2, UnixTimeSec, Accepted: accepted },
    } = await scanRes.json()

    const isSlot1Self = S1 === address
    const [contactAddr, encryptedData, points] = isSlot1Self
      ? [S2, D2, P2]
      : [S1, D1, P1]
    const name = await this.getContactNameByAddr(contactAddr)

    let profile = {}
    if (accepted && decrypt && encryptedData) {
      const { sharedAttrs, message } = await decryptData(
        encryptedData,
        rsaKeyPair.privateKey
      )
      profile = { sharedAttrs, message }
    }

    const res = await fetch(`/longy/attendees/address/${contactAddr}`)
    const {
      result: { value },
    } = await res.json()

    return {
      scanId,
      address: contactAddr,
      ...profile,
      accepted,
      points,
      name,
      imageUrl: `/linkedup-user-content/avatars/${value.ID}`,
      timestamp: UnixTimeSec * 1000,
    }
  },

  async getReputationLog() {
    const { address } = get(user)
    const res = await fetch(`/longy/attendees/address/${address}`)
    const {
      result: { value },
    } = await res.json()
    const scanIds = value.ScanIDs || []

    const verificationEntry = {
      name: value.Name,
      timestamp: value.UnixTimeSecClaimed * 1000,
      points: 5,
      label: 'Verified your profile',
      imageUrl: `/linkedup-user-content/avatars/${value.ID}`,
    }

    let scans = await Promise.all(scanIds.map(id => this.getScan(id)))
    scans = scans
      .filter(scan => scan.accepted)
      .map(s => ({
        ...s,
        label: `Connected to ${s.name}`,
      }))

    return [verificationEntry, ...scans].reverse()
  },

  async getPrizes() {
    const res = await fetch('/longy/prizes')
    const { result } = await res.json()

    const textToImage = text => `${text.toLowerCase().replace(/\s/g, '_')}.png`

    return result.map(prize => ({
      ...prize,
      imageUrl: `/linkedup-user-content/prizes/${textToImage(prize.prizeText)}`,
    }))
  },
}
