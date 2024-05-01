import { ReceiptsManager, createChain, createMapDb } from '@tevm/blockchain'
import { Common } from '@tevm/common'
import {} from '@tevm/errors'
import { createEvm } from '@tevm/evm'
import { createLogger } from '@tevm/logger'
import { createStateManager, dumpCanonicalGenesis, getForkBlockTag } from '@tevm/state'
import { TxPool } from '@tevm/txpool'
import { hexToBigInt, numberToHex, toHex } from '@tevm/utils'
import { createVm } from '@tevm/vm'
import { DEFAULT_CHAIN_ID } from './DEFAULT_CHAIN_ID.js'
import { addPredeploy } from './addPredeploy.js'
import { getChainId } from './getChainId.js'

// TODO the common code is not very good and should be moved to common package
// it has rotted from a previous implementation where the chainId was not used by vm

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
	 * @param {number} chainId
	 */
	const createCommon = (chainId) => {
		return Common.custom(
			{
				name: 'TevmCustom',
				chainId,
				networkId: 10,
			},
			{
				hardfork: options.hardfork ?? 'cancun',
				baseChain: 1,
				eips: [...(options.eips ?? []), 1559, 4895, 4844, 4788],
			},
		)
	}

	/**
	 * @returns {import('@tevm/state').StateOptions }
	 */
	const getStateManagerOpts = () => {
		/**
		 * @type {import('@tevm/state').StateOptions['onCommit']}
		 */
		const onCommit = (stateManager) => {
			if (!options.persister) {
				throw new Error('No persister provided')
			}
			dumpCanonicalGenesis(stateManager)().then((state) => {
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
		// handle normal mode
		if (options.persister) {
			return {
				onCommit: /** @type any*/ (onCommit),
			}
		}
		return {}
	}
	const stateManager = createStateManager(getStateManagerOpts())

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
		const url = options.fork?.url
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

		const blockTag = (() => {
			const blockTag = /** @type {import('@tevm/state').StateManager}*/ getForkBlockTag(stateManager) || {
				blockTag: 'latest',
			}
			if ('blockNumber' in blockTag && blockTag.blockNumber !== undefined) {
				return numberToHex(blockTag.blockNumber)
			}
			if ('blockTag' in blockTag && blockTag.blockTag !== undefined) {
				return blockTag.blockTag
			}
			return 'latest'
		})()
		const common = createCommon(await initChainId())
		const blockchain = await createChain({
			common,
			...(options.fork?.url !== undefined
				? {
						fork: {
							url: options.fork.url,
							blockTag: blockTag.startsWith('0x')
								? hexToBigInt(/** @type {import('@tevm/utils').Hex}*/ (blockTag))
								: /** @type {import('@tevm/utils').BlockTag}*/ (blockTag),
						},
					}
				: {}),
		})
		const evm = await createEvm({
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

		await Promise.all([statePromise, blockchain.ready()])

		return vm
	}

	const vmPromise = initVm()
	const txPoolPromise = vmPromise.then((vm) => new TxPool({ vm }))
	const receiptManagerPromise = vmPromise.then((vm) => {
		return new ReceiptsManager(createMapDb({ cache: new Map() }), vm.blockchain)
	})

	/**
	 * Create and return the baseClient
	 * It will be syncronously created but some functionality
	 * will be asyncronously blocked by initialization of vm and chainId
	 * @type {import('./BaseClient.js').BaseClient}
	 */
	const baseClient = {
		logger: createLogger({
			name: 'TevmClient',
			level: options.loggingLevel ?? 'warn',
		}),
		getReceiptsManager: () => {
			return receiptManagerPromise
		},
		getTxPool: () => {
			return txPoolPromise
		},
		getVm: () => vmPromise,
		miningConfig: options.miningConfig ?? { type: 'auto' },
		mode: options.fork?.url ? 'fork' : 'normal',
		...(options.fork?.url ? { forkUrl: options.fork.url } : { forkUrl: options.fork?.url }),
		extend: (extension) => extend(baseClient)(extension),
		ready: async () => {
			await vmPromise
			return true
		},
	}

	return baseClient
}
