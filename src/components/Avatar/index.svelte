<script>
  import { onMount } from 'svelte'
  import DefaultIcon from './DefaultIcon'

  export let avatarUrl
  export let name = ''
  export let hideLabel = false
  export let size = 265

  let imageExists = false

  const getHue = text => {
    // takes the first letter of text and converts it to a value between 0-255
    const num = (text[0] || 'a').toLowerCase().charCodeAt(0)
    return ((num - 97) * 255) / 25
  }

  if (avatarUrl) {
    onMount(() => {
      const img = new Image()
      img.onload = () => (imageExists = true)
      img.src = avatarUrl
    })
  }

  // name -> initials
  $: initials = name
    .split(' ')
    .map(c => c[0])
    .join('')
    .slice(0, 2)

  // initials -> hue
  $: fill = initials ? `hsl(${getHue(initials)}, 60%, 71%)` : ''
</script>

{#if imageExists}
  <span
    class="avatar"
    style={`background-image: url("${avatarUrl}"); width: ${size}px; height: ${size}px;`} />
{:else}
  <span
    class="avatar"
    style={`color: ${fill}; width: ${size}px; height: ${size}px;`}>
    <DefaultIcon />
    {#if !hideLabel}
      <span class="initials">{initials}</span>
    {/if}
  </span>
{/if}

<style>
  .avatar {
    display: inline-flex;
    width: 265px;
    height: 265px;
    text-align: center;
    background: none no-repeat center center var(--avatar-bg);
    background-size: cover;
    border-radius: 50%;
    justify-content: center;
    align-items: flex-end;
    position: relative;
  }
  .avatar :global(svg) {
    height: 95%;
  }
  .initials {
    font-size: 30px;
    position: absolute;
    bottom: 20%;
    left: 50%;
    transform: translateX(-50%);
    text-transform: uppercase;
    font-weight: 900;
    color: var(--black);
  }
</style>
