import platforms from './config.platforms'

const platformByLabel = platforms.reduce(
  (memo, p) => ({ ...memo, [p.name]: p }),
  {}
)

const isIOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent)

const defaultOptions = {
  gameActive: true,
  leaderboardFrameInterval: 10000,
  dataPollingInterval: 5000,
  segmentWriteApiKey: '6tAoLDmWqPfUxy30obm1ZqxcTbZ3zom8',
  sentryDsn: 'https://eea339b5af8c41cfa29f4f7f936fd601@sentry.io/1799879',
  env: 'development',
  isIOS,
  platforms,
  platformByLabel,
}

const domains = {
  'linkedup.sfbw.io': {
    gameActive: false,
    chainEndpoint: 'https://chain.linkedup.sfbw.io',
    keyEndpoint: 'https://keyservice.linkedup.sfbw.io',
    contentEndpoint: 'https://linkedup-user-content.s3.us-west-2.amazonaws.com',
    env: 'production',
  },
  default: {
    chainEndpoint: '/chainsvc',
    keyEndpoint: '/keysvc',
    contentEndpoint: '/linkedup-user-content',
    rewriteAvatarUploadUrl: true,
  },
}

const domainOptions = domains[document.location.hostname] || domains.default

export default {
  ...defaultOptions,
  ...domainOptions,
}
