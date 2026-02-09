import { Effect, Layer } from 'effect'
import { describe, expect, it } from 'vitest'
import { GetBalanceService } from './GetBalanceService.js'

describe('GetBalanceService', () => {
	describe('service definition', () => {
		it('should be a valid Context.Tag', () => {
			expect(GetBalanceService).toBeDefined()
			expect(typeof GetBalanceService).toBe('object')
		})

		it('should have the correct service key', () => {
			const key = GetBalanceService.key
			expect(key).toBe('@tevm/actions-effect/GetBalanceService')
		})

		it('should be usable as a Context.Tag for dependency injection', async () => {
			const mockShape = {
				getBalance: () => Effect.succeed(1000000000000000000n),
			}

			const MockLayer = Layer.succeed(GetBalanceService, mockShape as any)

			const program = Effect.gen(function* () {
				const service = yield* GetBalanceService
				expect(service).toBeDefined()
				expect(typeof service.getBalance).toBe('function')
				return true
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(MockLayer)))
			expect(result).toBe(true)
		})
	})
})
