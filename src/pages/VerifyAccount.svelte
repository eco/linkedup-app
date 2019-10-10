<script>
  import page from 'page'
  import { user } from '../store'
  import PageWithAction from '../layout/PageWithAction'
  import { Avatar, Button, Attributes } from '../components'
  import cosmos from '../services/cosmos'

  let loading = false

  if ($user.name) {
    // TODO: display error
    console.error('Device has already been initialized')
  }

  const currentUrl = new URL(document.location.href)
  const { searchParams } = currentUrl
  const address = searchParams.get('attendee')
  const secret = searchParams.get('secret')
  let profile = searchParams.get('profile')
  profile = JSON.parse(window.atob(profile))

  const name = `${profile.first_name} ${profile.last_name}`
  const attributes = [
    {
      label: 'email',
      value: profile.email,
    },
    {
      label: 'facebook',
      value: 'mark.alien.z',
    },
  ]
  let defaultShare = attributes.map(a => a.label) // turn on all by default

  currentUrl.search = ''
  window.history.replaceState({}, '', currentUrl.toString())

  const finishVerification = async () => {
    loading = true
    await cosmos.claimBadge(address, secret)
    loading = false
    $user = { ...$user, profile: { name, attributes, defaultShare } }
    page('/')
  }
</script>

<PageWithAction>
  <div slot="content">
    <h1>Verify my profile</h1>
    <p>What are you usually comfortable sharing?</p>
    <p class="avatar">
      <Avatar />
    </p>
    <Attributes {name} {attributes} bind:share={defaultShare} />
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
