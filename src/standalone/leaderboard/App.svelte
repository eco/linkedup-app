<script>
  import { onMount } from 'svelte'
  import { blur } from 'svelte/transition'
  import cosmos from '../../services/cosmos'
  import config from '../../config'
  import Overview from './Overview'
  import Winners from './Winners'

  const blurDuration = 1200

  let frame = 0
  let leaderboard
  let bonus

  const refreshData = async () => {
    leaderboard = await cosmos.getLeaderboard()
    bonus = await cosmos.getBonus()
  }

  const fetchAndRotate = async () => {
    await refreshData()
    frame = (frame + 1) % (leaderboard.length + 1)
  }

  onMount(async () => {
    await refreshData()

    const timerId = setInterval(fetchAndRotate, config.leaderboardFrameInterval)
    return () => clearInterval(timerId)
  })
</script>

<div class="container">
  <div class="top">
    <header>Linked Up</header>
    {#if bonus && bonus.active}
      <p class="boost">
        <span>🔥</span>
        Boost Active
      </p>
    {/if}
    <h1>Leaderboard</h1>
  </div>
  <main>
    {#if leaderboard}
      {#if frame === 0}
        <div in:blur={{ duration: blurDuration }} class="frame">
          <Overview {leaderboard} />
        </div>
      {/if}

      {#each leaderboard as tier, index (tier.name)}
        {#if frame === index + 1}
          <div in:blur={{ duration: blurDuration }} class="frame">
            <Winners {tier} />
          </div>
        {/if}
      {/each}
    {/if}
  </main>
  <footer>
    For more information about Linked Up, visit https://linkedup.sfbw.io
  </footer>
</div>

<style>
  :global(html),
  :global(body) {
    height: 100%;
  }
  :global(body) {
    background-color: var(--blue);
    color: var(--white);
    padding: 2.5%;
    font-size: 1.8vw;
  }
  .container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .top {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }
  header {
    font-size: 4vw;
    line-height: 1;
    font-weight: 800;
    text-transform: uppercase;
  }
  h1 {
    font-size: 4vw;
    line-height: 1;
    font-weight: 200;
  }
  .boost {
    color: var(--orange);
    text-transform: uppercase;
    font-size: 2vw;
    line-height: 1;
    font-weight: normal;
    margin: 0;
  }
  .boost span {
    margin-right: 0.5em;
    position: relative;
    top: -0.1em;
  }
  main {
    flex-grow: 1;
  }
  .frame {
    height: 100%;
  }
  footer {
    margin-top: 1em;
    font-weight: normal;
  }
</style>
