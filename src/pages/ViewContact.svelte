<script>
  import page from 'page'
  import { decryptData } from '../crypto'
  import events from '../services/events'
  import userStore from '../store/user'
  import playerStore from '../store/player'
  import { Avatar, TextInput } from '../components'

  export let pageParams

  const tracker = events.configured()
  tracker.track('view', {
    category: 'connection',
  })

  const { scanId } = pageParams
  let scan

  $: {
    if ($playerStore.data) {
      const { rsaKeyPair } = $userStore
      const foundScan = $playerStore.data.scans.find(s => s.scanId === scanId)

      if (!foundScan || !foundScan.accepted) {
        page.redirect('/')
      }

      if (foundScan.encryptedData) {
        decryptData(foundScan.encryptedData, rsaKeyPair.privateKey).then(
          data => (scan = { ...foundScan, ...data })
        )
      } else {
        scan = foundScan
      }
    }
  }
</script>

{#if scan}
  <p class="avatar">
    <Avatar name={scan.name} avatarUrl={scan.imageUrl} />
  </p>
  <h1>{scan.name}</h1>
  {#if scan.sharedAttrs}
    <ul>
      {#each scan.sharedAttrs as attr}
        <li>
          <TextInput
            fullWidth
            label={attr.label}
            bind:value={attr.value}
            readonly />
        </li>
      {/each}
    </ul>
  {/if}
  {#if scan.message}
    <p class="message">{scan.message}</p>
  {/if}
{/if}

<style>
  .avatar {
    text-align: center;
    line-height: 1;
  }
  h1 {
    text-align: center;
    margin-bottom: 2em;
  }
  li:not(:first-child) {
    margin-top: 1em;
  }
  .message {
    margin-top: 2em;
    font-size: 15px;
    font-style: italic;
    font-weight: normal;
    padding: 1em;
    box-shadow: 0px 1px 8px rgba(0, 0, 0, 0.2), 0px 3px 4px rgba(0, 0, 0, 0.12),
      0px 3px 3px rgba(0, 0, 0, 0.14);
    border-radius: 2px;
  }
</style>
