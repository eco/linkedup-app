<script>
  import page from 'page'
  import PageWithAction from '../layout/PageWithAction'
  import keyService from '../services/key'
  import { Button } from '../components'

  let loading = false

  export let pageParams

  const verifyProfile = async () => {
    loading = true
    const badgeId = parseInt(pageParams.badgeId, 10)
    await keyService.beginVerification(badgeId)
    loading = false
    page('/verify')
  }
</script>

<PageWithAction>
  <div slot="content">
    <h1>Welcome to Linked Up</h1>
    <p>Grow your professioanl network, make friends, and win prizes!</p>
    <p>Meet with others and share your contact details</p>
    <p>To play, scan the QR code on another SFBW attendee's badge using this app.</p>
    <p>Please verify your profile information and privacy settings</p>
  </div>
  <div slot="action">
    <Button fullWidth on:click={verifyProfile} {loading}>
      Verify your profile
    </Button>
  </div>
</PageWithAction>
