import { Effect } from 'effect'
import Ox from 'ox'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as JsonRpcRequest from './JsonRpcRequest.js'

vi.mock('ox', () => {
	return {
		default: {
			JsonRpcRequest: {
				create: vi.fn(),
				createBatch: vi.fn(),
				validate: vi.fn(),
				validateBatch: vi.fn(),
			},
		},
	}
})

describe('JsonRpcRequest', () => {
	beforeEach(() => {
		vi.resetAllMocks()
	})

	describe('create', () => {
		it('should create a JSON-RPC request successfully', async () => {
			const requestParams = {
				method: 'eth_getBalance',
				params: ['0x1234567890123456789012345678901234567890', 'latest'],
				id: 1,
			}

			const expectedResult = {
				jsonrpc: '2.0',
				method: 'eth_getBalance',
				params: ['0x1234567890123456789012345678901234567890', 'latest'],
				id: 1,
			}

			vi.mocked(Ox.JsonRpcRequest.create).mockReturnValue(expectedResult)

			const result = await Effect.runPromise(JsonRpcRequest.create(requestParams))

			expect(Ox.JsonRpcRequest.create).toHaveBeenCalledTimes(1)
			expect(Ox.JsonRpcRequest.create).toHaveBeenCalledWith(requestParams)
			expect(result).toEqual(expectedResult)
		})

		it('should handle errors', async () => {
			const requestParams = {
				method: 'eth_getBalance',
				params: ['0x1234567890123456789012345678901234567890', 'latest'],
				id: 1,
			}

			const error = new Error('Failed to create JSON-RPC request')
			vi.mocked(Ox.JsonRpcRequest.create).mockImplementation(() => {
				throw error
			})

			const effect = JsonRpcRequest.create(requestParams)

			await expect(Effect.runPromise(effect)).rejects.toThrow(JsonRpcRequest.CreateError)
			await expect(Effect.runPromise(effect)).rejects.toMatchObject({
				name: 'CreateError',
				_tag: 'CreateError',
				cause: error,
			})
		})
	})

	describe('createBatch', () => {
		it('should create a JSON-RPC request batch successfully', async () => {
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

			const expectedResult = [
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

			vi.mocked(Ox.JsonRpcRequest.createBatch).mockReturnValue(expectedResult)

			const result = await Effect.runPromise(JsonRpcRequest.createBatch(batchRequests))

			expect(Ox.JsonRpcRequest.createBatch).toHaveBeenCalledTimes(1)
			expect(Ox.JsonRpcRequest.createBatch).toHaveBeenCalledWith(batchRequests)
			expect(result).toEqual(expectedResult)
		})

		it('should handle errors', async () => {
			const batchRequests = [
				{
					method: 'eth_getBalance',
					params: ['0x1234567890123456789012345678901234567890', 'latest'],
					id: 1,
				},
			]

			const error = new Error('Failed to create JSON-RPC request batch')
			vi.mocked(Ox.JsonRpcRequest.createBatch).mockImplementation(() => {
				throw error
			})

			const effect = JsonRpcRequest.createBatch(batchRequests)

			await expect(Effect.runPromise(effect)).rejects.toThrow(JsonRpcRequest.CreateBatchError)
			await expect(Effect.runPromise(effect)).rejects.toMatchObject({
				name: 'CreateBatchError',
				_tag: 'CreateBatchError',
				cause: error,
			})
		})
	})

	describe('validate', () => {
		it('should validate a JSON-RPC request successfully', async () => {
			const request = {
				jsonrpc: '2.0',
				method: 'eth_getBalance',
				params: ['0x1234567890123456789012345678901234567890', 'latest'],
				id: 1,
			}

			vi.mocked(Ox.JsonRpcRequest.validate).mockReturnValue(request)

			const result = await Effect.runPromise(JsonRpcRequest.validate(request))

			expect(Ox.JsonRpcRequest.validate).toHaveBeenCalledTimes(1)
			expect(Ox.JsonRpcRequest.validate).toHaveBeenCalledWith(request)
			expect(result).toEqual(request)
		})

		it('should handle errors', async () => {
			const invalidRequest = {
				jsonrpc: '1.0', // Invalid version
				method: 'eth_getBalance',
				id: 1,
			}

			const error = new Error('Invalid JSON-RPC version')
			vi.mocked(Ox.JsonRpcRequest.validate).mockImplementation(() => {
				throw error
			})

			const effect = JsonRpcRequest.validate(invalidRequest as any)

			await expect(Effect.runPromise(effect)).rejects.toThrow(JsonRpcRequest.ValidateError)
			await expect(Effect.runPromise(effect)).rejects.toMatchObject({
				name: 'ValidateError',
				_tag: 'ValidateError',
				cause: error,
			})
		})
	})

	describe('validateBatch', () => {
		it('should validate a JSON-RPC request batch successfully', async () => {
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

			vi.mocked(Ox.JsonRpcRequest.validateBatch).mockReturnValue(batch)

			const result = await Effect.runPromise(JsonRpcRequest.validateBatch(batch))

			expect(Ox.JsonRpcRequest.validateBatch).toHaveBeenCalledTimes(1)
			expect(Ox.JsonRpcRequest.validateBatch).toHaveBeenCalledWith(batch)
			expect(result).toEqual(batch)
		})

		it('should handle errors', async () => {
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
			vi.mocked(Ox.JsonRpcRequest.validateBatch).mockImplementation(() => {
				throw error
			})

			const effect = JsonRpcRequest.validateBatch(invalidBatch as any)

			await expect(Effect.runPromise(effect)).rejects.toThrow(JsonRpcRequest.ValidateBatchError)
			await expect(Effect.runPromise(effect)).rejects.toMatchObject({
				name: 'ValidateBatchError',
				_tag: 'ValidateBatchError',
				cause: error,
			})
		})
	})
})
