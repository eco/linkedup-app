<script>
  import page from 'page'
  import { QRScanner } from '../components'

  let found = false
  const handleCode = () => {
    if (found) {
      return
    }
    found = true
    page('/badge/1422426129')
  }
</script>

<div class="scan-contact">
  <h1>Login</h1>
  <p>Scan your SF Blockchain Week badge to login.</p>
  <div class="qr-scanner">
    <QRScanner onCode={handleCode} />
  </div>
</div>

<style>
  .scan-contact {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .qr-scanner {
    flex: 1 0 0;
    margin: calc(var(--page-gutter-vert) * -1)
      calc(var(--page-gutter-horiz) * -1);
    margin-top: var(--page-gutter-vert);
  }
</style>
