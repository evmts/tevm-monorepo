// @ts-nocheck
import { createTevmNode } from '@tevm/node'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { callHandler } from '../Call/callHandler.js'
import { mineHandler } from '../Mine/mineHandler.js'
import { ethGetTransactionReceiptHandler } from './ethGetTransactionReceipt.js'

// Mock external dependencies
vi.mock('@tevm/jsonrpc', () => {
	return {
		createJsonRpcFetcher: vi.fn(() => ({
			request: vi.fn(async ({ method, params }) => {
				if (method === 'eth_getTransactionReceipt') {
					if (params[0] === '0x1234567890123456789012345678901234567890123456789012345678901234') {
						return {
							result: {
								hex: '0xblockhash123',
								blockNumber: '0x1',
								cumulativeBlockGasUsed: '0x5208',
								effectiveGasPrice: '0xa',
								from: '0xforkfrom123',
								gasUsed: '0x5208',
								to: '0xforkto123',
								transactionHash: '0x1234567890123456789012345678901234567890123456789012345678901234',
								transactionIndex: '0x0',
								contractAddress: '0xforkcontract123',
								logsBloom: '0xforkbloom',
								blobGasUsed: '0x1000',
								blobGasPrice: '0x500',
								root: '0xforkroot',
								status: '0x1',
								logs: [
									{
										address: '0xforklogaddress',
										blockHash: '0xforkblockhash',
										blockNumber: '0x1',
										data: '0xforkdata',
										logIndex: '0x0',
										removed: false,
										topics: ['0xforktopic1', '0xforktopic2'],
										transactionIndex: '0x0',
										transactionHash: '0x1234567890123456789012345678901234567890123456789012345678901234',
									},
								],
							},
						}
					}
					return { result: null }
				}
				return { result: null }
			}),
		})),
	}
})

describe('ethGetTransactionReceiptHandler', () => {
	// These tests use real client/functions
	it('should return the transaction receipt if found', async () => {
		const client = createTevmNode()
		const to = `0x${'69'.repeat(20)}` as const

		// Send a transaction
		const callResult = await callHandler(client)({
			createTransaction: true,
			to,
			value: 420n,
			skipBalance: true,
		})

		// Mine a block to include the transaction
		await mineHandler(client)({})

		const handler = ethGetTransactionReceiptHandler(client)
		const receipt = await handler({ hash: callResult.txHash })

		expect(receipt?.transactionHash).toEqual(callResult.txHash)
		expect(receipt).toMatchObject({
			blockHash: expect.stringMatching(/^0x[a-fA-F0-9]{64}$/),
			blockNumber: BigInt(1),
			transactionHash: callResult.txHash,
			transactionIndex: 0,
			from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
			to: '0x6969696969696969696969696969696969696969',
			cumulativeGasUsed: expect.any(BigInt),
			gasUsed: expect.any(BigInt),
			contractAddress: null,
			logs: expect.any(Array),
			logsBloom: expect.any(String),
			status: '0x1',
		})
	})

	it('should return null if the transaction receipt is not found', async () => {
		const client = createTevmNode()

		// Mine a block without any transactions
		await mineHandler(client)({})

		const handler = ethGetTransactionReceiptHandler(client)
		const receipt = await handler({ hash: '0x5e5b342fae6b13548e62c3038078915397ebd2406a8c67afd276e8dc84ebba80' })

		expect(receipt).toBeNull()
	})

	// The rest of the tests use mocked clients/dependencies
	describe('with mocked dependencies', () => {
		let client: any
		let vm: any
		let receiptsManager: any

		beforeEach(() => {
			client = {
				getVm: vi.fn(),
				getReceiptsManager: vi.fn(),
				forkTransport: null,
			}

			// Mock VM methods
			vm = {
				blockchain: {
					getBlock: vi.fn(),
				},
				stateManager: {
					setStateRoot: vi.fn(),
				},
				runBlock: vi.fn(),
				deepCopy: vi.fn().mockReturnThis(),
				common: {
					ethjsCommon: {
						setHardfork: vi.fn(),
					},
				},
			}

			// Mock receiptsManager
			receiptsManager = {
				getReceiptByTxHash: vi.fn(),
			}

			// Setup mocks for client
			client.getVm.mockResolvedValue(vm)
			client.getReceiptsManager.mockResolvedValue(receiptsManager)
		})

		it('should return receipt from fork when local receipt not found', async () => {
			// Set up client with fork transport
			client.forkTransport = {}

			// Set up receiptsManager to return null (not found)
			receiptsManager.getReceiptByTxHash.mockResolvedValue(null)

			const handler = ethGetTransactionReceiptHandler(client)
			const receipt = await handler({ hash: '0x1234567890123456789012345678901234567890123456789012345678901234' })

			// Verify receipt from fork
			expect(receipt).toMatchObject({
				blockHash: '0xblockhash123',
				blockNumber: expect.any(BigInt),
				transactionHash: '0x1234567890123456789012345678901234567890123456789012345678901234',
				from: '0xforkfrom123',
				to: '0xforkto123',
				contractAddress: '0xforkcontract123',
				logsBloom: '0xforkbloom',
				blobGasUsed: expect.any(BigInt),
				blobGasPrice: expect.any(BigInt),
				root: '0xforkroot',
				status: '0x1',
			})

			expect(receipt.logs[0]).toMatchObject({
				address: '0xforklogaddress',
				blockHash: '0xforkblockhash',
				topics: ['0xforktopic1', '0xforktopic2'],
			})
		})

		it('should return null if receipt not found locally or in fork', async () => {
			// Set up client with fork transport
			client.forkTransport = {}

			// Set up receiptsManager to return null (not found)
			receiptsManager.getReceiptByTxHash.mockResolvedValue(null)

			const handler = ethGetTransactionReceiptHandler(client)
			const receipt = await handler({ hash: '0x0000000000000000000000000000000000000000000000000000000000000abc' })

			expect(receipt).toBeNull()
		})

		it('should throw error if transaction exists in block but not found', async () => {
			const mockBlockHash = new Uint8Array([1, 2, 3])
			const mockTxIndex = 0
			const mockLogIndex = 0
			const mockReceipt = { logs: [], bitvector: new Uint8Array([0]), cumulativeBlockGasUsed: 100n }

			// Mock receiptsManager to return a receipt
			receiptsManager.getReceiptByTxHash.mockResolvedValue([mockReceipt, mockBlockHash, mockTxIndex, mockLogIndex])

			// Mock blockchain to return blocks
			const mockBlock = {
				hash: () => mockBlockHash,
				header: {
					number: 1n,
					parentHash: new Uint8Array([4, 5, 6]),
					baseFeePerGas: 10n,
				},
				transactions: [], // Empty transactions array to trigger error
			}

			vm.blockchain.getBlock.mockImplementation(async (hashOrNumber) => {
				if (Array.isArray(hashOrNumber) && hashOrNumber[0] === 1 && hashOrNumber[1] === 2 && hashOrNumber[2] === 3) {
					return mockBlock
				}
				if (hashOrNumber === 1n) {
					return mockBlock
				}
				if (Array.isArray(hashOrNumber) && hashOrNumber[0] === 4) {
					return {
						header: {
							stateRoot: new Uint8Array([7, 8, 9]),
						},
					}
				}
				return mockBlock
			})

			const handler = ethGetTransactionReceiptHandler(client)

			// Should throw error about no tx found
			await expect(
				handler({ hash: '0x0000000000000000000000000000000000000000000000000000000000000123' }),
			).rejects.toMatchObject({
				code: -32602,
				message: 'No tx found',
			})
		})

		it('should handle non-canonical blocks correctly', async () => {
			const mockBlockHash = new Uint8Array([1, 2, 3])
			const mockTxIndex = 0
			const mockLogIndex = 0
			const mockReceipt = { logs: [], bitvector: new Uint8Array([0]), cumulativeBlockGasUsed: 100n }

			// Mock receiptsManager to return a receipt
			receiptsManager.getReceiptByTxHash.mockResolvedValue([mockReceipt, mockBlockHash, mockTxIndex, mockLogIndex])

			// Mock blockchain to return different block hashes for the same block number
			// This simulates a non-canonical block
			const mockBlock = {
				hash: () => mockBlockHash,
				header: {
					number: 1n,
					parentHash: new Uint8Array([4, 5, 6]),
				},
				transactions: [],
			}

			const mockCanonicalBlock = {
				hash: () => new Uint8Array([9, 9, 9]), // Different hash
				header: {
					number: 1n,
				},
			}

			vm.blockchain.getBlock.mockImplementation(async (hashOrNumber) => {
				if (Array.isArray(hashOrNumber) && hashOrNumber[0] === 1 && hashOrNumber[1] === 2 && hashOrNumber[2] === 3) {
					return mockBlock
				}
				if (hashOrNumber === 1n) {
					return mockCanonicalBlock // Different block for the same number
				}
				return mockBlock
			})

			const handler = ethGetTransactionReceiptHandler(client)
			const receipt = await handler({ hash: '0x0000000000000000000000000000000000000000000000000000000000000234' })

			// Should return null for non-canonical block
			expect(receipt).toBeNull()
		})

		it('should handle different tx types correctly for gas price calculation', async () => {
			const mockBlockHash = new Uint8Array([1, 2, 3])
			const mockTxIndex = 0
			const mockLogIndex = 0
			const mockReceipt = {
				logs: [],
				bitvector: new Uint8Array([0]),
				cumulativeBlockGasUsed: 100n,
				stateRoot: new Uint8Array([7, 8, 9]),
				status: new Uint8Array([1]),
			}

			// Mock receiptsManager to return a receipt
			receiptsManager.getReceiptByTxHash.mockResolvedValue([mockReceipt, mockBlockHash, mockTxIndex, mockLogIndex])

			// Create a mock transaction with maxPriorityFeePerGas < maxFeePerGas - baseFeePerGas
			const mockTx = {
				maxPriorityFeePerGas: 5n,
				maxFeePerGas: 20n,
				to: { toString: () => '0x1234' },
				getSenderAddress: () => ({ toString: () => '0xsender' }),
				hash: () => new Uint8Array([1, 2, 3, 4]),
				common: {
					hardfork: () => 'london',
				},
			}

			// Mock block with transaction
			const mockBlock = {
				hash: () => mockBlockHash,
				header: {
					number: 1n,
					parentHash: new Uint8Array([4, 5, 6]),
					baseFeePerGas: 10n,
					stateRoot: new Uint8Array([7, 8, 9]),
				},
				transactions: [mockTx],
			}

			// Mock parent block
			const mockParentBlock = {
				header: {
					stateRoot: new Uint8Array([7, 8, 9]),
				},
			}

			vm.blockchain.getBlock.mockImplementation(async (hashOrNumber) => {
				if (Array.isArray(hashOrNumber) && hashOrNumber[0] === 1 && hashOrNumber[1] === 2 && hashOrNumber[2] === 3) {
					return mockBlock
				}
				if (hashOrNumber === 1n) {
					return mockBlock
				}
				if (Array.isArray(hashOrNumber) && hashOrNumber[0] === 4) {
					return mockParentBlock
				}
				return mockBlock
			})

			// Mock runBlock result
			vm.runBlock.mockResolvedValue({
				results: [
					{
						totalGasSpent: 21000n,
						createdAddress: { toString: () => '0xcreated' },
					},
				],
				receipts: [
					{
						blobGasPrice: 10n,
						blobGasUsed: 20n,
					},
				],
			})

			const handler = ethGetTransactionReceiptHandler(client)
			const receipt = await handler({ hash: '0x0000000000000000000000000000000000000000000000000000000000000345' })

			// Should return proper receipt with calculated effective gas price
			expect(receipt).toBeDefined()
			expect(receipt.effectiveGasPrice).toBe(5n)
			expect(receipt.blobGasPrice).toBe(10n)
			expect(receipt.blobGasUsed).toBe(20n)
			expect(receipt.contractAddress).toBe('0xcreated')
			expect(receipt.root).toBe('0x070809')
			// Comparing bytesToHex result directly
			expect(receipt.status).toBeDefined()
		})

		it('should throw error if no result for transaction', async () => {
			const mockBlockHash = new Uint8Array([1, 2, 3])
			const mockTxIndex = 0
			const mockLogIndex = 0
			const mockReceipt = { logs: [], bitvector: new Uint8Array([0]), cumulativeBlockGasUsed: 100n }

			// Mock receiptsManager to return a receipt
			receiptsManager.getReceiptByTxHash.mockResolvedValue([mockReceipt, mockBlockHash, mockTxIndex, mockLogIndex])

			// Mock tx
			const mockTx = {
				maxPriorityFeePerGas: 5n,
				maxFeePerGas: 20n,
				to: { toString: () => '0x1234' },
				getSenderAddress: () => ({ toString: () => '0xsender' }),
				hash: () => new Uint8Array([1, 2, 3, 4]),
				common: {
					hardfork: () => 'london',
				},
			}

			// Mock block
			const mockBlock = {
				hash: () => mockBlockHash,
				header: {
					number: 1n,
					parentHash: new Uint8Array([4, 5, 6]),
					baseFeePerGas: 10n,
				},
				transactions: [mockTx],
			}

			// Mock parent block
			const mockParentBlock = {
				header: {
					stateRoot: new Uint8Array([7, 8, 9]),
				},
			}

			vm.blockchain.getBlock.mockImplementation(async (hashOrNumber) => {
				if (Array.isArray(hashOrNumber) && hashOrNumber[0] === 1 && hashOrNumber[1] === 2 && hashOrNumber[2] === 3) {
					return mockBlock
				}
				if (hashOrNumber === 1n) {
					return mockBlock
				}
				if (Array.isArray(hashOrNumber) && hashOrNumber[0] === 4) {
					return mockParentBlock
				}
				return mockBlock
			})

			// Mock runBlock result with no results for the transaction
			vm.runBlock.mockResolvedValue({
				results: [], // Empty results
				receipts: [],
			})

			const handler = ethGetTransactionReceiptHandler(client)

			// Should throw error about no result for tx
			await expect(
				handler({ hash: '0x0000000000000000000000000000000000000000000000000000000000000456' }),
			).rejects.toThrow('No result for tx')
		})

		it('should handle maxPriorityFeePerGas >= maxFeePerGas - baseFeePerGas case', async () => {
			const mockBlockHash = new Uint8Array([1, 2, 3])
			const mockTxIndex = 0
			const mockLogIndex = 0
			const mockReceipt = { logs: [], bitvector: new Uint8Array([0]), cumulativeBlockGasUsed: 100n }

			// Mock receiptsManager to return a receipt
			receiptsManager.getReceiptByTxHash.mockResolvedValue([mockReceipt, mockBlockHash, mockTxIndex, mockLogIndex])

			// Create a mock transaction with maxPriorityFeePerGas >= maxFeePerGas - baseFeePerGas
			const mockTx = {
				maxPriorityFeePerGas: 15n, // Higher than maxFee - baseFee (20 - 10 = 10)
				maxFeePerGas: 20n,
				to: { toString: () => '0x1234' },
				getSenderAddress: () => ({ toString: () => '0xsender' }),
				hash: () => new Uint8Array([1, 2, 3, 4]),
				common: {
					hardfork: () => 'london',
				},
			}

			// Mock block with transaction
			const mockBlock = {
				hash: () => mockBlockHash,
				header: {
					number: 1n,
					parentHash: new Uint8Array([4, 5, 6]),
					baseFeePerGas: 10n,
					stateRoot: new Uint8Array([7, 8, 9]),
				},
				transactions: [mockTx],
			}

			// Mock parent block
			const mockParentBlock = {
				header: {
					stateRoot: new Uint8Array([7, 8, 9]),
				},
			}

			vm.blockchain.getBlock.mockImplementation(async (hashOrNumber) => {
				if (Array.isArray(hashOrNumber) && hashOrNumber[0] === 1 && hashOrNumber[1] === 2 && hashOrNumber[2] === 3) {
					return mockBlock
				}
				if (hashOrNumber === 1n) {
					return mockBlock
				}
				if (Array.isArray(hashOrNumber) && hashOrNumber[0] === 4) {
					return mockParentBlock
				}
				return mockBlock
			})

			// Mock runBlock result
			vm.runBlock.mockResolvedValue({
				results: [
					{
						totalGasSpent: 21000n,
						createdAddress: null,
					},
				],
				receipts: [{}],
			})

			const handler = ethGetTransactionReceiptHandler(client)
			const receipt = await handler({ hash: '0x0000000000000000000000000000000000000000000000000000000000000567' })

			// Should use maxFeePerGas - baseFeePerGas + baseFeePerGas = maxFeePerGas
			expect(receipt).toBeDefined()
			expect(receipt.effectiveGasPrice).toBe(20n)
			expect(receipt.contractAddress).toBeNull()
		})

		it('should correctly handle a transaction with null to address (contract creation)', async () => {
			const mockBlockHash = new Uint8Array([1, 2, 3])
			const mockTxIndex = 0
			const mockLogIndex = 0
			const mockReceipt = { logs: [], bitvector: new Uint8Array([0]), cumulativeBlockGasUsed: 100n }

			// Mock receiptsManager to return a receipt
			receiptsManager.getReceiptByTxHash.mockResolvedValue([mockReceipt, mockBlockHash, mockTxIndex, mockLogIndex])

			// Create a mock transaction with null to (contract creation)
			const mockTx = {
				maxPriorityFeePerGas: 5n,
				maxFeePerGas: 20n,
				to: null, // Contract creation
				getSenderAddress: () => ({ toString: () => '0xsender' }),
				hash: () => new Uint8Array([1, 2, 3, 4]),
				common: {
					hardfork: () => 'london',
				},
			}

			// Mock block with transaction
			const mockBlock = {
				hash: () => mockBlockHash,
				header: {
					number: 1n,
					parentHash: new Uint8Array([4, 5, 6]),
					baseFeePerGas: 10n,
				},
				transactions: [mockTx],
			}

			// Mock parent block
			const mockParentBlock = {
				header: {
					stateRoot: new Uint8Array([7, 8, 9]),
				},
			}

			vm.blockchain.getBlock.mockImplementation(async (hashOrNumber) => {
				if (Array.isArray(hashOrNumber) && hashOrNumber[0] === 1 && hashOrNumber[1] === 2 && hashOrNumber[2] === 3) {
					return mockBlock
				}
				if (hashOrNumber === 1n) {
					return mockBlock
				}
				if (Array.isArray(hashOrNumber) && hashOrNumber[0] === 4) {
					return mockParentBlock
				}
				return mockBlock
			})

			// Mock runBlock result with createdAddress
			vm.runBlock.mockResolvedValue({
				results: [
					{
						totalGasSpent: 21000n,
						createdAddress: { toString: () => '0xnewcontract' },
					},
				],
				receipts: [{}],
			})

			const handler = ethGetTransactionReceiptHandler(client)
			const receipt = await handler({ hash: '0x0000000000000000000000000000000000000000000000000000000000000678' })

			// Should return receipt with to as null and contractAddress set
			expect(receipt).toBeDefined()
			expect(receipt.to).toBeNull()
			expect(receipt.contractAddress).toBe('0xnewcontract')
		})
	})
})
