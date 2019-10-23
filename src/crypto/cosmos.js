import elliptic from 'elliptic'
import bech32 from 'bech32'
import { Buffer } from 'buffer'

const { subtle } = window.crypto
const { ec: EC } = elliptic
const ec = new EC('secp256k1')

export const generateCosmosKey = async () => {
  const keys = ec.genKeyPair()
  return keys.getPrivate().toString(16)
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

export const signTx = async (tx, _privateKey) => {
  // encode transaction into buffer
  const encoder = new TextEncoder()
  const data = encoder.encode(JSON.stringify(sortObject(tx)))
  const hash = await subtle.digest('SHA-256', data)
  const buf = Buffer.from(hash)

  // create keys
  const privateKey = Buffer.from(_privateKey, 'hex')
  const publicKey = Buffer.from(
    ec.keyFromPrivate(privateKey).getPublic(true, true)
  ).toString('base64')

  // sign transaction
  let signature = ec.sign(buf, privateKey, { canonical: true })
  signature = Buffer.concat([
    signature.r.toArrayLike(Buffer, 'be', 32),
    signature.s.toArrayLike(Buffer, 'be', 32),
  ]).toString('base64')

  return {
    tx: {
      msg: tx.msgs,
      fee: tx.fee,
      signatures: [
        {
          signature,
          pub_key: {
            type: 'tendermint/PubKeySecp256k1',
            value: publicKey,
          },
        },
      ],
      memo: tx.memo,
    },
    mode: 'block',
  }
}

export const signAddress = async (address, _privateKey) => {
  // decode address and hash bytes into buffer
  const { words } = bech32.decode(address)
  const bytes = bech32.fromWords(words)
  const hash = await subtle.digest('SHA-512', new Uint8Array(bytes))
  const buf = Buffer.from(hash)

  // import private cosmos key
  const privateKey = Buffer.from(_privateKey, 'hex')

  // sign data
  let signature = ec.sign(buf, privateKey, { canonical: true })
  signature = Buffer.concat([
    signature.r.toArrayLike(Buffer, 'be', 32),
    signature.s.toArrayLike(Buffer, 'be', 32),
  ]).toString('hex')

  return signature
}
