<script>
  import notificationStore from '../store/notifications'

  $: badge = $notificationStore.filter(n => !n.accepted).length
</script>

{#if badge}
  <span class="badge">{badge}</span>
{/if}

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
</style>
