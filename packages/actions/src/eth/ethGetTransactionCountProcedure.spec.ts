import { createAddress } from '@tevm/address'
import { createTevmNode } from '@tevm/node'
import { transports } from '@tevm/test-utils'
import { PREFUNDED_ACCOUNTS, numberToHex, parseEther } from '@tevm/utils'
import type { Hex } from '@tevm/utils'
import { custom } from 'viem'
import { describe, expect, it, vi } from 'vitest'
import { callHandler } from '../Call/callHandler.js'
import { mineHandler } from '../Mine/mineHandler.js'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import type { BlockTag } from '../common/BlockTag.js'
import { requestProcedure } from '../requestProcedure.js'
import { ethGetTransactionCountProcedure } from './ethGetTransactionCountProcedure.js'

const address = '0xb5d85CBf7cB3EE0D56b3bB207D5Fc4B82f43F511' as const

describe(ethGetTransactionCountProcedure.name, () => {
	it.skip('should work', async () => {
		const forkedNode = createTevmNode()
		const request: any = async (request: any) => {
			const response = await requestProcedure(forkedNode)(request)
			console.log(request, response)
			if (request.error) throw request.error
			return response.result
		}
		const node = createTevmNode({
			fork: {
				transport: custom({ request }),
			},
		})
		expect(
			await ethGetTransactionCountProcedure(node)({
				jsonrpc: '2.0',
				id: 1,
				method: 'eth_getTransactionCount',
				params: [address, 'latest'],
			}),
		).toMatchInlineSnapshot()

		await callHandler(node)({
			from: PREFUNDED_ACCOUNTS[2].address,
			to: PREFUNDED_ACCOUNTS[3].address,
			value: parseEther('1'),
			createTransaction: true,
		})
		await mineHandler(node)()
		expect(
			await ethGetTransactionCountProcedure(node)({
				jsonrpc: '2.0',
				id: 1,
				method: 'eth_getTransactionCount',
				params: [address, 'latest'],
			}),
		).toMatchInlineSnapshot()
	})

	it('should work with past block tags', async () => {
		const node = createTevmNode({
			fork: {
				transport: transports.mainnet,
				blockTag: 21996939n,
			},
		})
		expect(
			await ethGetTransactionCountProcedure(node)({
				jsonrpc: '2.0',
				id: 1,
				method: 'eth_getTransactionCount',
				params: [address, numberToHex(21996939n)],
			}),
		).toMatchInlineSnapshot(`
{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "eth_getTransactionCount",
  "result": "0xa836d8",
}
`)
	})

	it('should work with block hash', async () => {
		const node = createTevmNode({
			fork: {
				transport: transports.mainnet,
				blockTag: 21996939n,
			},
		})

		// Get the block and its hash
		const vm = await node.getVm()
		const block = await vm.blockchain.getBlock(21996939n)
		const blockHash = `0x${block.hash.toString('hex')}` as Hex

		// Mock the blockchain.getBlock method to handle the block hash request properly
		const originalGetBlock = vm.blockchain.getBlock
		vm.blockchain.getBlock = vi.fn(async (blockId) => {
			if (typeof blockId === 'object' && blockId instanceof Uint8Array) {
				// Check if this is our hash that we're looking for
				const hashHex = `0x${Buffer.from(blockId).toString('hex')}`
				if (hashHex === blockHash) {
					return block
				}
			}
			// Otherwise fall back to the original implementation
			return originalGetBlock.call(vm.blockchain, blockId)
		})

		try {
			const result = await ethGetTransactionCountProcedure(node)({
				jsonrpc: '2.0',
				id: 1,
				method: 'eth_getTransactionCount',
				params: [address, blockHash],
			})
			
			expect(result).toMatchObject({
				id: 1,
				jsonrpc: '2.0',
				method: 'eth_getTransactionCount',
				result: expect.any(String),
			})
		} finally {
			// Restore original method
			vm.blockchain.getBlock = originalGetBlock
		}
	})

	it('should work with other valid tags', async () => {
		const node = createTevmNode({
			fork: {
				transport: transports.mainnet,
				blockTag: 21996939n,
			},
		})

		// Setup the blockchain to have the correct block tags
		const vm = await node.getVm()
		const latestBlock = await vm.blockchain.getBlock(21996939n)
		
		// Mock the blocksByTag map
		const originalGet = vm.blockchain.blocksByTag.get
		vm.blockchain.blocksByTag.get = vi.fn((tag) => {
			// For test purposes, return the latest block for all tags
			if (['earliest', 'safe', 'finalized', 'latest'].includes(tag)) {
				return latestBlock
			}
			// Fall back to original implementation for unknown tags
			return originalGet.call(vm.blockchain.blocksByTag, tag)
		})

		try {
			// Test 'earliest' tag
			const earliestResult = await ethGetTransactionCountProcedure(node)({
				jsonrpc: '2.0',
				id: 1,
				method: 'eth_getTransactionCount',
				params: [address, 'earliest'],
			})
			
			expect(earliestResult).toMatchObject({
				id: 1,
				jsonrpc: '2.0',
				method: 'eth_getTransactionCount',
				result: expect.any(String),
			})

			// Test 'safe' tag
			const safeResult = await ethGetTransactionCountProcedure(node)({
				jsonrpc: '2.0',
				id: 1,
				method: 'eth_getTransactionCount',
				params: [address, 'safe'],
			})
			
			expect(safeResult).toMatchObject({
				id: 1,
				jsonrpc: '2.0',
				method: 'eth_getTransactionCount',
				result: expect.any(String),
			})

			// Test 'finalized' tag
			const finalizedResult = await ethGetTransactionCountProcedure(node)({
				jsonrpc: '2.0',
				id: 1,
				method: 'eth_getTransactionCount',
				params: [address, 'finalized'],
			})
			
			expect(finalizedResult).toMatchObject({
				id: 1,
				jsonrpc: '2.0',
				method: 'eth_getTransactionCount',
				result: expect.any(String),
			})
		} finally {
			// Restore original method
			vm.blockchain.blocksByTag.get = originalGet
		}
	})

	it('should handle invalid block tag', async () => {
		const node = createTevmNode({
			fork: {
				transport: transports.mainnet,
				blockTag: 21996939n,
			},
		})

		expect(
			await ethGetTransactionCountProcedure(node)({
				jsonrpc: '2.0',
				id: 1,
				method: 'eth_getTransactionCount',
				// Fix for TS2322: Use type assertion for the test
				params: [address, 'invalid_tag' as BlockTag | Hex],
			}),
		).toMatchObject({
			id: 1,
			jsonrpc: '2.0',
			method: 'eth_getTransactionCount',
			error: {
				code: -32602,
				message: 'Invalid block tag invalid_tag',
			},
		})
	})

	it('should handle fork fallback when state root not found', async () => {
		// Create a node with a mock fork transport
		const mockTransport = {
			request: vi.fn().mockResolvedValue('0x1234'),
		}

		const node = createTevmNode({
			fork: {
				transport: mockTransport,
			},
		})

		// Mock the stateManager to simulate missing state root
		const vm = await node.getVm()
		const originalHasStateRoot = vm.stateManager.hasStateRoot
		vm.stateManager.hasStateRoot = vi.fn().mockResolvedValue(false)

		const result = await ethGetTransactionCountProcedure(node)({
			jsonrpc: '2.0',
			id: 1,
			method: 'eth_getTransactionCount',
			params: [address, 'latest'],
		})

		// Restore original method
		vm.stateManager.hasStateRoot = originalHasStateRoot

		// Verify the fork transport was called
		expect(mockTransport.request).toHaveBeenCalled()
		expect(result).toMatchObject({
			id: 1,
			jsonrpc: '2.0',
			method: 'eth_getTransactionCount',
			result: expect.any(String),
		})
	})

	it('should handle fork request errors', async () => {
		// Create a node with a mock fork transport that throws
		const mockTransport = {
			request: vi.fn().mockImplementation(() => {
				throw new Error('Fork error')
			}),
		}

		const node = createTevmNode({
			fork: {
				// @ts-ignore - Using a simplified mock transport for testing
				transport: mockTransport,
			},
		})

		// Mock the stateManager to simulate missing state root
		const vm = await node.getVm()
		const originalHasStateRoot = vm.stateManager.hasStateRoot
		vm.stateManager.hasStateRoot = vi.fn().mockResolvedValue(false)

		try {
			const result = await ethGetTransactionCountProcedure(node)({
				jsonrpc: '2.0',
				id: 1,
				method: 'eth_getTransactionCount',
				params: [address, 'latest'],
			})

			// Verify the error response
			expect(result).toMatchObject({
				id: 1,
				jsonrpc: '2.0',
				method: 'eth_getTransactionCount',
				error: {
					message: expect.stringContaining('Unable to resolve eth_getTransactionCount with fork'),
				},
			})
		} finally {
			// Restore original method
			vm.stateManager.hasStateRoot = originalHasStateRoot
		}
	})

	it('should handle case when no state root is found and no fork is available', async () => {
		// Create a node without fork
		const node = createTevmNode()

		// Mock the stateManager to simulate missing state root
		const vm = await node.getVm()
		const originalHasStateRoot = vm.stateManager.hasStateRoot
		vm.stateManager.hasStateRoot = vi.fn().mockResolvedValue(false)

		const result = await ethGetTransactionCountProcedure(node)({
			jsonrpc: '2.0',
			id: 1,
			method: 'eth_getTransactionCount',
			params: [address, 'latest'],
		})

		// Restore original method
		vm.stateManager.hasStateRoot = originalHasStateRoot

		// Verify the error response
		expect(result).toMatchObject({
			id: 1,
			jsonrpc: '2.0',
			method: 'eth_getTransactionCount',
			error: {
				message: expect.stringContaining('No state root found for block tag latest'),
			},
		})
	})

	it('should work with pending tx', async () => {
		const forkedNode = createTevmNode()
		const request = requestProcedure(forkedNode)
		const node = createTevmNode({
			fork: {
				transport: custom({ request }),
			},
		})
		await setAccountHandler(node)({
			address,
			balance: parseEther('25'),
		})
		await callHandler(node)({
			from: address,
			to: createAddress(500).toString(),
			value: parseEther('0.1'),
			createTransaction: true,
		})
		expect(
			await ethGetTransactionCountProcedure(node)({
				jsonrpc: '2.0',
				id: 1,
				method: 'eth_getTransactionCount',
				params: [address, 'latest'],
			}),
		).toMatchInlineSnapshot(`
{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "eth_getTransactionCount",
  "result": "0xa836d8",
}
`)
		expect(
			await ethGetTransactionCountProcedure(node)({
				jsonrpc: '2.0',
				id: 1,
				method: 'eth_getTransactionCount',
				params: [address, 'pending'],
			}),
		).toMatchInlineSnapshot(`
{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "eth_getTransactionCount",
  "result": "0xa836d9",
}
`)
	})

	it('should handle requests without id', async () => {
		const node = createTevmNode({
			fork: {
				transport: transports.mainnet,
				blockTag: 21996939n,
			},
		})
		expect(
			await ethGetTransactionCountProcedure(node)({
				jsonrpc: '2.0',
				method: 'eth_getTransactionCount',
				params: [address, 'latest'],
			}),
		).toMatchObject({
			jsonrpc: '2.0',
			method: 'eth_getTransactionCount',
			result: expect.any(String),
		})
	})
})
