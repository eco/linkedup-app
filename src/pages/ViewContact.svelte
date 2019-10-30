<script>
  import page from 'page'
  import config from '../config'
  import { decryptData } from '../crypto'
  import events from '../services/events'
  import userStore from '../store/user'
  import playerStore from '../store/player'
  import { Avatar } from '../components'

  const { platforms } = config

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
          data => {
            const sharedAttrs = data.sharedAttrs.map(attr => {
              const platform = platforms.find(p => p.name === attr.label)
              switch (attr.type) {
                case 'email':
                  return { ...attr, href: `email:${attr.value}` }

                case 'tel':
                  if (platform.name === 'Phone') {
                    return { ...attr, href: `tel:${attr.value}` }
                  }
                  return attr

                case 'url':
                  return {
                    ...attr,
                    href: attr.value,
                    value: attr.value.replace(
                      platform.prefix,
                      platform.vanityPrefix || ''
                    ),
                  }

                default:
                  return attr
              }
            })
            scan = { ...foundScan, ...data, sharedAttrs }
          }
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
        <li class="field">
          <span class="label">{attr.label}</span>
          <span class="value">
            {#if attr.href}
              <a href={attr.href} target="_blank" rel="noopener noreferrer">
                {attr.value}
              </a>
            {:else}{attr.value}{/if}
          </span>
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
  li {
    padding-top: 12px;
    position: relative;
  }
  li:not(:first-child) {
    margin-top: 1em;
  }
  li .label {
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
    line-height: 1;
    height: 12px;
    position: absolute;
    top: 0;
    left: 0;
  }
  .value {
    display: block;
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
