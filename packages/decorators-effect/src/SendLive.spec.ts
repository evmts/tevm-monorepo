import { describe, it, expect, vi } from 'vitest'
import { Effect, Layer } from 'effect'
import { SendService } from './SendService.js'
import { SendLive } from './SendLive.js'
import { RequestService } from './RequestService.js'

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
})
