import { Context, Effect } from 'effect'
import { describe, expect, it } from 'vitest'
import { LoggerLive } from './LoggerLive.js'
import { LoggerService } from './LoggerService.js'

describe('LoggerService', () => {
	describe('Context.Tag', () => {
		it('should be a valid Context.Tag', () => {
			expect(LoggerService).toBeDefined()
			expect(Context.isTag(LoggerService)).toBe(true)
		})

		it('should have the correct service identifier', () => {
			// The tag key should be 'LoggerService'
			const key = LoggerService.key
			expect(key).toBe('@tevm/logger-effect/LoggerService')
		})
	})

	describe('usage in Effect.gen', () => {
		it('should be accessible via yield*', async () => {
			const program = Effect.gen(function* () {
				const logger = yield* LoggerService
				expect(logger).toBeDefined()
				expect(typeof logger.info).toBe('function')
				expect(typeof logger.debug).toBe('function')
				expect(typeof logger.warn).toBe('function')
				expect(typeof logger.error).toBe('function')
				expect(typeof logger.child).toBe('function')
				return 'success'
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(LoggerLive('silent'))))
			expect(result).toBe('success')
		})

		it('should fail if LoggerService is not provided', async () => {
			const program = Effect.gen(function* () {
				const logger = yield* LoggerService
				yield* logger.info('test')
				return 'success'
			})

			await expect(Effect.runPromise(program)).rejects.toThrow()
		})
	})

	describe('dependency composition', () => {
		it('should work with other Effect services', async () => {
			// Example of composing with other services
			const program = Effect.gen(function* () {
				const logger = yield* LoggerService
				yield* logger.info('Starting composite operation')

				// Simulate some work
				const result = yield* Effect.succeed(42)

				yield* logger.debug('Operation complete', { result })
				return result
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(LoggerLive('silent'))))
			expect(result).toBe(42)
		})
	})
})
