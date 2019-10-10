<script>
  import cosmos from '../services/cosmos'
  import { Avatar } from '../components'

  export let pageParams

  let scan
  cosmos.getScan(pageParams.scanId, true).then(_scan => {
    scan = _scan
  })
</script>

<p class="avatar">
  <Avatar />
</p>
{#if scan}
  <h1>{scan.name}</h1>
  <ul>
    {#each scan.sharedAttrs as attr}
      <li>
        <span class="label">{attr.label}</span>
        {attr.value}
      </li>
    {/each}
  </ul>
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
  .label {
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
    display: block;
    line-height: 1;
  }
  .message {
    background-color: var(--pale-blue);
    border-radius: 8px;
    padding: 8px;
    margin: 1em -8px;
  }
</style>
