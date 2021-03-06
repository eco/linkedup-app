import elliptic from 'elliptic'
import { Buffer } from 'buffer'

const { subtle } = window.crypto
const { ec: EC } = elliptic
const ec = new EC('secp256k1')

export const generateCosmosKey = async () => {
  const keys = ec.genKeyPair()
  return keys.getPrivate().toString(16, 64)
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

const signBuffer = (buf, _privateKey, encoding) => {
  // import private cosmos key
  const privateKey = Buffer.from(_privateKey, 'hex')

  // sign data
  let signature = ec.sign(buf, privateKey, { canonical: true })
  signature = Buffer.concat([
    signature.r.toArrayLike(Buffer, 'be', 32),
    signature.s.toArrayLike(Buffer, 'be', 32),
  ]).toString(encoding)

  return signature
}

export const signTx = async (tx, privateKey) => {
  // encode transaction into buffer
  const encoder = new TextEncoder()
  const data = encoder.encode(JSON.stringify(sortObject(tx)))
  const hash = await subtle.digest('SHA-256', data)
  const buf = Buffer.from(hash)

  // create keys
  const pk = Buffer.from(privateKey, 'hex')
  const publicKey = Buffer.from(
    ec.keyFromPrivate(pk).getPublic(true, true)
  ).toString('base64')

  // sign transaction
  const signature = signBuffer(buf, privateKey, 'base64')

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

export const signAddress = async (address, privateKey) => {
  // decode address and hash bytes into buffer
  const encoder = new TextEncoder()
  const encodedAddress = encoder.encode(address)
  const hash = await subtle.digest('SHA-256', encodedAddress)
  const buf = Buffer.from(hash)

  return signBuffer(buf, privateKey, 'hex')
}
