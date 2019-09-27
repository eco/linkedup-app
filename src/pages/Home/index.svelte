<script>
  import page from 'page'
  import PageWithAction from '../../layout/PageWithAction'
  import { Button } from '../../components'
  import ScanIcon from './ScanIcon'

  const scanContact = () => page('/scan')
</script>

<PageWithAction>
  <div slot="content">
    <h1>Your network</h1>
  </div>
  <div slot="action">
    <Button fullWidth onClick={scanContact}>
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
