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
    const { id, token } = processUrl()
    await keyService.recoverAccount(id, token)
    page.redirect('/')
  }

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
