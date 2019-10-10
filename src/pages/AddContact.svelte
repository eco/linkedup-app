<script>
  import page from 'page'
  import { user } from '../store'
  import PageWithAction from '../layout/PageWithAction'
  import { Button, Textarea, Avatar, Attributes } from '../components'
  import cosmos from '../services/cosmos'

  export let pageParams

  let contactName = ''
  let loading = false
  $: [contactFirstName] = contactName.split(' ')

  let message = ''
  let share = $user.profile.defaultShare

  const recordScanAndShare = async () => {
    const sharedAttrs = $user.profile.attributes.filter(attr =>
      share.includes(attr.label)
    )
    return recordScan({ sharedAttrs, message })
  }

  const recordScan = async sharePayload => {
    loading = true
    await cosmos.scanContact(pageParams.badgeId, sharePayload)
    loading = false
    page('/')
  }

  cosmos.getContactName(pageParams.badgeId).then(name => {
    contactName = name
  })
</script>

<PageWithAction>
  <div slot="content">
    <h1>Share your contact info with {contactName}</h1>
    <p class="avatar">
      <Avatar />
    </p>
    <Attributes
      bind:share
      name={$user.profile.name}
      attributes={$user.profile.attributes} />
    <Textarea
      bind:value={message}
      placeholder="Include a message for {contactFirstName}" />
  </div>

  <div slot="action" class="action">
    <span class="primary">
      <Button fullWidth onClick={recordScanAndShare} {loading}>Share</Button>
    </span>
    <span>
      <Button fullWidth secondary onClick={recordScan}>Skip</Button>
    </span>
  </div>
</PageWithAction>

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
