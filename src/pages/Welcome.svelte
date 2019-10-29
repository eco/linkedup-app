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
    <h1>Welcome to Linked Up</h1>
    <p>Grow your network by adding contacts</p>
    <p>To add a contact, scan the QR code on another SFBC attendee's badge.</p>
    <p>Please verify your profile information and privacy settings</p>
  </div>
  <div slot="action">
    <Button fullWidth on:click={verifyProfile} {loading}>
      Verify your profile
    </Button>
  </div>
</PageWithAction>
