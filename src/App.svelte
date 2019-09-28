<script>
  import page from 'page'
  import storage from './services/storage'
  import cosmos from './services/cosmos'
  import MainLayout from './layout/MainLayout'
  import Intro from './pages/Intro'
  import Home from './pages/Home'
  import Welcome from './pages/Welcome'
  import AlreadyClaimed from './pages/AlreadyClaimed'
  import AddContact from './pages/AddContact'
  import Unclaimed from './pages/Unclaimed'
  import StartVerification from './pages/StartVerification'
  import VerifyAccount from './pages/VerifyAccount'
  import ScanContact from './pages/ScanContact'

  let component
  let pageParams = {}

  page((ctx, next) => {
    component = null
    pageParams = ctx.params
    next()
  })
  page('/', () => {
    component = storage.getLocalUser() ? Home : Intro
  })
  page('/badge/:badgeId', async () => {
    const badgeClaimed = await cosmos.isBadgeClaimed(pageParams.badgeId)
    if (storage.getLocalUser()) {
      component = badgeClaimed ? AddContact : Unclaimed
    } else {
      component = badgeClaimed ? AlreadyClaimed : Welcome
    }
  })
  page('/verify', () => {
    component = StartVerification
  })
  page('/verify/:token', () => {
    component = VerifyAccount
  })
  page('/scan', () => {
    component = ScanContact
  })

  page({
    hashbang: true,
  })
</script>

<MainLayout>
  {#if component}
    <svelte:component this={component} {pageParams} />
  {:else}Page loading&hellip;{/if}
</MainLayout>
