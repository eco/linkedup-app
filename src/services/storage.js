const userKey = 'com.eco.longy.user'

export default {
  storeUser(name, attributes) {
    localStorage.setItem(userKey, JSON.stringify({ name, attributes }))
  },
  getLocalUser() {
    const user = localStorage.getItem(userKey)
    return JSON.parse(user)
  },
}
