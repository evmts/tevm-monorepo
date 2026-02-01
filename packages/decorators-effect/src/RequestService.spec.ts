import { describe, it, expect } from 'vitest'
import { Context, Effect, Layer } from 'effect'
import { RequestService } from './RequestService.js'

describe('RequestService', () => {
	it('should be a valid Context.Tag', () => {
		expect(RequestService).toBeDefined()
		expect(typeof RequestService).toBe('object')
	})

	it('should be usable as Context.Tag', () => {
		// The service should be usable as a Context.Tag identifier
		expect(typeof RequestService).toBe('object')
		// GenericTag creates objects that can be used with Layer.succeed and Effect.gen
		expect(RequestService).toBeDefined()
	})

	it('should be usable in Effect.gen', async () => {
		const mockRequestService = {
			request: ({ method }: { method: string }) => {
				if (method === 'eth_blockNumber') {
					return Effect.succeed('0x64')
				}
				return Effect.succeed(null)
			},
		}

		const testLayer = Layer.succeed(RequestService, mockRequestService as any)

		const program = Effect.gen(function* () {
			const requestService = yield* RequestService
			const result = yield* requestService.request({
				method: 'eth_blockNumber',
				params: [],
			})
			return result
		})

		const result = await Effect.runPromise(program.pipe(Effect.provide(testLayer)))
		expect(result).toBe('0x64')
	})
})
