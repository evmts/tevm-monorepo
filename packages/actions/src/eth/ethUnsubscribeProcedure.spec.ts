import { createTevmNode } from '@tevm/node'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ethUnsubscribeHandler } from './ethUnsubscribeHandler.js'
import { ethUnsubscribeJsonRpcProcedure } from './ethUnsubscribeProcedure.js'

// Mock the ethUnsubscribeHandler module
vi.mock('./ethUnsubscribeHandler.js', () => ({
	ethUnsubscribeHandler: vi.fn(),
}))

describe('ethUnsubscribeJsonRpcProcedure', () => {
	beforeEach(() => {
		vi.resetAllMocks()
	})

	it('should return true when unsubscribing from existing subscription', async () => {
		// Set up mock handler
		const mockHandler = vi.fn().mockResolvedValue(true)
		// @ts-expect-error - Mocking for testing purposes
		ethUnsubscribeHandler.mockReturnValue(mockHandler)

		const client = createTevmNode()
		const procedure = ethUnsubscribeJsonRpcProcedure(client)

		const result = await procedure({
			jsonrpc: '2.0',
			id: 1,
			method: 'eth_unsubscribe',
			params: ['0x1'],
		})

		expect(result).toEqual({
			jsonrpc: '2.0',
			id: 1,
			method: 'eth_unsubscribe',
			result: true,
		})
		expect(mockHandler).toHaveBeenCalledWith({ subscriptionId: '0x1' })
	})

	it('should return false when unsubscribing from non-existent subscription', async () => {
		// Set up mock handler
		const mockHandler = vi.fn().mockResolvedValue(false)
		// @ts-expect-error - Mocking for testing purposes
		ethUnsubscribeHandler.mockReturnValue(mockHandler)

		const client = createTevmNode()
		const procedure = ethUnsubscribeJsonRpcProcedure(client)

		const result = await procedure({
			jsonrpc: '2.0',
			id: 2,
			method: 'eth_unsubscribe',
			params: ['0x999'],
		})

		expect(result).toEqual({
			jsonrpc: '2.0',
			id: 2,
			method: 'eth_unsubscribe',
			result: false,
		})
		expect(mockHandler).toHaveBeenCalledWith({ subscriptionId: '0x999' })
	})

	it('should handle errors', async () => {
		// Set up mock handler that throws
		const mockError = new Error('Unexpected error')
		const mockHandler = vi.fn().mockImplementation(() => {
			throw mockError
		})
		// @ts-expect-error - Mocking for testing purposes
		ethUnsubscribeHandler.mockReturnValue(mockHandler)

		const client = createTevmNode()
		const procedure = ethUnsubscribeJsonRpcProcedure(client)

		const result = await procedure({
			jsonrpc: '2.0',
			id: 3,
			method: 'eth_unsubscribe',
			params: ['0x1'],
		})

		expect(result).toEqual({
			jsonrpc: '2.0',
			id: 3,
			method: 'eth_unsubscribe',
			error: {
				code: -32603,
				message: 'Unexpected error',
			},
		})
	})

	it('should handle missing ID in request', async () => {
		// Set up mock handler
		const mockHandler = vi.fn().mockResolvedValue(true)
		// @ts-expect-error - Mocking for testing purposes
		ethUnsubscribeHandler.mockReturnValue(mockHandler)

		const client = createTevmNode()
		const procedure = ethUnsubscribeJsonRpcProcedure(client)

		const result = await procedure({
			jsonrpc: '2.0',
			method: 'eth_unsubscribe',
			params: ['0x1'],
		})

		expect(result).toEqual({
			jsonrpc: '2.0',
			method: 'eth_unsubscribe',
			result: true,
		})
	})
})
