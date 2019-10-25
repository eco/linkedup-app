<script>
  import { createEventDispatcher } from 'svelte'
  import { fly } from 'svelte/transition'
  import page from 'page'
  import userStore from '../store/user'
  import notificationsStore from '../store/notifications'
  import MenuGraphic from './MenuGraphic'

  const dispatch = createEventDispatcher()
  const close = () => dispatch('close')

  const navigate = e => {
    e.preventDefault()
    close()
    page(e.target.pathname)
  }

  const navConfig = {
    '/': 'Home',
    '/rewards': {
      name: 'Rewards',
      requiresLogin: true,
    },
    '/notifications': {
      name: 'Notifications',
      requiresLogin: true,
      badge: () => $notificationsStore.filter(n => !n.accepted).length,
    },
    '/leaderboard': 'Leaderboard',
    '/about': 'About',
  }
  let navItems

  // userStore -> navItems
  $: {
    navItems = Object.entries(navConfig)
      .map(([path, entry]) => {
        if (entry.requiresLogin && !$userStore.profile) {
          return false
        }
        const name = entry.name || entry
        let badge
        if (entry.badge) {
          badge = entry.badge()
        }
        return { path, name, badge }
      })
      .filter(Boolean)
  }
</script>

<div class="menu-bg" on:click={close} />
<div class="menu" transition:fly={{ x: -200 }}>
  <header>Linked Up</header>
  <nav>
    <ol class="nav">
      {#each navItems as item}
        <li>
          {#if item.badge}
            <span class="badge">{item.badge}</span>
          {/if}
          <a href={item.path} on:click={navigate}>{item.name}</a>
        </li>
      {/each}
      <li>
        <a href="mailto:help@eco.com" target="_blank" rel="noopener noreferrer">
          Help
        </a>
      </li>
    </ol>
  </nav>

  <footer>
    <MenuGraphic />
  </footer>
</div>

<style>
  .menu-bg {
    position: fixed;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(89, 89, 89, 0.2);
    z-index: var(--z-index-menu);
  }
  .menu {
    position: fixed;
    left: 0;
    top: 0;
    height: 100%;
    width: 90%;
    padding: 12px;
    background-color: white;
    box-shadow: 0px 11px 15px rgba(0, 0, 0, 0.2),
      0px 9px 46px rgba(0, 0, 0, 0.12), 0px 24px 38px rgba(0, 0, 0, 0.14);
    z-index: var(--z-index-menu);
  }
  header {
    color: var(--blue);
    font-weight: bold;
    font-size: 36px;
    line-height: 54px;
    text-transform: uppercase;
  }
  nav {
    padding-left: 10px;
    margin-top: 1em;
    font-size: 32px;
    font-weight: 500;
    line-height: 54px;
  }
  nav li {
    margin-bottom: 10px;
  }
  nav a {
    text-decoration: none;
    outline: none;
    color: var(--black);
  }
  footer {
    text-align: center;
    margin-top: 2em;
  }
  footer :global(svg) {
    width: 180px;
    height: 180px;
  }
  .badge {
    float: right;
    width: 2em;
    line-height: 2em;
    background-color: var(--red);
    color: var(--white);
    border-radius: 10em;
    box-shadow: 1px 4px 8px rgba(0, 0, 0, 0.05), 0px 4px 4px rgba(0, 0, 0, 0.25);
    font-size: 18px;
    position: relative;
    top: 4px;
    right: 10px;
    text-align: center;
    font-weight: bold;
  }
</style>
