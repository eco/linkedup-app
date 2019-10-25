import cosmos from '../services/cosmos'
import fetchable from './types/fetchable'

export default fetchable(() => cosmos.getPrizes())
