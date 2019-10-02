export default {
  async isBadgeClaimed(badgeId) {
    return badgeId !== '123'
  },
  async beginVerification() {
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
  async getPlayerScore() {
    return 200
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
