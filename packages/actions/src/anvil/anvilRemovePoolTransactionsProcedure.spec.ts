import { createTevmNode } from '@tevm/node'
import { beforeEach, describe, expect, it } from 'vitest'
import { callHandler } from '../Call/callHandler.js'
import { anvilRemovePoolTransactionsJsonRpcProcedure } from './anvilRemovePoolTransactionsProcedure.js'

describe('anvilRemovePoolTransactionsJsonRpcProcedure', () => {
	let node: ReturnType<typeof createTevmNode>

	beforeEach(() => {
		node = createTevmNode()
	})

	it('should successfully remove transactions from a specific address', async () => {
		// Add transactions to the pool
		const to = `0x${'69'.repeat(20)}` as const

		// Create first transaction
		const callResult1 = await callHandler(node)({
			createTransaction: true,
			to,
			value: 420n,
			skipBalance: true,
		})
		const tx1Hash = callResult1.txHash

		// Create second transaction from same address
		const callResult2 = await callHandler(node)({
			createTransaction: true,
			to,
			value: 123n,
			skipBalance: true,
		})
		const tx2Hash = callResult2.txHash

		// Verify transactions are in the pool
		const txPool = await node.getTxPool()
		expect(txPool.txsInPool).toBe(2)

		// Get the sender address from the first transaction
		const tx = txPool.getByHash(tx1Hash as string)
		if (!tx) throw new Error('Transaction not found')
		const senderAddress = tx.getSenderAddress().toString()

		const procedure = anvilRemovePoolTransactionsJsonRpcProcedure(node)
		const result = await procedure({
			method: 'anvil_removePoolTransactions',
			params: [senderAddress],
			jsonrpc: '2.0',
		})

		expect(result).toEqual({
			method: 'anvil_removePoolTransactions',
			jsonrpc: '2.0',
			result: null,
		})

		// Verify all transactions from the address have been removed
		expect(txPool.txsInPool).toBe(0)
		expect(txPool.getByHash(tx1Hash as string)).toBeNull()
		expect(txPool.getByHash(tx2Hash as string)).toBeNull()
	})

	it('should handle address with no transactions', async () => {
		const nonExistentAddress = `0x${'42'.repeat(20)}` as const

		const procedure = anvilRemovePoolTransactionsJsonRpcProcedure(node)
		const result = await procedure({
			method: 'anvil_removePoolTransactions',
			params: [nonExistentAddress],
			jsonrpc: '2.0',
		})

		expect(result).toEqual({
			method: 'anvil_removePoolTransactions',
			jsonrpc: '2.0',
			result: null,
		})
	})

	it('should handle requests with id', async () => {
		const address = `0x${'69'.repeat(20)}` as const

		const procedure = anvilRemovePoolTransactionsJsonRpcProcedure(node)
		const result = await procedure({
			method: 'anvil_removePoolTransactions',
			params: [address],
			jsonrpc: '2.0',
			id: 1,
		})

		expect(result).toEqual({
			method: 'anvil_removePoolTransactions',
			jsonrpc: '2.0',
			result: null,
			id: 1,
		})
	})
})
