import { get } from 'svelte/store'
import { user } from '../store'
import { generateKey, sign } from '../crypto'
import { createTx, claimKey, scanQr } from './cosmos.msgs'

const broadcastMsg = async msg => {
  const { address, privateKey } = get(user)
  const accRes = await fetch(`/auth/accounts/${address}`)
  const {
    result: { value },
  } = await accRes.json()
  const tx = createTx(value.account_number, value.sequence, msg)
  const signedTx = await sign(tx, Buffer.from(privateKey, 'hex'))

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

const postKey = async (badgeId, privateKey) => {
  const res = await fetch('/key', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      attendee_id: badgeId,
      private_key: privateKey.toString('hex'),
    }),
  })

  if (!res.ok) {
    throw new Error('Failed to post key')
  }
}

export default {
  async isBadgeClaimed(badgeId) {
    const res = await fetch(`/longy/attendees/${badgeId}`)
    const { result } = await res.json()
    return result.value.Claimed
  },

  async beginVerification(badgeId) {
    const privateKey = await generateKey()
    await postKey(badgeId, privateKey)
    user.set({ badgeId, privateKey: privateKey.toString('hex') })
  },

  async claimBadge(address, secret) {
    const msg = claimKey({ attendeeAddress: address, secret })
    await broadcastMsg(msg)
    user.set({ address, ...get(user) })
  },

  async getContactName() {
    return '[not implemented]'
  },

  async scanContact(badgeId) {
    const { address } = get(user)
    const msg = scanQr({
      sender: address,
      scannedQR: badgeId,
      data: 'todo',
    })
    await broadcastMsg(msg)
  },

  async getPlayerScore() {
    const { address } = get(user)
    const res = await fetch(`/longy/attendees/address/${address}`)
    const { result } = await res.json()
    return result.value.Rep
  },

  async getReputationLog() {
    return [
      {
        timestamp: Date.now(),
        points: 10,
        label: 'Connected to Ayo Ozmani',
        imageUrl: 'https://source.unsplash.com/random/100x100?1',
      },
      {
        timestamp: Date.now(),
        points: 100,
        label: 'Verified your profile',
        imageUrl: 'https://source.unsplash.com/random/100x100?2',
      },
    ]
  },
}
