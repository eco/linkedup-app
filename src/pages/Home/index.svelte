<script>
  import page from 'page'
  import PageWithAction from '../../layout/PageWithAction'
  import { Button } from '../../components'
  import cosmos from '../../services/cosmos'
  import ScanIcon from './ScanIcon'

  let points
  cosmos.getPlayerScore().then(_p => {
    points = _p
  })
  let scans = []
  cosmos.getScans().then(_s => {
    scans = _s
  })
  const scanContact = () => page('/scan')
</script>

<PageWithAction>
  <div slot="content">
    <h1>Your network</h1>
    <p class="points">
      Reputation points:
      <a href="/reputation">{points}</a>
    </p>
    <div class="notif">
      <header>You earned 200 reputation points</header>
      <p>
        You'll earn 200 reputation points when you share your contact details
      </p>
    </div>
    <ul>
      {#each scans as scan}
        <li>
          <a href={`/contact/${scan.scanId}`}>{scan.name}</a>
        </li>
      {/each}
    </ul>
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
  h1 {
    margin-bottom: 0;
  }
  .points {
    margin-top: 0;
    text-transform: uppercase;
    font-size: 12px;
    line-height: 14px;
    font-weight: 500;
  }
  .notif {
    background-color: var(--light-blue);
    border-radius: 10px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.07);
    margin: 10px -10px 0;
    padding: 20px 10px;
    font-size: 14px;
    line-height: 21px;
    font-weight: 500;
  }
  .notif header {
    color: var(--blue);
  }
  .notif p {
    margin-bottom: 0;
  }
  .scan-icon {
    margin-right: 10px;
    position: relative;
    top: -1px;
  }
</style>
