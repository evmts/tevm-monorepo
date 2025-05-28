import {
	type GetRecordArgs,
	type GetRecordResult,
	type GetRecordsArgs,
	type GetRecordsResult,
	type Key,
	type MutableState,
	type Stash,
	type State,
	type StoreConfig,
	type StoreSubscribers,
	type StoreUpdatesSubscriber,
	type TableRecord,
	type TableSubscribers,
	type Unsubscribe,
	getRecord,
	getRecords,
	subscribeStash,
} from '@latticexyz/stash/internal'
import { storeEventsAbi } from '@latticexyz/store'
import { type Table } from '@latticexyz/store/internal'
import { createCommon } from '@tevm/common'
import { createLogger } from '@tevm/logger'
import { type MemoryClient, createMemoryClient } from '@tevm/memory-client'
import type { TxPool } from '@tevm/txpool'
import { type Address, createAddressFromString } from '@tevm/utils'
import type { Vm } from '@tevm/vm'
import { bytesToHex, type Client, type Hex, parseEventLogs, publicActions } from 'viem'
import { mudStoreGetStorageAtOverride } from './internal/decorators/mudStoreGetStorageAtOverride.js'
import { mudStoreWriteRequestOverride } from './internal/decorators/mudStoreWriteRequestOverride.js'
import { ethjsLogToAbiLog } from './internal/ethjsLogToAbiLog.js'
import { type PendingStashUpdate, applyStashUpdates, notifyStashSubscribers } from './internal/mud/applyUpdates.js'
import { createStorageAdapter } from './internal/mud/createStorageAdapter.js'
import { serialExecute } from './internal/utils/serialExecute.js'
import { type TxStatusSubscriber, subscribeTxStatus } from './subscribeTx.js'
import type { SessionClient } from './types.js'
import type { SyncAdapter } from '@latticexyz/store-sync'
import { createSyncAdapter } from './internal/mud/createSyncAdapter.js'
import { matchOptimisticTxCounterpart } from './internal/txIdentifier.js'

export type CreateOptimisticHandlerOptions<TConfig extends StoreConfig = StoreConfig> = {
	/** A base viem client */
	client: Client | SessionClient
	/** The address of the store contract */
	storeAddress: Address
	/** The state manager (here stash) */
	stash: Stash<TConfig>
	/** Sync options */
	sync?: {
		/** Whether to enable sync (default: true) */
		enabled?: boolean
		/** The block number to start syncing from (default: 0n) */
		startBlock?: bigint
	} | undefined
	/** The store config */
	config?: TConfig | undefined // for typing
	/** The logging level for Tevm clients */
	loggingLevel?: 'debug' | 'error' | 'fatal' | 'info' | 'trace' | 'warn' | undefined
}

export type CreateOptimisticHandlerResult<TConfig extends StoreConfig = StoreConfig> = {
	getOptimisticState: () => State<TConfig>
	getOptimisticRecord: <
		TTable extends Table,
		TDefaultValue extends Omit<TableRecord<TTable>, keyof Key<TTable>> | undefined = undefined,
	>(
		args: Omit<GetRecordArgs<TTable, TDefaultValue>, 'stash'>,
	) => GetRecordResult<TTable, TDefaultValue>
	getOptimisticRecords: <TTable extends Table>(args: Omit<GetRecordsArgs<TTable>, 'stash'>) => GetRecordsResult<TTable>
	subscribeOptimisticState: (args: { subscriber: StoreUpdatesSubscriber }) => Unsubscribe
	subscribeTx: (args: { subscriber: TxStatusSubscriber }) => Unsubscribe
	syncAdapter: SyncAdapter
	_: {
		optimisticClient: MemoryClient
		internalClient: MemoryClient
		optimisticStoreSubscribers: StoreSubscribers
		optimisticTableSubscribers: TableSubscribers
		cleanup: () => Promise<void>
	}
}

/**
 * Initializes the optimistic handlers (storage and send transaction interceptors), and returns optimistic methods.
 */
export const createOptimisticHandler = <TConfig extends StoreConfig = StoreConfig>({
	client,
	storeAddress,
	stash,
	loggingLevel,
}: CreateOptimisticHandlerOptions<TConfig>): CreateOptimisticHandlerResult<TConfig> => {
	const logger = loggingLevel ? createLogger({ name: '@tevm/mud', level: loggingLevel }) : undefined
	logger?.debug('Creating optimistic handler')

	function createForkRequestOverrideClient(getState: () => State, type: 'internal' | 'optimistic') {
		if (!client.chain) throw new Error('Client must be connected to a chain')
		const transport = 'client' in client ? client.client : client
		return createMemoryClient({
			fork: {
				transport: {
					request: mudStoreGetStorageAtOverride(transport, type, logger)({ getState, storeAddress }),
				},
				blockTag: 'latest',
			},
			common: createCommon(client.chain),
			...(loggingLevel ? { loggingLevel } : {}),
		})
	}

	// Create optimistic subscribers
	const optimisticTableSubscribers: TableSubscribers = {}
	const optimisticStoreSubscribers: StoreSubscribers = new Set()
	// Create tx status subscribers
	const txStatusSubscribers: Set<TxStatusSubscriber> = new Set()

	// View-only optimistic logs
	let optimisticLogs: PendingStashUpdate[] = []
	// Internal logs that build up during execution for the internal client to read the current state as it runs the txs
	let internalLogs: PendingStashUpdate[] = []

	// Optimistic hashes of transactions already handled while syncing their incoming canonical counterpart
	const syncedOptimisticHashes: Set<Hex> = new Set()

	// View function that applies optimistic or internal logs on top of the canonical state
	function getStateView(logs: PendingStashUpdate[]): State<TConfig> {
		const localState: MutableState = {
			config: stash.get().config,
			records: structuredClone(stash.get().records),
		}

		const localStash = {
			get: () => localState,
			_: {
				state: localState,
				tableSubscribers: {},
				storeSubscribers: new Set(),
			},
		} satisfies Stash

		// Apply provided logs without notifications
		applyStashUpdates({ stash: localStash, updates: logs })

		return {
			config: localState.config,
			records: localState.records,
		} as State<TConfig>
	}

	// Get the optimistic state
	const getOptimisticView = () => getStateView(optimisticLogs)
	// Get the internal optimistic state at the latest applied tx
	const getInternalView = () => getStateView(internalLogs)

	let vm: Vm | undefined
	let txPool: TxPool | undefined
	// Function that processes transactions and updates logs
	// we want to execute this function serially so there won't be multiple invocations modifying the same internalLogs variable
	const processTransactionsAndUpdateLogs = serialExecute(async (): Promise<void> => {
		if (!vm) vm = await internalClient.transport.tevm.getVm()
		if (!txPool) txPool = await optimisticClient.transport.tevm.getTxPool()

		// TODO: we seem to have a race condition here:
		// -> the mud indexer on the canonical chain will fire an update right in sync with our 'txremoved' event
		// BUT txPool.txsInPool (and the txs inside) will not reflect the change yet, meaning that it will apply that tx that was supposed to be removed
		// on top of its canonical counterpart. Hence the race condition:
		// why is that event fired at the right time, but the entire txPool state not updated yet, although it's supposed to be updated _before_ the event is fired?
		// -> we basically want the internal sync storage adapter update (that we receive in _subscribeToOptimisticState:subscribeStash) AND
		// the _subscribeToOptimisticState:txremoved event to somehow be combined into a single event?
		if (txPool.txsInPool === 0) {
			logger?.debug('No txs in pool, clearing logs and returning canonical state.')
			internalLogs = []
			optimisticLogs = []
			return
		}

		logger?.debug({ txsInPool: txPool.txsInPool }, 'Processing transactions.')

		const orderedTxs = await txPool.txsByPriceAndNonce()
		const vmCopy = await vm.deepCopy()

		// Reset internal logs for this execution
		internalLogs = []

		// Create adapter that reads from internal view
		const internalState = getInternalView()
		const internalStash = {
			get: () => internalState,
			_: {
				state: internalState,
				tableSubscribers: {},
				storeSubscribers: new Set(),
			},
		} satisfies Stash

		const adapter = createStorageAdapter({ stash: internalStash })

		// Process each transaction, building up internal logs
		for (const tx of orderedTxs) {
			logger?.debug({ tx, hash: bytesToHex(tx.hash()) }, `Running tx ${orderedTxs.indexOf(tx) + 1}/${orderedTxs.length}.`)

			// clear cache to force the fork request to not hit cache and go through our `getStorageAt` interceptor
			// TODO: we absolutely don't want to do this, also it clears some non-data-related slots that could have stayed cached
			vmCopy.stateManager._baseState.forkCache.storage.clearStorage(createAddressFromString(storeAddress))
			const txResult = await vmCopy.runTx({
				tx,
				skipBalance: true,
				skipNonce: true,
				skipHardForkValidation: true,
				skipBlockGasLimitValidation: true,
			})

			if (txResult.execResult.exceptionError) throw txResult.execResult.exceptionError

			const storeEventsLogs = parseEventLogs({
				abi: storeEventsAbi,
				logs: txResult.receipt.logs.map((log) => ethjsLogToAbiLog(storeEventsAbi, log)),
			})

			// Get updates and add to internal logs (builds up incrementally)
			const updates = await adapter({ logs: storeEventsLogs, blockNumber: 0n })
			internalLogs.push(...updates)
		}

		// When finished, update optimistic logs
		optimisticLogs = [...internalLogs]

		// Notify subscribers if requested
		if (optimisticLogs.length > 0) {
			const optimisticState = getOptimisticView()
			const notificationStash = {
				get: () => optimisticState,
				_: {
					state: optimisticState,
					tableSubscribers: optimisticTableSubscribers,
					storeSubscribers: optimisticStoreSubscribers,
				},
			} satisfies Stash

			notifyStashSubscribers({ stash: notificationStash, updates: optimisticLogs })
		}

		logger?.debug({ txsInPool: txPool.txsInPool }, 'Finished processing transactions and notified subscribers.')
	})

	// TODO: we don't want to have two clients but that's a workaround because we apply different getStorageAt interceptors:
	// - internalClient: used during _optimisticStateView:runTx and uses a mudStoreGetStorageAtOverride that builds up the optimistic state
	// as the pool txs are executed (so the getStorageAt override reads the current optimistic state SO FAR, at each tx)
	// - optimisticClient: used for the write interceptor, and uses a mudStoreGetStorageAtOverride that always reads the optimistic state
	// from the _optimisticStateView
	const internalClient = createForkRequestOverrideClient(getInternalView, 'internal')
	const optimisticClient = createForkRequestOverrideClient(getOptimisticView, 'optimistic')

	mudStoreWriteRequestOverride(client, logger)({
		memoryClient: optimisticClient,
		storeAddress,
		txStatusSubscribers
	})

	// Update subscribers when the optimistic state changes or when the canonical state changes (and it's been synced to the optimistic state)
	const _subscribeToOptimisticState = async () => {
		logger?.debug('Subscribing to optimistic state')
		if (!txPool) txPool = await optimisticClient.transport.tevm.getTxPool()

		const unsubscribeTxAdded = txPool.on('txadded', () => {
			logger?.debug('Tx added, updating optimistic state.')
			processTransactionsAndUpdateLogs()
		})
		const unsubscribeTxRemoved = txPool.on('txremoved', (hash) => {
			logger?.debug('Tx removed, updating optimistic state.')
			if (!syncedOptimisticHashes.has(hash as Hex)) processTransactionsAndUpdateLogs()
			else {
				logger?.debug({ optimisticTxHash: hash }, 'Skipping txremoved update for tx that is being handled by the canonical sync.')
				syncedOptimisticHashes.delete(hash as Hex) // cleanup
			}
		})

		const unsubscribeStash = subscribeStash({
			stash,
			subscriber: () => {
				logger?.debug('Stash updated, updating optimistic state.')
				processTransactionsAndUpdateLogs()
			},
		})

		return () => {
			unsubscribeTxAdded()
			unsubscribeTxRemoved()
			unsubscribeStash()
		}
	}

	const unsubscribe = _subscribeToOptimisticState()

	return {
		getOptimisticState: () => getOptimisticView(),
		getOptimisticRecord: ({ state, ...args }) => getRecord({ ...args, state: state ?? getOptimisticView() }),
		getOptimisticRecords: ({ state, ...args }) => getRecords({ ...args, state: state ?? getOptimisticView() }),
		subscribeOptimisticState: ({ subscriber }) => {
			// Subscribe both to the canonical and the optimistic state
			stash._.storeSubscribers.add(subscriber)
			optimisticStoreSubscribers.add(subscriber)
			return () => {
				stash._.storeSubscribers.delete(subscriber)
				optimisticStoreSubscribers.delete(subscriber)
			}
		},
		subscribeTx: ({ subscriber }) => subscribeTxStatus(txStatusSubscribers)(subscriber),
		syncAdapter: createSyncAdapter({
			stash,
			onTx: async ({ hash }) => {
				if (!txPool) txPool = await optimisticClient.transport.tevm.getTxPool()
				if (!hash) return

				const tx = await ('client' in client ? client.client : client).extend(publicActions).getTransaction({ hash })
				const data = tx?.input
				if (!data) return

				const optimisticTxHash = await matchOptimisticTxCounterpart(txPool, data)
				if (optimisticTxHash) {
					logger?.debug({ hash, optimisticTxHash }, 'Marking optimistic tx as being handled during canonical sync.')
					syncedOptimisticHashes.add(optimisticTxHash)
					if (txPool.getByHash(optimisticTxHash)) txPool.removeByHash(optimisticTxHash)
				}
			}
		}),
		_: {
			optimisticClient,
			internalClient,
			optimisticStoreSubscribers,
			optimisticTableSubscribers,
			cleanup: async () => {
				try {
					logger?.debug('Cleaning up optimistic handler')
					;(await unsubscribe)()
					// TODO: how do we completely get rid of a client?
				} catch (error) {
					console.error('Error cleaning up optimistic handler', error)
				}
			},
		},
	}
}
