import { DEFAULT_CHAIN_ID } from './DEFAULT_CHAIN_ID.js'
import { addPredeploy } from './addPredeploy.js'
import { getChainId } from './getChainId.js'
import { createBlockchain } from '@tevm/blockchain'
import { TevmCommon } from '@tevm/common'
import { createEvm } from '@tevm/evm'
import { createTevmStateManager } from '@tevm/state'
import { hexToBigInt, toHex } from '@tevm/utils'
import { createVm } from '@tevm/vm'

/**
 * Creates the base instance of a memory client
 * @param {import('./BaseClientOptions.js').BaseClientOptions} [options]
 * @returns {Promise<import('./BaseClient.js').BaseClient>}
 * @example
 * ```ts
 *  ```
 */
export const createBaseClient = async (options = {}) => {
	if (options.fork?.url && options.proxy?.url) {
		throw new Error(
			'Unable to initialize BaseClient. Cannot use both fork and proxy options at the same time!',
		)
	}

	/**
	 * @type {number}
	 */
	const chainId = await (async () => {
		if (options.chainId) {
			return options.chainId
		}
		const url = options.fork?.url ?? options.proxy?.url
		if (url) {
			return getChainId(url)
		}
		return DEFAULT_CHAIN_ID
	})()

	const common = new TevmCommon({
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

	/**
	 * Create the extend function in a generic way
	 * @param {import('./BaseClient.js').BaseClient} client
	 * @returns {import('./BaseClient.js').BaseClient['extend']}
	 */
	const extend = (client) => (extension) => {
		const newClient = {
			...client,
			...extension(baseClient),
		}
		return /** @type {any}*/ ({
			...newClient,
			extend: extend(newClient),
		})
	}

	/**
	 * Create and return the baseClient
	 * @type {import('./BaseClient.js').BaseClient}
	 */
	const baseClient = {
		chainId,
		mode: options.fork?.url ? 'fork' : options.proxy?.url ? 'proxy' : 'normal',
		vm,
		...(options.fork?.url
			? { forkUrl: options.fork.url }
			: { forkUrl: options.fork?.url }),
		...(options.proxy?.url
			? { proxyUrl: options.proxy.url }
			: { proxyUrl: options.proxy?.url }),
		extend: (extension) => extend(baseClient)(extension),
	}

	await statePromise

	return baseClient
}
