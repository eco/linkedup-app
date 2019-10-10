import { generateCosmosKey, generateRsaKeyPair } from '../crypto'
import { user } from '../store'

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
  async beginVerification(badgeId) {
    const cosmosKey = await generateCosmosKey()
    const rsaKeyPair = await generateRsaKeyPair()
    await postKey(badgeId, cosmosKey, rsaKeyPair.privateKey)
    user.set({ cosmosKey, rsaKeyPair })
  },
}
