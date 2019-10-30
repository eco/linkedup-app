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
    margin: 1em 0;
    background-color: var(--white);
    color: var(--black);
    box-shadow: 0px 5px 6px rgba(0, 0, 0, 0.2), 0px 3px 16px rgba(0, 0, 0, 0.12),
      0px 9px 12px rgba(0, 0, 0, 0.14);
    border-radius: 0.5vw;
  }
  .tier {
    display: flex;
    flex-wrap: wrap;
    padding: 2.5vw;
    justify-content: space-between;
  }
  h2 {
    margin: 0;
    flex-basis: 50%;
    font-size: 2.5vw;
    line-height: 1;
    font-weight: 500;
  }
  p {
    margin: 0;
  }
  .prize {
    flex-basis: 50%;
    text-align: right;
    font-size: 2vw;
    line-height: 1;
    font-weight: normal;
  }
  .prize span {
    color: var(--dark-gray);
    margin-right: 1em;
  }
  .stat {
    width: 15vw;
    padding-top: 1.5em;
    text-align: center;
    text-transform: uppercase;
    font-weight: 600;
  }
  .stat span {
    display: block;
    font-size: 4vw;
    line-height: 1.5;
    font-weight: 500;
  }
</style>
