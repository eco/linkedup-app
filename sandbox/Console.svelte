<script>
  import page from 'page'
  import user from './user'

  const commands = {
    'Reset device': () => {
      page('/')
      localStorage.clear()
      document.location.reload()
    },

    'Scan own badge': () => {
      page('/badge/123')
    },

    'Open verification email': () => {
      const query = new URLSearchParams()
      query.set('name', user.name)
      query.set('attributes', JSON.stringify(user.attributes))

      const url = new URL(document.location)
      url.search = query.toString()
      url.hash = '#!/verify/abc'

      document.location.replace(url)
    },

    'Scan attendee badge': () => {
      page('/badge/456')
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
</style>
