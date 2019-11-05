<script>
  import { createEventDispatcher } from 'svelte'
  import { fly } from 'svelte/transition'
  import page from 'page'
  import config from '../../config'
  import userStore from '../../store/user'
  import NotifBadge from './NotifBadge'

  const dispatch = createEventDispatcher()
  const close = () => dispatch('close')

  const navigate = e => {
    e.preventDefault()
    close()
    page(e.target.pathname)
  }

  const navConfig = {
    '/': 'Connections',
    '/rewards': {
      name: 'Rewards',
      requiresLogin: true,
    },
    '/notifications': {
      name: 'Notifications',
      requiresLogin: true,
      badge: true,
      disabled: !config.gameActive,
    },
    '/leaderboard': 'Leaderboard',
    '/about': 'How to Play',
  }
  let navItems

  // userStore -> navItems
  $: {
    navItems = Object.entries(navConfig)
      .map(([path, entry]) => {
        if (entry.disabled || (entry.requiresLogin && !$userStore.profile)) {
          return false
        }
        const name = entry.name || entry
        return { path, name, badge: entry.badge }
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
            <span class="badge">
              <NotifBadge />
            </span>
          {/if}
          <a href={item.path} on:click={navigate}>{item.name}</a>
        </li>
      {/each}
      <li>
        <a
          href="mailto:linkedup@sfbw.io"
          target="_blank"
          rel="noopener noreferrer">
          Help
        </a>
      </li>
    </ol>
  </nav>

  <footer>
    <p class="subtitle">Powered by:</p>
    <a href="https://www.eco.com" target="_blank" rel="noopener noreferrer">
      <img src="/assets/images/eco.png" alt="Eco" />
    </a>
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
    overflow: scroll;
    padding: 12px;
    background-color: white;
    box-shadow: 0px 11px 15px rgba(0, 0, 0, 0.2),
      0px 9px 46px rgba(0, 0, 0, 0.12), 0px 24px 38px rgba(0, 0, 0, 0.14);
    z-index: var(--z-index-menu);
    display: flex;
    flex-direction: column;
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
    margin: 0.5em 0;
    font-size: 32px;
    font-weight: 500;
    line-height: 54px;
  }
  nav li {
    margin: 5px 0;
  }
  nav a {
    text-decoration: none;
    outline: none;
    color: var(--black);
  }
  .badge {
    float: right;
    position: relative;
    top: 4px;
    right: 10px;
    font-size: 18px;
  }
  footer {
    margin-top: auto;
    padding-left: 10px;
  }
  footer .subtitle {
    color: var(--dark-gray);
    text-transform: uppercase;
    font-size: 14px;
    font-weight: bold;
    margin: 0 0 5px;
  }
  footer a {
    display: block;
    width: 120px;
  }
  footer img {
    width: 100%;
    height: auto;
  }
</style>
