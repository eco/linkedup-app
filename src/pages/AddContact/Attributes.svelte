<script>
  import { Checkbox } from '../../components'

  export let name
  export let attributes
</script>

<table>
  <tr>
    <th>
      <span class="label">Name</span>
      {name}
    </th>
    <th class="share-input">
      <span class="label">Share?</span>
    </th>
  </tr>
  {#each attributes as attr}
    <tr>
      <td>
        <span class="label">{attr.label}</span>
        {attr.value}
      </td>
      <td class="share-input">
        <Checkbox checked />
      </td>
    </tr>
  {/each}
</table>

<style>
  table {
    width: 100%;
    margin: 1em 0;
  }
  th {
    vertical-align: top;
    text-align: left;
    font-weight: inherit;
  }
  td {
    vertical-align: bottom;
    padding-top: 0.5em;
  }
  .share-input {
    text-align: center;
  }
  .label {
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
    display: block;
    line-height: 1;
  }
</style>
