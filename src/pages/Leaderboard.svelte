<script>
  import cosmos from '../services/cosmos'
  import userStore from '../store/user'
  import playerStore from '../store/player'

  const getPlacement = async points => {
    const tiers = await leaderboardPromise
    let name = '-'
    let prizePerAttendee = '-'

    const placement = tiers.find(tier => {
      const attendees = tier.attendees.map(a => a.address)
      return attendees.includes($userStore.address)
    })

    if (placement) {
      name = placement.name
      prizePerAttendee = placement.prizePerAttendee
    }

    return {
      points,
      name,
      prizePerAttendee,
    }
  }

  const leaderboardPromise = cosmos.getLeaderboard()
  let placementPromise

  $: {
    if ($playerStore.data) {
      placementPromise = getPlacement($playerStore.data.score)
    }
  }
</script>

<h1>Leaderboard</h1>
{#if placementPromise}
  {#await placementPromise then placement}
    <table>
      <tr>
        <td>Reputation Points</td>
        <td>{placement.points}</td>
      </tr>
      <tr>
        <td>Your Tier</td>
        <td>{placement.name}</td>
      </tr>
      <tr>
        <td>Current Payout</td>
        <td>${placement.prizePerAttendee}</td>
      </tr>
    </table>
  {/await}
{/if}

<h2>Tier Breakdown</h2>
{#await leaderboardPromise then leaderboard}
  {#each leaderboard as tier}
    <table class="tier">
      <thead>
        <tr>
          <th>
            <h3>{tier.name}</h3>
          </th>
          <th>${tier.prizeAmount}</th>
        </tr>
      </thead>
      <tr>
        <td># of attendees</td>
        <td>{tier.numAttendees}</td>
      </tr>
      <tr>
        <td>Prize/Attendee</td>
        <td>${tier.prizePerAttendee}</td>
      </tr>
      <tr>
        <td>Min. Points</td>
        <td>{tier.minRep}</td>
      </tr>
      <tr>
        <td>Max. Points</td>
        <td>{tier.maxRep}</td>
      </tr>
    </table>
  {/each}
{/await}

<style>
  h2 {
    font-size: 22px;
    font-weight: 400;
    line-height: 33px;
    margin: 0;
  }
  th,
  h3 {
    font-size: 30px;
    line-height: 45px;
    font-weight: 500;
    margin: 0;
  }
  table {
    width: 100%;
    margin: 1em 0;
    border-spacing: 0;
  }
  th {
    text-align: left;
    padding-bottom: 20px;
    font-weight: 300;
  }
  table th:last-child,
  table td:last-child {
    text-align: right;
    font-weight: 400;
  }
  table.tier {
    box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.2), 0px 3px 4px rgba(0, 0, 0, 0.12),
      0px 2px 4px rgba(0, 0, 0, 0.14);
    border-radius: 2px;
    padding: 10px;
    font-size: 16px;
    margin: 2em 0 0;
  }
  table.tier td {
    font-weight: 400;
    text-transform: uppercase;
  }
</style>
