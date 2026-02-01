import { describe, it, expect } from 'vitest'
import { Effect, Layer } from 'effect'
import { GetCodeService } from './GetCodeService.js'

describe('GetCodeService', () => {
	describe('service definition', () => {
		it('should be a valid Context.Tag', () => {
			expect(GetCodeService).toBeDefined()
			expect(typeof GetCodeService).toBe('object')
		})

		it('should have the correct service key', () => {
			const key = GetCodeService.key
			expect(key).toBe('@tevm/actions-effect/GetCodeService')
		})

		it('should be usable as a Context.Tag for dependency injection', async () => {
			const mockShape = {
				getCode: () => Effect.succeed('0x6080604052' as const),
			}

			const MockLayer = Layer.succeed(GetCodeService, mockShape as any)

			const program = Effect.gen(function* () {
				const service = yield* GetCodeService
				expect(service).toBeDefined()
				expect(typeof service.getCode).toBe('function')
				return true
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(MockLayer)))
			expect(result).toBe(true)
		})
	})
})
