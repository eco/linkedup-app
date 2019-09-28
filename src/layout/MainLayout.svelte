<div class="layout">
  <header>The Chain Game</header>
  <main>
    <slot />
  </main>
</div>

<style>
  .layout {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    background-color: var(--white);
  }
  header {
    background-color: var(--blue);
    color: var(--white);
    text-transform: uppercase;
    text-align: center;
    line-height: 70px;
    font-weight: 800;
    font-size: 18px;
  }
  main {
    padding: var(--page-gutter-vert) var(--page-gutter-horiz);
    flex: 1 0 0;
  }
</style>
