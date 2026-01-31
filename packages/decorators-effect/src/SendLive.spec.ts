import { describe, it, expect, vi } from 'vitest'
import { Effect, Layer, Data } from 'effect'
import { SendService } from './SendService.js'
import { SendLive } from './SendLive.js'
import { RequestService } from './RequestService.js'

// Tagged error classes for testing EIP-1193 error code mapping
class InvalidRequestError extends Data.TaggedError('InvalidRequestError')<{ message: string }> {}
class MethodNotFoundError extends Data.TaggedError('MethodNotFoundError')<{ message: string }> {}
class InvalidParamsError extends Data.TaggedError('InvalidParamsError')<{ message: string }> {}
class InternalError extends Data.TaggedError('InternalError')<{ message: string }> {}
class RevertError extends Data.TaggedError('RevertError')<{ message: string }> {}
class OutOfGasError extends Data.TaggedError('OutOfGasError')<{ message: string }> {}
class InvalidOpcodeError extends Data.TaggedError('InvalidOpcodeError')<{ message: string }> {}
class InvalidJumpError extends Data.TaggedError('InvalidJumpError')<{ message: string }> {}
class StackOverflowError extends Data.TaggedError('StackOverflowError')<{ message: string }> {}
class StackUnderflowError extends Data.TaggedError('StackUnderflowError')<{ message: string }> {}
class InsufficientFundsError extends Data.TaggedError('InsufficientFundsError')<{ message: string }> {}
class InsufficientBalanceError extends Data.TaggedError('InsufficientBalanceError')<{ message: string }> {}
class ForkError extends Data.TaggedError('ForkError')<{ message: string }> {}
class TimeoutError extends Data.TaggedError('TimeoutError')<{ message: string }> {}
class NetworkError extends Data.TaggedError('NetworkError')<{ message: string }> {}
class NonceTooLowError extends Data.TaggedError('NonceTooLowError')<{ message: string }> {}
class NonceTooHighError extends Data.TaggedError('NonceTooHighError')<{ message: string }> {}
class GasTooLowError extends Data.TaggedError('GasTooLowError')<{ message: string }> {}
class InvalidTransactionError extends Data.TaggedError('InvalidTransactionError')<{ message: string }> {}
class StateRootNotFoundError extends Data.TaggedError('StateRootNotFoundError')<{ message: string }> {}
class StorageError extends Data.TaggedError('StorageError')<{ message: string }> {}
class AccountNotFoundError extends Data.TaggedError('AccountNotFoundError')<{ message: string }> {}
class BlockNotFoundError extends Data.TaggedError('BlockNotFoundError')<{ message: string }> {}
class InvalidBlockError extends Data.TaggedError('InvalidBlockError')<{ message: string }> {}
class BlockGasLimitExceededError extends Data.TaggedError('BlockGasLimitExceededError')<{ message: string }> {}
class NodeNotReadyError extends Data.TaggedError('NodeNotReadyError')<{ message: string }> {}
class SnapshotNotFoundError extends Data.TaggedError('SnapshotNotFoundError')<{ message: string }> {}
class FilterNotFoundError extends Data.TaggedError('FilterNotFoundError')<{ message: string }> {}
class UnknownTaggedError extends Data.TaggedError('UnknownTaggedError')<{ message: string }> {}

describe('SendLive', () => {
	const createMockRequestService = () => ({
		request: vi.fn(({ method }: { method: string }) => {
			if (method === 'eth_blockNumber') {
				return Effect.succeed('0x64')
			}
			if (method === 'eth_chainId') {
				return Effect.succeed('0x1')
			}
			if (method === 'unsupported') {
				return Effect.fail(new Error('Unsupported method'))
			}
			return Effect.succeed(null)
		}),
	})

	const createTestLayer = () => {
		const requestMock = createMockRequestService()

		const mockLayer = Layer.succeed(RequestService, requestMock as any)

		return {
			layer: Layer.provide(SendLive, mockLayer),
			mocks: {
				request: requestMock,
			},
		}
	}

	it('should send single request', async () => {
		const { layer, mocks } = createTestLayer()

		const program = Effect.gen(function* () {
			const sendService = yield* SendService
			return yield* sendService.send({
				jsonrpc: '2.0',
				method: 'eth_blockNumber',
				params: [],
				id: 1,
			})
		})

		const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
		expect(result.jsonrpc).toBe('2.0')
		expect(result.result).toBe('0x64')
		expect(result.id).toBe(1)
		expect(mocks.request.request).toHaveBeenCalledWith({
			method: 'eth_blockNumber',
			params: [],
		})
	})

	it('should handle error in response', async () => {
		const { layer } = createTestLayer()

		const program = Effect.gen(function* () {
			const sendService = yield* SendService
			return yield* sendService.send({
				jsonrpc: '2.0',
				method: 'unsupported',
				params: [],
				id: 1,
			})
		})

		const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
		expect(result.jsonrpc).toBe('2.0')
		expect(result.error).toBeDefined()
		expect(result.error?.code).toBe(-32603)
		expect(result.id).toBe(1)
	})

	it('should send bulk requests', async () => {
		const { layer, mocks } = createTestLayer()

		const program = Effect.gen(function* () {
			const sendService = yield* SendService
			return yield* sendService.sendBulk([
				{
					jsonrpc: '2.0',
					method: 'eth_blockNumber',
					params: [],
					id: 1,
				},
				{
					jsonrpc: '2.0',
					method: 'eth_chainId',
					params: [],
					id: 2,
				},
			])
		})

		const results = await Effect.runPromise(program.pipe(Effect.provide(layer)))
		expect(results).toHaveLength(2)
		expect(results[0]?.result).toBe('0x64')
		expect(results[0]?.id).toBe(1)
		expect(results[1]?.result).toBe('0x1')
		expect(results[1]?.id).toBe(2)
		expect(mocks.request.request).toHaveBeenCalledTimes(2)
	})

	describe('EIP-1193 JSON-RPC error code mapping', () => {
		/**
		 * Helper to create a mock request service that fails with a specific error
		 */
		const createErrorMockService = (errorToThrow: unknown) => ({
			request: vi.fn(() => Effect.fail(errorToThrow)),
		})

		const createErrorTestLayer = (errorToThrow: unknown) => {
			const mockLayer = Layer.succeed(RequestService, createErrorMockService(errorToThrow) as any)
			return Layer.provide(SendLive, mockLayer)
		}

		it('should return -32600 for InvalidRequestError', async () => {
			const layer = createErrorTestLayer(new InvalidRequestError({ message: 'Invalid request' }))
			const program = Effect.gen(function* () {
				const sendService = yield* SendService
				return yield* sendService.send({ jsonrpc: '2.0', method: 'test', params: [], id: 1 })
			})
			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.error?.code).toBe(-32600)
		})

		it('should return -32601 for MethodNotFoundError', async () => {
			const layer = createErrorTestLayer(new MethodNotFoundError({ message: 'Method not found' }))
			const program = Effect.gen(function* () {
				const sendService = yield* SendService
				return yield* sendService.send({ jsonrpc: '2.0', method: 'test', params: [], id: 1 })
			})
			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.error?.code).toBe(-32601)
		})

		it('should return -32602 for InvalidParamsError', async () => {
			const layer = createErrorTestLayer(new InvalidParamsError({ message: 'Invalid params' }))
			const program = Effect.gen(function* () {
				const sendService = yield* SendService
				return yield* sendService.send({ jsonrpc: '2.0', method: 'test', params: [], id: 1 })
			})
			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.error?.code).toBe(-32602)
		})

		it('should return -32603 for InternalError', async () => {
			const layer = createErrorTestLayer(new InternalError({ message: 'Internal error' }))
			const program = Effect.gen(function* () {
				const sendService = yield* SendService
				return yield* sendService.send({ jsonrpc: '2.0', method: 'test', params: [], id: 1 })
			})
			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.error?.code).toBe(-32603)
		})

		it('should return 3 for RevertError (Ethereum convention)', async () => {
			const layer = createErrorTestLayer(new RevertError({ message: 'Execution reverted' }))
			const program = Effect.gen(function* () {
				const sendService = yield* SendService
				return yield* sendService.send({ jsonrpc: '2.0', method: 'test', params: [], id: 1 })
			})
			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.error?.code).toBe(3)
		})

		it('should return -32003 for OutOfGasError', async () => {
			const layer = createErrorTestLayer(new OutOfGasError({ message: 'Out of gas' }))
			const program = Effect.gen(function* () {
				const sendService = yield* SendService
				return yield* sendService.send({ jsonrpc: '2.0', method: 'test', params: [], id: 1 })
			})
			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.error?.code).toBe(-32003)
		})

		it('should return -32015 for InvalidOpcodeError', async () => {
			const layer = createErrorTestLayer(new InvalidOpcodeError({ message: 'Invalid opcode' }))
			const program = Effect.gen(function* () {
				const sendService = yield* SendService
				return yield* sendService.send({ jsonrpc: '2.0', method: 'test', params: [], id: 1 })
			})
			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.error?.code).toBe(-32015)
		})

		it('should return -32015 for InvalidJumpError', async () => {
			const layer = createErrorTestLayer(new InvalidJumpError({ message: 'Invalid jump' }))
			const program = Effect.gen(function* () {
				const sendService = yield* SendService
				return yield* sendService.send({ jsonrpc: '2.0', method: 'test', params: [], id: 1 })
			})
			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.error?.code).toBe(-32015)
		})

		it('should return -32015 for StackOverflowError', async () => {
			const layer = createErrorTestLayer(new StackOverflowError({ message: 'Stack overflow' }))
			const program = Effect.gen(function* () {
				const sendService = yield* SendService
				return yield* sendService.send({ jsonrpc: '2.0', method: 'test', params: [], id: 1 })
			})
			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.error?.code).toBe(-32015)
		})

		it('should return -32015 for StackUnderflowError', async () => {
			const layer = createErrorTestLayer(new StackUnderflowError({ message: 'Stack underflow' }))
			const program = Effect.gen(function* () {
				const sendService = yield* SendService
				return yield* sendService.send({ jsonrpc: '2.0', method: 'test', params: [], id: 1 })
			})
			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.error?.code).toBe(-32015)
		})

		it('should return -32000 for InsufficientFundsError', async () => {
			const layer = createErrorTestLayer(new InsufficientFundsError({ message: 'Insufficient funds' }))
			const program = Effect.gen(function* () {
				const sendService = yield* SendService
				return yield* sendService.send({ jsonrpc: '2.0', method: 'test', params: [], id: 1 })
			})
			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.error?.code).toBe(-32000)
		})

		it('should return -32015 for InsufficientBalanceError', async () => {
			const layer = createErrorTestLayer(new InsufficientBalanceError({ message: 'Insufficient balance' }))
			const program = Effect.gen(function* () {
				const sendService = yield* SendService
				return yield* sendService.send({ jsonrpc: '2.0', method: 'test', params: [], id: 1 })
			})
			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.error?.code).toBe(-32015)
		})

		it('should return -32604 for ForkError', async () => {
			const layer = createErrorTestLayer(new ForkError({ message: 'Fork error' }))
			const program = Effect.gen(function* () {
				const sendService = yield* SendService
				return yield* sendService.send({ jsonrpc: '2.0', method: 'test', params: [], id: 1 })
			})
			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.error?.code).toBe(-32604)
		})

		it('should return -32002 for TimeoutError', async () => {
			const layer = createErrorTestLayer(new TimeoutError({ message: 'Timeout' }))
			const program = Effect.gen(function* () {
				const sendService = yield* SendService
				return yield* sendService.send({ jsonrpc: '2.0', method: 'test', params: [], id: 1 })
			})
			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.error?.code).toBe(-32002)
		})

		it('should return -32603 for NetworkError', async () => {
			const layer = createErrorTestLayer(new NetworkError({ message: 'Network error' }))
			const program = Effect.gen(function* () {
				const sendService = yield* SendService
				return yield* sendService.send({ jsonrpc: '2.0', method: 'test', params: [], id: 1 })
			})
			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.error?.code).toBe(-32603)
		})

		it('should return -32003 for NonceTooLowError', async () => {
			const layer = createErrorTestLayer(new NonceTooLowError({ message: 'Nonce too low' }))
			const program = Effect.gen(function* () {
				const sendService = yield* SendService
				return yield* sendService.send({ jsonrpc: '2.0', method: 'test', params: [], id: 1 })
			})
			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.error?.code).toBe(-32003)
		})

		it('should return -32003 for NonceTooHighError', async () => {
			const layer = createErrorTestLayer(new NonceTooHighError({ message: 'Nonce too high' }))
			const program = Effect.gen(function* () {
				const sendService = yield* SendService
				return yield* sendService.send({ jsonrpc: '2.0', method: 'test', params: [], id: 1 })
			})
			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.error?.code).toBe(-32003)
		})

		it('should return -32003 for GasTooLowError', async () => {
			const layer = createErrorTestLayer(new GasTooLowError({ message: 'Gas too low' }))
			const program = Effect.gen(function* () {
				const sendService = yield* SendService
				return yield* sendService.send({ jsonrpc: '2.0', method: 'test', params: [], id: 1 })
			})
			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.error?.code).toBe(-32003)
		})

		it('should return -32003 for InvalidTransactionError', async () => {
			const layer = createErrorTestLayer(new InvalidTransactionError({ message: 'Invalid transaction' }))
			const program = Effect.gen(function* () {
				const sendService = yield* SendService
				return yield* sendService.send({ jsonrpc: '2.0', method: 'test', params: [], id: 1 })
			})
			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.error?.code).toBe(-32003)
		})

		it('should return -32602 for StateRootNotFoundError', async () => {
			const layer = createErrorTestLayer(new StateRootNotFoundError({ message: 'State root not found' }))
			const program = Effect.gen(function* () {
				const sendService = yield* SendService
				return yield* sendService.send({ jsonrpc: '2.0', method: 'test', params: [], id: 1 })
			})
			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.error?.code).toBe(-32602)
		})

		it('should return -32603 for StorageError', async () => {
			const layer = createErrorTestLayer(new StorageError({ message: 'Storage error' }))
			const program = Effect.gen(function* () {
				const sendService = yield* SendService
				return yield* sendService.send({ jsonrpc: '2.0', method: 'test', params: [], id: 1 })
			})
			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.error?.code).toBe(-32603)
		})

		it('should return -32001 for AccountNotFoundError', async () => {
			const layer = createErrorTestLayer(new AccountNotFoundError({ message: 'Account not found' }))
			const program = Effect.gen(function* () {
				const sendService = yield* SendService
				return yield* sendService.send({ jsonrpc: '2.0', method: 'test', params: [], id: 1 })
			})
			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.error?.code).toBe(-32001)
		})

		it('should return -32001 for BlockNotFoundError', async () => {
			const layer = createErrorTestLayer(new BlockNotFoundError({ message: 'Block not found' }))
			const program = Effect.gen(function* () {
				const sendService = yield* SendService
				return yield* sendService.send({ jsonrpc: '2.0', method: 'test', params: [], id: 1 })
			})
			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.error?.code).toBe(-32001)
		})

		it('should return -32003 for InvalidBlockError', async () => {
			const layer = createErrorTestLayer(new InvalidBlockError({ message: 'Invalid block' }))
			const program = Effect.gen(function* () {
				const sendService = yield* SendService
				return yield* sendService.send({ jsonrpc: '2.0', method: 'test', params: [], id: 1 })
			})
			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.error?.code).toBe(-32003)
		})

		it('should return -32003 for BlockGasLimitExceededError', async () => {
			const layer = createErrorTestLayer(new BlockGasLimitExceededError({ message: 'Block gas limit exceeded' }))
			const program = Effect.gen(function* () {
				const sendService = yield* SendService
				return yield* sendService.send({ jsonrpc: '2.0', method: 'test', params: [], id: 1 })
			})
			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.error?.code).toBe(-32003)
		})

		it('should return -32603 for NodeNotReadyError', async () => {
			const layer = createErrorTestLayer(new NodeNotReadyError({ message: 'Node not ready' }))
			const program = Effect.gen(function* () {
				const sendService = yield* SendService
				return yield* sendService.send({ jsonrpc: '2.0', method: 'test', params: [], id: 1 })
			})
			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.error?.code).toBe(-32603)
		})

		it('should return -32001 for SnapshotNotFoundError', async () => {
			const layer = createErrorTestLayer(new SnapshotNotFoundError({ message: 'Snapshot not found' }))
			const program = Effect.gen(function* () {
				const sendService = yield* SendService
				return yield* sendService.send({ jsonrpc: '2.0', method: 'test', params: [], id: 1 })
			})
			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.error?.code).toBe(-32001)
		})

		it('should return -32001 for FilterNotFoundError', async () => {
			const layer = createErrorTestLayer(new FilterNotFoundError({ message: 'Filter not found' }))
			const program = Effect.gen(function* () {
				const sendService = yield* SendService
				return yield* sendService.send({ jsonrpc: '2.0', method: 'test', params: [], id: 1 })
			})
			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.error?.code).toBe(-32001)
		})

		it('should return -32603 for unknown tagged errors', async () => {
			const layer = createErrorTestLayer(new UnknownTaggedError({ message: 'Unknown error' }))
			const program = Effect.gen(function* () {
				const sendService = yield* SendService
				return yield* sendService.send({ jsonrpc: '2.0', method: 'test', params: [], id: 1 })
			})
			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.error?.code).toBe(-32603)
		})

		it('should use error.code if present on the error object', async () => {
			const errorWithCode = Object.assign(new Error('Custom error'), { code: -32099 })
			const layer = createErrorTestLayer(errorWithCode)
			const program = Effect.gen(function* () {
				const sendService = yield* SendService
				return yield* sendService.send({ jsonrpc: '2.0', method: 'test', params: [], id: 1 })
			})
			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.error?.code).toBe(-32099)
		})

		it('should include error data with _tag for tagged errors', async () => {
			const layer = createErrorTestLayer(new RevertError({ message: 'Reverted' }))
			const program = Effect.gen(function* () {
				const sendService = yield* SendService
				return yield* sendService.send({ jsonrpc: '2.0', method: 'test', params: [], id: 1 })
			})
			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.error?.data?._tag).toBe('RevertError')
		})

		it('should include cause in error data when present', async () => {
			const errorWithCause = Object.assign(new Error('Test error'), {
				_tag: 'InternalError',
				cause: new Error('Root cause')
			})
			const layer = createErrorTestLayer(errorWithCause)
			const program = Effect.gen(function* () {
				const sendService = yield* SendService
				return yield* sendService.send({ jsonrpc: '2.0', method: 'test', params: [], id: 1 })
			})
			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.error?.data?.cause).toContain('Root cause')
		})

		it('should use "Internal error" message when error has no message', async () => {
			const errorNoMessage = { _tag: 'InternalError' }
			const layer = createErrorTestLayer(errorNoMessage)
			const program = Effect.gen(function* () {
				const sendService = yield* SendService
				return yield* sendService.send({ jsonrpc: '2.0', method: 'test', params: [], id: 1 })
			})
			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.error?.message).toBe('Internal error')
		})

		it('should handle sendBulk with multiple error types', async () => {
			// Create a mock that returns different errors for different methods
			const mockService = {
				request: vi.fn(({ method }: { method: string }) => {
					if (method === 'method1') {
						return Effect.fail(new RevertError({ message: 'Reverted' }))
					}
					if (method === 'method2') {
						return Effect.fail(new InvalidParamsError({ message: 'Invalid params' }))
					}
					return Effect.succeed('0x1')
				}),
			}
			const mockLayer = Layer.succeed(RequestService, mockService as any)
			const layer = Layer.provide(SendLive, mockLayer)

			const program = Effect.gen(function* () {
				const sendService = yield* SendService
				return yield* sendService.sendBulk([
					{ jsonrpc: '2.0', method: 'method1', params: [], id: 1 },
					{ jsonrpc: '2.0', method: 'method2', params: [], id: 2 },
					{ jsonrpc: '2.0', method: 'method3', params: [], id: 3 },
				])
			})

			const results = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(results[0]?.error?.code).toBe(3) // RevertError
			expect(results[1]?.error?.code).toBe(-32602) // InvalidParamsError
			expect(results[2]?.result).toBe('0x1') // Success
		})
	})
})
