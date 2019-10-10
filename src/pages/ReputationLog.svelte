<script>
  import { format } from 'date-fns'
  import cosmos from '../services/cosmos'

  let points
  cosmos.getPlayerScore().then(_p => {
    points = _p
  })

  let log = [
    {
      timestamp: Date.now(),
      points: 6,
      label: 'Verified your profile',
      imageUrl: 'https://source.unsplash.com/random/100x100',
    },
  ]
  cosmos.getScans().then(scans => {
    const scansWithLabels = scans.map(s => ({
      ...s,
      label: `Connected to ${s.name}`,
    }))
    log = [...scansWithLabels, ...log]
  })
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
      <tr>
        <td>
          <img src={entry.imageUrl} alt={entry.label} />
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
  }
  th {
    text-align: left;
    padding-bottom: 2em;
  }
  td {
    font-size: 16px;
    line-height: 24px;
    vertical-align: top;
    font-weight: 400;
    padding-bottom: 1em;
  }
  img {
    border-radius: 50%;
    width: 50px;
    height: 50px;
    display: block;
    margin-right: 1em;
    background-color: var(--pale-blue);
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
