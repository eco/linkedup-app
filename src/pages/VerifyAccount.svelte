<script>
  import page from 'page'
  import { user } from '../store'
  import PageWithAction from '../layout/PageWithAction'
  import { Avatar, Button, Attributes } from '../components'

  if ($user) {
    // TODO: display error
    console.error('Device has already been initialized')
  }

  const currentUrl = new URL(document.location.href)
  const { searchParams } = currentUrl

  $user = JSON.parse(searchParams.get('longy.user'))
  searchParams.delete('longy.user')
  currentUrl.search = searchParams.toString()
  window.history.replaceState({}, '', currentUrl.toString())

  const finishVerification = () => page('/')
</script>

<PageWithAction>
  <div slot="content">
    <h1>Verify my profile</h1>
    <p class="avatar">
      <Avatar editable />
    </p>
    <Attributes name={$user.name} attributes={$user.attributes} />
  </div>
  <div slot="action">
    <Button fullWidth onClick={finishVerification}>Finish</Button>
  </div>
</PageWithAction>

<style>
  .avatar {
    margin: 2em 0;
    text-align: center;
    line-height: 1;
  }
</style>
