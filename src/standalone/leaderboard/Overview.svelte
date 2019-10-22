<script>
  export let leaderboard
</script>

{#each leaderboard as tier}
  <div class="tier box">
    <h2>{tier.name}</h2>
    <p class="prize">
      <span>Total Prize</span>
      ${tier.prizeAmount}
    </p>
    <p class="stat">
      <span>{tier.numAttendees}</span>
      # of attendees
    </p>
    <p class="stat">
      <span>{tier.minRep}</span>
      min. points
    </p>
    <p class="stat">
      <span>{tier.maxRep}</span>
      max. points
    </p>
    <p class="stat">
      <span>${tier.prizePerAttendee}</span>
      prize/attendee
    </p>
  </div>
{/each}

<style>
  .box {
    background-color: var(--white);
    color: var(--black);
    box-shadow: 0px 5px 6px rgba(0, 0, 0, 0.2), 0px 3px 16px rgba(0, 0, 0, 0.12),
      0px 9px 12px rgba(0, 0, 0, 0.14);
    border-radius: 2px;
    margin: 1em 0;
  }
  .tier {
    display: flex;
    flex-wrap: wrap;
    padding: 24px;
    justify-content: space-between;
  }
  h2 {
    margin: 0;
    flex-basis: 50%;
    font-size: 36px;
    line-height: 54px;
    font-weight: 500;
  }
  p {
    margin: 0;
  }
  .prize {
    flex-basis: 50%;
    text-align: right;
    font-size: 32px;
    line-height: 54px;
    font-weight: normal;
  }
  .prize span {
    color: var(--dark-gray);
    margin-right: 24px;
  }
  .stat {
    width: 200px;
    padding-top: 1.5em;
    text-align: center;
    text-transform: uppercase;
    font-size: 16px;
    line-height: 24px;
    font-weight: 600;
  }
  .stat span {
    display: block;
    font-size: 64px;
    line-height: 96px;
    font-weight: 500;
  }
</style>
