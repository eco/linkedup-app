<script>
  import MainLayout from '../../layout/MainLayout'
  import PageWithAction from '../../layout/PageWithAction'
  import keyService from '../../services/key'
  import cosmos from '../../services/cosmos'
  import { decryptData } from '../../crypto'
  import { Button, Spinner } from '../../components'
  import userStore from '../../store/user'

  let loading = false

  const url = new URL(document.location.href)
  const id = url.searchParams.get('id')
  const token = url.searchParams.get('token')

  const recoverAccount = async () => {
    try {
      await keyService.recoverAccount(id, token)
    } catch (e) {
      window.Sentry.captureException(e)
      throw e
    }
  }

  const exportContacts = async () => {
    try {
      loading = true
      const player = await cosmos.getPlayer(id)
      const { rsaKeyPair } = $userStore
      const contacts = player.scans.map(scan =>
        decryptData(scan.encryptedData, rsaKeyPair.privateKey)
      )
      console.log(contacts)
    } catch (e) {
      window.Sentry.captureException(e)
      window.alert(`ERROR: ${e.message}`)
    } finally {
      loading = false
    }
  }

  const recoveryPromise = $userStore.profile
    ? Promise.resolve()
    : recoverAccount()
</script>

<MainLayout standalone>
  {#await recoveryPromise}
    <div class="progress">
      <Spinner />
      <p>Logging back in&hellip;</p>
    </div>
  {:then recovery}
    <PageWithAction>
      <div slot="content">
        <h1>Download your contact information</h1>
        <p>You'll receive a CSV file containing all the connections you made</p>
      </div>
      <div slot="action">
        <Button fullWidth on:click={exportContacts} {loading}>Download</Button>
      </div>
    </PageWithAction>
  {:catch error}
    <p>Something went wrong: {error.message}</p>
  {/await}
</MainLayout>

<style>
  .progress {
    text-align: center;
  }
</style>
