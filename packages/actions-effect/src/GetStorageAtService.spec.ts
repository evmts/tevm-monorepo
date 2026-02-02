import { describe, it, expect } from 'vitest'
import { Effect, Layer } from 'effect'
import { GetStorageAtService } from './GetStorageAtService.js'

describe('GetStorageAtService', () => {
	describe('service definition', () => {
		it('should be a valid Context.Tag', () => {
			expect(GetStorageAtService).toBeDefined()
			expect(typeof GetStorageAtService).toBe('object')
		})

		it('should have the correct service key', () => {
			const key = GetStorageAtService.key
			expect(key).toBe('@tevm/actions-effect/GetStorageAtService')
		})

		it('should be usable as a Context.Tag for dependency injection', async () => {
			const mockShape = {
				getStorageAt: () =>
					Effect.succeed(
						'0x0000000000000000000000000000000000000000000000000000000000000001' as const,
					),
			}

			const MockLayer = Layer.succeed(GetStorageAtService, mockShape as any)

			const program = Effect.gen(function* () {
				const service = yield* GetStorageAtService
				expect(service).toBeDefined()
				expect(typeof service.getStorageAt).toBe('function')
				return true
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(MockLayer)))
			expect(result).toBe(true)
		})
	})
})
