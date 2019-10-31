<script>
  import page from 'page'
  import config from '../config'
  import PageWithAction from '../layout/PageWithAction'
  import events from '../services/events'
  import keyService from '../services/key'
  import { VerificationCode, Button } from '../components'

  let code = ''
  let loading = false
  const url = new URL(document.location.href)
  const badgeId = url.searchParams.get('badgeId')
  const email = url.searchParams.get('email')

  const tracker = events.configured()
  tracker.track('view', {
    category: 'login',
    action: 'check_email',
  })

  const recoverAccount = async () => {
    try {
      loading = true
      const result = await keyService.recoverAccount(badgeId, code)
      page.redirect(result.claimUrl || '/')
    } catch (e) {
      window.alert(`ERROR: ${e.message}`)
    } finally {
      loading = false
    }
  }
</script>

{#if config.isIOS}
  <PageWithAction>
    <div slot="content">
      <h1>Check your email</h1>
      <p>To verify your profile, enter the 6 digit code sent to {email}</p>
      <p>
        If this is not the correct email or you did not recieve an email, please
        visit the Linked Up game center for help.
      </p>
      <p class="verification-code">
        <VerificationCode length={6} bind:code label="Verification code" />
      </p>
    </div>
    <div slot="action">
      <Button fullWidth on:click={recoverAccount} {loading}>Continue</Button>
    </div>
  </PageWithAction>
{:else}
  <h1>Check your email</h1>
  <p>We've sent an email to {email} with a link to log you in!</p>
  <p>
    If this is not the correct email or you did not recieve an email, please
    visit the Linked Up game center for help.
  </p>
{/if}

<style>
  .verification-code {
    margin-top: 3em;
  }
</style>
