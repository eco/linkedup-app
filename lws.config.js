module.exports = {
  directory: 'public',
  hostname: 'localhost',
  port: '5000',
  spa: 'index.html',
  rewrite: [{
    from: '/keys/(.*)',
    to: 'http://localhost:1337/$1',
  }, {
    from: '/longy/(.*)',
    to: 'http://localhost:1317/longy/$1'
  }, {
    from: '/auth/(.*)',
    to: 'http://localhost:1317/auth/$1'
  }, {
    from: '/linkedup-user-content/(.*)',
    to: 'http://localhost:4572/linkedup-user-content/$1'
  }]
}
