<script>
  import MainLayout from '../../layout/MainLayout'
  import PageWithAction from '../../layout/PageWithAction'
  import cosmos from '../../services/cosmos'
  import config from '../../config'
  import { Button } from '../../components'

  let loading = false
  let badgeId

  // configure error reporting
  window.Sentry.init({
    dsn: config.sentryDsn,
    environment: config.env,
  })

  const parseUrl = () => {
    const url = new URL(document.location.href)
    return {
      address: url.searchParams.get('address'),
      sig: url.searchParams.get('sig'),
    }
  }

  const markClaimed = async () => {
    try {
      loading = true
      await cosmos.claimWinnings(address, sig)
      winningsPromise = cosmos.getWinnings(address)
    } catch (e) {
      window.alert(`ERROR: ${e.message}`)
    } finally {
      loading = false
    }
  }

  const { address, sig } = parseUrl()

  let winningsPromise = cosmos.getWinnings(address)
  cosmos.getContactByAddr(address).then(contact => (badgeId = contact.id))
</script>

<MainLayout standalone>
  <PageWithAction>
    <div slot="content">
      <h1>Attendee Reward Status</h1>
      {#if badgeId}
        <h2>Badge #{badgeId}</h2>
      {/if}
      {#await winningsPromise then winnings}
        {#if winnings.length}
          <table>
            {#each winnings as prize}
              <tr class:unclaimed={!prize.claimed}>
                <td>{prize.name}</td>
                <td class="status">
                  {#if prize.claimed}
                    <span class="tag">Claimed</span>
                  {/if}
                </td>
              </tr>
            {/each}
          </table>
        {:else}
          <p>Player has no rewards.</p>
        {/if}
      {/await}
    </div>
    <div slot="action">
      {#await winningsPromise then winnings}
        {#if winnings.filter(w => !w.claimed).length}
          <Button fullWidth on:click={markClaimed} {loading}>
            Mark all as claimed
          </Button>
        {/if}
      {/await}
    </div>
  </PageWithAction>

</MainLayout>

<style>
  table {
    margin-top: 1.5em;
    width: 100%;
    border-spacing: 0;
  }
  table td {
    padding: 0.5em 0;
    vertical-align: top;
  }
  tr.unclaimed {
    color: var(--blue);
    font-weight: normal;
  }
  .status {
    text-align: right;
  }
  .tag {
    font-size: 14px;
    font-weight: bold;
    background-color: var(--light-gray);
    color: var(--dark-gray);
    text-transform: uppercase;
    padding: 8px 12px;
    border-radius: 50px;
  }
  h2 {
    font-size: 16px;
    font-weight: 500;
    line-height: 36px;
    margin: 1em 0;
    color: var(--blue);
  }
</style>
