import { createTevmNode } from '@tevm/node'
import { beforeEach, describe, expect, it } from 'vitest'
import { callHandler } from '../Call/callHandler.js'
import { anvilDropAllTransactionsJsonRpcProcedure } from './anvilDropAllTransactionsProcedure.js'

describe('anvilDropAllTransactionsJsonRpcProcedure', () => {
	let node: ReturnType<typeof createTevmNode>

	beforeEach(() => {
		node = createTevmNode()
	})

	it('should successfully drop all transactions from the pool', async () => {
		// Add multiple transactions to the pool
		const to1 = `0x${'69'.repeat(20)}` as const
		const to2 = `0x${'42'.repeat(20)}` as const
		await callHandler(node)({
			createTransaction: true,
			to: to1,
			value: 420n,
			skipBalance: true,
		})
		await callHandler(node)({
			createTransaction: true,
			to: to2,
			value: 123n,
			skipBalance: true,
		})

		// Verify transactions are in the pool
		const txPool = await node.getTxPool()
		expect(txPool.txsInPool).toBe(2)

		const procedure = anvilDropAllTransactionsJsonRpcProcedure(node)
		const result = await procedure({
			method: 'anvil_dropAllTransactions',
			params: [],
			jsonrpc: '2.0',
		})

		expect(result).toEqual({
			method: 'anvil_dropAllTransactions',
			jsonrpc: '2.0',
			result: null,
		})

		// Verify all transactions have been removed
		expect(txPool.txsInPool).toBe(0)
	})

	it('should handle empty pool', async () => {
		const procedure = anvilDropAllTransactionsJsonRpcProcedure(node)
		const result = await procedure({
			method: 'anvil_dropAllTransactions',
			params: [],
			jsonrpc: '2.0',
		})

		expect(result).toEqual({
			method: 'anvil_dropAllTransactions',
			jsonrpc: '2.0',
			result: null,
		})

		// Verify pool is still empty
		const txPool = await node.getTxPool()
		expect(txPool.txsInPool).toBe(0)
	})

	it('should handle requests with id', async () => {
		const procedure = anvilDropAllTransactionsJsonRpcProcedure(node)
		const result = await procedure({
			method: 'anvil_dropAllTransactions',
			params: [],
			jsonrpc: '2.0',
			id: 1,
		})

		expect(result).toEqual({
			method: 'anvil_dropAllTransactions',
			jsonrpc: '2.0',
			result: null,
			id: 1,
		})
	})
})
