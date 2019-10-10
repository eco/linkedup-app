import { get } from 'svelte/store'
import { user } from '../store'
import {
  generateCosmosKey,
  signTx,
  generateRsaKeyPair,
  encryptData,
} from '../crypto'
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

const postKey = async (badgeId, cosmosKey, rsaKey) => {
  const res = await fetch('/key', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      attendee_id: badgeId,
      cosmos_private_key: cosmosKey,
      rsa_private_key: rsaKey,
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
    const cosmosKey = await generateCosmosKey()
    const rsaKeyPair = await generateRsaKeyPair()
    await postKey(badgeId, cosmosKey, rsaKeyPair.privateKey)
    user.set({ badgeId, cosmosKey, rsaKeyPair })
  },

  async claimBadge(address, secret) {
    const { rsaKeyPair } = get(user)
    const msg = claimKey({
      attendeeAddress: address,
      secret,
      rsaPublicKey: rsaKeyPair.publicKey,
      encryptedInfo: 'todo',
    })
    user.set({ ...get(user), address })
    await broadcastMsg(msg)
  },

  async getContactName() {
    return 'George Costanza'
  },

  async scanContact(badgeId, sharePayload) {
    const { address } = get(user)
    const res = await fetch(`/longy/attendees/${badgeId}`)
    const { result } = await res.json()
    const data = await encryptData(sharePayload, result.value.RsaPublicKey)
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
