const defaultOptions = {
  leaderboardFrameInterval: 10000,
  dataPollingInterval: 5000,
  segmentWriteApiKey: '6tAoLDmWqPfUxy30obm1ZqxcTbZ3zom8',
}

const domains = {
  'linkedup.sfbw.io': {
    chainEndpoint: 'https://chain.linkedup.sfbw.io',
    keyEndpoint: 'https://keyservice.linkedup.sfbw.io',
    contentEndpoint: 'https://linkedup-user-content.s3.us-west-2.amazonaws.com',
  },
  localhost: {
    chainEndpoint: '/chainsvc',
    keyEndpoint: '/keysvc',
    contentEndpoint: '/linkedup-user-content',
  },
}

const domainOptions = domains[document.location.hostname] || {}

export default {
  ...defaultOptions,
  ...domainOptions,
}