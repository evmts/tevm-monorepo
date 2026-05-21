import { createMapDb } from '@evmts/zevm/receipt-manager'
import { createChain } from '@tevm/blockchain'
import { createCommon, tevmDefault } from '@tevm/common'
import { createNoopConsensusService } from '@tevm/consensus'
import { createEvm } from '@tevm/evm'
import { createJsonRpcFetcher } from '@tevm/jsonrpc'
import { createLogger } from '@tevm/logger'
import { p256VerifyPrecompile } from '@tevm/precompiles'
import { ReceiptsManager } from '@tevm/receipt-manager'
import { createStateManager } from '@tevm/state'
import { TxPool } from '@tevm/txpool'
import { bytesToHex, getAddress, hexToBigInt, hexToBytes, KECCAK256_RLP, keccak256, numberToHex } from '@tevm/utils'
import { createVm } from '@tevm/vm'
import { createIntervalMiner } from './createIntervalMiner.js'
import { DEFAULT_CHAIN_ID } from './DEFAULT_CHAIN_ID.js'
import { GENESIS_STATE } from './GENESIS_STATE.js'
import { getChainId } from './getChainId.js'
import { chainIdToLightSyncNetwork, normalizeSlots, selectStartupCheckpoint } from './lightSync.js'
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
	/** @type {import('./ExEx.js').ExExHook[]} */
	const exExHooks = [...(options.exExHooks ?? [])]
	/**
	 * @param {import('./ExEx.js').ExExHook} hook
	 */
	const registerExExHook = (hook) => {
		exExHooks.push(hook)
		return () => {
			const i = exExHooks.indexOf(hook)
			if (i >= 0) exExHooks.splice(i, 1)
		}
	}
	/**
	 * @param {import('./ExEx.js').ExExEvent} event
	 */
	const emitExExEvent = async (event) => {
		for (const hook of exExHooks) {
			try {
				await hook(event)
			} catch (e) {
				logger.error(e, 'ExEx hook failed')
			}
		}
	}
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
	let impersonatedAccount
	/**
	 * @param {import('@tevm/utils').Address | undefined} address
	 * returns {void}
	 */
	const setImpersonatedAccount = (address) => {
		impersonatedAccount = address
	}

	/**
	 * @type {boolean}
	 */
	let autoImpersonate = false
	/**
	 * Gets whether auto-impersonation is enabled
	 * @returns {boolean}
	 */
	const getAutoImpersonate = () => autoImpersonate
	/**
	 * Sets whether to automatically impersonate all transaction senders
	 * @param {boolean} enabled
	 */
	const setAutoImpersonate = (enabled) => {
		autoImpersonate = enabled
	}

	/**
	 * @type {boolean}
	 */
	let tracesEnabled = false
	/**
	 * Gets whether automatic tracing is enabled
	 * @returns {boolean}
	 */
	const getTracesEnabled = () => tracesEnabled
	/**
	 * Sets whether to automatically collect traces for all transactions
	 * @param {boolean} enabled
	 */
	const setTracesEnabled = (enabled) => {
		tracesEnabled = enabled
	}

	/**
	 * Timestamp to use for the next block (if set)
	 * @type {bigint | undefined}
	 */
	let nextBlockTimestamp
	/**
	 * Sets the timestamp for the next block
	 * @param {bigint | undefined} timestamp
	 */
	const setNextBlockTimestamp = (timestamp) => {
		nextBlockTimestamp = timestamp
	}
	/**
	 * Gets the timestamp set for the next block
	 * @returns {bigint | undefined}
	 */
	const getNextBlockTimestamp = () => nextBlockTimestamp

	/**
	 * Gas limit to use for the next block (if set)
	 * @type {bigint | undefined}
	 */
	let nextBlockGasLimit
	/**
	 * Sets the gas limit for the next block
	 * @param {bigint | undefined} gasLimit
	 */
	const setNextBlockGasLimit = (gasLimit) => {
		nextBlockGasLimit = gasLimit
	}
	/**
	 * Gets the gas limit set for the next block
	 * @returns {bigint | undefined}
	 */
	const getNextBlockGasLimit = () => nextBlockGasLimit

	/**
	 * Base fee per gas to use for the next block (if set)
	 * @type {bigint | undefined}
	 */
	let nextBlockBaseFeePerGas
	/** @type {bigint | undefined} */
	let nextBlockPrevRandao
	/**
	 * Sets the base fee per gas for the next block (EIP-1559)
	 * @param {bigint | undefined} baseFeePerGas
	 */
	const setNextBlockBaseFeePerGas = (baseFeePerGas) => {
		nextBlockBaseFeePerGas = baseFeePerGas
	}
	/**
	 * Gets the base fee per gas set for the next block
	 * @returns {bigint | undefined}
	 */
	const getNextBlockBaseFeePerGas = () => nextBlockBaseFeePerGas
	/**
	 * @param {bigint | undefined} prevRandao
	 */
	const setNextBlockPrevRandao = (prevRandao) => {
		nextBlockPrevRandao = prevRandao
	}
	/**
	 * @returns {bigint | undefined}
	 */
	const getNextBlockPrevRandao = () => nextBlockPrevRandao

	/**
	 * Minimum gas price for transactions
	 * @type {bigint | undefined}
	 */
	let minGasPrice
	/**
	 * Sets the minimum gas price for transactions
	 * @param {bigint | undefined} price
	 */
	const setMinGasPrice = (price) => {
		minGasPrice = price
	}
	/**
	 * Gets the minimum gas price for transactions
	 * @returns {bigint | undefined}
	 */
	const getMinGasPrice = () => minGasPrice

	/**
	 * Timestamp interval to automatically add between blocks (if set)
	 * @type {bigint | undefined}
	 */
	let blockTimestampInterval
	/**
	 * Sets the timestamp interval to automatically add between blocks
	 * @param {bigint | undefined} interval
	 */
	const setBlockTimestampInterval = (interval) => {
		blockTimestampInterval = interval
	}
	/**
	 * Gets the timestamp interval set for automatic increments
	 * @returns {bigint | undefined}
	 */
	const getBlockTimestampInterval = () => blockTimestampInterval

	/**
	 * Snapshot storage for evm_snapshot/evm_revert
	 * Maps snapshot ID (hex string) to a full snapshot blob.
	 * @type {Map<string, any>}
	 */
	const snapshots = new Map()
	/**
	 * Counter for generating snapshot IDs
	 * @type {number}
	 */
	let snapshotIdCounter = 1

	/**
	 * Gets all stored snapshots
	 * @returns {Map<string, any>}
	 */
	const getSnapshots = () => snapshots

	/**
	 * Adds a new snapshot and returns its ID
	 * @param {string} stateRoot
	 * @param {import('@tevm/state').TevmState} state
	 * @param {import('./TevmNode.js').SnapshotMetadata} [metadata]
	 * @returns {string} - The snapshot ID in hex format (e.g., "0x1")
	 */
	const addSnapshot = (stateRoot, state, metadata = {}) => {
		const id = `0x${snapshotIdCounter.toString(16)}`
		snapshots.set(id, { stateRoot, state, ...metadata })
		snapshotIdCounter++
		return id
	}

	/**
	 * Gets a snapshot by ID
	 * @param {string} snapshotId
	 * @returns {any | undefined}
	 */
	const getSnapshot = (snapshotId) => snapshots.get(snapshotId)

	/**
	 * Deletes snapshots with IDs greater than or equal to the given ID
	 * This is needed because reverting invalidates all subsequent snapshots
	 * @param {string} snapshotId
	 */
	const deleteSnapshotsFrom = (snapshotId) => {
		const targetNum = parseInt(snapshotId, 16)
		for (const [id] of snapshots) {
			if (parseInt(id, 16) >= targetNum) {
				snapshots.delete(id)
			}
		}
	}

	const loggingLevel = options.loggingLevel ?? 'warn'
	const consensus = options.consensus ?? createNoopConsensusService()
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
			const fork = await forkAnchorPromise
			return {
				loggingLevel,
				...(options.persister ? { onCommit: statePersister(options.persister, logger) } : {}),
				fork: {
					...options.fork,
					transport,
					blockTag: fork.blockTag,
					...('blockHash' in fork ? { blockHash: fork.blockHash } : {}),
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
		// Priority order:
		// 1. fork.chainId (highest priority - allows overriding for wallet compatibility)
		// 2. common.id (user-provided common configuration)
		// 3. auto-detected from RPC (when forking)
		// 4. DEFAULT_CHAIN_ID (fallback)
		if (options?.fork?.chainId !== undefined) {
			logger.debug({ chainId: options.fork.chainId }, 'Using fork chainId override')
			return options.fork.chainId
		}
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

	chainIdPromise.then((chainId) => {
		if (consensus.mode !== 'light-client' || !consensus.updateLightSyncStatus) return
		const checkpoint = selectStartupCheckpoint(options.lightSync ?? {})
		consensus.updateLightSyncStatus({
			network: chainIdToLightSyncNetwork(Number(chainId)),
			checkpointSource: checkpoint.checkpointSource,
			lastCheckpoint: checkpoint.checkpoint,
			status: checkpoint.checkpoint ? 'starting' : 'idle',
		})
	})

	const getLightSyncStatus = () =>
		normalizeSlots(
			consensus.getLightSyncStatus?.() ?? {
				ready: true,
				status: 'ready',
				network: 'unknown',
				checkpointSource: 'none',
				lastCheckpoint: null,
				optimisticSlot: 0n,
				safeSlot: 0n,
				finalizedSlot: 0n,
			},
		)

	/**
	 * @param {{ request: import('viem').EIP1193RequestFn }} transport
	 * @param {import('@tevm/utils').BlockTag | bigint} blockTag
	 */
	const fetchForkAnchor = async (transport, blockTag) => {
		if (blockTag === 'pending') {
			throw new Error('Cannot use pending as a fork block tag')
		}
		const fetcher = createJsonRpcFetcher(transport)
		const { result, error } = await fetcher.request({
			jsonrpc: '2.0',
			id: 1,
			method: 'eth_getBlockByNumber',
			params: [typeof blockTag === 'bigint' ? numberToHex(blockTag) : blockTag, false],
		})
		if (error) {
			throw error
		}
		const block = /** @type {{ number?: import('@tevm/utils').Hex; hash?: import('@tevm/utils').Hex }} */ (result ?? {})
		if (
			!block.number ||
			!block.hash ||
			typeof block.number !== 'string' ||
			!block.number.startsWith('0x') ||
			typeof block.hash !== 'string'
		) {
			// Mock transports / non-conforming providers may not honor eth_getBlockByNumber
			// Fall back to using the supplied blockTag verbatim so we don't crash.
			return { blockTag: typeof blockTag === 'bigint' ? blockTag : 0n }
		}
		return {
			blockTag: hexToBigInt(block.number),
			blockHash: block.hash,
		}
	}

	const forkAnchorPromise = (async () => {
		if (options.fork === undefined) {
			// this is ultimately unused
			return { blockTag: 0n }
		}
		if (!transport) {
			return { blockTag: 0n }
		}
		const anchor = await fetchForkAnchor(transport, options.fork.blockTag ?? 'latest')
		logger.debug(anchor, 'fetched fork block anchor from provided forkurl')
		return anchor
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

	const blockchainPromise = Promise.all([chainCommonPromise, forkAnchorPromise]).then(([common, forkAnchor]) => {
		return createChain({
			loggingLevel,
			common,
			...(transport !== undefined
				? {
						fork: {
							transport,
							blockTag: 'blockHash' in forkAnchor ? forkAnchor.blockHash : forkAnchor.blockTag,
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
			return createEvm({
				common,
				stateManager,
				blockchain,
				allowUnlimitedContractSize: options.allowUnlimitedContractSize ?? false,
				customPrecompiles: [
					...[p256VerifyPrecompile()].filter(
						(p) =>
							!new Set((options.customPrecompiles ?? []).map((p) => p.address.toString())).has(p.address.toString()),
					),
					...(options.customPrecompiles ?? []),
				],
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
					const index = listeners.indexOf(listener)
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
					listeners.forEach((listener) => {
						listener(...args)
					})
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
		const chainId = await chainIdPromise
		eventEmitter.emit('connect', { chainId: `0x${chainId.toString(16)}` })
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
		let impersonatedAccount
		/**
		 * @param {import('@tevm/utils').Address | undefined} address
		 * returns {void}
		 */
		const setImpersonatedAccount = (address) => {
			impersonatedAccount = address && getAddress(address)
		}
		/**
		 * Auto impersonate state copied from parent
		 * @type {boolean}
		 */
		let copiedAutoImpersonate = baseClient.getAutoImpersonate()
		const getCopiedAutoImpersonate = () => copiedAutoImpersonate
		/**
		 * @param {boolean} enabled
		 */
		const setCopiedAutoImpersonate = (enabled) => {
			copiedAutoImpersonate = enabled
		}
		/**
		 * Traces enabled state copied from parent
		 * @type {boolean}
		 */
		let copiedTracesEnabled = baseClient.getTracesEnabled()
		const getCopiedTracesEnabled = () => copiedTracesEnabled
		/**
		 * @param {boolean} enabled
		 */
		const setCopiedTracesEnabled = (enabled) => {
			copiedTracesEnabled = enabled
		}
		/**
		 * Timestamp to use for the next block (if set)
		 * @type {bigint | undefined}
		 */
		let copiedNextBlockTimestamp = baseClient.getNextBlockTimestamp()
		/**
		 * @param {bigint | undefined} timestamp
		 */
		const setCopiedNextBlockTimestamp = (timestamp) => {
			copiedNextBlockTimestamp = timestamp
		}
		/**
		 * Gas limit to use for the next block (if set)
		 * @type {bigint | undefined}
		 */
		let copiedNextBlockGasLimit = baseClient.getNextBlockGasLimit()
		/**
		 * @param {bigint | undefined} gasLimit
		 */
		const setCopiedNextBlockGasLimit = (gasLimit) => {
			copiedNextBlockGasLimit = gasLimit
		}
		/**
		 * Base fee per gas to use for the next block (if set)
		 * @type {bigint | undefined}
		 */
		let copiedNextBlockBaseFeePerGas = baseClient.getNextBlockBaseFeePerGas()
		/** @type {bigint | undefined} */
		let copiedNextBlockPrevRandao = baseClient.getNextBlockPrevRandao()
		/**
		 * @param {bigint | undefined} baseFeePerGas
		 */
		const setCopiedNextBlockBaseFeePerGas = (baseFeePerGas) => {
			copiedNextBlockBaseFeePerGas = baseFeePerGas
		}
		/**
		 * @param {bigint | undefined} prevRandao
		 */
		const setCopiedNextBlockPrevRandao = (prevRandao) => {
			copiedNextBlockPrevRandao = prevRandao
		}
		/**
		 * Minimum gas price for transactions
		 * @type {bigint | undefined}
		 */
		let copiedMinGasPrice = baseClient.getMinGasPrice()
		/**
		 * @param {bigint | undefined} price
		 */
		const setCopiedMinGasPrice = (price) => {
			copiedMinGasPrice = price
		}
		/**
		 * Timestamp interval to automatically add between blocks (if set)
		 * @type {bigint | undefined}
		 */
		let copiedBlockTimestampInterval = baseClient.getBlockTimestampInterval()
		/**
		 * @param {bigint | undefined} interval
		 */
		const setCopiedBlockTimestampInterval = (interval) => {
			copiedBlockTimestampInterval = interval
		}
		/**
		 * Copy snapshots from the parent client
		 * @type {Map<string, import('./TevmNode.js').TevmSnapshot>}
		 */
		const copiedSnapshots = new Map(baseClient.getSnapshots())
		let copiedSnapshotIdCounter = Math.max(0, ...[...copiedSnapshots.keys()].map((id) => Number.parseInt(id, 16))) + 1

		const getCopiedSnapshots = () => copiedSnapshots
		/**
		 * @param {string} stateRoot
		 * @param {import('@tevm/state').TevmState} state
		 * @param {import('./TevmNode.js').SnapshotMetadata} [metadata]
		 * @returns {string}
		 */
		const addCopiedSnapshot = (stateRoot, state, metadata = {}) => {
			const id = `0x${copiedSnapshotIdCounter.toString(16)}`
			copiedSnapshots.set(id, { stateRoot, state, ...metadata })
			copiedSnapshotIdCounter++
			return id
		}
		/**
		 * @param {string} snapshotId
		 * @returns {import('./TevmNode.js').TevmSnapshot | undefined}
		 */
		const getCopiedSnapshot = (snapshotId) => copiedSnapshots.get(snapshotId)
		/**
		 * @param {string} snapshotId
		 */
		const deleteCopiedSnapshotsFrom = (snapshotId) => {
			const targetNum = parseInt(snapshotId, 16)
			for (const [id] of copiedSnapshots) {
				if (parseInt(id, 16) >= targetNum) {
					copiedSnapshots.delete(id)
				}
			}
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
			consensus: baseClient.consensus,
			getReceiptsManager: async () => Promise.resolve(receiptsManager),
			getTxPool: async () => Promise.resolve(txPool),
			getVm: async () => Promise.resolve(vm),
			miningConfig: baseClient.miningConfig,
			setMiningConfig: (config) => {
				copiedClient.miningConfig = config
				baseClient.logger.debug({ newConfig: config }, 'Copied client mining configuration updated')
				// Copied clients don't manage interval mining independently
			},
			mode: baseClient.mode,
			...('forkTransport' in baseClient
				? {
						forkTransport: {
							request: baseClient.forkTransport.request,
						},
					}
				: {}),
			extend: (extension) => extend(copiedClient)(extension),
			deepCopy: () => deepCopy(copiedClient)(),
			ready: () => Promise.resolve(true),
			getFilters: () => newFilters,
			getImpersonatedAccount() {
				return impersonatedAccount
			},
			setImpersonatedAccount,
			getAutoImpersonate: getCopiedAutoImpersonate,
			setAutoImpersonate: setCopiedAutoImpersonate,
			getTracesEnabled: getCopiedTracesEnabled,
			setTracesEnabled: setCopiedTracesEnabled,
			getNextBlockTimestamp: () => copiedNextBlockTimestamp,
			setNextBlockTimestamp: setCopiedNextBlockTimestamp,
			getNextBlockGasLimit: () => copiedNextBlockGasLimit,
			setNextBlockGasLimit: setCopiedNextBlockGasLimit,
			getNextBlockBaseFeePerGas: () => copiedNextBlockBaseFeePerGas,
			setNextBlockBaseFeePerGas: setCopiedNextBlockBaseFeePerGas,
			getNextBlockPrevRandao: () => copiedNextBlockPrevRandao,
			setNextBlockPrevRandao: setCopiedNextBlockPrevRandao,
			getMinGasPrice: () => copiedMinGasPrice,
			setMinGasPrice: setCopiedMinGasPrice,
			getBlockTimestampInterval: () => copiedBlockTimestampInterval,
			setBlockTimestampInterval: setCopiedBlockTimestampInterval,
			getSnapshots: getCopiedSnapshots,
			addSnapshot: addCopiedSnapshot,
			getSnapshot: getCopiedSnapshot,
			deleteSnapshotsFrom: deleteCopiedSnapshotsFrom,
			setFilter: (filter) => {
				newFilters.set(filter.id, filter)
			},
			removeFilter: (filterId) => {
				newFilters.delete(filterId)
			},
			status: 'READY',
			getLightSyncStatus: baseClient.getLightSyncStatus,
			registerExExHook: baseClient.registerExExHook,
			emitExExEvent: baseClient.emitExExEvent,
			close: () => {
				// Copied clients don't manage interval mining independently
				// They inherit the state but don't start their own timers
				copiedClient.status = 'STOPPED'
				baseClient.logger.debug('Copied TevmNode closed')
			},
		}
		return copiedClient
	}

	// Create interval miner instance before baseClient so we can reference it
	/** @type {ReturnType<typeof createIntervalMiner> | null} */
	let intervalMiner = null

	/**
	 * Emits the same block import events as manual mining without depending on
	 * @tevm/actions from @tevm/node.
	 * @param {import('./TevmNode.js').TevmNode} client
	 * @param {import('@tevm/block').Block} block
	 * @param {Array<import('@tevm/receipt-manager').TxReceipt>} receipts
	 * @returns {Promise<void>}
	 */
	const emitMinedBlockEvents = async (client, block, receipts) => {
		const blockHash = bytesToHex(block.hash())
		client.emit('newBlock', block)
		await client.emitExExEvent({ type: 'block', phase: 'imported', block, blockHash })

		let cumulativeLogIndex = 0n
		for (let txIndex = 0; txIndex < receipts.length; txIndex++) {
			const receipt = receipts[txIndex]
			if (!receipt) {
				continue
			}
			client.emit('newReceipt', receipt)
			await client.emitExExEvent({ type: 'receipt', phase: 'created', blockHash, receipt })
			const txHash = /** @type {any} */ (receipt).txHash
			await client.emitExExEvent({
				type: 'transaction',
				phase: 'executed',
				txHash: txHash ? bytesToHex(txHash) : '0x',
				blockHash,
				receipt,
			})

			const tx = block.transactions?.[txIndex]
			const transactionHash = tx ? bytesToHex(tx.hash()) : txHash ? bytesToHex(txHash) : '0x'
			for (const log of receipt.logs) {
				client.emit('newLog', log, {
					blockHash,
					blockNumber: block.header.number,
					transactionHash,
					transactionIndex: BigInt(txIndex),
					logIndex: cumulativeLogIndex,
				})
				cumulativeLogIndex++
				await client.emitExExEvent({ type: 'log', phase: 'created', blockHash, receipt, log })
			}
		}

		await client.emitExExEvent({
			type: 'state',
			phase: 'committed',
			blockHash,
			stateRoot: bytesToHex(block.header.stateRoot),
		})
		await client.emitExExEvent({
			type: 'canonical',
			phase: 'headChanged',
			headHash: blockHash,
			headNumber: block.header.number,
			reorged: false,
		})
	}

	/**
	 * Mines all currently pending transactions using the same state, receipt, and
	 * txpool updates as manual mining.
	 * @param {import('./TevmNode.js').TevmNode} client
	 * @returns {Promise<void>}
	 */
	const minePendingTransactions = async (client) => {
		const pool = await client.getTxPool()
		const originalVm = await client.getVm()
		const vm = await originalVm.deepCopy()
		const receiptsManager = await client.getReceiptsManager()
		const parentBlock = await vm.blockchain.getCanonicalHeadBlock()
		const overrideBaseFee = client.getNextBlockBaseFeePerGas()
		const baseFeePerGas = overrideBaseFee ?? parentBlock.header.calcNextBaseFee()
		const orderedTxs = await pool.txsByPriceAndNonce({ baseFee: baseFeePerGas })
		if (orderedTxs.length === 0) {
			client.logger.debug('Interval mining: No transactions to mine')
			return
		}
		if (overrideBaseFee !== undefined) {
			client.setNextBlockBaseFeePerGas(undefined)
		}

		const overrideTimestamp = client.getNextBlockTimestamp()
		const timestampInterval = client.getBlockTimestampInterval()
		let timestamp
		if (overrideTimestamp !== undefined) {
			timestamp = overrideTimestamp
			client.setNextBlockTimestamp(undefined)
		} else if (timestampInterval !== undefined) {
			timestamp = parentBlock.header.timestamp + timestampInterval
		} else {
			const currentTimestamp = BigInt(Math.floor(Date.now() / 1000))
			timestamp = currentTimestamp > parentBlock.header.timestamp ? currentTimestamp : parentBlock.header.timestamp + 1n
		}
		timestamp = timestamp > parentBlock.header.timestamp ? timestamp : parentBlock.header.timestamp + 1n
		const gasLimit = client.getNextBlockGasLimit() ?? parentBlock.header.gasLimit
		const overridePrevRandao = client.getNextBlockPrevRandao?.()
		if (overridePrevRandao !== undefined && client.setNextBlockPrevRandao) {
			client.setNextBlockPrevRandao(undefined)
		}
		const mixHash =
			overridePrevRandao !== undefined
				? hexToBytes(`0x${overridePrevRandao.toString(16).padStart(64, '0')}`)
				: undefined

		const blockBuilder = await vm.buildBlock({
			parentBlock,
			headerData: {
				timestamp,
				number: parentBlock.header.number + 1n,
				...(mixHash ? { mixHash } : {}),
				gasLimit,
				baseFeePerGas,
			},
			blockOpts: { freeze: false, setHardfork: false, putBlockIntoBlockchain: false, common: vm.common },
		})

		/**
		 * @type {Array<import('@tevm/receipt-manager').TxReceipt>}
		 */
		const receipts = []
		for (const tx of orderedTxs) {
			const txResult = await blockBuilder.addTransaction(tx, {
				skipBalance: false,
				skipNonce: false,
				skipHardForkValidation: false,
			})
			receipts.push(txResult.receipt)
		}

		await vm.stateManager.checkpoint()
		await vm.stateManager.commit(true)
		const block = await blockBuilder.build()
		await Promise.all([receiptsManager.saveReceipts(block, receipts), vm.blockchain.putBlock(block)])
		pool.removeNewBlockTxs([block])

		const state = vm.stateManager._baseState.stateRoots.get(bytesToHex(block.header.stateRoot))
		if (state !== undefined) {
			originalVm.stateManager.saveStateRoot(block.header.stateRoot, state)
		}
		originalVm.blockchain = vm.blockchain
		originalVm.evm.blockchain = vm.evm.blockchain
		// @ts-expect-error internal receipt manager chain is intentionally updated after mining
		receiptsManager.chain = vm.evm.blockchain
		await originalVm.stateManager.setStateRoot(hexToBytes(vm.stateManager._baseState.getCurrentStateRoot()))

		await emitMinedBlockEvents(client, block, receipts)
		client.logger.debug(
			{ blockNumber: block.header.number, txCount: orderedTxs.length },
			'Block mined via interval mining',
		)
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
		consensus,
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
		miningConfig: options.miningConfig ?? { type: 'auto' },
		setMiningConfig: (config) => {
			const oldConfig = baseClient.miningConfig
			baseClient.miningConfig = config
			logger.debug({ oldConfig, newConfig: config }, 'Mining configuration updated')

			// Handle interval mining state changes
			if (oldConfig.type === 'interval' && intervalMiner) {
				intervalMiner.stop()
			}

			if (config.type === 'interval') {
				if (!intervalMiner) {
					intervalMiner = createIntervalMiner(baseClient)
					// Set up the mining callback
					intervalMiner.setMiningCallback(async () => {
						try {
							await minePendingTransactions(baseClient)
						} catch (error) {
							baseClient.logger.error(error, 'Failed to mine block in setMiningConfig')
						}
					})
				}
				intervalMiner.updateConfig()
				intervalMiner.start()
			}
		},
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
		getAutoImpersonate,
		setAutoImpersonate,
		getTracesEnabled,
		setTracesEnabled,
		getNextBlockTimestamp,
		setNextBlockTimestamp,
		getNextBlockGasLimit,
		setNextBlockGasLimit,
		getNextBlockBaseFeePerGas,
		setNextBlockBaseFeePerGas,
		getNextBlockPrevRandao,
		setNextBlockPrevRandao,
		getMinGasPrice,
		setMinGasPrice,
		getBlockTimestampInterval,
		setBlockTimestampInterval,
		getSnapshots,
		addSnapshot,
		getSnapshot,
		deleteSnapshotsFrom,
		getFilters: () => filters,
		setFilter: (filter) => {
			filters.set(filter.id, filter)
		},
		removeFilter: (filterId) => {
			filters.delete(filterId)
		},
		status: 'INITIALIZING',
		getLightSyncStatus,
		registerExExHook,
		emitExExEvent,
		deepCopy: () => deepCopy(baseClient)(),
		close: () => {
			baseClient.status = 'STOPPED'
			intervalMiner?.stop()
			logger.debug('TevmNode closed')
		},
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

		// Start interval mining if configured
		if (baseClient.miningConfig.type === 'interval') {
			intervalMiner = createIntervalMiner(baseClient)

			// Set up the mining callback to handle block creation
			intervalMiner.setMiningCallback(async () => {
				try {
					await minePendingTransactions(baseClient)
				} catch (error) {
					baseClient.logger.error(error, 'Failed to mine block in interval mining')
				}
			})

			intervalMiner.start()
		}
	})

	return baseClient
}
