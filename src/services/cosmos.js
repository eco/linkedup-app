import { get } from 'svelte/store'
import { user } from '../store'
import { signTx, encryptData } from '../crypto'
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
}

export default {
  async isBadgeClaimed(badgeId) {
    const res = await fetch(`/longy/attendees/${badgeId}`)
    const { result } = await res.json()
    return result.value.Claimed
  },

  async claimBadge(address, secret) {
    const { rsaKeyPair } = get(user)
    const msg = claimKey({
      attendeeAddress: address,
      secret,
      rsaPublicKey: rsaKeyPair.publicKey,
      encryptedInfo: 'todo',
    })
    user.set({ address, ...get(user) })
    await broadcastMsg(msg)
  },

  async getContactName() {
    return 'George Costanza'
  },

  async scanContact(badgeId, sharePayload) {
    const { address } = get(user)
    const res = await fetch(`/longy/attendees/${badgeId}`)
    const { result } = await res.json()

    let data = ''
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

  async getScans() {
    const { address } = get(user)
    const res = await fetch(`/longy/attendees/address/${address}`)
    const { result } = await res.json()

    return Promise.all(
      result.value.ScanIDs.map(async (scanId, i) => {
        const scanRes = await fetch(`/longy/scans/${scanId}`)
        const {
          result: { S1, S2 },
        } = await scanRes.json()
        const isSlot1Self = S1 === address
        const contactAddr = isSlot1Self ? S2 : S1
        const name = await this.getContactName(contactAddr)

        return {
          timestamp: Date.now(),
          points: 3,
          name,
          imageUrl: `https://source.unsplash.com/random/100x100?${i}`,
        }
      })
    )
  },
}
