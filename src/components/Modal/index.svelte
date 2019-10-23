<script>
  import { createEventDispatcher } from 'svelte'
  import Button from '../Button'
  import CloseIcon from './CloseIcon'

  export let title

  const dispatch = createEventDispatcher()
</script>

<div class="modal-background">
  <section class="modal">
    <span class="close">
      <Button on:click={() => dispatch('close')} secondary>
        <CloseIcon />
      </Button>
    </span>
    <h1>{title}</h1>
    <slot />
  </section>
</div>

<style>
  .modal-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    z-index: var(--z-index-modal);
  }

  section {
    background-color: var(--white);
    margin: 1em;
    padding: 2em;
    overflow: auto;
    width: 100%;
  }

  .close {
    float: right;
  }
  .close :global(button) {
    margin: 0;
    padding: 0.5em;
    line-height: 1;
  }
</style>
