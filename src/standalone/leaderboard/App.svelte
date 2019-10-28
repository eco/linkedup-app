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

  const fetchAndRotate = async () => {
    leaderboard = await cosmos.getLeaderboard()
    frame = (frame + 1) % (leaderboard.length + 1)
  }

  onMount(async () => {
    leaderboard = await cosmos.getLeaderboard()

    const timerId = setInterval(fetchAndRotate, config.leaderboardFrameInterval)
    return () => clearInterval(timerId)
  })
</script>

<div class="container">
  <div class="top">
    <header>Linked Up</header>
    <h1>Leaderboard</h1>
  </div>
  <main>
    {#if leaderboard}
      {#if frame === 0}
        <div in:blur={{ duration: blurDuration }}>
          <Overview {leaderboard} />
        </div>
      {/if}

      {#each leaderboard as tier, index (tier.name)}
        {#if frame === index + 1}
          <div in:blur={{ duration: blurDuration }}>
            <Winners {tier} />
          </div>
        {/if}
      {/each}
    {/if}

  </main>
  <footer>For more information about Linked Up, visit sfbw.com/linkedup</footer>
</div>

<style>
  :global(body) {
    background-color: var(--blue);
    color: var(--white);
    padding: 30px;
  }

  .container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .top {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
  header {
    font-size: 60px;
    line-height: 90px;
    font-weight: 800;
    text-transform: uppercase;
  }
  h1 {
    font-size: 60px;
    line-height: 90px;
    font-weight: 200;
  }
  main {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
</style>
