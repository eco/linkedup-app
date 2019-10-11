<script>
  import Console from './Console'
  import App from '../src/App'
</script>

<div class="sandbox">
  <div class="emulator">
    <App />
  </div>
  <div class="console">
    <Console />
  </div>
</div>

<style>
  .sandbox {
    min-height: 100%;
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: flex-start;
    background-color: var(--black);
    padding: 20px;
  }

  .emulator {
    width: 375px;
    height: 667px;
    overflow: auto;
    box-shadow: 0 0 10px var(--black);
  }

  /* creates a new stacking context, for things like position:fixed */
  .emulator > :global(div.layout) {
    transform: translateZ(0);
  }

  .console {
    background-color: var(--gray);
    padding: 20px;
    width: 375px;
  }
</style>
