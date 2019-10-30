<script>
  import { createEventDispatcher } from 'svelte'
  import { format } from 'date-fns'
  import Avatar from './Avatar'

  export let points = 0
  export let log = []

  const dispatch = createEventDispatcher()
</script>

<table>
  <thead>
    <tr>
      <th colspan="2">
        <h1>Reputation</h1>
      </th>
      <th class="points">{points}</th>
    </tr>
  </thead>

  <tbody>
    {#each log as entry}
      <tr on:click={() => dispatch('open', entry)}>
        <td class="avatar-col">
          <Avatar
            avatarUrl={entry.imageUrl}
            name={entry.name}
            hideLabel
            size={50} />
        </td>
        <td>
          {entry.label}
          <br />
          <span class="timestamp">{format(entry.timestamp, 'h:mma')}</span>
        </td>
        <td class="points">{entry.points}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  table {
    width: 100%;
    border-spacing: 0;
  }
  th {
    text-align: left;
    padding-bottom: 1em;
  }
  td {
    font-size: 16px;
    line-height: 24px;
    vertical-align: top;
    font-weight: 400;
    padding-top: 1em;
  }
  td.avatar-col {
    width: 65px;
  }
  .timestamp {
    font-size: 14px;
    font-weight: 200;
    text-transform: lowercase;
  }
  .points {
    text-align: right;
    font-weight: bold;
  }
  tbody .points::before {
    content: '+';
  }
  th.points {
    font-size: 22px;
  }
  td.points {
    font-size: 18px;
  }
</style>
