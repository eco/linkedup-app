import bip39 from 'bip39'
import bip32 from 'bip32'
import bitcoinjs from 'bitcoinjs-lib'
import secp256k1 from 'secp256k1'
import arrayBufferToBuffer from 'arraybuffer-to-buffer'
import { get } from 'svelte/store'
import { user } from '../store'
import { claimKey } from './txs'

const path = "m/44'/118'/0'/0/0"

const getECPairPriv = async mnemonic => {
  const seed = await bip39.mnemonicToSeed(mnemonic)
  const node = bip32.fromSeed(seed)
  const child = node.derivePath(path)
  const ecpair = bitcoinjs.ECPair.fromPrivateKey(child.privateKey, {
    compressed: false,
  })
  return ecpair.privateKey
}

const getPubKeyBase64 = ecpairPriv => {
  const pubKeyByte = secp256k1.publicKeyCreate(ecpairPriv)
  return Buffer.from(pubKeyByte, 'binary').toString('base64')
}

const sortObject = obj => {
  if (obj === null) return null
  if (typeof obj !== 'object') return obj
  if (Array.isArray(obj)) return obj.map(sortObject)
  const sortedKeys = Object.keys(obj).sort()
  const result = {}
  sortedKeys.forEach(key => {
    result[key] = sortObject(obj[key])
  })
  return result
}

const sign = async (tx, privateKey) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(JSON.stringify(sortObject(tx)))
  const hash = await crypto.subtle.digest('SHA-256', data)
  const buf = arrayBufferToBuffer(hash)
  const signObj = secp256k1.sign(buf, privateKey)
  const signatureBase64 = Buffer.from(signObj.signature, 'binary').toString(
    'base64'
  )

  return {
    tx: {
      msg: tx.msgs,
      fee: tx.fee,
      signatures: [
        {
          signature: signatureBase64,
          pub_key: {
            type: 'tendermint/PubKeySecp256k1',
            value: getPubKeyBase64(privateKey),
          },
        },
      ],
      memo: tx.memo,
    },
    mode: 'sync',
  }
}

export default {
  async isBadgeClaimed(badgeId) {
    const res = await fetch(`/longy/attendees/${badgeId}`)
    const { result } = await res.json()
    return result.value.Claimed
  },
  async beginVerification(badgeId) {
    const mnemonic = bip39.generateMnemonic()
    const privateKey = await getECPairPriv(mnemonic)

    await fetch('/key', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        attendee_id: badgeId,
        private_key: privateKey.toString('hex'),
      }),
    })

    user.set({ badgeId, privateKey: privateKey.toString('hex') })
  },
  async claimBadge(address, secret) {
    const { privateKey } = get(user)
    const accRes = await fetch(`/auth/accounts/${address}`)
    const { result } = await accRes.json()
    const tx = claimKey(
      result.value.account_number,
      result.value.sequence,
      address,
      secret
    )
    const signedTx = await sign(tx, Buffer.from(privateKey, 'hex'))

    const res = await fetch('/longy/txs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signedTx),
    })

    if (!res.ok) {
      throw new Error('claimBadge response not ok.')
    }

    user.set({ address, privateKey })
  },
  async getContactName() {
    return '[not implemented]'
  },
  async scanContact() {
    // todo
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
