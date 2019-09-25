<div class="layout">
  <header>The Chain Game</header>
  <main>
    <slot />
  </main>
</div>

<style>
  .layout {
    --header-height: 70px;
  }
  header {
    background-color: var(--blue);
    color: var(--white);
    text-transform: uppercase;
    text-align: center;
    line-height: var(--header-height);
    font-weight: 800;
    font-size: 18px;
  }
  main {
    padding: 38px 28px;
    min-height: calc(100vh - var(--header-height));
    display: flex;
    flex-direction: column;
  }
</style>
