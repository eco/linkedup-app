<script>
  import page from 'page'
  import notificationsStore from '../store/notifications'
  import Menu from './Menu'
  import MenuIcon from './MenuIcon'
  import BackIcon from './BackIcon'
  import NotifIcon from './NotifIcon'

  export let navAction = 'menu'
  let menuVisible = false

  const showMenu = () => (menuVisible = true)
  const hideMenu = () => (menuVisible = false)
  const goBack = () => window.history.back()
  const openNotifs = () => page('/notifications')

  $: badge = $notificationsStore.filter(n => !n.accepted).length
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
    <span class="notif-icon" on:click={openNotifs}>
      <NotifIcon />
      {#if badge}
        <span class="badge">{badge}</span>
      {/if}
    </span>
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
  .notif-icon {
    position: absolute;
    top: 0;
    right: 25px;
  }
  main {
    background-color: var(--white);
    padding: var(--page-gutter-vert) var(--page-gutter-horiz);
    flex: 1 0 0;
  }
  .badge {
    position: absolute;
    width: 2em;
    line-height: 2em;
    background-color: var(--red);
    color: var(--white);
    border-radius: 10em;
    box-shadow: 1px 4px 8px rgba(0, 0, 0, 0.05), 0px 4px 4px rgba(0, 0, 0, 0.25);
    font-size: 11px;
    top: 13px;
    right: -10px;
    text-align: center;
    font-weight: bold;
  }
</style>
