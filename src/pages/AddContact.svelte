<script>
  import { onMount } from 'svelte'
  import page from 'page'
  import PageWithAction from '../layout/PageWithAction'
  import { Button, Textarea, Avatar, Attributes } from '../components'
  import cosmos from '../services/cosmos'
  import storage from '../services/storage'

  const user = storage.getLocalUser()
  let contactName = ''
  $: [contactFirstName] = contactName.split(' ')
  export let pageParams

  onMount(() => {
    const { badgeId } = pageParams
    cosmos.getContactName(badgeId).then(name => {
      contactName = name
    })
    cosmos.scanContact(badgeId)
  })

  const returnHome = () => page('/')
  const shareAttributes = async () => {
    // todo: how will this be done?
    returnHome()
  }
</script>

<PageWithAction>
  <div slot="content">
    <h1>Share your contact info with {contactName}</h1>
    <p class="avatar">
      <Avatar />
    </p>
    <Attributes name={user.name} attributes={user.attributes} />
    <Textarea placeholder="Include a message for {contactFirstName}" />
  </div>

  <div slot="action" class="action">
    <span class="primary">
      <Button fullWidth onClick={shareAttributes}>Share</Button>
    </span>
    <span>
      <Button fullWidth secondary onClick={returnHome}>Skip</Button>
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
