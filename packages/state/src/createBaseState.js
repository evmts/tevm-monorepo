import { AccountCache, CacheType, StorageCache } from '@ethereumjs/statemanager'
import { InternalError } from '@tevm/errors'
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
				throw new InternalError('Cannot set state root to non existing state root')
			}
			currentStateRoot = root
		},
		stateRoots,
		options,
		caches: {
			contracts: options.contractCache ?? new ContractCache(new StorageCache({ size: 100_000, type: CacheType.LRU })),
			accounts:
				options.accountsCache ??
				new AccountCache({
					size: 100_000,
					type: CacheType.LRU,
				}),
			storage:
				options.storageCache ??
				new StorageCache({
					size: 100_000,
					type: CacheType.LRU,
				}),
		},
		forkCache: {
			contracts: options.contractCache ?? new ContractCache(new StorageCache({ size: 100_000, type: CacheType.LRU })),
			accounts:
				options.accountsCache ??
				new AccountCache({
					size: 100_000,
					type: CacheType.LRU,
				}),
			storage:
				options.storageCache ??
				new StorageCache({
					size: 100_000,
					type: CacheType.LRU,
				}),
		},
		ready: () => genesisPromise.then(() => true),
	}
	const genesisPromise = (
		options.genesisState !== undefined && options.currentStateRoot === undefined
			? (async () => {
					const fn = generateCanonicalGenesis(state)
					if (fn && options.genesisState) {
						return fn(options.genesisState)
					}
				})()
			: Promise.resolve().then(() => {
					if (options.currentStateRoot) {
						state.setCurrentStateRoot(options.currentStateRoot)
						const fn = generateCanonicalGenesis(state)
						const genesis = options.genesisState ?? stateRoots.get(options.currentStateRoot)
						if (fn && genesis) {
							return fn(genesis)
						}
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
