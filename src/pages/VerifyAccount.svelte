<script>
  import page from 'page'
  import { user } from '../store'
  import PageWithAction from '../layout/PageWithAction'
  import { Avatar, Button, Attributes } from '../components'
  import cosmos from '../services/cosmos'
  import stubUser from '../../sandbox/user'

  let loading = false

  if ($user.name) {
    // TODO: display error
    console.error('Device has already been initialized')
  }

  const currentUrl = new URL(document.location.href)
  const { searchParams } = currentUrl

  const address = searchParams.get('attendee')
  const secret = searchParams.get('secret')

  currentUrl.search = ''
  window.history.replaceState({}, '', currentUrl.toString())

  const finishVerification = async () => {
    loading = true
    await cosmos.claimBadge(address, secret)
    loading = false
    page('/')
  }
</script>

<PageWithAction>
  <div slot="content">
    <h1>Verify my profile</h1>
    <p class="avatar">
      <Avatar editable />
    </p>
    <Attributes name={stubUser.name} attributes={stubUser.attributes} />
  </div>
  <div slot="action">
    <Button fullWidth onClick={finishVerification} {loading}>Finish</Button>
  </div>
</PageWithAction>

<style>
  .avatar {
    margin: 2em 0;
    text-align: center;
    line-height: 1;
  }
</style>
