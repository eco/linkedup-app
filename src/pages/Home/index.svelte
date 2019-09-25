<script>
  import page from 'page'
  import PageWithAction from '../../layout/PageWithAction'
  import ScanIcon from './ScanIcon'

  const scanContact = () => page('/scan')
</script>

<PageWithAction
  actionText="Scan contact"
  ActionIcon={ScanIcon}
  onAction={scanContact}>
  <h1>Your network</h1>
</PageWithAction>
