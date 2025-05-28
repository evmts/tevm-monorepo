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
} from '@latticexyz/stash/internal'
import { storeEventsAbi } from '@latticexyz/store'
import { createStorageAdapter } from '@latticexyz/store-sync/internal'
import { type Table } from '@latticexyz/store/internal'
import { createCommon } from '@tevm/common'
import { createLogger } from '@tevm/logger'
import { type MemoryClient, createMemoryClient } from '@tevm/memory-client'
import type { TxPool } from '@tevm/txpool'
import { type Address, createAddressFromString } from '@tevm/utils'
import type { Vm } from '@tevm/vm'
import { type Client, parseEventLogs } from 'viem'
import { mudStoreGetStorageAtOverride } from './internal/decorators/mudStoreGetStorageAtOverride.js'
import { mudStoreWriteRequestOverride } from './internal/decorators/mudStoreWriteRequestOverride.js'
import { ethjsLogToAbiLog } from './internal/ethjsLogToAbiLog.js'
import { type TxStatusSubscriber, subscribeTxStatus } from './subscribeTx.js'
import type { SessionClient } from './types.js'

export type CreateOptimisticHandlerOptions<TConfig extends StoreConfig = StoreConfig> = {
	/** A base viem client */
	client: Client | SessionClient
	/** The address of the store contract */
	storeAddress: Address
	/** The state manager (here stash) */
	stash: Stash<TConfig>
	/** The store config */
	config?: TConfig | undefined // for typing
	/** The logging level for Tevm clients */
	loggingLevel?: 'debug' | 'error' | 'fatal' | 'info' | 'trace' | 'warn' | undefined
}

export type CreateOptimisticHandlerResult<TConfig extends StoreConfig = StoreConfig> = {
	getOptimisticState: () => Promise<State<TConfig>>
	getOptimisticRecord: <
		TTable extends Table,
		TDefaultValue extends Omit<TableRecord<TTable>, keyof Key<TTable>> | undefined = undefined,
	>(
		args: Omit<GetRecordArgs<TTable, TDefaultValue>, 'stash'>,
	) => Promise<GetRecordResult<TTable, TDefaultValue>>
	getOptimisticRecords: <TTable extends Table>(
		args: Omit<GetRecordsArgs<TTable>, 'stash'>,
	) => Promise<GetRecordsResult<TTable>>
	subscribeOptimisticState: (args: { subscriber: StoreUpdatesSubscriber }) => Unsubscribe
	subscribeTx: (args: { subscriber: TxStatusSubscriber }) => Unsubscribe
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

	function createForkRequestOverrideClient(getState: () => Promise<State>, type: 'internal' | 'optimistic') {
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

	// Internal state that builds up as runTx goes
	const internalOptimisticState: MutableState = {
		config: stash.get().config,
		records: structuredClone(stash.get().records),
	}

	let vm: Vm | undefined
	let txPool: TxPool | undefined
	// Adds the optimistic state on top of the canonical state by applying the logs on a deep copy of the canonical state and returning it instead
	async function _optimisticStateView(notifySubscribers = false) {
		if (!vm) vm = await internalClient.transport.tevm.getVm()
		if (!txPool) txPool = await optimisticClient.transport.tevm.getTxPool()
		// TODO: we seem to have a race condition here:
		// -> the mud indexer on the canonical chain will fire an update right in sync with our 'txremoved' event
		// BUT txPool.txsInPool (and the txs inside) will not reflect the change yet, meaning that it will apply that tx that was supposed to be removed
		// on top of its canonical counterpart. Hence the race condition:
		// why is that event fired at the right time, but the entire txPool state not updated yet, although it's supposed to be updated _before_ the event is fired?
		if (txPool.txsInPool === 0) {
			logger?.debug('No txs in pool, returning canonical state.')
			return stash.get()
		}

		logger?.debug(
			{
				txsInPool: txPool.txsInPool,
				notifySubscribers,
			},
			'Applying txs to optimistic state.',
		)
		// Get the txs in the pending block to apply them on top of the canonical state
		const orderedTxs = await txPool.txsByPriceAndNonce()
		const vmCopy = await vm.deepCopy() // we don't want to share the state with the client as it ran these already
		// Reset the internal state
		internalOptimisticState.records = structuredClone(stash.get().records)

		const adapter = createStorageAdapter({
			stash: {
				get: () => internalOptimisticState,
				_: {
					state: internalOptimisticState,
					tableSubscribers: notifySubscribers ? optimisticTableSubscribers : {},
					storeSubscribers: notifySubscribers ? optimisticStoreSubscribers : new Set(),
				},
			},
		})

		// Replay txs to get the logs
		for (const tx of orderedTxs) {
			logger?.debug({ tx }, `Running tx ${orderedTxs.indexOf(tx) + 1}/${orderedTxs.length}.`)
			// clear cache to force the fork request to not hit cache and go through our `getStorageAt` interceptor
			vmCopy.stateManager._baseState.forkCache.storage.clearStorage(createAddressFromString(storeAddress))
			const txResult = await vmCopy.runTx({
				tx,
				skipBalance: true,
				skipNonce: true,
				skipHardForkValidation: true,
				skipBlockGasLimitValidation: true,
			})

			if (txResult.execResult.exceptionError) throw txResult.execResult.exceptionError

			// Parse the logs for usage by the storage adapter
			const storeEventsLogs = parseEventLogs({
				abi: storeEventsAbi,
				logs: txResult.receipt.logs.map((log) => ethjsLogToAbiLog(storeEventsAbi, log)),
			})

			// Apply the logs to the optimistic state
			adapter({ logs: storeEventsLogs, blockNumber: 0n })
		}

		logger?.debug(
			{
				txsInPool: txPool.txsInPool,
				notifySubscribers,
			},
			'Returning optimistic state after applying txs.',
		)
		// TODO: do we need to do that or am I in object closure hell?
		return {
			config: internalOptimisticState.config,
			records: structuredClone(internalOptimisticState.records),
		} as State<TConfig>
	}

	// TODO: we don't want to have two clients but that's a workaround because we apply different getStorageAt interceptors:
	// - internalClient: used during _optimisticStateView:runTx and uses a mudStoreGetStorageAtOverride that builds up the optimistic state
	// as the pool txs are executed (so the getStorageAt override reads the current optimistic state SO FAR, at each tx)
	// - optimisticClient: used for the write interceptor, and uses a mudStoreGetStorageAtOverride that always reads the optimistic state
	// from the _optimisticStateView
	const internalClient = createForkRequestOverrideClient(() => Promise.resolve(internalOptimisticState), 'internal')
	const optimisticClient = createForkRequestOverrideClient(() => _optimisticStateView(), 'optimistic')

	mudStoreWriteRequestOverride(client, logger)({ memoryClient: optimisticClient, storeAddress, txStatusSubscribers })

	// Update subscribers when the optimistic state changes
	const _subscribeToOptimisticState = async () => {
		logger?.debug('Subscribing to optimistic state')
		if (!txPool) txPool = await optimisticClient.transport.tevm.getTxPool()
		const unsubscribeTxAdded = txPool.on('txadded', () => {
			logger?.debug('Tx added, updating optimistic state.')
			_optimisticStateView(true)
			logger?.debug('Notified subscribers of optimistic state update.')
		})
		const unsubscribeTxRemoved = txPool.on('txremoved', () => {
			logger?.debug('Tx removed, updating optimistic state.')
			_optimisticStateView(true)
			logger?.debug('Notified subscribers of optimistic state update.')
		})

		return () => {
			unsubscribeTxAdded()
			unsubscribeTxRemoved()
		}
	}

	const unsubscribe = _subscribeToOptimisticState()

	return {
		getOptimisticState: async () => _optimisticStateView(),
		getOptimisticRecord: async ({ state, ...args }) =>
			getRecord({ ...args, state: state ?? (await _optimisticStateView()) }),
		getOptimisticRecords: async ({ state, ...args }) =>
			getRecords({ ...args, state: state ?? (await _optimisticStateView()) }),
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
		_: {
			optimisticClient,
			internalClient,
			optimisticStoreSubscribers,
			optimisticTableSubscribers,
			cleanup: async () => {
				logger?.debug('Cleaning up optimistic handler')
				;(await unsubscribe)()
				// TODO: how do we completely get rid of a client?
			},
		},
	}
}
