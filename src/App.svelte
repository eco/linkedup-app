<script>
  import page from 'page'
  import Intro from './pages/Intro.svelte'
  import Home from './pages/Home.svelte'
  import Welcome from './pages/Welcome.svelte'
  import AlreadyClaimed from './pages/AlreadyClaimed.svelte'
  import AddContact from './pages/AddContact.svelte'
  import Unclaimed from './pages/Unclaimed.svelte'
  import VerifyAccount from './pages/VerifyAccount.svelte'
  import Scanner from './pages/Scanner.svelte'

  let component = Intro

  const initialized = true
  const isBadgeClaimed = () => true

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

<svelte:component this={component} />
