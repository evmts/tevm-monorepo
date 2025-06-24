import { createChain } from '@tevm/blockchain'
import { createCommon, tevmDefault } from '@tevm/common'
import { createEvm } from '@tevm/evm'
import { createLogger } from '@tevm/logger'
import { p256VerifyPrecompile } from '@tevm/precompiles'
import { ReceiptsManager, createMapDb } from '@tevm/receipt-manager'
import { createStateManager } from '@tevm/state'
import { TxPool } from '@tevm/txpool'
import { KECCAK256_RLP, bytesToHex, getAddress, hexToBigInt, keccak256 } from '@tevm/utils'
import { createVm } from '@tevm/vm'
import { DEFAULT_CHAIN_ID } from './DEFAULT_CHAIN_ID.js'
import { GENESIS_STATE } from './GENESIS_STATE.js'
import { getBlockNumber } from './getBlockNumber.js'
import { getChainId } from './getChainId.js'
import { statePersister } from './statePersister.js'

// TODO the common code is not very good and should be moved to common package
// it has rotted from a previous implementation where the chainId was not used by vm

/**
 * Creates the base instance of a memory client
 * @param {import('./TevmNodeOptions.js').TevmNodeOptions} [options]
 * @returns {import('./TevmNode.js').TevmNode}
 * @example
 * ```ts
 *  ```
 */
export const createTevmNode = (options = {}) => {
	// for now we just only work with eip-1193 provider but later
	// we can consider dynamically passing in chain retries etc
	const transport = (() => {
		if (typeof options?.fork?.transport === 'function') {
			return options.fork.transport({})
		}
		return options.fork?.transport
	})()
	/**
	 * @type {import('@tevm/utils').Address | undefined}
	 */
	let impersonatedAccount = undefined
	/**
	 * @param {import('@tevm/utils').Address | undefined} address
	 * returns {void}
	 */
	const setImpersonatedAccount = (address) => {
		impersonatedAccount = address
	}

	const loggingLevel = options.loggingLevel ?? 'warn'
	const logger = createLogger({
		name: 'TevmClient',
		level: loggingLevel,
	})

	/**
	 * @returns {Promise<import('@tevm/state').StateOptions>}
	 */
	const getStateManagerOpts = async () => {
		if (transport) {
			// if the user passed in latest we must use an explicit block tag
			const blockTag = await blockTagPromise
			return {
				loggingLevel,
				...(options.persister ? { onCommit: statePersister(options.persister, logger) } : {}),
				fork: {
					...options.fork,
					transport,
					blockTag,
				},
			}
		}
		return {
			loggingLevel,
			...(options.storageCache !== undefined ? { storageCache: options.storageCache } : {}),
			...(options.contractCache !== undefined ? { contractCache: options.contractCache } : {}),
			...(options.accountsCache !== undefined ? { accountsCache: options.accountsCache } : {}),
			...(options.fork?.transport ? { ...options.fork, transport } : {}),
			...(options.persister !== undefined ? { onCommit: statePersister(options.persister, logger) } : {}),
		}
	}

	/**
	 * Create the extend function in a generic way
	 * @param {import('./TevmNode.js').TevmNode} client
	 * @returns {import('./TevmNode.js').TevmNode['extend']}
	 */
	const extend = (client) => (extension) => {
		Object.assign(client, extension(client))
		return /** @type {any}*/ (client)
	}

	const chainIdPromise = (async () => {
		if (options?.common) {
			return options?.common.id
		}
		if (transport) {
			const id = await getChainId(transport)
			return id
		}
		return DEFAULT_CHAIN_ID
	})().then((chainId) => {
		logger.debug({ chainId }, 'Creating client with chainId')
		return BigInt(chainId)
	})

	const blockTagPromise = (async () => {
		if (options.fork === undefined) {
			// this is ultimately unused
			return 0n
		}
		// TODO handle other moving block tags like `safe`
		// we need to fetch the latest block number and return that otherwise we may have inconsistencies from block number changing
		if (options.fork.blockTag === undefined || options.fork.blockTag === 'latest') {
			const latestBlockNumber = await getBlockNumber(options.fork.transport)
			logger.debug({ latestBlockNumber }, 'fetched fork block number from provided forkurl')
			return latestBlockNumber
		}
		return options.fork.blockTag
	})()

	const chainCommonPromise = chainIdPromise
		.then((chainId) => {
			if (options.common) {
				return createCommon({
					...options.common,
					id: Number(chainId),
					loggingLevel: options.loggingLevel ?? 'warn',
					hardfork: /** @type {import('@tevm/common').Hardfork}*/ (options.common.ethjsCommon.hardfork()) ?? 'prague',
					eips: options.common.ethjsCommon.eips(),
					customCrypto: options.common.ethjsCommon.customCrypto,
				})
			}
			return createCommon({
				...tevmDefault,
				id: Number(chainId),
				loggingLevel: options.loggingLevel ?? 'warn',
				hardfork: 'prague',
				eips: [],
			})
		})
		.then((common) => {
			// ALWAYS Copy common so we don't modify the global instances since it's stateful!
			const copy = common.copy()
			return copy
		})

	const blockchainPromise = Promise.all([chainCommonPromise, blockTagPromise]).then(([common, blockTag]) => {
		return createChain({
			loggingLevel,
			common,
			...(options.fork?.transport !== undefined
				? {
						fork: {
							transport: {
								request:
									typeof options.fork.transport === 'function'
										? options.fork.transport({}).request
										: options.fork.transport.request,
							},
							blockTag,
						},
					}
				: {}),
		})
	})

	const stateManagerPromise = blockchainPromise
		.then(async (blockchain) => {
			// wait for blockchain to initialize so we have the correct state root
			await blockchain.ready()
			return blockchain
		})
		.then((chain) => chain.getCanonicalHeadBlock())
		.then(async (headBlock) => {
			const stateRootHex = bytesToHex(headBlock.header.stateRoot)
			const restoredState = options.persister?.restoreState()
			if (restoredState) {
				logger.debug(restoredState, 'Restoring persisted state...')
				logger.warn(
					'State persistence is an experimental feature. It currently does not persist the blockchain state only the EVM state.',
				)
				/**
				 * @type {import('@tevm/state').TevmState}
				 */
				const parsedState = {}
				for (const [k, v] of Object.entries(restoredState)) {
					const { nonce, balance, storageRoot, codeHash } = v
					parsedState[/** @type {import('@tevm/utils').Address}*/ (k)] = {
						...v,
						nonce: hexToBigInt(nonce),
						balance: hexToBigInt(balance),
						storageRoot: storageRoot,
						codeHash: codeHash,
					}
				}
				// We might want to double check we aren't forking and overwriting this somehow
				// TODO we should be storing blockchain state too
				const manager = createStateManager({
					genesisState: parsedState,
					currentStateRoot: bytesToHex(headBlock.header.stateRoot),
					stateRoots: new Map([[stateRootHex, parsedState]]),
					...(await getStateManagerOpts()),
				})
				await manager.ready()
				return manager
			}
			const genesisState = {
				...GENESIS_STATE,
				// add predeploys to genesis state
				...Object.fromEntries(
					(options.customPredeploys ?? []).map((predeploy) => [
						predeploy.contract.address,
						{
							nonce: 0n,
							deployedBytecode: predeploy.contract.deployedBytecode,
							// TODO this is definitely wrong but should work
							storageRoot: bytesToHex(KECCAK256_RLP),
							codeHash: keccak256(predeploy.contract.deployedBytecode),
						},
					]),
				),
			}
			const opts = await getStateManagerOpts()
			return createStateManager({
				...opts,
				currentStateRoot: stateRootHex,
				stateRoots: new Map([[bytesToHex(headBlock.header.stateRoot), genesisState]]),
				genesisState,
			})
		})

	const evmPromise = Promise.all([chainCommonPromise, stateManagerPromise, blockchainPromise]).then(
		([common, stateManager, blockchain]) => {
			// Default precompiles
			const defaultPrecompiles = [p256VerifyPrecompile()]
			
			// User-provided precompiles
			const userPrecompiles = options.customPrecompiles ?? []
			
			// Create a set of user precompile addresses for efficient lookup
			const userAddresses = new Set(userPrecompiles.map(p => p.address.toString()))
			
			// Filter out any default precompiles that are overridden by user precompiles
			const filteredDefaults = defaultPrecompiles.filter(p => !userAddresses.has(p.address.toString()))
			
			// Merge filtered defaults with user precompiles
			const finalPrecompiles = [...filteredDefaults, ...userPrecompiles]

			return createEvm({
				common,
				stateManager,
				blockchain,
				allowUnlimitedContractSize: options.allowUnlimitedContractSize ?? false,
				customPrecompiles: finalPrecompiles,
				profiler: options.profiler ?? false,
				loggingLevel,
			})
		},
	)

	const vmPromise = Promise.all([evmPromise, chainCommonPromise]).then(([evm, common]) => {
		const vm = createVm({
			stateManager: evm.stateManager,
			evm: evm,
			// TODO this inherited type is wrong thus we need to cast this
			blockchain: /** @type {import('@tevm/blockchain').Chain} */ (evm.blockchain),
			common,
		})
		return vm
	})

	const txPoolPromise = vmPromise.then((vm) => new TxPool({ vm }))
	const receiptManagerPromise = vmPromise.then((vm) => {
		logger.debug('initializing receipts manager...')
		return new ReceiptsManager(createMapDb({ cache: new Map() }), vm.blockchain)
	})
	/**
	 * @type {Map<import('viem').Hex, import('./Filter.js').Filter>}
	 */
	const filters = new Map()

	const createEventEmitter = () => {
		/** @type {Map<string | symbol, Array<Function>>} */
		const events = new Map()
		/**
		 * @type {import('./EIP1193EventEmitterTypes.js').EIP1193EventEmitter}
		 */
		const eventEmitter = {
			on(eventName, listener) {
				const listeners = events.get(eventName) || []
				listeners.push(listener)
				events.set(eventName, listeners)
			},
			removeListener(eventName, listener) {
				const listeners = events.get(eventName)
				if (listeners) {
					const index = listeners.findIndex((l) => l === listener)
					if (index !== -1) {
						listeners.splice(index, 1)
						if (listeners.length === 0) {
							events.delete(eventName)
						}
					}
				}
			},
			emit(eventName, ...args) {
				const listeners = events.get(eventName)
				if (listeners?.length) {
					listeners.forEach((listener) => listener(...args))
					return true // Event was successfully emitted
				}
				return false // No listeners for the event
			},
		}
		return eventEmitter
	}
	const eventEmitter = createEventEmitter()

	const readyPromise = (async () => {
		await blockchainPromise.then((b) => b.ready())
		await stateManagerPromise.then((b) => b.ready())
		await vmPromise.then((vm) => vm.ready())
		eventEmitter.emit('connect')
		return /** @type {true}*/ (true)
	})()

	/**
	 * @param {import('./TevmNode.js').TevmNode} baseClient
	 * @returns {import('./TevmNode.js').TevmNode['deepCopy']}
	 */
	const deepCopy = (baseClient) => async () => {
		/**
		 * @type {import('@tevm/utils').Address | undefined}
		 */
		let impersonatedAccount = undefined
		/**
		 * @param {import('@tevm/utils').Address | undefined} address
		 * returns {void}
		 */
		const setImpersonatedAccount = (address) => {
			impersonatedAccount = address && getAddress(address)
		}
		await readyPromise
		const oldVm = await vmPromise
		const vm = await oldVm.deepCopy()
		const oldReceiptsManager = await receiptManagerPromise
		const receiptsManager = oldReceiptsManager.deepCopy(vm.blockchain)
		const oldTxPool = await txPoolPromise
		const txPool = oldTxPool.deepCopy({ vm })
		/**
		 * @type {Map<import('viem').Hex, import('./Filter.js').Filter>}
		 */
		const newFilters = new Map(filters)
		// don't copy registered events because that would be confusing
		const eventEmitter = createEventEmitter()
		/**
		 * @type {import('./TevmNode.js').TevmNode}
		 */
		const copiedClient = {
			...eventEmitter,
			logger: baseClient.logger,
			getReceiptsManager: async () => Promise.resolve(receiptsManager),
			getTxPool: async () => Promise.resolve(txPool),
			getVm: async () => Promise.resolve(vm),
			miningConfig: baseClient.miningConfig,
			mode: baseClient.mode,
			...('forkTransport' in baseClient
				? {
						forkTransport: {
							request: baseClient.forkTransport.request,
						},
					}
				: {}),
			extend: (extension) => extend(baseClient)(extension),
			deepCopy: () => deepCopy(copiedClient)(),
			ready: () => Promise.resolve(true),
			getFilters: () => newFilters,
			getImpersonatedAccount() {
				return impersonatedAccount
			},
			setImpersonatedAccount,
			setFilter: (filter) => {
				newFilters.set(filter.id, filter)
			},
			removeFilter: (filterId) => {
				newFilters.delete(filterId)
			},
			status: 'READY',
		}
		return copiedClient
	}

	/**
	 * Create and return the baseClient
	 * It will be syncronously created but some functionality
	 * will be asyncronously blocked by initialization of vm and chainId
	 * @type {import('./TevmNode.js').TevmNode}
	 */
	const baseClient = {
		...eventEmitter,
		logger,
		getReceiptsManager: async () => {
			await readyPromise
			return receiptManagerPromise
		},
		getTxPool: async () => {
			await readyPromise
			return txPoolPromise
		},
		getVm: async () => {
			await readyPromise
			return vmPromise
		},
		miningConfig: options.miningConfig ?? { type: 'manual' },
		mode: transport ? 'fork' : 'normal',
		...(transport
			? {
					forkTransport: transport,
				}
			: {}),
		extend: (extension) => extend(baseClient)(extension),
		ready: () => readyPromise,
		getImpersonatedAccount() {
			return impersonatedAccount
		},
		setImpersonatedAccount,
		getFilters: () => filters,
		setFilter: (filter) => {
			filters.set(filter.id, filter)
		},
		removeFilter: (filterId) => {
			filters.delete(filterId)
		},
		status: 'INITIALIZING',
		deepCopy: () => deepCopy(baseClient)(),
		debug: async () => {
			const txPool = await txPoolPromise
			const vm = await vmPromise
			const receiptManager = await receiptManagerPromise
			return {
				chainName: vm.common.name,
				status: baseClient.status,
				mode: baseClient.mode,
				miningConfig: baseClient.miningConfig,
				registeredFilters: baseClient.getFilters(),
				blocks: {
					latest: vm.blockchain.blocksByTag.get('latest')?.header.toJSON(),
					forked: vm.blockchain.blocksByTag.get('forked')?.header.toJSON(),
				},
				txsInMempool: txPool.txsInPool,
				state: await vm.stateManager.dumpCanonicalGenesis(),
				hardfork: vm.common.ethjsCommon.hardfork(),
				eips: vm.common.ethjsCommon.eips(),
				chainId: vm.common.id,
				receipts: await receiptManager.getLogs(
					/** @type {import('@tevm/block').Block}*/ (
						vm.blockchain.blocksByTag.get('forked') ?? vm.blockchain.blocksByNumber.get(0n)
					),
					/** @type {import('@tevm/block').Block}*/ (vm.blockchain.blocksByTag.get('latest')),
				),
			}
		},
	}

	eventEmitter.on('connect', () => {
		if (baseClient.status !== 'INITIALIZING') {
			return
		}
		baseClient.status = 'READY'
	})

	return baseClient
}
