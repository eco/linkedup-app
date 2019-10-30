const isIOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent)

const defaultOptions = {
  leaderboardFrameInterval: 10000,
  dataPollingInterval: 5000,
  segmentWriteApiKey: '6tAoLDmWqPfUxy30obm1ZqxcTbZ3zom8',
  sentryDsn: 'https://7379beb03edb44148dbb098e4f85c83f@sentry.io/1802604',
  env: 'development',
  isIOS,
}

const domains = {
  'linkedup.sfbw.io': {
    chainEndpoint: 'https://chain.linkedup.sfbw.io',
    keyEndpoint: 'https://keyservice.linkedup.sfbw.io',
    contentEndpoint: 'https://linkedup-user-content.s3.us-west-2.amazonaws.com',
    env: 'production',
  },
  localhost: {
    chainEndpoint: '/chainsvc',
    keyEndpoint: '/keysvc',
    contentEndpoint: '/linkedup-user-content',
    rewriteAvatarUploadUrl: true,
  },
}

const domainOptions = domains[document.location.hostname] || {}

export default {
  ...defaultOptions,
  ...domainOptions,
}
