<script>
  import notificationStore from '../../store/notifications'
  import userStore from '../../store/user'

  let badge = 0
  $: {
    const seen = n => {
      const { noticesViewedAt: viewed } = $userStore
      return viewed && n.timestamp <= viewed
    }

    badge = $notificationStore.filter(n => !n.accepted && !seen(n)).length
  }
</script>

<span class="badge" class:empty={!badge}>{badge}</span>

<style>
  .badge {
    display: block;
    width: 2em;
    line-height: 2em;
    background-color: var(--red);
    color: var(--white);
    border-radius: 50%;
    box-shadow: 1px 4px 8px rgba(0, 0, 0, 0.05), 0px 4px 4px rgba(0, 0, 0, 0.25);
    text-align: center;
    font-weight: bold;
  }
  .badge.empty {
    visibility: hidden;
  }
</style>
