import { Effect, Layer } from 'effect'
import { describe, expect, it } from 'vitest'
import { SetAccountService } from './SetAccountService.js'

describe('SetAccountService', () => {
	describe('service definition', () => {
		it('should be a valid Context.Tag', () => {
			expect(SetAccountService).toBeDefined()
			expect(typeof SetAccountService).toBe('object')
		})

		it('should have the correct service key', () => {
			// Access the key through the tag's key property
			const key = SetAccountService.key
			expect(key).toBe('@tevm/actions-effect/SetAccountService')
		})

		it('should be usable as a Context.Tag for dependency injection', async () => {
			// Create a mock implementation of the SetAccountService
			const mockSetAccountShape = {
				setAccount: () => Effect.succeed({ address: '0x1234567890123456789012345678901234567890' as const }),
			}

			const MockLayer = Layer.succeed(SetAccountService, mockSetAccountShape as any)

			const program = Effect.gen(function* () {
				const service = yield* SetAccountService
				expect(service).toBeDefined()
				expect(typeof service.setAccount).toBe('function')
				return true
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(MockLayer)))
			expect(result).toBe(true)
		})
	})
})
