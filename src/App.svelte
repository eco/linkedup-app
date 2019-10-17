<script>
  import page from 'page'
  import { user } from './store'
  import cosmos from './services/cosmos'
  import MainLayout from './layout/MainLayout'
  import Intro from './pages/Intro'
  import Home from './pages/Home'
  import Welcome from './pages/Welcome'
  import AlreadyClaimed from './pages/AlreadyClaimed'
  import AddContact from './pages/AddContact'
  import Unclaimed from './pages/Unclaimed'
  import BeginVerification from './pages/BeginVerification'
  import VerifyAccount from './pages/VerifyAccount'
  import ScanContact from './pages/ScanContact'
  import ViewContact from './pages/ViewContact'
  import Rewards from './pages/Rewards'
  import Error404 from './pages/Error404'

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
  page('/', () => (component = $user.profile ? Home : Intro))
  page('/badge/:badgeId', async (ctx, next) => {
    if ($user.profile) {
      next()
    } else {
      const badgeClaimed = await cosmos.isBadgeClaimed(pageParams.badgeId)
      component = badgeClaimed ? AlreadyClaimed : Welcome
      navAction = 'back'
    }
  })
  page('/verify', () => (component = BeginVerification))
  page('/claim', () => {
    component = VerifyAccount
    navAction = false
  })

  // redirect if not logged in
  page((ctx, next) => ($user.profile ? next() : page.redirect('/')))

  // scanning contacts and sponsors
  page('/scan', () => {
    component = ScanContact
    navAction = 'back'
  })
  page('/badge/:badgeId', async () => {
    const badgeClaimed = await cosmos.isBadgeClaimed(pageParams.badgeId)
    component = badgeClaimed ? AddContact : Unclaimed
    navAction = 'back'
  })
  page('/contact/:scanId', () => {
    component = ViewContact
    navAction = 'back'
  })

  // rewards
  page('/rewards', () => (component = Rewards))

  // finally, if no route matched, display 404
  page(() => {
    component = Error404
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
