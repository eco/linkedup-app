<script>
  import page from 'page'
  import userStore from './store/user'
  import cosmos from './services/cosmos'
  import events from './services/events'
  import MainLayout from './layout/MainLayout'
  import * as pages from './pages'
  import config from './config'

  let component
  let pageParams = {}
  let navAction

  // configure analytics / segment
  const tracker = events.configure()

  // configure error reporting
  window.Sentry.init({
    dsn: config.sentryDsn,
    environment: config.env,
  })

  userStore.subscribe(({ address, profile }) => {
    if (address) {
      const traits = {}
      if (profile) {
        traits.name = profile.name
      }
      tracker.identify(address, traits)
    }
  })

  page((ctx, next) => {
    component = null
    pageParams = ctx.params
    navAction = 'menu'
    next()
  })

  // onboarding
  page('/', () => (component = $userStore.profile ? pages.Home : pages.Intro))
  page('/badge/:badgeId', async (ctx, next) => {
    if ($userStore.profile) {
      next()
    } else {
      const badgeClaimed = await cosmos.isBadgeClaimed(pageParams.badgeId)
      component = badgeClaimed ? pages.LoggedOut : pages.Welcome
      navAction = 'back'
    }
  })
  page('/verify', () => (component = pages.BeginVerification))
  page('/claim', () => {
    component = pages.VerifyAccount
    navAction = false
  })
  page('/recover', () => {
    component = pages.Recovery
    navAction = false
  })
  page('/about', () => (component = pages.About))
  page('/leaderboard', () => (component = pages.Leaderboard))

  // redirect if not logged in
  page((ctx, next) => ($userStore.profile ? next() : page.redirect('/')))

  // scanning contacts and sponsors
  // page('/scan', () => {
  //   component = pages.ScanContact
  //   navAction = 'back'
  // })
  page('/badge/:badgeId', async () => {
    const badgeClaimed = await cosmos.isBadgeClaimed(pageParams.badgeId)
    component = badgeClaimed ? pages.AddContact : pages.Unclaimed
    navAction = 'back'
  })

  // view contacts
  page('/contact/:scanId', () => {
    component = pages.ViewContact
    navAction = 'back'
  })

  // rewards
  page('/rewards', () => (component = pages.Rewards))
  page('/rewards/:prizeIndex', () => {
    component = pages.Redemption
    navAction = 'back'
  })

  // notifications
  // page('/notifications', () => (component = pages.Notifications))

  // finally, if no route matched, display 404
  page(() => {
    component = pages.Error404
  })

  // start the router
  page()
</script>

<MainLayout {navAction}>
  {#if component}
    <svelte:component this={component} {pageParams} />
  {:else}
    <p>Page loading&hellip;</p>
  {/if}
</MainLayout>
