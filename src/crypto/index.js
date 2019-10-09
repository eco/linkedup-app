import bip39 from 'bip39'
import bip32 from 'bip32'
import bitcoinjs from 'bitcoinjs-lib'
import secp256k1 from 'secp256k1'
import arrayBufferToBuffer from 'arraybuffer-to-buffer'

const { subtle } = window.crypto

const path = "m/44'/118'/0'/0/0"

export const generateRsaKey = async () => {
  const opts = {
    name: 'RSA-OAEP',
    modulusLength: 1024,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: 'SHA-256',
  }
  const keyPair = await subtle.generateKey(opts, true, ['encrypt', 'decrypt'])
  const pkcs8 = await subtle.exportKey('pkcs8', keyPair.privateKey)
  const keyStr = String.fromCharCode(...new Uint8Array(pkcs8))
  const key64 = window.btoa(keyStr)
  return `-----BEGIN PRIVATE KEY-----\n${key64}\n-----END PRIVATE KEY-----`
}

export const generateCosmosKey = async () => {
  const mnemonic = bip39.generateMnemonic()
  const seed = await bip39.mnemonicToSeed(mnemonic)
  const node = bip32.fromSeed(seed)
  const child = node.derivePath(path)
  const ecpair = bitcoinjs.ECPair.fromPrivateKey(child.privateKey, {
    compressed: false,
  })
  return ecpair.privateKey
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

const getPubKeyBase64 = ecpairPriv => {
  const pubKeyByte = secp256k1.publicKeyCreate(ecpairPriv)
  return Buffer.from(pubKeyByte, 'binary').toString('base64')
}

export const sign = async (tx, privateKey) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(JSON.stringify(sortObject(tx)))
  const hash = await subtle.digest('SHA-256', data)
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
