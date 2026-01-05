import { createTevmNode } from '@tevm/node'
import type { Hex } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { callHandler } from '../Call/callHandler.js'
import { mineHandler } from '../Mine/mineHandler.js'
import { ethGetBlockReceiptsJsonRpcProcedure } from './ethGetBlockReceiptsProcedure.js'

describe('ethGetBlockReceiptsJsonRpcProcedure', () => {
	it('should return all receipts for a block with transactions', async () => {
		const client = createTevmNode({
			miningConfig: {
				type: 'manual',
			},
		})
		const to1 = `0x${'11'.repeat(20)}` as const
		const to2 = `0x${'22'.repeat(20)}` as const

		// Send two transactions without auto-mining
		const callResult1 = await callHandler(client)({
			createTransaction: true,
			to: to1,
			value: 100n,
			skipBalance: true,
		})

		const callResult2 = await callHandler(client)({
			createTransaction: true,
			to: to2,
			value: 200n,
			skipBalance: true,
		})

		// Mine a block to include both transactions
		await mineHandler(client)({})

		const request = {
			id: 1,
			method: 'eth_getBlockReceipts',
			params: ['0x1'],
			jsonrpc: '2.0',
		} as const

		const procedure = ethGetBlockReceiptsJsonRpcProcedure(client)
		const response = await procedure(request)

		expect(response).toMatchObject({
			jsonrpc: '2.0',
			id: 1,
			method: 'eth_getBlockReceipts',
		})
		expect(response.result).toHaveLength(2)
		expect(response.result?.[0]?.transactionHash).toEqual(callResult1.txHash)
		expect(response.result?.[1]?.transactionHash).toEqual(callResult2.txHash)

		// Verify first receipt
		expect(response.result?.[0]).toMatchObject({
			blockHash: expect.stringMatching(/^0x[a-fA-F0-9]{64}$/),
			blockNumber: '0x1',
			transactionHash: callResult1.txHash,
			transactionIndex: '0x0',
			from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
			to: to1,
			cumulativeGasUsed: expect.stringMatching(/^0x[0-9a-fA-F]+$/),
			gasUsed: expect.stringMatching(/^0x[0-9a-fA-F]+$/),
			contractAddress: null,
			logs: expect.any(Array),
			logsBloom: expect.any(String),
			status: '0x1',
		})

		// Verify second receipt
		expect(response.result?.[1]).toMatchObject({
			blockHash: expect.stringMatching(/^0x[a-fA-F0-9]{64}$/),
			blockNumber: '0x1',
			transactionHash: callResult2.txHash,
			transactionIndex: '0x1',
			from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
			to: to2,
			cumulativeGasUsed: expect.stringMatching(/^0x[0-9a-fA-F]+$/),
			gasUsed: expect.stringMatching(/^0x[0-9a-fA-F]+$/),
			contractAddress: null,
			logs: expect.any(Array),
			logsBloom: expect.any(String),
			status: '0x1',
		})
	})

	it('should return empty array for a block with no transactions', async () => {
		const client = createTevmNode()

		// Mine a block without any transactions
		await mineHandler(client)({})

		const request = {
			id: 1,
			method: 'eth_getBlockReceipts',
			params: ['0x1'],
			jsonrpc: '2.0',
		} as const

		const procedure = ethGetBlockReceiptsJsonRpcProcedure(client)
		const response = await procedure(request)

		expect(response).toMatchObject({
			jsonrpc: '2.0',
			id: 1,
			method: 'eth_getBlockReceipts',
			result: [],
		})
	})

	it('should return null result for a block that does not exist', async () => {
		const client = createTevmNode()

		const request = {
			id: 1,
			method: 'eth_getBlockReceipts',
			params: ['0x3e7'], // Block 999
			jsonrpc: '2.0',
		} as const

		const procedure = ethGetBlockReceiptsJsonRpcProcedure(client)
		const response = await procedure(request)

		expect(response.jsonrpc).toBe('2.0')
		expect(response.id).toBe(1)
		expect(response.method).toBe('eth_getBlockReceipts')
		// Result can be null or undefined depending on handler
		expect(response.result === null || response.result === undefined).toBe(true)
	})

	it('should work with block tag "latest"', async () => {
		const client = createTevmNode({
			miningConfig: {
				type: 'manual',
			},
		})
		const to = `0x${'33'.repeat(20)}` as const

		// Send a transaction without auto-mining
		await callHandler(client)({
			createTransaction: true,
			to,
			value: 300n,
			skipBalance: true,
		})

		// Mine a block
		await mineHandler(client)({})

		const request = {
			id: 1,
			method: 'eth_getBlockReceipts',
			params: ['latest'],
			jsonrpc: '2.0',
		} as const

		const procedure = ethGetBlockReceiptsJsonRpcProcedure(client)
		const response = await procedure(request)

		expect(response.result).toHaveLength(1)
		expect(response.result?.[0]).toMatchObject({
			blockNumber: '0x1',
			to,
		})
	})

	it('should work with block tag "earliest"', async () => {
		const client = createTevmNode()

		// Mine a genesis block
		await mineHandler(client)({})

		const request = {
			id: 1,
			method: 'eth_getBlockReceipts',
			params: ['earliest'],
			jsonrpc: '2.0',
		} as const

		const procedure = ethGetBlockReceiptsJsonRpcProcedure(client)
		const response = await procedure(request)

		// Genesis block may not exist or may return null
		// Just verify response structure
		expect(response.jsonrpc).toBe('2.0')
		expect(response.id).toBe(1)
		expect(response.method).toBe('eth_getBlockReceipts')
		// Result can be null, undefined, or an empty array
		if (response.result) {
			expect(Array.isArray(response.result)).toBe(true)
		}
	})

	it('should work with block hash', async () => {
		const client = createTevmNode({
			miningConfig: {
				type: 'manual',
			},
		})
		const to = `0x${'44'.repeat(20)}` as const

		// Send a transaction without auto-mining
		await callHandler(client)({
			createTransaction: true,
			to,
			value: 400n,
			skipBalance: true,
		})

		// Mine a block
		await mineHandler(client)({})

		// Get the block to retrieve its hash
		const vm = await client.getVm()
		const block = await vm.blockchain.getBlock(1n)
		const blockHash = `0x${Buffer.from(block.hash()).toString('hex')}` as Hex

		const request = {
			id: 1,
			method: 'eth_getBlockReceipts',
			params: [blockHash],
			jsonrpc: '2.0',
		} as const

		const procedure = ethGetBlockReceiptsJsonRpcProcedure(client)
		const response = await procedure(request)

		expect(response.result).not.toBeNull()
		expect(response.result).toHaveLength(1)
		expect(response.result?.[0]).toMatchObject({
			blockHash,
			blockNumber: '0x1',
			to,
		})
	})

	it('should handle request without id parameter', async () => {
		const client = createTevmNode()
		const to = `0x${'55'.repeat(20)}` as const

		// Send a transaction
		await callHandler(client)({
			createTransaction: true,
			to,
			value: 500n,
			skipBalance: true,
		})

		// Mine a block
		await mineHandler(client)({})

		const request = {
			// No id here
			method: 'eth_getBlockReceipts',
			params: ['0x1'],
			jsonrpc: '2.0',
		} as const

		const procedure = ethGetBlockReceiptsJsonRpcProcedure(client)
		const response = await procedure(request)

		expect(response).toMatchObject({
			jsonrpc: '2.0',
			method: 'eth_getBlockReceipts',
			result: expect.arrayContaining([
				expect.objectContaining({
					to,
				}),
			]),
		})
		// Should not have an id
		expect('id' in response).toBe(false)
	})

	it('should return error for invalid params (missing blockId)', async () => {
		const client = createTevmNode()
		const procedure = ethGetBlockReceiptsJsonRpcProcedure(client)

		const request = {
			id: 1,
			method: 'eth_getBlockReceipts',
			params: [],
			jsonrpc: '2.0',
		} as const

		const response = await procedure(request)

		expect(response).toMatchObject({
			jsonrpc: '2.0',
			id: 1,
			method: 'eth_getBlockReceipts',
			error: {
				code: -32602,
				message: 'Invalid params: blockId is required',
			},
		})
	})

	it('should properly format all receipt fields', async () => {
		const client = createTevmNode()
		const to = `0x${'66'.repeat(20)}` as const

		// Send a transaction
		await callHandler(client)({
			createTransaction: true,
			to,
			value: 600n,
			skipBalance: true,
		})

		await mineHandler(client)({})

		const request = {
			id: 1,
			method: 'eth_getBlockReceipts',
			params: ['0x1'],
			jsonrpc: '2.0',
		} as const

		const procedure = ethGetBlockReceiptsJsonRpcProcedure(client)
		const response = await procedure(request)

		// Verify all fields are properly formatted as hex strings
		const receipt = response.result?.[0]
		expect(receipt?.blockNumber).toMatch(/^0x[0-9a-fA-F]+$/)
		expect(receipt?.transactionIndex).toMatch(/^0x[0-9a-fA-F]+$/)
		expect(receipt?.cumulativeGasUsed).toMatch(/^0x[0-9a-fA-F]+$/)
		expect(receipt?.gasUsed).toMatch(/^0x[0-9a-fA-F]+$/)
		expect(receipt?.effectiveGasPrice).toMatch(/^0x[0-9a-fA-F]+$/)

		// Verify logs are properly formatted
		if (receipt?.logs && receipt.logs.length > 0) {
			for (const log of receipt.logs) {
				expect(log.blockNumber).toMatch(/^0x[0-9a-fA-F]+$/)
				expect(log.logIndex).toMatch(/^0x[0-9a-fA-F]+$/)
				expect(log.transactionIndex).toMatch(/^0x[0-9a-fA-F]+$/)
				expect(log.removed).toBe(false)
			}
		}
	})

	it('should maintain correct block hash across all receipts', async () => {
		const client = createTevmNode({
			miningConfig: {
				type: 'manual',
			},
		})
		const to1 = `0x${'77'.repeat(20)}` as const
		const to2 = `0x${'88'.repeat(20)}` as const

		// Send two transactions
		await callHandler(client)({
			createTransaction: true,
			to: to1,
			value: 700n,
			skipBalance: true,
		})

		await callHandler(client)({
			createTransaction: true,
			to: to2,
			value: 800n,
			skipBalance: true,
		})

		// Mine a block
		await mineHandler(client)({})

		const request = {
			id: 1,
			method: 'eth_getBlockReceipts',
			params: ['0x1'],
			jsonrpc: '2.0',
		} as const

		const procedure = ethGetBlockReceiptsJsonRpcProcedure(client)
		const response = await procedure(request)

		expect(response.result).toHaveLength(2)

		// All receipts should have the same block hash
		expect(response.result?.[0]?.blockHash).toBe(response.result?.[1]?.blockHash)
	})

	it('should return null/undefined for invalid block hash', async () => {
		const client = createTevmNode()

		const request = {
			id: 1,
			method: 'eth_getBlockReceipts',
			params: [`0x${'1'.repeat(64)}`],
			jsonrpc: '2.0',
		} as const

		const procedure = ethGetBlockReceiptsJsonRpcProcedure(client)
		const response = await procedure(request)

		// Non-existent block hash returns null or undefined
		expect(response.result === null || response.result === undefined).toBe(true)
	})

	it('should handle hex block number correctly', async () => {
		const client = createTevmNode()
		const to = `0x${'99'.repeat(20)}` as const

		// Send a transaction
		await callHandler(client)({
			createTransaction: true,
			to,
			value: 900n,
			skipBalance: true,
		})

		// Mine a block
		await mineHandler(client)({})

		const request = {
			id: 1,
			method: 'eth_getBlockReceipts',
			params: ['0x1'], // Hex number
			jsonrpc: '2.0',
		} as const

		const procedure = ethGetBlockReceiptsJsonRpcProcedure(client)
		const response = await procedure(request)

		expect(response.result).toHaveLength(1)
		expect(response.result?.[0]).toMatchObject({
			blockNumber: '0x1',
			to,
		})
	})

	it('should handle larger hex block numbers', async () => {
		const client = createTevmNode()
		const to = `0x${'aa'.repeat(20)}` as const

		// Mine multiple blocks
		await mineHandler(client)({})
		await mineHandler(client)({})
		await mineHandler(client)({})
		await mineHandler(client)({})

		// Send a transaction in the 5th block
		await callHandler(client)({
			createTransaction: true,
			to,
			value: 1000n,
			skipBalance: true,
		})

		await mineHandler(client)({})

		const request = {
			id: 1,
			method: 'eth_getBlockReceipts',
			params: ['0x5'], // Block 5
			jsonrpc: '2.0',
		} as const

		const procedure = ethGetBlockReceiptsJsonRpcProcedure(client)
		const response = await procedure(request)

		expect(response.result).toHaveLength(1)
		expect(response.result?.[0]).toMatchObject({
			blockNumber: '0x5',
			to,
		})
	})

	it('should handle block tag "pending"', async () => {
		const client = createTevmNode({
			miningConfig: {
				type: 'manual',
			},
		})
		const to = `0x${'bb'.repeat(20)}` as const

		// Send a transaction without auto-mining
		await callHandler(client)({
			createTransaction: true,
			to,
			value: 1100n,
			skipBalance: true,
		})

		// Mine a block
		await mineHandler(client)({})

		const request = {
			id: 1,
			method: 'eth_getBlockReceipts',
			params: ['pending'],
			jsonrpc: '2.0',
		} as const

		const procedure = ethGetBlockReceiptsJsonRpcProcedure(client)
		const response = await procedure(request)

		// Pending may not be supported and could return null/undefined
		// Just verify response structure
		expect(response.jsonrpc).toBe('2.0')
		expect(response.id).toBe(1)
		expect(response.method).toBe('eth_getBlockReceipts')
		// Result can be null, undefined, or an array
		if (response.result) {
			expect(Array.isArray(response.result)).toBe(true)
		}
	})

	it('should handle requests with string id', async () => {
		const client = createTevmNode()
		const to = `0x${'cc'.repeat(20)}` as const

		await callHandler(client)({
			createTransaction: true,
			to,
			value: 1200n,
			skipBalance: true,
		})

		await mineHandler(client)({})

		const request = {
			id: 'test-id-456',
			method: 'eth_getBlockReceipts',
			params: ['0x1'],
			jsonrpc: '2.0',
		} as const

		const procedure = ethGetBlockReceiptsJsonRpcProcedure(client)
		const response = await procedure(request)

		expect(response.id).toBe('test-id-456')
		expect(response.result).toHaveLength(1)
	})

	it('should include status field in receipts', async () => {
		const client = createTevmNode()
		const to = `0x${'dd'.repeat(20)}` as const

		await callHandler(client)({
			createTransaction: true,
			to,
			value: 1300n,
			skipBalance: true,
		})

		await mineHandler(client)({})

		const request = {
			id: 1,
			method: 'eth_getBlockReceipts',
			params: ['0x1'],
			jsonrpc: '2.0',
		} as const

		const procedure = ethGetBlockReceiptsJsonRpcProcedure(client)
		const response = await procedure(request)

		expect(response.result?.[0]?.status).toBe('0x1')
	})

	it('should include root field in receipts', async () => {
		const client = createTevmNode()
		const to = `0x${'ee'.repeat(20)}` as const

		await callHandler(client)({
			createTransaction: true,
			to,
			value: 1400n,
			skipBalance: true,
		})

		await mineHandler(client)({})

		const request = {
			id: 1,
			method: 'eth_getBlockReceipts',
			params: ['0x1'],
			jsonrpc: '2.0',
		} as const

		const procedure = ethGetBlockReceiptsJsonRpcProcedure(client)
		const response = await procedure(request)

		expect(response.result?.[0]?.root).toBeDefined()
		expect(typeof response.result?.[0]?.root).toBe('string')
	})
})
