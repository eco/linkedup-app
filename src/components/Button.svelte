<script>
  import { createEventDispatcher } from 'svelte'
  import Spinner from './Spinner'

  export let fullWidth = false
  export let secondary = false
  export let loading = false

  const dispatch = createEventDispatcher()
  const handleClick = () => !loading && dispatch('click')
</script>

<button type="button" class:fullWidth class:secondary on:click={handleClick}>
  {#if loading}
    <Spinner />
  {:else}
    <slot />
  {/if}
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
