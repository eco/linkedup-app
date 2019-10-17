import { arrayBufferToBase64, base64ToArrayBuffer } from './utils'

const { subtle } = window.crypto
const DATA_SEP = ':::'

export const generateRsaKeyPair = async () => {
  const opts = {
    name: 'RSA-OAEP',
    modulusLength: 1024,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: 'SHA-256',
  }
  const keyPair = await subtle.generateKey(opts, true, ['encrypt', 'decrypt'])
  const pkcs8 = await subtle.exportKey('pkcs8', keyPair.privateKey)
  const spki = await subtle.exportKey('spki', keyPair.publicKey)
  return {
    privateKey: arrayBufferToBase64(pkcs8),
    publicKey: arrayBufferToBase64(spki),
  }
}

export const encryptData = async (data, _publicKey) => {
  // generate AES key
  const aesKey = await subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt']
  )

  // encrypt data using the AES key
  const encoder = new TextEncoder()
  const encodedData = encoder.encode(JSON.stringify(data))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encryptedData = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    aesKey,
    encodedData
  )

  // import public RSA key
  let publicKey = base64ToArrayBuffer(_publicKey)
  publicKey = await subtle.importKey(
    'spki',
    publicKey,
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    false,
    ['encrypt']
  )

  // encrypt AES key using the public RSA key
  const aesKeyExport = await subtle.exportKey('raw', aesKey)
  const encryptedAesKey = await crypto.subtle.encrypt(
    { name: 'RSA-OAEP' },
    publicKey,
    aesKeyExport
  )

  // final encoding
  const consString = [
    arrayBufferToBase64(encryptedAesKey),
    btoa(String.fromCharCode(...iv)),
    arrayBufferToBase64(encryptedData),
  ].join(DATA_SEP)

  return btoa(consString)
}

export const decryptData = async (base64, _privateKey) => {
  // reverse final encoding
  const consString = atob(base64)
  const parts = consString.split(DATA_SEP)
  const encryptedAesKey = base64ToArrayBuffer(parts[0])
  const encryptedData = base64ToArrayBuffer(parts[2])
  let iv = atob(parts[1])
  iv = iv.split('').map(c => c.charCodeAt(0))
  iv = Uint8Array.from(iv)

  // import private RSA key
  let privateKey = base64ToArrayBuffer(_privateKey)
  privateKey = await subtle.importKey(
    'pkcs8',
    privateKey,
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    false,
    ['decrypt']
  )

  // decode AES key using the private RSA key
  let aesKey = await subtle.decrypt(
    {
      name: 'RSA-OAEP',
    },
    privateKey,
    encryptedAesKey
  )

  // import AES key
  aesKey = await subtle.importKey('raw', aesKey, 'AES-GCM', false, ['decrypt'])

  // decrypt data using the AES key
  const encodedData = await subtle.decrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    aesKey,
    encryptedData
  )
  const decoder = new TextDecoder()
  const data = decoder.decode(encodedData)

  // done!
  return JSON.parse(data)
}
