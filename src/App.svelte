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
  import ReputationLog from './pages/ReputationLog'

  let component
  let pageParams = {}

  page((ctx, next) => {
    component = null
    pageParams = ctx.params
    next()
  })
  page('/', () => {
    component = $user ? Home : Intro
  })
  page('/badge/:badgeId', async () => {
    const badgeClaimed = await cosmos.isBadgeClaimed(pageParams.badgeId)
    if ($user) {
      component = badgeClaimed ? AddContact : Unclaimed
    } else {
      component = badgeClaimed ? AlreadyClaimed : Welcome
    }
  })
  page('/verify', () => {
    component = BeginVerification
  })
  page('/verify/:token', () => {
    component = VerifyAccount
  })
  page('/scan', () => {
    component = ScanContact
  })
  page('/reputation', () => {
    component = ReputationLog
  })

  page()
</script>

<MainLayout>
  {#if component}
    <svelte:component this={component} {pageParams} />
  {:else}Page loading&hellip;{/if}
</MainLayout>
