import { derived } from 'svelte/store'
import playerStore from './player'
import prizeStore from './prizes'

export default derived(
  [playerStore, prizeStore],
  ([{ data: player }, { data: prizes }]) => {
    let requests = []
    let rewards = []

    if (player) {
      // connection requests
      requests = player.scans
        .filter(scan => !scan.isSelfInitiated)
        .map(scan => ({
          ...scan,
          type: 'request',
          label: 'Connection Request',
        }))

      if (prizes) {
        // earned rewards
        const scoresWithTimestamps = player.scans.reduce(
          (memo, scan) => {
            const lastScore = memo[memo.length - 1]
            return memo.concat({
              score: lastScore.score + parseInt(scan.points, 10),
              timestamp: scan.timestamp,
            })
          },
          [{ score: 5, timestamp: player.claimedAt }]
        )

        rewards = prizes
          .map((prize, index) => {
            if (parseInt(prize.repNeeded, 10) > parseInt(player.score, 10)) {
              return
            }
            const score = scoresWithTimestamps.find(
              mark => mark.score >= parseInt(prize.repNeeded, 10)
            )

            return {
              type: 'reward',
              imageUrl: prize.imageUrl,
              label: 'Reward Earned',
              name: prize.prizeText,
              timestamp: score.timestamp,
              accepted: prizes.claimed,
              index,
            }
          })
          .filter(Boolean)
      }
    }

    return [...requests, ...rewards].sort((a, b) => {
      if (a.timestamp === b.timestamp) {
        return a.type === 'reward' ? -1 : 1
      }
      return b.timestamp - a.timestamp
    })
  },
  []
)
