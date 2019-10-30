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
    <h1>
      <font color ="3c48ea">Welcome to LinkedUp</font>
    </h1>
    <p>Grow your professional network, make friends, earn loot, and compete to take your share of $5,000!</p>
    <p>Meet with others, share your contact details, and build your reputation securely on the blockchain.</p>
    <h3>
      <font color ="3c48ea">Why blockchain?</font>
    </h3>
    <p>You get to choose 
      <b>WHO</b> can see your data and how much of it. You and your contact's details stay hidden while your reputation and notoriety grow.
    </p>
    <p>Meet someone that you want to hang with after the conference? Share your telegram and mobile number.</p>
    <p>Want to follow up with that sales director but on your terms? Share just your work email.
      <p>
        <h3>
          <font color ="3c48ea">Get Started</font>
        </h3>
        <p>To play, scan the QR code on another SFBW attendee's badge using your phone and share your contact details</p>
        <p>For 
          <font color ="3c48ea">
            <b>iOS</b>
          </font> devices: Due to less than ideal support for progressive web apps, it is recommended that you use 
          <font color ="3c48ea">
            <b>Safari without a private tab</b>
          </font> in order to have the smoothest LinkedUp experience.
        </p>
        <p>Please verify your profile information and privacy settings</p>
      </div>
      <div slot="action">
        <Button fullWidth on:click={verifyProfile} {loading}>
      Verify your profile
    </Button>
      </div>
    </PageWithAction>
