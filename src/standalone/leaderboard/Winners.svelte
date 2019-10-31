<script>
  import { flip } from 'svelte/animate'

  export let tier
</script>

<div class="container">
  <div class="top tier-top">
    <p>{tier.name}</p>
    <p>Prize Pool: ${tier.prizeAmount}</p>
  </div>
  <div class="box tier-details">
    <table class="winners">
      <thead>
        <tr>
          <th>Rank</th>
          <th>Name</th>
          <th>Reputation</th>
        </tr>
      </thead>
      {#each tier.attendees as attendee, idx (attendee.name)}
        <tr animate:flip>
          <td>{idx + 1 + tier.offset}</td>
          <td>{attendee.name}</td>
          <td>
            {#if attendee.rep}{attendee.rep}{:else}&mdash;{/if}
          </td>
        </tr>
      {/each}
    </table>
    <div class="winners-fade" />
  </div>
</div>

<style>
  .container {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .box {
    background-color: var(--white);
    color: var(--black);
    box-shadow: 0px 5px 6px rgba(0, 0, 0, 0.2), 0px 3px 16px rgba(0, 0, 0, 0.12),
      0px 9px 12px rgba(0, 0, 0, 0.14);
    border-radius: 0.5vw;
    margin-bottom: 1em;
    flex-grow: 1;
  }
  .top {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
  .tier-top {
    font-size: 2vw;
    line-height: 1.5;
    color: var(--gray);
    font-weight: normal;
  }
  .tier-details {
    flex-grow: 1;
    overflow: hidden;
    position: relative;
  }
  p {
    margin: 0.5em 0;
  }
  .winners {
    width: 100%;
    height: 100%;
  }
  .winners th {
    text-align: left;
    font-size: 2vw;
    line-height: 1.5;
    font-weight: normal;
    padding: 10px 28px;
  }
  .winners td {
    font-size: 1.6vw;
    line-height: 1.5;
    font-weight: normal;
    border-bottom: 0.02em solid var(--gray);
    padding: 0 28px;
  }
  .winners td:first-child {
    text-align: center;
  }
  .winners td:nth-child(2) {
    width: 100%;
  }
  .winners td:last-child {
    text-align: center;
  }
  .winners-fade {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 50%;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0), var(--white));
  }
</style>
