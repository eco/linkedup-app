<script>
  import page from 'page'
  import PageWithAction from '../../layout/PageWithAction'
  import { AvatarEditor, Button, Attributes } from '../../components'
  import cosmos from '../../services/cosmos'
  import s3 from '../../services/s3'
  import processUrl from './process-url'

  let loading = false
  let avatarFile

  const { address, secret, avatarUploadUrl, profile } = processUrl()

  const finishVerification = async () => {
    loading = true
    if (avatarFile) {
      await s3.uploadFile(avatarUploadUrl, avatarFile)
    }
    await cosmos.claimBadge(address, secret, profile)
    loading = false
    page('/')
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
