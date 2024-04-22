import { AccountCache, StorageCache } from '@ethereumjs/statemanager'
import type { ContractCache } from '../ContractCache.js'

/**
 * @internal
 * The shape of the internal cache
 */
export type StateCache = {
	accounts: AccountCache
	storage: StorageCache
	contracts: ContractCache
}
