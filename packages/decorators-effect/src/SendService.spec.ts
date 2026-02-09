import { Effect, Layer } from 'effect'
import { describe, expect, it } from 'vitest'
import { SendService } from './SendService.js'

describe('SendService', () => {
	it('should be a valid Context.Tag', () => {
		expect(SendService).toBeDefined()
		expect(typeof SendService).toBe('object')
	})

	it('should be usable as Context.Tag', () => {
		// The service should be usable as a Context.Tag identifier
		expect(typeof SendService).toBe('object')
		// GenericTag creates objects that can be used with Layer.succeed and Effect.gen
		expect(SendService).toBeDefined()
	})

	it('should be usable in Effect.gen', async () => {
		const mockSendService = {
			send: ({ method: _method, id }: { method: string; id: number }) =>
				Effect.succeed({
					jsonrpc: '2.0' as const,
					result: '0x64',
					id,
				}),
			sendBulk: (requests: Array<{ method: string; id: number }>) =>
				Effect.succeed(
					requests.map((req) => ({
						jsonrpc: '2.0' as const,
						result: '0x64',
						id: req.id,
					})),
				),
		}

		const testLayer = Layer.succeed(SendService, mockSendService as any)

		const program = Effect.gen(function* () {
			const sendService = yield* SendService
			const result = yield* sendService.send({
				jsonrpc: '2.0',
				method: 'eth_blockNumber',
				params: [],
				id: 1,
			})
			return result
		})

		const result = await Effect.runPromise(program.pipe(Effect.provide(testLayer)))
		expect(result.result).toBe('0x64')
		expect(result.id).toBe(1)
	})
})
