<script>
  import page from 'page'
  import PageWithAction from '../layout/PageWithAction'
  import keyService from '../services/key'
  import { Button } from '../components'

  export let pageParams
  let loading = false

  const beginRecovery = async () => {
    loading = true
    const badgeId = parseInt(pageParams.badgeId, 10)
    await keyService.beginRecovery(badgeId)
    loading = false
    page('/verify')
    loading = false
  }
</script>

<PageWithAction>
  <div slot="content">
    <h1>You are not logged in</h1>
    <p>
      If you'd like to recover your account, please tap "Recover my account".
      You won't be able to earn reputation points until you're signed in.
    </p>
  </div>
  <div slot="action">
    <Button fullWidth on:click={beginRecovery} {loading}>
      Recover my account
    </Button>
  </div>
</PageWithAction>
