<script>
  import page from 'page'
  import PageWithAction from '../layout/PageWithAction'
  import keyService from '../services/key'
  import { Button } from '../components'

  let loading = false

  export let pageParams

  const verifyProfile = async () => {
    try {
      loading = true
      const badgeId = parseInt(pageParams.badgeId, 10)
      await keyService.beginVerification(badgeId)
      page(`/verify?badgeId=${badgeId}`)
    } catch (e) {
      window.alert(`ERROR: ${e.message}`)
    } finally {
      loading = false
    }
  }
</script>

<PageWithAction>
  <div slot="content">
    <h1>Welcome to LinkedUp</h1>
    <p>
      Grow your professional network, make friends, earn loot, and compete to
      take your share of $5,000! Meet with others, share your contact details,
      and build your reputation securely on the blockchain.
    </p>
    <h2>Get Started</h2>
    <p>
      To play, scan the QR code on another SFBW attendee's badge using your
      phone and share your contact details.
    </p>
    <p>
      For
      <em>iOS</em>
      devices: Due to less than ideal support for progressive web apps, it is
      recommended that you use
      <em>Safari without a private tab</em>
      in order to have the smoothest LinkedUp experience.
    </p>
    <p>Please verify your profile information and privacy settings</p>
  </div>
  <div slot="action">
    <Button fullWidth on:click={verifyProfile} {loading}>
      Verify your profile
    </Button>
  </div>
</PageWithAction>

<style>
  h1 {
    color: var(--blue);
  }
  h2 {
    font-size: 18px;
    font-weight: 500;
    line-height: 30px;
    margin: 1em 0 0.5em;
    color: var(--blue);
  }
  em {
    color: var(--blue);
    font-style: normal;
    font-weight: normal;
  }
</style>
