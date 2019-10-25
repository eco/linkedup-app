<script>
  import page from 'page'
  import userStore from '../src/store/user'

  const attendees = {
    Stoyan: 1422410109,
    Michael: 1422426129,
    Andrew: 1422437101,
    Hamdi: 1434344865,
    Matt: 1441255721,
  }

  const commands = {}

  Object.entries(attendees).forEach(([name, id]) => {
    commands[`Scan ${name}`] = () => page(`/badge/${id}`)
  })

  commands['Reset device'] = () => {
    page('/')
    localStorage.clear()
    document.location.reload()
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
  <pre>{$userStore ? JSON.stringify($userStore, null, 4) : '<empty>'}</pre>
</div>

<style>
  .console {
    text-align: center;
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
    overflow: scroll;
    padding-bottom: 1em;
  }
</style>
