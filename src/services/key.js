import { generateCosmosKey, generateRsaKeyPair, decryptData } from '../crypto'
import userStore from '../store/user'
import config from '../config'
import cosmos from './cosmos'

export default {
  async beginVerification(badgeId) {
    const cosmosKey = await generateCosmosKey()
    const rsaKeyPair = await generateRsaKeyPair()
    const res = await fetch(`${config.keyEndpoint}/key`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        attendee_id: badgeId,
        cosmos_private_key: cosmosKey,
        rsa_private_key: rsaKeyPair.privateKey,
      }),
    })

    if (!res.ok) {
      throw new Error('Failed to post key')
    }
    userStore.set({ cosmosKey, rsaKeyPair })
  },

  async beginRecovery(badgeId) {
    const res = await fetch(`${config.keyEndpoint}/recover`, {
      method: 'POST',
      body: JSON.stringify(badgeId),
    })

    if (!res.ok) {
      throw new Error('Failed to post key')
    }
  },

  async getAddressByBadge(badgeId) {
    const res = await fetch(`${config.keyEndpoint}/id/${badgeId}`)
    return res.text()
  },

  async recoverAccount(badgeId, token) {
    const res = await fetch(
      `${config.keyEndpoint}/recover/${badgeId}/${token}`,
      {
        headers: {
          Accept: 'application/json',
        },
      }
    )
    const json = await res.json()
    const contact = await cosmos.getContactByBadge(badgeId)
    const address = await this.getAddressByBadge(badgeId)
    const profile = await decryptData(contact.EncryptedInfo, json.RSA_key)

    userStore.set({
      address,
      cosmosKey: json.cosmos_private_key,
      rsaKeyPair: {
        privateKey: json.RSA_key,
        publicKey: contact.RsaPublicKey,
      },
      profile,
    })
  },
}
