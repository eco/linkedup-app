<script>
  import page from 'page'
  import QRCode from 'qrcode'
  import cosmos from '../services/cosmos'

  export let pageParams = {}
  let qrCodeVisible = false
  let qrCodePromise = QRCode.toDataURL('https://www.google.com/', {
    margin: 0,
    width: 200,
  })

  const displayQrCode = () => (qrCodeVisible = true)

  const getPrizeAtIndex = async index => {
    if (index) {
      const [score, prizes] = await Promise.all([
        cosmos.getPlayerScore(),
        cosmos.getPrizes(),
      ])
      const prize = prizes[index]
      if (prize && score >= prize.repNeeded) {
        return prize
      }
    }
    page.redirect('/rewards')
  }

  const prizePromise = getPrizeAtIndex(pageParams.prizeIndex)
</script>

{#await prizePromise then prize}
  <h1>{prize.prizeText}</h1>
  <p>
    Present this screen at the SF Blockchain Week merchandise booth to claim
    your prize.
  </p>
  <img src={prize.imageUrl} alt={prize.prizeText} />
  <span class="qr-code" on:click={displayQrCode}>
    {#if qrCodeVisible}
      {#await qrCodePromise then qrCode}
        <img src={qrCode} alt="QR Code for prize redemption" />
      {/await}
    {:else}Show One-Time use QR Code{/if}
  </span>

{/await}

<style>
  img {
    width: 100%;
  }
  p {
    font-size: 16px;
    font-weight: normal;
    line-height: 19px;
    margin-bottom: 3em;
  }
  .qr-code {
    display: flex;
    margin: -5em auto 0;
    position: relative;
    width: 200px;
    height: 200px;
    background-color: var(--light-blue);
    justify-content: center;
    align-items: center;
    text-align: center;
    border: 10px solid var(--white);
  }
</style>
