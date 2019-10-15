<script>
  import loadImage from 'blueimp-load-image'
  import Avatar from './Avatar'

  export let selectedFile = undefined
  export let name

  let files = []
  let avatarUrl

  const imageOptions = {
    maxWidth: 500,
    maxHeight: 500,
    orientation: true,
  }

  // files -> avatarUrl (as data URL)
  $: {
    if (files[0]) {
      loadImage(
        files[0],
        canvas => {
          avatarUrl = canvas.toDataURL()
          canvas.toBlob(blob => (selectedFile = blob))
        },
        imageOptions
      )
    }
  }
</script>

<Avatar {avatarUrl} {name} />
<label>
  <span>Choose avatar</span>
  <input type="file" accept="image/*" bind:files />
</label>

<style>
  label input {
    display: none;
  }
  /* TODO: this was copied from ButtonLink, how to correctly abstract? */
  label span {
    display: inline-block;
    color: var(--blue);
    font-size: 12px;
    line-height: 18px;
    font-weight: normal;
    text-transform: uppercase;
    border: 0;
    padding: 1em 1.5em;
    outline: none;
  }
  label span:active {
    background-color: var(--pale-blue);
    opacity: 0.5;
  }
</style>
