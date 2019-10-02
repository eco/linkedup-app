<script>
  import { onMount } from 'svelte'
  import cosmos from '../services/cosmos'

  export let pageParams

  onMount(async () => {
    await cosmos.beginVerification(pageParams.badgeId)
  })
</script>

<h1>Check your email</h1>
<p>We've sent you an email with a link to log you in!</p>
