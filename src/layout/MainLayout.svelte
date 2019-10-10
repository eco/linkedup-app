<div class="layout">
  <header>Linked Up</header>
  <main>
    <slot />
  </main>
</div>

<style>
  .layout {
    display: flex;
    flex-direction: column;
    height: 100%;
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
    background-color: var(--white);
    padding: var(--page-gutter-vert) var(--page-gutter-horiz);
    flex: 1 0 0;
  }
</style>
