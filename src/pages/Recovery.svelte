<script>
  import page from 'page'
  import keyService from '../services/key'
  import { Spinner } from '../components'

  const processUrl = () => {
    const url = new URL(document.location.href)
    return {
      id: url.searchParams.get('id'),
      token: url.searchParams.get('token'),
    }
  }

  const recoverAccount = async () => {
    try {
      const { id, token } = processUrl()
      const result = await keyService.recoverAccount(id, token)
      page.redirect(result.claimUrl || '/')
    } catch (e) {
      window.alert(`ERROR: ${e.message}`)
    }
  }

  // begin recover as soon as page is loaded
  recoverAccount()
</script>

<div>
  <Spinner />
  <p>Logging back in&hellip;</p>
</div>

<style>
  div {
    text-align: center;
  }
</style>
