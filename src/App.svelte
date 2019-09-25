<script>
  import page from 'page'
  import MainLayout from './pages/layout/MainLayout'
  import Intro from './pages/Intro'
  import Home from './pages/Home'
  import Welcome from './pages/Welcome'
  import AlreadyClaimed from './pages/AlreadyClaimed'
  import AddContact from './pages/AddContact'
  import Unclaimed from './pages/Unclaimed'
  import VerifyAccount from './pages/VerifyAccount'
  import Scanner from './pages/Scanner'

  let component = Intro

  const initialized = false
  const isBadgeClaimed = () => false

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
    component = Scanner
  })

  page({
    hashbang: true,
  })
</script>

<MainLayout>
  <svelte:component this={component} />
</MainLayout>
