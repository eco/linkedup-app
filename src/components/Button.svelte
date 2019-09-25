<script>
  export let fullWidth = false
</script>

<button type="button" class:fullWidth>
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
    cursor: pointer;
  }

  button.fullWidth {
    width: 100%;
  }
</style>
