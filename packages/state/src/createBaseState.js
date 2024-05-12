import { AccountCache, CacheType, StorageCache } from '@ethereumjs/statemanager'
import { createLogger } from '@tevm/logger'
import { ContractCache } from './ContractCache.js'
import { checkpoint } from './actions/checkpoint.js'
import { commit } from './actions/commit.js'
import { generateCanonicalGenesis } from './actions/generateCannonicalGenesis.js'

/**
 * @type {import('viem').Hex}
 */
const INITIAL_STATE_ROOT = '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421'

/**
 * @internal
 * Creates the core data structure for ethereum state
 * @param {import('./state-types/index.js').StateOptions} options
 * @returns {import('./BaseState.js').BaseState}
 * Creates the core data structure the state manager operates on
 */
export const createBaseState = (options) => {
	const logger = createLogger({
		level: options.loggingLevel ?? 'warn',
		name: '@tevm/state-manager',
	})
	/**
	 * @type {import('./state-types/StateRoots.js').StateRoots}
	 */
	const stateRoots = options.stateRoots ?? new Map()
	if (options.genesisState && options.currentStateRoot) {
		stateRoots.set(options.currentStateRoot, options.genesisState)
	} else {
		stateRoots.set(INITIAL_STATE_ROOT, options.genesisState ?? {})
	}
	let currentStateRoot = options.currentStateRoot ?? INITIAL_STATE_ROOT
	/**
	 * @type {import('./BaseState.js').BaseState}
	 */
	const state = {
		logger,
		getCurrentStateRoot: () => currentStateRoot,
		setCurrentStateRoot: (root) => {
			if (!state.stateRoots.has(root)) {
				throw new Error('Cannot set state root to non existing state root')
			}
			currentStateRoot = root
		},
		stateRoots,
		options,
		caches: {
			contracts: new ContractCache(),
			accounts: new AccountCache({
				size: 100_000,
				type: CacheType.ORDERED_MAP,
			}),
			storage: new StorageCache({
				size: 100_000,
				type: CacheType.ORDERED_MAP,
			}),
		},
		ready: () => genesisPromise.then(() => true),
	}
	const genesisPromise = (
		options.genesisState !== undefined && options.currentStateRoot === undefined
			? generateCanonicalGenesis(state)(options.genesisState)
			: Promise.resolve().then(() => {
					if (options.currentStateRoot) {
						state.setCurrentStateRoot(options.currentStateRoot)
						return generateCanonicalGenesis(state)(options.genesisState ?? stateRoots.get(options.currentStateRoot))
					}
					return Promise.resolve()
				})
	).then(async () => {
		await checkpoint(state)()
		await commit(state)()
		logger.debug('StateManager is ready')
	})

	return state
}
