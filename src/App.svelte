<script>
  import page from 'page'
  import MainLayout from './layout/MainLayout'
  import Intro from './pages/Intro'
  import Home from './pages/Home'
  import Welcome from './pages/Welcome'
  import AlreadyClaimed from './pages/AlreadyClaimed'
  import AddContact from './pages/AddContact'
  import Unclaimed from './pages/Unclaimed'
  import VerifyAccount from './pages/VerifyAccount'
  import ScanContact from './pages/ScanContact'

  let component = Intro
  let pageParams = {}

  const initialized = true
  const isBadgeClaimed = () => true

  page((ctx, next) => {
    pageParams = ctx.params
    next()
  })

  page('/', () => {
    component = initialized ? Home : Intro
  })
  page('/badge/:badgeId', ctx => {
    const badgeClaimed = isBadgeClaimed(ctx.params.badgeId)
    if (badgeClaimed) {
      component = initialized ? AddContact : AlreadyClaimed
    } else {
      component = initialized ? Unclaimed : Welcome
    }
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
  <svelte:component this={component} {pageParams} />
</MainLayout>
