import { AccountCache, CacheType, StorageCache } from '@ethereumjs/statemanager'
import { toHex } from 'viem'
import { ContractCache } from './ContractCache.js'
import { generateCanonicalGenesis } from './actions/generateCannonicalGenesis.js'

/**
 * @internal
 * Creates the core data structure for ethereum state
 * @param {import('./state-types/index.js').StateOptions} [options]
 * @returns {import('./BaseState.js').BaseState}
 * Creates the core data structure the state manager operates on
 */
export const createBaseState = (options = {}) => {
	// TODO this is kinda hacky to always start with 0
	const initialStateRoot = toHex(Uint8Array.from([0]), { size: 32 })
	const stateRoots = options.stateRoots ?? new Map()
	stateRoots.set(initialStateRoot, options.genesisState ?? {})
	/**
	 * @type {import('./BaseState.js').BaseState}
	 */
	const state = {
		_currentStateRoot: initialStateRoot,
		_stateRoots: options.stateRoots ?? new Map(),
		_options: options,
		_caches: {
			contracts: new ContractCache(),
			accounts: new AccountCache({
				size: 100000,
				type: CacheType.ORDERED_MAP,
			}),
			storage: new StorageCache({
				size: 100000,
				type: CacheType.ORDERED_MAP,
			}),
		},
		ready: () => genesisPromise.then(() => true),
	}
	const genesisPromise =
		options.genesisState !== undefined ? generateCanonicalGenesis(state)(options.genesisState) : Promise.resolve()
	return state
}
