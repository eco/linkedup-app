<script>
  import cosmos from '../services/cosmos'
  import { Avatar, TextInput } from '../components'

  export let pageParams
  const scanPromise = cosmos.getScan(pageParams.scanId, true)
</script>

{#await scanPromise then scan}
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
{/await}

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
