<script>
  import page from 'page'
  import config from '../../config'
  import events from '../../services/events'
  import PageWithAction from '../../layout/PageWithAction'
  import { ReputationLog, Button } from '../../components'
  import playerStore from '../../store/player'
  import bonusStore from '../../store/bonus'
  import ScanIcon from './ScanIcon'

  const tracker = events.configured()
  tracker.track('view', {
    category: 'home',
  })

  const scanContact = () => page('/scan')
  const openContact = e => {
    if (e.detail.type === 'connection') {
      page(`/contact/${e.detail.scanId}`)
    }
  }

  let score
  let log
  let bonusPercent

  $: {
    const { loading, error, data: player } = $playerStore

    if (player && !(loading || error)) {
      const verificationEntry = {
        type: 'verification',
        name: player.name,
        timestamp: player.claimedAt,
        points: 5,
        label: 'Verified your profile',
        imageUrl: `${config.contentEndpoint}/avatars/${player.id}`,
      }

      const scans = player.scans
        .filter(scan => scan.accepted)
        .map(s => ({
          ...s,
          type: 'connection',
          label: `Connected to ${s.name}`,
        }))

      score = player.score
      log = [verificationEntry, ...scans].reverse()
    }
  }

  $: {
    const { data } = $bonusStore
    if (data && data.active) {
      bonusPercent = (data.multiplier - 1) * 100
    }
  }
</script>

<PageWithAction>
  <div slot="content">
    {#if $playerStore.data}
      <ReputationLog points={score} {log} on:open={openContact} />
    {/if}
  </div>
  <div slot="action">
    {#if $bonusStore.data && $bonusStore.data.active}
      <div class="boost">
        <header>Boost Active</header>
        <p>
          Scanning sponsors will earn you {bonusPercent}% bonus reputation
          points
        </p>
      </div>
    {/if}
    <Button fullWidth on:click={scanContact}>
      <span class="scan-icon">
        <ScanIcon />
      </span>
      Scan contact
    </Button>
  </div>
</PageWithAction>

<style>
  .boost {
    margin-bottom: 1em;
    background: var(--light-gray);
    border: 1px solid var(--orange);
    border-radius: 4px;
    padding: 12px;
    font-size: 16px;
    font-weight: normal;
  }
  .boost header {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
  }
  .boost p {
    margin: 0;
    font-size: 16px;
    line-height: 24px;
  }
  .scan-icon {
    margin-right: 10px;
    position: relative;
    top: -1px;
  }
</style>
