import { createBlockchain } from '@tevm/blockchain'
import { Common } from '@tevm/common'
import { createEvm } from '@tevm/evm'
import { createTevmStateManager } from '@tevm/state'
import { TxPool } from '@tevm/txpool'
import { hexToBigInt, toHex } from '@tevm/utils'
import { createVm } from '@tevm/vm'
import { DEFAULT_CHAIN_ID } from './DEFAULT_CHAIN_ID.js'
import { addPredeploy } from './addPredeploy.js'
import { getChainId } from './getChainId.js'

/**
 * Creates the base instance of a memory client
 * @param {import('./BaseClientOptions.js').BaseClientOptions} [options]
 * @returns {import('./BaseClient.js').BaseClient}
 * @example
 * ```ts
 *  ```
 */
export const createBaseClient = (options = {}) => {
	/**
	 * @type {number|undefined}
	 */
	let overrideChainId = undefined
	/**
	 * @param {number} id
	 */
	const setChainId = (id) => {
		overrideChainId = id
	}
	// First do everything that is not async
	// Eagerly do async integration
	// Return proxies that will block on initialization if not yet initialized
	if (options.fork?.url && options.proxy?.url) {
		throw new Error(
			'Unable to initialize BaseClient. Cannot use both fork and proxy options at the same time!',
		)
	}
	const common = new Common({
		chain: 1,
		hardfork: options.hardfork ?? 'shanghai',
		eips: /**@type number[]*/ (options.eips ?? [1559, 4895]),
	})

	/**
	 * @returns {import('@tevm/state').TevmStateManagerOptions }
	 */
	const getStateManagerOpts = () => {
		/**
		 * @type {import('@tevm/state').ForkStateManagerOpts['onCommit']}
		 */
		const onCommit = (stateManager) => {
			if (!options.persister) {
				throw new Error('No persister provided')
			}
			stateManager.dumpCanonicalGenesis().then((state) => {
				/**
				 * @type {import('@tevm/state').ParameterizedTevmState}
				 */
				const parsedState = {}

				for (const [k, v] of Object.entries(state)) {
					const { nonce, balance, storageRoot, codeHash } = v
					parsedState[k] = {
						...v,
						nonce: toHex(nonce),
						balance: toHex(balance),
						storageRoot: storageRoot,
						codeHash: codeHash,
					}
				}
				options.persister?.persistTevmState(parsedState)
			})
		}
		if (options.fork?.url) {
			return {
				fork: {
					...options.fork,
					...(options.persister ? { onCommit } : {}),
				},
			}
		}
		if (options.proxy?.url) {
			return {
				proxy: {
					...options.proxy,
					...(options.persister
						? { onCommit: /** @type any*/ (onCommit) }
						: {}),
				},
			}
		}
		// handle normal mode
		if (options.persister) {
			return {
				normal: { onCommit: /** @type any*/ (onCommit) },
			}
		}
		return {}
	}
	const stateManager = createTevmStateManager(getStateManagerOpts())

	/**
	 * Create the extend function in a generic way
	 * @param {import('./BaseClient.js').BaseClient} client
	 * @returns {import('./BaseClient.js').BaseClient['extend']}
	 */
	const extend = (client) => (extension) => {
		Object.assign(client, extension(client))
		return /** @type {any}*/ (client)
	}

	const initChainId = async () => {
		if (options.chainId) {
			return options.chainId
		}
		const url = options.fork?.url ?? options.proxy?.url
		if (url) {
			const id = await getChainId(url)
			return id
		}
		return DEFAULT_CHAIN_ID
	}
	const initVm = async () => {
		// Handle initializing the state from the persisted state
		/**
		 * @type {Promise<any>}
		 */
		let statePromise = Promise.resolve()
		if (options.persister) {
			const restoredState = options.persister.restoreState()
			if (restoredState) {
				/**
				 * @type {import('@tevm/state').TevmState}
				 */
				const parsedState = {}
				for (const [k, v] of Object.entries(restoredState)) {
					const { nonce, balance, storageRoot, codeHash } = v
					parsedState[k] = {
						...v,
						nonce: hexToBigInt(nonce),
						balance: hexToBigInt(balance),
						storageRoot: storageRoot,
						codeHash: codeHash,
					}
				}
				statePromise = stateManager.generateCanonicalGenesis(parsedState)
			}
		}

		const blockchain = await createBlockchain({ common })
		const evm = createEvm({
			common,
			stateManager,
			blockchain,
			allowUnlimitedContractSize: options.allowUnlimitedContractSize ?? false,
			customPrecompiles: options.customPrecompiles ?? [],
			profiler: options.profiler ?? false,
		})
		const vm = await createVm({
			stateManager,
			evm,
			blockchain,
			common,
		})

		/**
		 * Add custom predeploys
		 */
		if (options.customPredeploys) {
			await Promise.all(
				options.customPredeploys.map((predeploy) => {
					addPredeploy({
						vm,
						address: predeploy.address,
						deployedBytecode: predeploy.contract.deployedBytecode,
					})
				}),
			)
		}

		await statePromise

		return vm
	}

	const vmPromise = initVm()
	const txPoolPromise = vmPromise.then((vm) => new TxPool({ vm }))
	const chainIdPromise = initChainId()

	/**
	 * Create and return the baseClient
	 * It will be syncronously created but some functionality
	 * will be asyncronously blocked by initialization of vm and chainId
	 * @type {import('./BaseClient.js').BaseClient}
	 */
	const baseClient = {
		getTxPool: () => {
			return txPoolPromise
		},
		getChainId: () => {
			if (overrideChainId) {
				return Promise.resolve(overrideChainId)
			}
			return chainIdPromise
		},
		setChainId,
		getVm: () => vmPromise,
		miningConfig: options.miningConfig ?? { type: 'auto' },
		mode: options.fork?.url ? 'fork' : options.proxy?.url ? 'proxy' : 'normal',
		...(options.fork?.url
			? { forkUrl: options.fork.url }
			: { forkUrl: options.fork?.url }),
		...(options.proxy?.url
			? { proxyUrl: options.proxy.url }
			: { proxyUrl: options.proxy?.url }),
		extend: (extension) => extend(baseClient)(extension),
		ready: async () => {
			const [chainId, vm] = await Promise.allSettled([
				chainIdPromise,
				vmPromise,
			])
			const errors = []
			if (chainId.status === 'rejected') {
				errors.push(chainId.reason)
			}
			if (vm.status === 'rejected') {
				errors.push(vm.reason)
			}
			if (errors.length > 1) {
				throw new AggregateError(errors)
			}
			if (errors.length === 1) {
				throw errors[0]
			}
			return true
		},
	}

	return baseClient
}
