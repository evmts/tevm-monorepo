import { Effect } from 'effect'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { JsonRpcRequestEffectLive, JsonRpcRequestEffectService } from './JsonRpcRequestEffect.js'

// Mock the RpcRequest module
const mockCreate = vi.fn()
const mockCreateBatch = vi.fn()
const mockValidate = vi.fn()
const mockValidateBatch = vi.fn()

vi.mock('ox/json-rpc/request', () => ({
	create: (...args: any[]) => mockCreate(...args),
	createBatch: (...args: any[]) => mockCreateBatch(...args),
	validate: (...args: any[]) => mockValidate(...args),
	validateBatch: (...args: any[]) => mockValidateBatch(...args),
}))

describe('JsonRpcRequestEffect', () => {
	const jsonRpcRequest: JsonRpcRequestEffectService = JsonRpcRequestEffectLive

	beforeEach(() => {
		vi.resetAllMocks()
	})

	describe('createEffect', () => {
		it('should create a JSON-RPC request', async () => {
			const requestParams = {
				method: 'eth_getBalance',
				params: ['0x1234567890123456789012345678901234567890', 'latest'],
				id: 1,
			}

			const mockResult = {
				jsonrpc: '2.0',
				method: 'eth_getBalance',
				params: ['0x1234567890123456789012345678901234567890', 'latest'],
				id: 1,
			}

			mockCreate.mockReturnValue(mockResult)

			const result = await Effect.runPromise(jsonRpcRequest.createEffect(requestParams))

			expect(result).toBe(mockResult)
			expect(mockCreate).toHaveBeenCalledWith(requestParams)
		})

		it('should handle errors properly', async () => {
			const requestParams = {
				method: '',
				id: 1,
			}

			const error = new Error('Invalid method name')
			mockCreate.mockImplementation(() => {
				throw error
			})

			try {
				await Effect.runPromise(jsonRpcRequest.createEffect(requestParams))
				// Should not reach here
				expect(true).toBe(false)
			} catch (err) {
				expect(err).toBe(error)
			}
		})
	})

	describe('createBatchEffect', () => {
		it('should create a JSON-RPC request batch', async () => {
			const batchRequests = [
				{
					method: 'eth_getBalance',
					params: ['0x1234567890123456789012345678901234567890', 'latest'],
					id: 1,
				},
				{
					method: 'eth_blockNumber',
					id: 2,
				},
			]

			const mockResult = [
				{
					jsonrpc: '2.0',
					method: 'eth_getBalance',
					params: ['0x1234567890123456789012345678901234567890', 'latest'],
					id: 1,
				},
				{
					jsonrpc: '2.0',
					method: 'eth_blockNumber',
					id: 2,
				},
			]

			mockCreateBatch.mockReturnValue(mockResult)

			const result = await Effect.runPromise(jsonRpcRequest.createBatchEffect(batchRequests))

			expect(result).toBe(mockResult)
			expect(mockCreateBatch).toHaveBeenCalledWith(batchRequests)
		})

		it('should handle errors properly', async () => {
			const batchRequests = [
				{
					method: '',
					id: 1,
				},
			]

			const error = new Error('Invalid method name in batch request')
			mockCreateBatch.mockImplementation(() => {
				throw error
			})

			try {
				await Effect.runPromise(jsonRpcRequest.createBatchEffect(batchRequests))
				// Should not reach here
				expect(true).toBe(false)
			} catch (err) {
				expect(err).toBe(error)
			}
		})
	})

	describe('validateEffect', () => {
		it('should validate a JSON-RPC request', async () => {
			const request = {
				jsonrpc: '2.0',
				method: 'eth_getBalance',
				params: ['0x1234567890123456789012345678901234567890', 'latest'],
				id: 1,
			}

			mockValidate.mockReturnValue(request)

			const result = await Effect.runPromise(jsonRpcRequest.validateEffect(request))

			expect(result).toBe(request)
			expect(mockValidate).toHaveBeenCalledWith(request)
		})

		it('should handle validation errors properly', async () => {
			const invalidRequest = {
				jsonrpc: '1.0', // Invalid version
				method: 'eth_getBalance',
				id: 1,
			}

			const error = new Error('Invalid JSON-RPC version')
			mockValidate.mockImplementation(() => {
				throw error
			})

			try {
				await Effect.runPromise(jsonRpcRequest.validateEffect(invalidRequest))
				// Should not reach here
				expect(true).toBe(false)
			} catch (err) {
				expect(err).toBe(error)
			}
		})
	})

	describe('validateBatchEffect', () => {
		it('should validate a JSON-RPC request batch', async () => {
			const batch = [
				{
					jsonrpc: '2.0',
					method: 'eth_getBalance',
					params: ['0x1234567890123456789012345678901234567890', 'latest'],
					id: 1,
				},
				{
					jsonrpc: '2.0',
					method: 'eth_blockNumber',
					id: 2,
				},
			]

			mockValidateBatch.mockReturnValue(batch)

			const result = await Effect.runPromise(jsonRpcRequest.validateBatchEffect(batch))

			expect(result).toBe(batch)
			expect(mockValidateBatch).toHaveBeenCalledWith(batch)
		})

		it('should handle batch validation errors properly', async () => {
			const invalidBatch = [
				{
					jsonrpc: '2.0',
					method: 'eth_getBalance',
					id: 1,
				},
				{
					jsonrpc: '1.0', // Invalid version
					method: 'eth_blockNumber',
					id: 2,
				},
			]

			const error = new Error('Invalid JSON-RPC version in batch request')
			mockValidateBatch.mockImplementation(() => {
				throw error
			})

			try {
				await Effect.runPromise(jsonRpcRequest.validateBatchEffect(invalidBatch))
				// Should not reach here
				expect(true).toBe(false)
			} catch (err) {
				expect(err).toBe(error)
			}
		})
	})
})
