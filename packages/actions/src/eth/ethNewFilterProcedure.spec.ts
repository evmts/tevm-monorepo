import { createTevmNode } from '@tevm/node'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ethNewFilterHandler } from './ethNewFilterHandler.js'
import { ethNewFilterJsonRpcProcedure } from './ethNewFilterProcedure.js'

// Mock the ethNewFilterHandler module
vi.mock('./ethNewFilterHandler.js', () => ({
	ethNewFilterHandler: vi.fn(),
}))

describe('ethNewFilterJsonRpcProcedure', () => {
	beforeEach(() => {
		vi.resetAllMocks()
	})

	it('should return filter ID in JSON-RPC response format', async () => {
		// Set up mock handler
		const mockHandler = vi.fn().mockResolvedValue('0x123')
		// @ts-expect-error - Mocking for testing purposes
		ethNewFilterHandler.mockReturnValue(mockHandler)

		const client = createTevmNode()
		const procedure = ethNewFilterJsonRpcProcedure(client)

		const result = await procedure({
			jsonrpc: '2.0',
			id: 1,
			method: 'eth_newFilter',
			params: [{ fromBlock: 'latest', toBlock: 'latest' }],
		})

		expect(result).toEqual({
			jsonrpc: '2.0',
			id: 1,
			method: 'eth_newFilter',
			result: '0x123',
		})
	})

	it('should handle errors', async () => {
		// Set up mock handler that throws
		const mockError = new Error('Test error') as Error & { code: number }
		mockError.code = -32000
		const mockHandler = vi.fn().mockImplementation(() => {
			throw mockError
		})
		// @ts-expect-error - Mocking for testing purposes
		ethNewFilterHandler.mockReturnValue(mockHandler)

		const client = createTevmNode()
		const procedure = ethNewFilterJsonRpcProcedure(client)

		const result = await procedure({
			jsonrpc: '2.0',
			id: 1,
			method: 'eth_newFilter',
			params: [{ fromBlock: 'latest' }],
		})

		expect(result).toEqual({
			jsonrpc: '2.0',
			id: 1,
			method: 'eth_newFilter',
			error: {
				code: -32000,
				message: 'Test error',
			},
		})
	})

	it('should handle missing ID in request', async () => {
		// Set up mock handler
		const mockHandler = vi.fn().mockResolvedValue('0x123')
		// @ts-expect-error - Mocking for testing purposes
		ethNewFilterHandler.mockReturnValue(mockHandler)

		const client = createTevmNode()
		const procedure = ethNewFilterJsonRpcProcedure(client)

		const result = await procedure({
			jsonrpc: '2.0',
			method: 'eth_newFilter',
			params: [{ fromBlock: 'latest' }],
		})

		expect(result).toEqual({
			jsonrpc: '2.0',
			method: 'eth_newFilter',
			result: '0x123',
		})
	})
})
