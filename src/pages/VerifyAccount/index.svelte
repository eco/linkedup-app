<script>
  import page from 'page'
  import PageWithAction from '../../layout/PageWithAction'
  import { AvatarEditor, Button, Attributes } from '../../components'
  import cosmos from '../../services/cosmos'
  import events from '../../services/events'
  import s3 from '../../services/s3'
  import processUrl from './process-url'

  let loading = false
  let avatarFile
  let form

  const tracker = events.configured()
  tracker.track('view', {
    category: 'onboarding',
    label: 'verify',
  })

  const { address, secret, avatarUploadUrl, profile } = processUrl()

  const finishVerification = async () => {
    if (!form.reportValidity()) {
      return
    }

    try {
      loading = true
      if (avatarFile) {
        await s3.uploadFile(avatarUploadUrl, avatarFile)
      }
      await cosmos.claimBadge(address, secret, profile)
      tracker.track('click', {
        category: 'onboarding',
        label: 'verify',
      })
      page('/')
    } catch (e) {
      window.Sentry.captureException(e)
      window.alert(`ERROR: ${e.message}`)
    } finally {
      loading = false
    }
  }
</script>

<PageWithAction>
  <div slot="content">
    <h1>Verify my profile</h1>
    <p>What are you usually comfortable sharing?</p>
    <p class="avatar">
      <AvatarEditor bind:selectedFile={avatarFile} name={profile.name} />
    </p>
    <Attributes
      editable
      bind:this={form}
      bind:name={profile.name}
      bind:attributes={profile.attributes}
      bind:share={profile.defaultShare} />
  </div>
  <div slot="action">
    <Button fullWidth on:click={finishVerification} {loading}>Finish</Button>
  </div>
</PageWithAction>

<style>
  .avatar {
    margin: 1em 0 2em;
    text-align: center;
    line-height: 1;
  }
</style>
