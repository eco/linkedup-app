import { get } from 'svelte/store'
import config from '../config'
import cosmos from '../services/cosmos'
import fetchable from './types/fetchable'
import userStore from './user'

const textToImage = text => `${text.toLowerCase().replace(/\s/g, '_')}.png`

export default fetchable(
  async () => {
    const { address } = get(userStore)
    const [prizes, winnings] = await Promise.all([
      cosmos.getPrizes(),
      cosmos.getWinnings(address),
    ])

    return prizes
      .sort((a, b) => a.repNeeded - b.repNeeded)
      .map(prize => {
        const winning = winnings.find(w => w.tier === prize.tier)
        const won = !!winning

        return {
          ...prize,
          imageUrl: `${config.contentEndpoint}/prizes/${textToImage(
            prize.prizeText
          )}`,
          quantity: parseInt(prize.quantity, 10),
          won,
          claimed: won && winning.claimed,
        }
      })
  },
  {
    pollingInterval: config.dataPollingInterval,
  }
)
