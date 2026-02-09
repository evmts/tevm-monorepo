// @ts-nocheck
import { createTevmNode } from '@tevm/node'
import { bytesToHex } from '@tevm/utils'
import { describe, expect, it, vi } from 'vitest'
import { callHandler } from '../Call/callHandler.js'
import { mineHandler } from '../Mine/mineHandler.js'
import { ethGetBlockReceiptsHandler } from './ethGetBlockReceiptsHandler.js'

// Mock external dependencies
vi.mock('@tevm/jsonrpc', () => {
	return {
		createJsonRpcFetcher: vi.fn(() => ({
			request: vi.fn(async ({ method, params }) => {
				if (method === 'eth_getBlockReceipts') {
					if (params[0] === '0x5' || params[0] === '5') {
						return {
							result: [
								{
									blockHash: '0xblockhash123',
									blockNumber: '0x5',
									cumulativeGasUsed: '0x5208',
									effectiveGasPrice: '0xa',
									from: '0xforkfrom1',
									gasUsed: '0x5208',
									to: '0xforkto1',
									transactionHash: '0xtxhash1',
									transactionIndex: '0x0',
									contractAddress: null,
									logsBloom: '0xforkbloom',
									status: '0x1',
									logs: [
										{
											address: '0xforklogaddress1',
											blockHash: '0xforkblockhash',
											blockNumber: '0x5',
											data: '0xforkdata1',
											logIndex: '0x0',
											removed: false,
											topics: ['0xforktopic1'],
											transactionIndex: '0x0',
											transactionHash: '0xtxhash1',
										},
									],
								},
								{
									blockHash: '0xblockhash123',
									blockNumber: '0x5',
									cumulativeGasUsed: '0xa410',
									effectiveGasPrice: '0xa',
									from: '0xforkfrom2',
									gasUsed: '0x5208',
									to: '0xforkto2',
									transactionHash: '0xtxhash2',
									transactionIndex: '0x1',
									contractAddress: null,
									logsBloom: '0xforkbloom',
									status: '0x1',
									logs: [
										{
											address: '0xforklogaddress2',
											blockHash: '0xforkblockhash',
											blockNumber: '0x5',
											data: '0xforkdata2',
											logIndex: '0x1',
											removed: false,
											topics: ['0xforktopic2'],
											transactionIndex: '0x1',
											transactionHash: '0xtxhash2',
										},
									],
								},
							],
						}
					}
					return { result: null }
				}
				return { result: null }
			}),
		})),
	}
})

describe('ethGetBlockReceiptsHandler', () => {
	it('should return all receipts for a block with multiple transactions', async () => {
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

		const handler = ethGetBlockReceiptsHandler(client)
		const receipts = await handler({ blockTag: 1n })

		expect(receipts).toHaveLength(2)
		expect(receipts[0].transactionHash).toEqual(callResult1.txHash)
		expect(receipts[1].transactionHash).toEqual(callResult2.txHash)

		// Verify first receipt
		expect(receipts[0]).toMatchObject({
			blockHash: expect.stringMatching(/^0x[a-fA-F0-9]{64}$/),
			blockNumber: BigInt(1),
			transactionHash: callResult1.txHash,
			transactionIndex: BigInt(0),
			from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
			to: to1,
			cumulativeGasUsed: expect.any(BigInt),
			gasUsed: expect.any(BigInt),
			contractAddress: null,
			logs: expect.any(Array),
			logsBloom: expect.any(String),
			status: '0x1',
		})

		// Verify second receipt
		expect(receipts[1]).toMatchObject({
			blockHash: expect.stringMatching(/^0x[a-fA-F0-9]{64}$/),
			blockNumber: BigInt(1),
			transactionHash: callResult2.txHash,
			transactionIndex: BigInt(1),
			from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
			to: to2,
			cumulativeGasUsed: expect.any(BigInt),
			gasUsed: expect.any(BigInt),
			contractAddress: null,
			logs: expect.any(Array),
			logsBloom: expect.any(String),
			status: '0x1',
		})

		// Verify cumulative gas is monotonically increasing
		expect(receipts[1].cumulativeGasUsed).toBeGreaterThan(receipts[0].cumulativeGasUsed)
	})

	it('should return empty array for a block with no transactions', async () => {
		const client = createTevmNode()

		// Mine a block without any transactions
		await mineHandler(client)({})

		const handler = ethGetBlockReceiptsHandler(client)
		const receipts = await handler({ blockTag: 1n })

		expect(receipts).toEqual([])
	})

	it('should return null for a block that does not exist', async () => {
		const client = createTevmNode()

		const handler = ethGetBlockReceiptsHandler(client)
		const receipts = await handler({ blockTag: 999n })

		expect(receipts).toBeNull()
	})

	it('should work with block tag "latest"', async () => {
		const client = createTevmNode()
		const to = `0x${'33'.repeat(20)}` as const

		// Send a transaction
		await callHandler(client)({
			createTransaction: true,
			to,
			value: 300n,
			skipBalance: true,
		})

		// Mine a block
		await mineHandler(client)({})

		const handler = ethGetBlockReceiptsHandler(client)
		const receipts = await handler({ blockTag: 'latest' })

		expect(receipts).toHaveLength(1)
		expect(receipts[0]).toMatchObject({
			blockNumber: BigInt(1),
			to,
		})
	})

	it('should work with block hash', async () => {
		const client = createTevmNode()
		const to = `0x${'44'.repeat(20)}` as const

		// Send a transaction
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
		const blockHash = bytesToHex(block.hash())

		const handler = ethGetBlockReceiptsHandler(client)
		const receipts = await handler({ blockHash })

		expect(receipts).not.toBeNull()
		expect(receipts).toHaveLength(1)
		expect(receipts?.[0]).toMatchObject({
			blockHash,
			blockNumber: BigInt(1),
			to,
		})
	})

	it('should work with block number as hex string', async () => {
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

		const handler = ethGetBlockReceiptsHandler(client)
		const receipts = await handler({ blockTag: '0x1' })

		expect(receipts).toHaveLength(1)
		expect(receipts[0]).toMatchObject({
			blockNumber: BigInt(1),
			to,
		})
	})

	it('should properly handle log indices across multiple transactions', async () => {
		const client = createTevmNode({
			miningConfig: {
				type: 'manual',
			},
		})

		// Use simple transfers which don't emit logs for simplicity
		const to1 = `0x${'88'.repeat(20)}` as const
		const to2 = `0x${'99'.repeat(20)}` as const

		await callHandler(client)({
			createTransaction: true,
			to: to1,
			value: 100n,
			skipBalance: true,
		})

		await callHandler(client)({
			createTransaction: true,
			to: to2,
			value: 200n,
			skipBalance: true,
		})

		// Mine a block to include both transactions
		await mineHandler(client)({})

		const handler = ethGetBlockReceiptsHandler(client)
		const receipts = await handler({ blockTag: 1n })

		expect(receipts).toHaveLength(2)

		// Verify log indices are properly tracked across transactions
		let totalLogCount = 0
		for (const receipt of receipts) {
			for (let i = 0; i < receipt.logs.length; i++) {
				expect(receipt.logs[i].logIndex).toBe(BigInt(totalLogCount + i))
			}
			totalLogCount += receipt.logs.length
		}
	})

	it('should handle fork transport when block not found locally', async () => {
		const client = createTevmNode()
		;(client as any).forkTransport = { request: async () => null }

		const handler = ethGetBlockReceiptsHandler(client)
		const receipts = await handler({ blockTag: '0x5' })

		expect(receipts).toHaveLength(2)
		expect(receipts[0].from).toBe('0xforkfrom1')
		expect(receipts[1].from).toBe('0xforkfrom2')
	})

	it('should maintain correct block hash across all receipts', async () => {
		const client = createTevmNode({
			miningConfig: {
				type: 'manual',
			},
		})
		const to1 = `0x${'66'.repeat(20)}` as const
		const to2 = `0x${'77'.repeat(20)}` as const

		// Send two transactions
		await callHandler(client)({
			createTransaction: true,
			to: to1,
			value: 600n,
			skipBalance: true,
		})

		await callHandler(client)({
			createTransaction: true,
			to: to2,
			value: 700n,
			skipBalance: true,
		})

		// Mine a block
		await mineHandler(client)({})

		const handler = ethGetBlockReceiptsHandler(client)
		const receipts = await handler({ blockTag: 1n })

		expect(receipts).toHaveLength(2)

		// All receipts should have the same block hash
		expect(receipts[0].blockHash).toBe(receipts[1].blockHash)
	})

	it('should return null for invalid block hash', async () => {
		const client = createTevmNode()

		const handler = ethGetBlockReceiptsHandler(client)
		const receipts = await handler({
			blockHash: `0x${'1'.repeat(64)}`,
		})

		// Non-existent block hash returns null
		expect(receipts).toBeNull()
	})

	it('should handle block tag "earliest"', async () => {
		const client = createTevmNode()

		// Mine a genesis block
		await mineHandler(client)({})

		const handler = ethGetBlockReceiptsHandler(client)
		const receipts = await handler({ blockTag: 'earliest' })

		// Genesis block should have no transactions
		expect(receipts).not.toBeNull()
		expect(receipts).toEqual([])
	})
})
