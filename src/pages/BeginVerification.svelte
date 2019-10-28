<script>
  import events from '../services/events'

  const tracker = events.configured()
  tracker.track('view', {
    category: 'login',
    action: 'check_email',
  })
</script>

<h1>Check your email</h1>
<p>We've sent you an email with a link to log you in!</p>
