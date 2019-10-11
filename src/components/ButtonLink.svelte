<script>
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()
</script>

<button type="button" on:click={() => dispatch('click')}>
  <slot />
</button>

<style>
  button {
    color: var(--blue);
    font-size: 12px;
    line-height: 18px;
    font-weight: normal;
    text-transform: uppercase;
    border: 0;
    padding: 1em 1.5em;
    outline: none;
  }
  button:active {
    background-color: var(--pale-blue);
    opacity: 0.5;
  }
</style>
