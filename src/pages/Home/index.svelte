<script>
  import page from 'page'
  import PageWithAction from '../../layout/PageWithAction'
  import { ReputationLog, Button } from '../../components'
  import cosmos from '../../services/cosmos'
  import ScanIcon from './ScanIcon'

  const scanContact = () => page('/scan')
  const openContact = e => {
    if (e.detail.type === 'connection') {
      page(`/contact/${e.detail.scanId}`)
    }
  }

  let dataPromise = Promise.all([
    cosmos.getPlayerScore(),
    cosmos.getReputationLog(),
  ])
</script>

<PageWithAction>
  <div slot="content">
    {#await dataPromise then data}
      <ReputationLog points={data[0]} log={data[1]} on:open={openContact} />
    {/await}
  </div>
  <div slot="action">
    <Button fullWidth on:click={scanContact}>
      <span class="scan-icon">
        <ScanIcon />
      </span>
      Scan contact
    </Button>
  </div>
</PageWithAction>

<style>
  .scan-icon {
    margin-right: 10px;
    position: relative;
    top: -1px;
  }
</style>
