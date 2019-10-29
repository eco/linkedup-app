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
        rsa_public_key: rsaKeyPair.publicKey,
        use_verification: config.isIOS,
      }),
    })

    if (res.status === 409) {
      await this.beginRecovery(badgeId)
      return
    }

    if (!res.ok) {
      throw new Error('Failed to post key')
    }

    userStore.set({ cosmosKey, rsaKeyPair })
  },

  async beginRecovery(badgeId) {
    const res = await fetch(`${config.keyEndpoint}/recover`, {
      method: 'POST',
      body: JSON.stringify({
        attendee_id: badgeId,
        use_verification: config.isIOS,
      }),
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

    const user = {
      cosmosKey: json.cosmos_private_key,
      rsaKeyPair: {
        privateKey: json.rsa_private_key,
        publicKey: json.rsa_public_key,
      },
    }

    let claimUrl
    if (contact.claimed) {
      const profile = await decryptData(
        contact.encryptedInfo,
        json.rsa_private_key
      )
      userStore.set({ address, ...user, profile })
    } else {
      // can only restore keys
      userStore.set(user)
      const params = {
        attendee: address,
        secret: json.commitment_secret,
        avatar: json.image_upload_url,
        profile: btoa(JSON.stringify(json.attendee)),
      }
      const query = new URLSearchParams(params)
      claimUrl = `/claim?${query}`
    }

    return {
      profileRecovered: contact.claimed,
      claimUrl,
    }
  },
}
