<script>
  import page from 'page'
  import { user } from '../../store'
  import PageWithAction from '../../layout/PageWithAction'
  import { Avatar, Button, Attributes } from '../../components'
  import cosmos from '../../services/cosmos'
  import processUrl from './process-url'

  const { address, secret, profile } = processUrl()
  let loading = false

  const finishVerification = async () => {
    loading = true
    await cosmos.claimBadge(address, secret, profile.name)
    loading = false
    $user = { ...$user, profile }
    page('/')
  }
</script>

<PageWithAction>
  <div slot="content">
    <h1>Verify my profile</h1>
    <p>What are you usually comfortable sharing?</p>
    <p class="avatar">
      <Avatar editable />
    </p>
    <Attributes
      editable
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
    margin: 2em 0;
    text-align: center;
    line-height: 1;
  }
</style>
