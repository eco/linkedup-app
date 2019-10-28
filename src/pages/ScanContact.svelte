<script>
  import page from 'page'
  import { QRScanner } from '../components'

  const handleCode = e => {
    const url = new URL(e.detail.url)
    page.redirect(url.pathname)
  }
</script>

<div class="scan-contact">
  <h1>Scan another attendee's QR code to add them to your network</h1>
  <div class="qr-scanner">
    <QRScanner on:code={handleCode} />
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
