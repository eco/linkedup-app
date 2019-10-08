<script>
  import page from 'page'
  import PageWithAction from '../layout/PageWithAction'
  import cosmos from '../services/cosmos'
  import { Button } from '../components'

  let loading = false

  export let pageParams

  const verifyProfile = async () => {
    loading = true
    await cosmos.beginVerification(pageParams.badgeId)
    loading = false
    page('/verify')
  }
</script>

<PageWithAction>
  <div slot="content">
    <h1>Welcome to the Chain Game</h1>
    <p>Grow your network by adding contacts</p>
    <p>To add a contact, scan the QR code on another SFBC attendee's badge.</p>
    <p>Please verify your profile information and privacy settings</p>
  </div>
  <div slot="action">
    <Button fullWidth onClick={verifyProfile} {loading}>
      Verify your profile
    </Button>
  </div>

</PageWithAction>
