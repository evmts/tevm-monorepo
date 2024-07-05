import { describe, expect, it, vi, beforeEach } from 'vitest'
import { createJsonRpcFetcher } from './index.js'

describe('createJsonRpcFetcher', () => {
	let mockClient: any
	let jsonRpcFetcher: any

	beforeEach(() => {
		mockClient = {
			request: vi.fn(),
		}
		jsonRpcFetcher = createJsonRpcFetcher(mockClient)
	})

	it('should return a valid JSON-RPC response when the request succeeds', async () => {
		const mockRequest = {
			method: 'eth_getBlockByNumber',
			params: ['latest', false],
			id: 1,
		}
		const mockResponse = { number: '0x1b4' }

		mockClient.request.mockResolvedValueOnce(mockResponse)

		const result = await jsonRpcFetcher.request(mockRequest)

		expect(result).toEqual({
			jsonrpc: '2.0',
			result: mockResponse,
			method: 'eth_getBlockByNumber',
			params: ['latest', false],
			id: 1,
		})

		expect(mockClient.request).toHaveBeenCalledWith(mockRequest)
	})

	it('should return a JSON-RPC error response when the request fails with a known error', async () => {
		const mockRequest = {
			method: 'eth_getBlockByNumber',
			params: ['latest', false],
			id: 1,
		}
		const mockError = {
			code: -32601,
			message: 'Method not found',
		}

		mockClient.request.mockRejectedValueOnce(mockError)

		const result = await jsonRpcFetcher.request(mockRequest)

		expect(result).toEqual({
			jsonrpc: '2.0',
			error: {
				code: mockError.code,
				message: mockError.message,
			},
			method: 'eth_getBlockByNumber',
			params: ['latest', false],
			id: 1,
		})

		expect(mockClient.request).toHaveBeenCalledWith(mockRequest)
	})

	it('should return a JSON-RPC error response when the request fails with an unknown error', async () => {
		const mockRequest = {
			method: 'eth_getBlockByNumber',
			params: ['latest', false],
			id: 1,
		}
		const mockError = new Error('Unknown error')

		mockClient.request.mockRejectedValueOnce(mockError)

		const result = await jsonRpcFetcher.request(mockRequest)

		expect(result).toEqual({
			jsonrpc: '2.0',
			error: {
				code: -32000,
				message: 'Unknown error in jsonrpc request',
			},
			method: 'eth_getBlockByNumber',
			params: ['latest', false],
			id: 1,
		})

		expect(mockClient.request).toHaveBeenCalledWith(mockRequest)
	})

	it('should return a JSON-RPC response without params and id if they are not provided in the request', async () => {
		const mockRequest = {
			method: 'eth_getBlockByNumber',
		}
		const mockResponse = { number: '0x1b4' }

		mockClient.request.mockResolvedValueOnce(mockResponse)

		const result = await jsonRpcFetcher.request(mockRequest)

		expect(result).toEqual({
			jsonrpc: '2.0',
			result: mockResponse,
			method: 'eth_getBlockByNumber',
		})

		expect(mockClient.request).toHaveBeenCalledWith(mockRequest)
	})
})
