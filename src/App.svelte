<script>
  import page from 'page'
  import { user } from './store'
  import cosmos from './services/cosmos'
  import MainLayout from './layout/MainLayout'
  import * as pages from './pages'

  let component
  let pageParams = {}
  let navAction

  page((ctx, next) => {
    component = null
    pageParams = ctx.params
    navAction = 'menu'
    next()
  })

  // onboarding
  page('/', () => (component = $user.profile ? pages.Home : pages.Intro))
  page('/badge/:badgeId', async (ctx, next) => {
    if ($user.profile) {
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

  // redirect if not logged in
  page((ctx, next) => ($user.profile ? next() : page.redirect('/')))

  // scanning contacts and sponsors
  page('/scan', () => {
    component = pages.ScanContact
    navAction = 'back'
  })
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
