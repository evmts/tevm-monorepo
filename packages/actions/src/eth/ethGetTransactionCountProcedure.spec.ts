import { createAddress } from '@tevm/address'
import { mainnet } from '@tevm/common'
import { createTevmNode } from '@tevm/node'
import { bytesToHex, type Hex, numberToHex } from '@tevm/utils'
import { describe, expect, it, vi } from 'vitest'
import type { BlockTag } from '../common/BlockTag.js'
import { mineHandler } from '../Mine/mineHandler.js'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { ethGetTransactionCountProcedure } from './ethGetTransactionCountProcedure.js'

const address = createAddress('0xb5d85CBf7cB3EE0D56b3bB207D5Fc4B82f43F511').toString() as `0x${string}`

const setupNodeWithNonce = async (nonce: bigint) => {
	const node = createTevmNode()
	await setAccountHandler(node)({ address, nonce })
	await mineHandler(node)({ blockCount: 1 })
	return node
}

describe(ethGetTransactionCountProcedure.name, () => {
	it('should work with past block tags', async () => {
		const node = await setupNodeWithNonce(7n)
		const vm = await node.getVm()
		const latest = vm.blockchain.blocksByTag.get('latest')
		if (!latest) throw new Error('Latest block not found')

		expect(
			await ethGetTransactionCountProcedure(node)({
				jsonrpc: '2.0',
				id: 1,
				method: 'eth_getTransactionCount',
				params: [address, numberToHex(latest.header.number)],
			}),
		).toMatchObject({
			id: 1,
			jsonrpc: '2.0',
			method: 'eth_getTransactionCount',
			result: '0x7',
		})
	})

	it('should work with block hash', async () => {
		const node = await setupNodeWithNonce(5n)
		const vm = await node.getVm()
		const latest = vm.blockchain.blocksByTag.get('latest')
		if (!latest) throw new Error('Latest block not found')

		const result = await ethGetTransactionCountProcedure(node)({
			jsonrpc: '2.0',
			id: 1,
			method: 'eth_getTransactionCount',
			params: [address, bytesToHex(latest.hash())],
		})

		expect(result).toMatchObject({
			id: 1,
			jsonrpc: '2.0',
			method: 'eth_getTransactionCount',
			result: '0x5',
		})
	})

	it('should work with other valid tags', async () => {
		const node = await setupNodeWithNonce(3n)
		const vm = await node.getVm()
		const latest = vm.blockchain.blocksByTag.get('latest')
		if (!latest) throw new Error('Latest block not found')

		const originalGet = vm.blockchain.blocksByTag.get
		vm.blockchain.blocksByTag.get = vi.fn((tag) => {
			if (['earliest', 'safe', 'finalized', 'latest'].includes(tag as string)) {
				return latest
			}
			return originalGet.call(vm.blockchain.blocksByTag, tag as any)
		})

		try {
			for (const tag of ['earliest', 'safe', 'finalized'] as const) {
				const result = await ethGetTransactionCountProcedure(node)({
					jsonrpc: '2.0',
					id: 1,
					method: 'eth_getTransactionCount',
					params: [address, tag],
				})

				expect(result).toMatchObject({
					id: 1,
					jsonrpc: '2.0',
					method: 'eth_getTransactionCount',
					result: '0x3',
				})
			}
		} finally {
			vm.blockchain.blocksByTag.get = originalGet
		}
	})

	it('should handle invalid block tag', async () => {
		const node = await setupNodeWithNonce(1n)

		expect(
			await ethGetTransactionCountProcedure(node)({
				jsonrpc: '2.0',
				id: 1,
				method: 'eth_getTransactionCount',
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
		const mockTransport = {
			request: vi.fn(async ({ method }: { method: string }) => {
				if (method === 'eth_chainId') return '0x1'
				if (method === 'eth_getTransactionCount') return '0x1234'
				return '0x0'
			}),
		}

		const node = createTevmNode({
			common: mainnet,
			fork: {
				transport: mockTransport,
			},
		})

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

			expect(mockTransport.request).toHaveBeenCalled()
			expect(result).toMatchObject({
				id: 1,
				jsonrpc: '2.0',
				method: 'eth_getTransactionCount',
				result: '0x1234',
			})
		} finally {
			vm.stateManager.hasStateRoot = originalHasStateRoot
		}
	})

	it('should handle case when no state root is found and no fork is available', async () => {
		const node = createTevmNode()
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

			expect(result).toMatchObject({
				id: 1,
				jsonrpc: '2.0',
				method: 'eth_getTransactionCount',
				error: {
					message: expect.stringContaining('No state root found for block tag latest'),
				},
			})
		} finally {
			vm.stateManager.hasStateRoot = originalHasStateRoot
		}
	})

	it('should handle requests without id', async () => {
		const node = await setupNodeWithNonce(2n)

		expect(
			await ethGetTransactionCountProcedure(node)({
				jsonrpc: '2.0',
				method: 'eth_getTransactionCount',
				params: [address, 'latest'],
			}),
		).toMatchObject({
			jsonrpc: '2.0',
			method: 'eth_getTransactionCount',
			result: '0x2',
		})
	})
})
