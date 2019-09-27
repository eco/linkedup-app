<script>
  export let onClick = () => {}
  export let fullWidth = false
  export let secondary = false
</script>

<button type="button" class:fullWidth class:secondary on:click={onClick}>
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
    font-weight: 500;
  }

  button.fullWidth {
    width: 100%;
  }

  button.secondary {
    background-color: var(--gray);
  }
</style>
