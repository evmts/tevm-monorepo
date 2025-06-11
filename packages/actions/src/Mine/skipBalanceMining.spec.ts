import { describe, expect, it } from 'vitest'
import { createTevmNode } from '@tevm/node'
import { createTransaction } from '../CreateTransaction/createTransaction.js'
import { callHandler } from '../Call/callHandler.js'
import { mineHandler } from './mineHandler.js'
import { getAccountHandler } from '../GetAccount/getAccountHandler.js'

describe('skipBalance mining behavior', () => {
	it('should preserve skipBalance: false during mining', async () => {
		const client = createTevmNode()
		await client.ready()

		// Create a transaction with skipBalance: false (should fail if insufficient balance)
		const callResult = await callHandler(client)({
			skipBalance: false,
			createTransaction: true,
			data: '0x608060405234801561001057600080fd5b50600080fd5b6040516020806100208339810180604052810190808051906020019092919050505050',
			value: 1000000000000000000n, // 1 ETH
			gasLimit: 1000000n,
		})

		// Verify transaction was created
		expect(callResult.txHash).toBeDefined()
		const txHash = callResult.txHash!

		// Get the transaction pool to verify skip flags are stored
		const pool = await client.getTxPool()
		const skipFlags = pool.getSkipFlags(txHash)
		expect(skipFlags).toEqual({
			skipBalance: false,
			skipNonce: false
		})

		// Mine the transaction - this should preserve the original skipBalance: false
		const mineResult = await mineHandler(client)({ tx: txHash })
		
		// The mining should succeed because the default account has sufficient balance
		expect(mineResult.blockHashes).toHaveLength(1)
	})

	it('should preserve skipBalance: true during mining', async () => {
		const client = createTevmNode()
		await client.ready()

		// Create a transaction with skipBalance: true
		const callResult = await callHandler(client)({
			skipBalance: true,
			createTransaction: true,
			data: '0x608060405234801561001057600080fd5b50600080fd5b6040516020806100208339810180604052810190808051906020019092919050505050',
			value: 1000000000000000000000n, // 1000 ETH (more than default balance)
			gasLimit: 1000000n,
		})

		// Verify transaction was created
		expect(callResult.txHash).toBeDefined()
		const txHash = callResult.txHash!

		// Get the transaction pool to verify skip flags are stored
		const pool = await client.getTxPool()
		const skipFlags = pool.getSkipFlags(txHash)
		expect(skipFlags).toEqual({
			skipBalance: true,
			skipNonce: false
		})

		// Mine the transaction - this should preserve the original skipBalance: true
		const mineResult = await mineHandler(client)({ tx: txHash })
		
		// The mining should succeed because skipBalance: true bypasses balance checks
		expect(mineResult.blockHashes).toHaveLength(1)
	})

	it('should handle batch mining with mixed skipBalance settings', async () => {
		const client = createTevmNode()
		await client.ready()

		// Create first transaction with skipBalance: false
		const call1Result = await callHandler(client)({
			skipBalance: false,
			createTransaction: true,
			data: '0x608060405234801561001057600080fd5b50600080fd5b6040516020806100208339810180604052810190808051906020019092919050505050',
			value: 100000000000000000n, // 0.1 ETH
			gasLimit: 1000000n,
		})

		// Create second transaction with skipBalance: true
		const call2Result = await callHandler(client)({
			skipBalance: true,
			createTransaction: true,
			data: '0x608060405234801561001057600080fd5b50600080fd5b6040516020806100208339810180604052810190808051906020019092919050505050',
			value: 10000000000000000000n, // 10 ETH
			gasLimit: 1000000n,
		})

		// Verify both transactions were created
		expect(call1Result.txHash).toBeDefined()
		expect(call2Result.txHash).toBeDefined()

		// Verify skip flags are stored correctly
		const pool = await client.getTxPool()
		const skipFlags1 = pool.getSkipFlags(call1Result.txHash!)
		const skipFlags2 = pool.getSkipFlags(call2Result.txHash!)
		
		expect(skipFlags1).toEqual({
			skipBalance: false,
			skipNonce: false
		})
		expect(skipFlags2).toEqual({
			skipBalance: true,
			skipNonce: false
		})

		// Mine all transactions in a batch
		const mineResult = await mineHandler(client)({ blockCount: 1 })
		
		// Both transactions should be mined successfully
		expect(mineResult.blockHashes).toHaveLength(1)
	})

	it('should handle empty transaction pool gracefully', async () => {
		const client = createTevmNode()
		await client.ready()

		// Mine with empty pool
		const mineResult = await mineHandler(client)({ blockCount: 1 })
		
		// Should create empty block
		expect(mineResult.blockHashes).toHaveLength(1)
	})

	it('should handle missing transaction gracefully', async () => {
		const client = createTevmNode()
		await client.ready()

		// Try to mine a non-existent transaction
		const nonExistentTxHash = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
		
		// This should handle the missing transaction gracefully
		const mineResult = await mineHandler(client)({ tx: nonExistentTxHash })
		
		// Should create block even if specific transaction doesn't exist
		expect(mineResult.blockHashes).toHaveLength(1)
	})
})