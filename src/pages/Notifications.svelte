<script>
  import page from 'page'
  import { format } from 'date-fns'
  import { Avatar } from '../components'
  import notificationStore from '../store/notifications'

  const openNotification = notif => {
    if (notif.type === 'reward') {
      page(`/rewards/${notif.index}`)
    } else {
      page(`/badge/${notif.id}`)
    }
  }
</script>

<h1>Notifications</h1>
{#if $notificationStore.length}
  <table>
    <tbody>
      {#each $notificationStore as notif}
        <tr>
          <td class="avatar-col">
            <Avatar
              avatarUrl={notif.imageUrl}
              name={notif.name}
              hideLabel
              size={50} />
          </td>
          <td class="info">
            <span>{notif.label}</span>
            <span class="name">{notif.name}</span>
            <span class="timestamp">{format(notif.timestamp, 'h:mma')}</span>
          </td>
          <td>
            {#if !notif.accepted}
              <span class="cta" on:click={() => openNotification(notif)}>
                View
              </span>
            {/if}

          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{:else}
  <p>No notifications found. Check back soon to see your game activity!</p>
{/if}

<style>
  table {
    width: 100%;
    margin-top: 2em;
    border-spacing: 0;
  }
  td {
    font-size: 16px;
    line-height: 24px;
    vertical-align: top;
    font-weight: 400;
    padding-bottom: 1em;
  }
  td.avatar-col {
    width: 65px;
  }
  td.info span {
    display: block;
    line-height: 1.4;
  }
  .name {
    font-size: 14px;
    font-weight: 200;
  }
  .timestamp {
    font-size: 10px;
    font-weight: 200;
    text-transform: lowercase;
  }
  td:last-child {
    text-align: right;
  }
  .cta {
    font-size: 14px;
    background-color: var(--light-purple);
    color: var(--purple);
    text-transform: uppercase;
    padding: 8px 12px;
    border-radius: 50px;
  }
</style>
