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
    const result = await keyService.recoverAccount(id, token)
    if (result.profileRecovered) {
      // account recovery fully completed
      page.redirect('/')
    } else {
      // keys recovered but profile is yet to be claimed
      const params = {
        attendee: result.address,
        secret: result.secret,
        avatar: result.avatar,
        profile: result.profile,
      }
      const query = new URLSearchParams(params).toString()
      page.redirect(`/claim?${query}`)
    }
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
