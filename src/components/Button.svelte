<script>
  export let fullWidth = false
  export let onClick = () => {}
</script>

<button type="button" class:fullWidth on:click={onClick}>
  <slot />
</button>

<style>
  button {
    color: var(--white);
    background-color: var(--blue);
    outline: none;
    border: 0;
    padding: 0;
    line-height: 54px;
    text-transform: uppercase;
  }

  button.fullWidth {
    width: 100%;
  }
</style>
