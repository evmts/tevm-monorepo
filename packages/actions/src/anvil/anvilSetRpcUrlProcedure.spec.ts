import { mainnet } from '@tevm/common'
import { createTevmNode } from '@tevm/node'
import { describe, expect, it } from 'vitest'
import { anvilSetRpcUrlJsonRpcProcedure } from './anvilSetRpcUrlProcedure.js'

describe('anvilSetRpcUrlJsonRpcProcedure', () => {
	it('should return an error for a non-forked node', async () => {
		const node = createTevmNode()
		const procedure = anvilSetRpcUrlJsonRpcProcedure(node)

		const result = await procedure({
			jsonrpc: '2.0',
			method: 'anvil_setRpcUrl',
			params: ['https://mainnet.optimism.io'],
			id: 1,
		})

		expect(result).toEqual({
			jsonrpc: '2.0',
			method: 'anvil_setRpcUrl',
			error: {
				code: '-32602',
				message: 'Cannot set RPC URL on a non-forked node. Create the node with fork configuration.',
			},
			id: 1,
		})
	})

	it('should update the URL for a forked node with mutable transport', async () => {
		const originalUrl = 'https://mainnet.optimism.io'
		const newUrl = 'https://mainnet.infura.io/v3/test'

		const mockTransport = {
			url: originalUrl,
			request: async ({ method }: { method: string }) => {
				if (method === 'eth_chainId') return '0x1'
				return '0x0'
			},
		}

		const node = createTevmNode({
			common: mainnet,
			fork: {
				transport: mockTransport,
			},
		})
		const procedure = anvilSetRpcUrlJsonRpcProcedure(node)

		const result = await procedure({
			jsonrpc: '2.0',
			method: 'anvil_setRpcUrl',
			params: [newUrl],
			id: 1,
		})

		expect(result).toEqual({
			jsonrpc: '2.0',
			method: 'anvil_setRpcUrl',
			result: null,
			id: 1,
		})

		expect(mockTransport.url).toBe(newUrl)
	})

	it('should work without id in request', async () => {
		const originalUrl = 'https://mainnet.optimism.io'
		const newUrl = 'https://mainnet.infura.io/v3/test'

		const mockTransport = {
			url: originalUrl,
			request: async ({ method }: { method: string }) => {
				if (method === 'eth_chainId') return '0x1'
				return '0x0'
			},
		}

		const node = createTevmNode({
			common: mainnet,
			fork: {
				transport: mockTransport,
			},
		})
		const procedure = anvilSetRpcUrlJsonRpcProcedure(node)

		const result = await procedure({
			jsonrpc: '2.0',
			method: 'anvil_setRpcUrl',
			params: [newUrl],
		})

		expect(result).toEqual({
			jsonrpc: '2.0',
			method: 'anvil_setRpcUrl',
			result: null,
		})
	})

	it('should handle forked node with readonly transport', async () => {
		const node = createTevmNode({
			common: mainnet,
			fork: {
				transport: {
					request: async ({ method }: { method: string }) => {
						if (method === 'eth_chainId') return '0x1'
						return '0x0'
					},
					// No url property
				},
			},
		})
		const procedure = anvilSetRpcUrlJsonRpcProcedure(node)

		const result = await procedure({
			jsonrpc: '2.0',
			method: 'anvil_setRpcUrl',
			params: ['https://mainnet.optimism.io'],
			id: 1,
		})

		// Should still return success even if URL cannot be updated
		expect(result).toEqual({
			jsonrpc: '2.0',
			method: 'anvil_setRpcUrl',
			result: null,
			id: 1,
		})
	})
})
