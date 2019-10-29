<script>
  import page from 'page'
  import config from '../../config'
  import events from '../../services/events'
  import PageWithAction from '../../layout/PageWithAction'
  import { ReputationLog, Button } from '../../components'
  import playerStore from '../../store/player'
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

  $: {
    const player = $playerStore.data

    if (player) {
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
</script>

<PageWithAction>
  <div slot="content">
    {#if $playerStore.data}
      <ReputationLog points={score} {log} on:open={openContact} />
    {/if}
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
