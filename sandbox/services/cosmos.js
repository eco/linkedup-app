export default {
  async isBadgeClaimed(badgeId) {
    return badgeId !== '123'
  },
  async startVerification() {
    return true
  },
  async getContactName(badgeId) {
    const names = {
      '456': 'Ayo Ozmandi',
    }
    return names[badgeId]
  },
  async scanContact() {
    // todo
  },
}
