<script>
  import MainLayout from '../../layout/MainLayout'
  import PageWithAction from '../../layout/PageWithAction'
  import cosmos from '../../services/cosmos'
  import { Button } from '../../components'

  let loading = false

  const parseUrl = () => {
    const url = new URL(document.location.href)
    return {
      address: url.searchParams.get('address'),
      sig: url.searchParams.get('sig'),
    }
  }

  const markClaimed = async () => {
    loading = true
    cosmos.claimWinnings(address, sig)
    winningsPromise = cosmos.getWinnings(address)
    loading = false
  }

  const { address, sig } = parseUrl()
  let winningsPromise = cosmos.getWinnings(address)
</script>

<MainLayout navAction={false}>
  <PageWithAction>
    <div slot="content">
      <h1>Attendee Reward Status</h1>
      {#await winningsPromise then winnings}
        <table>
          {#each winnings as prize}
            <tr>
              <td>{prize.name}</td>
              <td class="status">
                {#if prize.claimed}
                  <span class="tag">Claimed</span>
                {/if}
              </td>
            </tr>
          {/each}
        </table>
      {/await}
    </div>
    <div slot="action">
      <Button fullWidth on:click={markClaimed} {loading}>
        Mark all as claimed
      </Button>
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
    padding-top: 0.5em;
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
</style>
