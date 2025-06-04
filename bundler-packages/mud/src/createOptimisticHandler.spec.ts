import { createTevmTransport } from '@tevm/memory-client'
import { createClient } from 'viem'
import { beforeEach, describe, expect, it } from 'vitest'
import { config } from '../test/config.js'
import { state } from '../test/state.js'
import { createOptimisticHandler } from './createOptimisticHandler.js'
import type { TxStatus } from './subscribeTx.js'
import { testContract, sessionClient, stash, prepare } from '../test/prepare.js'

describe('createOptimisticHandler', () => {
	beforeEach(async () => {
		await prepare({ count: 10 })
	})

	it('should create handler with all required methods', () => {
		const handler = createOptimisticHandler({
			client: sessionClient,
			storeAddress: testContract.address,
			stash,
			config,
		})

		expect(handler).toHaveProperty('getOptimisticState')
		expect(handler).toHaveProperty('getOptimisticRecord')
		expect(handler).toHaveProperty('getOptimisticRecords')
		expect(handler).toHaveProperty('subscribeOptimisticState')
		expect(handler).toHaveProperty('subscribeTx')
		expect(handler).toHaveProperty('_')

		expect(typeof handler.getOptimisticState).toBe('function')
		expect(typeof handler.getOptimisticRecord).toBe('function')
		expect(typeof handler.getOptimisticRecords).toBe('function')
		expect(typeof handler.subscribeOptimisticState).toBe('function')
		expect(typeof handler.subscribeTx).toBe('function')

		// Check internal properties
		expect(handler._).toHaveProperty('optimisticClient')
		expect(handler._).toHaveProperty('internalClient')
		expect(handler._).toHaveProperty('cleanup')
	})

	it('should return canonical state when no pending transactions', async () => {
		const handler = createOptimisticHandler({
			client: sessionClient,
			storeAddress: testContract.address,
			stash,
			config,
		})

		expect(handler.getOptimisticState()).toMatchObject(stash.get())
	})

	// TODO: Fix block with hash does not exist error
	it.todo('should handle optimistic state with pending transactions', async () => {
		const handler = createOptimisticHandler({
			client: sessionClient,
			storeAddress: testContract.address,
			stash,
			config,
			loggingLevel: 'debug',
		})

		const optimisticClient = handler._.optimisticClient
		const txPool = await optimisticClient.transport.tevm.getTxPool()

		// Add a pending transaction to the optimistic client
		const newRecord = Object.values(state.records.app.TestTable)[10]!
		await optimisticClient.tevmContract({
			// @ts-expect-error - cannot type args
			...testContract.write.set(...Object.values(newRecord)),
			addToMempool: true,
		})

		expect(txPool.txsInPool).toBe(1)

		// Get optimistic state - should include pending changes
		const optimisticState = handler.getOptimisticState()
		const canonicalState = stash.get()

		// States should be different due to pending transaction
		expect(optimisticState).not.toEqual(canonicalState)
		expect(optimisticState.config).toEqual(canonicalState.config)
	})

	// TODO: Fix block with hash does not exist error
	it.todo('should handle subscription to optimistic state changes', async () => {
		const handler = createOptimisticHandler({
			client: sessionClient,
			storeAddress: testContract.address,
			stash,
			config,
		})

		let notificationCount = 0
		const unsubscribe = handler.subscribeOptimisticState({
			subscriber: () => {
				notificationCount++
			},
		})

		// Add a pending transaction to trigger notification
		const optimisticClient = handler._.optimisticClient
		const newRecord = Object.values(state.records.app.TestTable)[10]!

		await optimisticClient.tevmContract({
			// @ts-expect-error - cannot type args
			...testContract.write.set(...Object.values(newRecord)),
			addToMempool: true,
		})

		// Give some time for async notification
		await new Promise((resolve) => setTimeout(resolve, 10))
		expect(notificationCount).toBeGreaterThan(0)

		// Cleanup
		unsubscribe()
	})

	// TODO: Fix block with hash does not exist error
	it.todo('should handle transaction status subscriptions', async () => {
		const handler = createOptimisticHandler({
			client: sessionClient,
			storeAddress: testContract.address,
			stash,
			config,
		})

		const statusUpdates: TxStatus[] = []
		const unsubscribe = handler.subscribeTx({
			subscriber: (status) => {
				statusUpdates.push(status)
			},
		})

		expect(typeof unsubscribe).toBe('function')
		expect(statusUpdates).toHaveLength(0)

		const optimisticClient = handler._.optimisticClient
		const newRecord = Object.values(state.records.app.TestTable)[10]!
		await optimisticClient.tevmContract({
			// @ts-expect-error - cannot type args
			...testContract.write.set(...Object.values(newRecord)),
			addToMempool: true,
		})

		await new Promise((resolve) => setTimeout(resolve, 10))
		expect(statusUpdates).toHaveLength(1)
		expect(statusUpdates[0]?.status).toBe('optimistic')

		// Cleanup
		unsubscribe()
	})

	// TODO: Fix block with hash does not exist error
	it.todo('should handle transaction removal from pool', async () => {
		const handler = createOptimisticHandler({
			client: sessionClient,
			storeAddress: testContract.address,
			stash,
			config,
		})

		const optimisticClient = handler._.optimisticClient
		const txPool = await optimisticClient.transport.tevm.getTxPool()

		// Add transaction
		const newRecord = Object.values(state.records.app.TestTable)[10]!
		await optimisticClient.tevmContract({
			// @ts-expect-error - cannot type args
			...testContract.write.set(...Object.values(newRecord)),
			addToMempool: true,
		})

		expect(txPool.txsInPool).toBe(1)

		// Mine the transaction (removes from pool)
		await optimisticClient.tevmMine()

		expect(txPool.txsInPool).toBe(0)

		// Optimistic state should now match canonical state
		const optimisticState = await handler.getOptimisticState()
		const canonicalState = stash.get()
		expect(optimisticState).toEqual(canonicalState)
	})

	it('should cleanup properly', async () => {
		const handler = createOptimisticHandler({
			client: sessionClient,
			storeAddress: testContract.address,
			stash,
			config,
		})

		// Should not throw
		await expect(handler._.cleanup()).resolves.toBeUndefined()
	})

	// TODO: Fix block with hash does not exist error
	it.todo('should handle multiple pending transactions in order', async () => {
		const handler = createOptimisticHandler({
			client: sessionClient,
			storeAddress: testContract.address,
			stash,
			config,
		})

		const optimisticClient = handler._.optimisticClient
		const newRecord = Object.values(state.records.app.TestTable)[10]!

		// Add multiple transactions modifying the same record
		const tx1Values = { ...newRecord, val1: newRecord.val1 + 100n }
		const tx2Values = { ...newRecord, val1: newRecord.val1 + 200n }

		await optimisticClient.tevmContract({
			// @ts-expect-error - cannot type args
			...testContract.write.set(...Object.values(tx1Values)),
			addToMempool: true,
		})

		await optimisticClient.tevmContract({
			// @ts-expect-error - cannot type args
			...testContract.write.set(...Object.values(tx2Values)),
			addToMempool: true,
		})

		const txPool = await optimisticClient.transport.tevm.getTxPool()
		expect(txPool.txsInPool).toBe(2)

		// Get optimistic record - should reflect the last transaction
		const optimisticRecord = await handler.getOptimisticRecord({
			table: config.tables.app__TestTable,
			key: { key1: newRecord.key1, key2: newRecord.key2 },
		})

		expect(optimisticRecord?.val1).toBe(tx2Values.val1)
	})

	it('should throw error when client has no chain', () => {
		const clientWithoutChain = createClient({ transport: createTevmTransport() })

		expect(() => {
			createOptimisticHandler({
				client: clientWithoutChain,
				storeAddress: testContract.address,
				stash,
				config,
			})
		}).toThrow('Client must be connected to a chain')
	})
})
