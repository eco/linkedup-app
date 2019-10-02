<script>
  import page from 'page'
  import sandboxUser from './user'
  import { user } from '../src/store'

  const commands = {
    'Scan own badge': () => {
      page('/badge/123')
    },

    'Open verification email': () => {
      const query = new URLSearchParams()
      query.set('longy.user', JSON.stringify(sandboxUser))

      const url = new URL(document.location)
      url.pathname = '/verify/abc'
      url.search = query.toString()

      document.location.replace(url)
    },

    'Scan attendee badge': () => {
      page('/badge/456')
    },

    'Reset device': () => {
      page('/')
      localStorage.clear()
      document.location.reload()
    },
  }
</script>

<div class="console">
  <h1>Console</h1>
  <ul>
    {#each Object.entries(commands) as [name, callback]}
      <li>
        <button type="button" on:click={callback}>{name}</button>
      </li>
    {/each}
  </ul>
  <hr />
  <h1>Storage</h1>
  <pre>{$user ? JSON.stringify($user, null, 4) : '<empty>'}</pre>
</div>

<style>
  .console {
    text-align: center;
  }
  ul,
  li {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  li {
    margin: 1em 0;
  }
  button {
    font-size: 15px;
    text-transform: uppercase;
    cursor: pointer;
  }
  pre {
    text-align: left;
    font-size: 14px;
    line-height: normal;
  }
</style>
