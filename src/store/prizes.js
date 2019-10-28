import { get } from 'svelte/store'
import config from '../config'
import cosmos from '../services/cosmos'
import fetchable from './types/fetchable'
import userStore from './user'

const textToImage = text => `${text.toLowerCase().replace(/\s/g, '_')}.png`
let prizes

export default fetchable(
  async () => {
    if (!prizes) {
      prizes = await cosmos.getPrizes()
    }

    const { address } = get(userStore)
    const winnings = await cosmos.getWinnings(address)

    return prizes
      .sort((a, b) => a.repNeeded - b.repNeeded)
      .map(prize => {
        const winning = winnings.find(w => w.tier === prize.tier)

        return {
          ...prize,
          imageUrl: `${config.contentEndpoint}/prizes/${textToImage(
            prize.prizeText
          )}`,
          claimed: !!winning && winning.claimed,
        }
      })
  },
  {
    pollingInterval: config.dataPollingInterval,
  }
)
