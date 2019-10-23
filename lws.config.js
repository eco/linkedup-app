module.exports = {
  directory: 'public',
  hostname: 'localhost',
  port: '5000',
  spa: 'index.html',
  spaAssetTest: '(\\.|^\\/s\\/)',
  rewrite: [{
    from: '/keysvc/(.*)',
    to: 'http://localhost:1337/$1',
  }, {
    from: '/chainsvc/(.*)',
    to: 'http://localhost:1317/$1'
  }, {
    from: '/linkedup-user-content/(.*)',
    to: 'http://localhost:4572/linkedup-user-content/$1'
  }]
}
