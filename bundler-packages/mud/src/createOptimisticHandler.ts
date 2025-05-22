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
import { createMemoryClient } from '@tevm/memory-client'
import { type Address, EthjsAddress } from '@tevm/utils'
import type { RunTxResult } from '@tevm/vm'
import { http, type Client, parseEventLogs } from 'viem'
import { mudStoreGetStorageAtOverride } from './internal/decorators/mudStoreGetStorageAtOverride.js'
import { mudStoreWriteRequestOverride } from './internal/decorators/mudStoreWriteRequestOverride.js'
import { ethjsLogToAbiLog } from './internal/ethjsLogToAbiLog.js'
import type { SessionClient } from './types.js'

// TODO: add debug logs

export type CreateOptimisticHandlerOptions<TConfig extends StoreConfig = StoreConfig> = {
	/** A base viem client */
	client: Client | SessionClient
	/** The address of the store contract */
	storeAddress: Address
	/** The state manager (here stash) */
	stash: Stash<TConfig>
	/** The store config */
	config?: TConfig // for typing
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
}

/**
 * Initializes the optimistic handlers (storage and send transaction interceptors), and returns optimistic methods.
 */
export const createOptimisticHandler = <TConfig extends StoreConfig = StoreConfig>({
	client,
	storeAddress,
	stash,
}: CreateOptimisticHandlerOptions<TConfig>): CreateOptimisticHandlerResult<TConfig> => {
	if (!client.chain) throw new Error('Client must be connected to a chain')
	const memoryClient = createMemoryClient({
		fork: {
			transport: http(client.chain.rpcUrls.default.http[0])({
				chain: client.chain,
			}),
			blockTag: 'latest',
		},
		// @ts-expect-error - version mismatch, properties such as `fees` incompatibles
		common: createCommon(client.chain),
	})

	// Create optimistic subscribers
	const optimisticTableSubscribers: TableSubscribers = {}
	const optimisticStoreSubscribers: StoreSubscribers = new Set()

	// TODO: is it clean to do that? So we start the promises asap, and below it should await only the first time?
	const _vm = memoryClient.transport.tevm.getVm()
	const _txPool = memoryClient.transport.tevm.getTxPool()
	// Adds the optimistic state on top of the canonical state by applying the logs on a deep copy of the canonical state and returning it instead
	const _optimisticStateView = async (notifySubscribers = false) => {
		const vm = await _vm
		const txPool = await _txPool
		if (txPool.txsInPool === 0) return stash.get()

		// Get the txs in the pending block to apply them on top of the canonical state
		const orderedTxs = await txPool.txsByPriceAndNonce()
		const txResults: Array<RunTxResult> = []
		const vmCopy = orderedTxs.length > 0 ? await vm.deepCopy() : vm // we don't want to share the state with the client as it ran these already

		// Replay txs to get the logs
		for (const tx of orderedTxs) {
			// clear cache to force the fork request to not hit cache and go through our `getStorageAt` interceptor
			vmCopy.stateManager._baseState.forkCache.storage.clearContractStorage(EthjsAddress.fromString(storeAddress))
			const txResult = await vmCopy.runTx({
				tx,
				skipBalance: true,
				skipNonce: true,
				skipHardForkValidation: true,
				skipBlockGasLimitValidation: true,
			})

			if (txResult.execResult.exceptionError) throw txResult.execResult.exceptionError
			txResults.push(txResult)
		}

		// Parse the logs for usage by the storage adapter
		const storeEventsLogs = parseEventLogs({
			abi: storeEventsAbi,
			logs: txResults.flatMap((tx) => tx.receipt.logs.map((log) => ethjsLogToAbiLog(storeEventsAbi, log))),
		})

		// Create a deep clone of the canonical state
		const canonicalState = stash.get()
		const optimisticState: MutableState = {
			config: canonicalState.config,
			records: structuredClone(canonicalState.records),
		}
		console.log('computing optimistic state', notifySubscribers)
		// Apply the logs to the optimistic state
		createStorageAdapter({
			stash: {
				get: () => optimisticState,
				_: {
					state: optimisticState,
					tableSubscribers: notifySubscribers ? optimisticTableSubscribers : {},
					storeSubscribers: notifySubscribers ? optimisticStoreSubscribers : new Set(),
				},
			},
		})({ logs: storeEventsLogs, blockNumber: 0n })

		return optimisticState as State<TConfig>
	}

	client.extend(mudStoreWriteRequestOverride({ memoryClient, storeAddress }))
	memoryClient.extend(mudStoreGetStorageAtOverride({ getOptimisticState: () => _optimisticStateView(), storeAddress }))

	// Update subscribers when the optimistic state changes
	const _subscribeToOptimisticState = async () => {
		const txPool = await _txPool
		txPool.on('txadded', () => _optimisticStateView(true))
		txPool.on('txremoved', () => _optimisticStateView(true))
	}

	_subscribeToOptimisticState()

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
	}
}
