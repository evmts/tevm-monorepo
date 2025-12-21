import { SimpleContract } from '@tevm/contract'
import { createTevmNode, type TevmNode } from '@tevm/node'
import { assert, beforeEach, describe, expect, it } from 'vitest'
import { deployHandler } from '../Deploy/deployHandler.js'
import { contractHandler } from '../Contract/contractHandler.js'
import { mineHandler } from '../Mine/mineHandler.js'
import { debugGetRawTransactionJsonRpcProcedure } from './debugGetRawTransactionProcedure.js'

let node: TevmNode

beforeEach(async () => {
	node = createTevmNode()
})

describe('debugGetRawTransactionJsonRpcProcedure', () => {
	it('should return error when transaction hash is missing', async () => {
		const procedure = debugGetRawTransactionJsonRpcProcedure(node)

		const response = await procedure({
			jsonrpc: '2.0',
			id: 1,
			method: 'debug_getRawTransaction',
			params: [],
		})

		expect(response).toMatchObject({
			jsonrpc: '2.0',
			id: 1,
			method: 'debug_getRawTransaction',
		})

		expect(response.error).toBeDefined()
		expect(response.error.code).toBe(-32602)
		expect(response.error.message).toContain('transaction hash is required')
	})

	it('should return error for non-existent transaction', async () => {
		const procedure = debugGetRawTransactionJsonRpcProcedure(node)
		const fakeTxHash = '0x' + '1'.repeat(64)

		const response = await procedure({
			jsonrpc: '2.0',
			id: 1,
			method: 'debug_getRawTransaction',
			params: [fakeTxHash],
		})

		expect(response).toMatchObject({
			jsonrpc: '2.0',
			id: 1,
			method: 'debug_getRawTransaction',
		})

		expect(response.error).toBeDefined()
		expect(response.error.code).toBe(-32603)
	})

	it('should return raw transaction for existing transaction', async () => {
		const procedure = debugGetRawTransactionJsonRpcProcedure(node)

		// Deploy a contract to get a transaction
		const { createdAddress } = await deployHandler(node)({
			addToBlockchain: true,
			...SimpleContract.deploy(1n),
		})
		assert(createdAddress, 'Contract deployment failed')
		const contract = SimpleContract.withAddress(createdAddress)

		// Execute a contract call that adds to mempool
		const { txHash } = await contractHandler(node)({
			addToMempool: true,
			...contract.write.set(42n),
		})
		assert(txHash, 'Transaction failed')

		// Mine the transaction
		await mineHandler(node)({})

		const response = await procedure({
			jsonrpc: '2.0',
			id: 1,
			method: 'debug_getRawTransaction',
			params: [txHash],
		})

		expect(response).toMatchObject({
			jsonrpc: '2.0',
			id: 1,
			method: 'debug_getRawTransaction',
		})

		expect(response.result).toBeDefined()
		expect(typeof response.result).toBe('string')
		expect(response.result).toMatch(/^0x/)

		// Verify the result is a valid hex string of reasonable length
		const hexData = response.result.slice(2)
		expect(hexData.length).toBeGreaterThan(0)
		expect(/^[0-9a-f]+$/i.test(hexData)).toBe(true)
	})

	it('should omit id when request has no id', async () => {
		const procedure = debugGetRawTransactionJsonRpcProcedure(node)

		const response = await procedure({
			jsonrpc: '2.0',
			method: 'debug_getRawTransaction',
			params: [],
		})

		expect(response).toMatchObject({
			jsonrpc: '2.0',
			method: 'debug_getRawTransaction',
		})
		expect(response.id).toBeUndefined()
		expect(response.error).toBeDefined()
	})
})
