<script>
  import { onMount } from 'svelte'
  import page from 'page'
  // import { user } from '../store'
  import PageWithAction from '../layout/PageWithAction'
  import { Button, Textarea, Avatar, Attributes } from '../components'
  import cosmos from '../services/cosmos'
  import stubUser from '../../sandbox/user'

  let contactName = ''
  let loading = false
  $: [contactFirstName] = contactName.split(' ')
  export let pageParams

  onMount(() => {
    const { badgeId } = pageParams
    cosmos.getContactName(badgeId).then(name => {
      contactName = name
    })
    // cosmos.scanContact(badgeId)
  })

  const returnHome = () => page('/')
  const shareAttributes = async () => {
    // todo: how will this be done?
    // note: for demo, scanning contact occurs here
    const { badgeId } = pageParams
    loading = true
    await cosmos.scanContact(badgeId)
    loading = false
    returnHome()
  }
</script>

<PageWithAction>
  <div slot="content">
    <h1>Share your contact info with {contactName}</h1>
    <p class="avatar">
      <Avatar />
    </p>
    <Attributes name={stubUser.name} attributes={stubUser.attributes} />
    <Textarea placeholder="Include a message for {contactFirstName}" />
  </div>

  <div slot="action" class="action">
    <span class="primary">
      <Button fullWidth onClick={shareAttributes} {loading}>Share</Button>
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
