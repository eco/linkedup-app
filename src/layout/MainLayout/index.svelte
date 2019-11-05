<script>
  import page from 'page'
  import config from '../../config'
  import userStore from '../../store/user'
  import Menu from './Menu'
  import MenuIcon from './MenuIcon'
  import BackIcon from './BackIcon'
  import NotifIcon from './NotifIcon'
  import NotifBadge from './NotifBadge'

  export let navAction = 'menu'
  export let standalone = false
  let menuVisible = false

  const showMenu = () => (menuVisible = true)
  const hideMenu = () => (menuVisible = false)
  const goBack = () => window.history.back()
  const openNotifs = () => page('/notifications')
</script>

<div class="layout">
  <header>
    <a href="/">Linked Up</a>
    {#if !standalone}
      {#if navAction === 'menu'}
        <span class="menu-icon" on:click={showMenu}>
          <MenuIcon />
        </span>
      {:else if navAction === 'back'}
        <span class="menu-icon" on:click={goBack}>
          <BackIcon />
        </span>
      {/if}
      {#if $userStore.profile && config.gameActive}
        <span class="notif-icon" on:click={openNotifs}>
          <NotifIcon />
          <span class="badge">
            <NotifBadge />
          </span>
        </span>
      {/if}
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
  header a {
    text-decoration: none;
    outline: none;
    color: var(--white);
  }
  .menu-icon {
    position: absolute;
    top: 0;
    left: 25px;
  }
  .notif-icon {
    position: absolute;
    top: 0;
    right: 25px;
  }
  .badge {
    position: absolute;
    top: 13px;
    right: -10px;
    font-size: 11px;
  }
  main {
    background-color: var(--white);
    padding: var(--page-gutter-vert) var(--page-gutter-horiz);
    flex: 1 0 0;
  }
</style>
