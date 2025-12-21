import { createTevmNode } from '@tevm/node'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ethSubscribeHandler } from './ethSubscribeHandler.js'
import { ethSubscribeJsonRpcProcedure } from './ethSubscribeProcedure.js'

// Mock the ethSubscribeHandler module
vi.mock('./ethSubscribeHandler.js', () => ({
	ethSubscribeHandler: vi.fn(),
}))

describe('ethSubscribeJsonRpcProcedure', () => {
	beforeEach(() => {
		vi.resetAllMocks()
	})

	it('should return subscription ID for newHeads subscription', async () => {
		// Set up mock handler
		const mockHandler = vi.fn().mockResolvedValue('0x1')
		// @ts-expect-error - Mocking for testing purposes
		ethSubscribeHandler.mockReturnValue(mockHandler)

		const client = createTevmNode()
		const procedure = ethSubscribeJsonRpcProcedure(client)

		const result = await procedure({
			jsonrpc: '2.0',
			id: 1,
			method: 'eth_subscribe',
			params: ['newHeads'],
		})

		expect(result).toEqual({
			jsonrpc: '2.0',
			id: 1,
			method: 'eth_subscribe',
			result: '0x1',
		})
		expect(mockHandler).toHaveBeenCalledWith({ subscriptionType: 'newHeads' })
	})

	it('should return subscription ID for logs subscription with filter', async () => {
		// Set up mock handler
		const mockHandler = vi.fn().mockResolvedValue('0x2')
		// @ts-expect-error - Mocking for testing purposes
		ethSubscribeHandler.mockReturnValue(mockHandler)

		const client = createTevmNode()
		const procedure = ethSubscribeJsonRpcProcedure(client)

		const filterParams = {
			address: '0x1234567890123456789012345678901234567890',
			topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'],
		}

		const result = await procedure({
			jsonrpc: '2.0',
			id: 2,
			method: 'eth_subscribe',
			params: ['logs', filterParams],
		})

		expect(result).toEqual({
			jsonrpc: '2.0',
			id: 2,
			method: 'eth_subscribe',
			result: '0x2',
		})
		expect(mockHandler).toHaveBeenCalledWith({
			subscriptionType: 'logs',
			filterParams,
		})
	})

	it('should return subscription ID for newPendingTransactions subscription', async () => {
		// Set up mock handler
		const mockHandler = vi.fn().mockResolvedValue('0x3')
		// @ts-expect-error - Mocking for testing purposes
		ethSubscribeHandler.mockReturnValue(mockHandler)

		const client = createTevmNode()
		const procedure = ethSubscribeJsonRpcProcedure(client)

		const result = await procedure({
			jsonrpc: '2.0',
			id: 3,
			method: 'eth_subscribe',
			params: ['newPendingTransactions'],
		})

		expect(result).toEqual({
			jsonrpc: '2.0',
			id: 3,
			method: 'eth_subscribe',
			result: '0x3',
		})
		expect(mockHandler).toHaveBeenCalledWith({ subscriptionType: 'newPendingTransactions' })
	})

	it('should return subscription ID for syncing subscription', async () => {
		// Set up mock handler
		const mockHandler = vi.fn().mockResolvedValue('0x4')
		// @ts-expect-error - Mocking for testing purposes
		ethSubscribeHandler.mockReturnValue(mockHandler)

		const client = createTevmNode()
		const procedure = ethSubscribeJsonRpcProcedure(client)

		const result = await procedure({
			jsonrpc: '2.0',
			id: 4,
			method: 'eth_subscribe',
			params: ['syncing'],
		})

		expect(result).toEqual({
			jsonrpc: '2.0',
			id: 4,
			method: 'eth_subscribe',
			result: '0x4',
		})
		expect(mockHandler).toHaveBeenCalledWith({ subscriptionType: 'syncing' })
	})

	it('should handle errors', async () => {
		// Set up mock handler that throws
		const mockError = new Error('Invalid subscription type') as Error & { code: number }
		mockError.code = -32602
		const mockHandler = vi.fn().mockImplementation(() => {
			throw mockError
		})
		// @ts-expect-error - Mocking for testing purposes
		ethSubscribeHandler.mockReturnValue(mockHandler)

		const client = createTevmNode()
		const procedure = ethSubscribeJsonRpcProcedure(client)

		const result = await procedure({
			jsonrpc: '2.0',
			id: 5,
			method: 'eth_subscribe',
			params: ['invalid'],
		})

		expect(result).toEqual({
			jsonrpc: '2.0',
			id: 5,
			method: 'eth_subscribe',
			error: {
				code: -32602,
				message: 'Invalid subscription type',
			},
		})
	})

	it('should handle missing ID in request', async () => {
		// Set up mock handler
		const mockHandler = vi.fn().mockResolvedValue('0x5')
		// @ts-expect-error - Mocking for testing purposes
		ethSubscribeHandler.mockReturnValue(mockHandler)

		const client = createTevmNode()
		const procedure = ethSubscribeJsonRpcProcedure(client)

		const result = await procedure({
			jsonrpc: '2.0',
			method: 'eth_subscribe',
			params: ['newHeads'],
		})

		expect(result).toEqual({
			jsonrpc: '2.0',
			method: 'eth_subscribe',
			result: '0x5',
		})
	})
})
