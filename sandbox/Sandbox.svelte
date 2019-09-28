<script>
  import Console from './Console'
  import App from '../src/App'
</script>

<div class="sandbox">
  <div class="console">
    <Console />
  </div>
  <div class="emulator">
    <App />
  </div>
</div>

<style>
  .sandbox {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: flex-start;
    background-color: var(--black);
    padding: 20px;
  }

  .console {
    background-color: var(--gray);
    padding: 20px;
    width: 375px;
  }

  .emulator {
    width: 375px;
    height: 667px;
    overflow: auto;
    box-shadow: 0 0 10px var(--black);
  }
</style>
