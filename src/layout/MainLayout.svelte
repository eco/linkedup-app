<script>
  import Menu from './Menu'
  import MenuIcon from './MenuIcon'
  import BackIcon from './BackIcon'

  export let navAction = 'menu'
  let menuVisible = false

  const showMenu = () => (menuVisible = true)
  const hideMenu = () => (menuVisible = false)
  const goBack = () => window.history.back()
</script>

<div class="layout">
  <header>
    Linked Up
    {#if navAction === 'menu'}
      <span class="menu-icon" on:click={showMenu}>
        <MenuIcon />
      </span>
    {:else if navAction === 'back'}
      <span class="menu-icon" on:click={goBack}>
        <BackIcon />
      </span>
    {/if}
  </header>

  <main>
    <slot />
  </main>

  {#if menuVisible}
    <Menu on:close={hideMenu} />
  {/if}
</div>

<style>
  .layout {
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
  }
  header {
    position: sticky;
    top: 0;
    z-index: var(--z-index-header);
    background-color: var(--blue);
    color: var(--white);
    text-transform: uppercase;
    text-align: center;
    line-height: 70px;
    font-weight: 800;
    font-size: 18px;
  }
  .menu-icon {
    position: absolute;
    top: 0;
    left: 25px;
  }
  main {
    background-color: var(--white);
    padding: var(--page-gutter-vert) var(--page-gutter-horiz);
    flex: 1 0 0;
  }
</style>
