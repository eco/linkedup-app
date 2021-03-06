<script>
  import page from 'page'
  import userStore from '../store/user'
  import events from '../services/events'
  import PageWithAction from '../layout/PageWithAction'
  import { Button, Textarea, Avatar, Attributes } from '../components'
  import cosmos from '../services/cosmos'
  import config from '../config'

  export let pageParams

  if (!config.gameActive) {
    page.redirect('/')
  }

  const tracker = events.configured()
  tracker.track('view', {
    category: 'share_contact',
  })

  let isSelf = false
  let contactName = ''
  let avatarUrl = `${config.contentEndpoint}/avatars/${pageParams.badgeId}`
  let loadingShare = false
  let loadingSkip = false
  $: [contactFirstName] = contactName.split(' ')

  let message = ''
  let share = $userStore.profile.defaultShare

  const handleShare = async () => {
    try {
      const sharedAttrs = $userStore.profile.attributes.filter(attr =>
        share.includes(attr.label)
      )
      const sharePayload = { sharedAttrs, message }
      loadingShare = true
      await cosmos.scanContact(pageParams.badgeId, sharePayload)
    } catch (e) {
      window.Sentry.captureException(e)
      window.alert(`ERROR: ${e.message}`)
    } finally {
      loadingShare = false
    }

    page('/')
    tracker.track('click', {
      category: 'share_contact',
      label: 'confirm',
    })
  }

  const handleSkip = async () => {
    try {
      loadingSkip = true
      await cosmos.scanContact(pageParams.badgeId)
    } catch (e) {
      window.Sentry.captureException(e)
      window.alert(`ERROR: ${e.message}`)
    } finally {
      loadingSkip = false
    }

    page('/')
    tracker.track('click', {
      category: 'share_contact',
      label: 'skip',
    })
  }

  cosmos.getContactByBadge(pageParams.badgeId).then(contact => {
    contactName = contact.name
    isSelf = contact.address === $userStore.address
  })
</script>

{#if isSelf}
  <p>Earn reputation points by connecting with other players</p>
{:else}
  <PageWithAction>
    <div slot="content">
      <h1>Share your contact info with {contactName}</h1>
      <p class="avatar">
        <Avatar name={contactName} {avatarUrl} />
      </p>
      <Attributes
        bind:share
        name={$userStore.profile.name}
        attributes={$userStore.profile.attributes} />
      <Textarea
        bind:value={message}
        placeholder="Include a message for {contactFirstName}" />
    </div>
    <div slot="action" class="action">
      <span class="primary">
        <Button fullWidth on:click={handleShare} loading={loadingShare}>
          Share
        </Button>
      </span>
      <span>
        <Button fullWidth secondary on:click={handleSkip} loading={loadingSkip}>
          Skip
        </Button>
      </span>
    </div>
  </PageWithAction>
{/if}

<style>
  .avatar {
    text-align: center;
    line-height: 1;
  }
  .action {
    display: flex;
  }
  .action > span {
    width: 100%;
  }
  .action span.primary {
    flex-basis: 200%;
    margin-right: 12px;
  }
</style>
