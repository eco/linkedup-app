export const arrayBufferToBase64 = arrayBuffer => {
  const arr = new Uint8Array(arrayBuffer)
  const keyStr = String.fromCharCode(...arr)
  return btoa(keyStr)
}

export const base64ToArrayBuffer = base64 => {
  const str = atob(base64)
  const buf = new ArrayBuffer(str.length)
  const bufView = new Uint8Array(buf)
  for (let i = 0, l = str.length; i < l; i += 1) {
    bufView[i] = str.charCodeAt(i)
  }
  return buf
}
