<script>
  import page from 'page'
  import events from '../services/events'
  import { ButtonLink } from '../components'
  import prizeStore from '../store/prizes'
  import playerStore from '../store/player'

  let prizes
  let loading = true

  const openPrizeAtIndex = index => page(`/rewards/${index}`)

  const tracker = events.configured()
  tracker.track('view', {
    category: 'rewards',
  })

  $: {
    if ($prizeStore.data && $playerStore.data) {
      prizes = $prizeStore.data.map(prize => ({
        ...prize,
        pointsRemaining: Math.max(0, prize.repNeeded - $playerStore.data.score),
      }))
      loading = false
    } else {
      prizes = []
      loading = true
    }
  }
</script>

<h1>Rewards</h1>

{#if loading}
  <p>Fetching rewards&hellip;</p>
{:else if $prizeStore.error}
  <p>There was an error fetching the rewards. {$prizeStore.error.message}</p>
{:else if $playerStore.error}
  <p>There was an error fetching the rewards. {$playerStore.error.message}</p>
{:else}
  <ul>
    {#each prizes as prize, index}
      <li>
        <span class="image-clip" class:claimed={prize.claimed}>
          <img src={prize.imageUrl} alt={prize.prizeText} />
        </span>

        {#if !prize.claimed}
          <progress
            max={prize.repNeeded}
            value={prize.repNeeded - prize.pointsRemaining} />
        {/if}

        <span class="message">
          {#if prize.pointsRemaining}
            You are {prize.pointsRemaining} points away from a {prize.prizeText}
          {:else if prize.claimed}
            You claimed a {prize.prizeText}
          {:else}
            <span class="claim">
              <ButtonLink on:click={() => openPrizeAtIndex(index)}>
                Claim
              </ButtonLink>
            </span>
            You earned a {prize.prizeText}
          {/if}
        </span>
      </li>
    {/each}
  </ul>
{/if}

<style>
  li {
    margin: 1em 0 2em;
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.2), 0px 2px 2px rgba(0, 0, 0, 0.12),
      0px 0px 2px rgba(0, 0, 0, 0.14);
    border-radius: 2px;
  }
  .image-clip {
    max-height: 170px;
    overflow: hidden;
    display: block;
  }
  .image-clip.claimed {
    opacity: 0.65;
  }
  img {
    width: 100%;
    background-color: var(--avatar-bg);
  }
  progress {
    -webkit-appearance: none;
    appearance: none;
    display: block;
    width: 100%;
    height: 4px;
    margin-top: 6px;
  }
  progress::-webkit-progress-bar {
    background-color: var(--gray);
  }
  progress::-webkit-progress-value {
    background-color: var(--blue);
  }
  .message {
    display: block;
    padding: 0.8em;
    font-size: 16px;
    overflow: auto;
  }
  .message :global(button) {
    float: right;
    line-height: inherit;
    margin: -1em 0;
  }
</style>
