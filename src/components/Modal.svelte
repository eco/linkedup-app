<div class="modal-background">
  <section class="modal">
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
    align-items: center;
  }

  section {
    background-color: var(--white);
    margin: 1em;
    padding: 1em 2em;
    overflow: auto;
    width: 100%;
  }
</style>
