import config from '../config'
import cosmos from '../services/cosmos'
import fetchable from './types/fetchable'

export default fetchable(() => cosmos.getPlayer(), {
  pollingInterval: config.dataPollingInterval,
})
