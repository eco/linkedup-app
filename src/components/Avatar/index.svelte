<script>
  import DefaultIcon from './DefaultIcon'

  export let avatarUrl = undefined
  export let name = ''
  export let hideLabel = false
  export let size = 265
  export let disableHue = false
  export let useFallback = true

  let imageExists = false
  let initials
  let fill

  const getHue = text => {
    // takes the first letter of text and converts it to a value between 0-255
    const num = (text[0] || 'a').toLowerCase().charCodeAt(0)
    return ((num - 97) * 360) / 26
  }

  // avatarUrl -> imageExists
  $: {
    if (avatarUrl) {
      const img = new Image()
      img.onload = () => (imageExists = true)
      img.onerror = () => (imageExists = false)
      img.src = avatarUrl
    }
  }

  // name -> initials, hue
  $: {
    fill = name && !disableHue ? `hsl(${getHue(name)}, 60%, 71%)` : 'white'
    initials = name
      .split(' ')
      .map(c => c[0])
      .join('')
      .slice(0, 2)
  }
</script>

<span
  class="avatar"
  style={`background-image: url("${avatarUrl}"); color: ${fill}; width: ${size}px; height: ${size}px;`}>
  {#if !imageExists && useFallback}
    <DefaultIcon />
    {#if !hideLabel}
      <span class="initials">{initials}</span>
    {/if}
  {/if}
</span>

<style>
  .avatar {
    display: inline-flex;
    width: 1em;
    height: 1em;
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
