import { describe, expect, it } from 'vitest'
import { Effect } from 'effect'
import { LoggerService } from './LoggerService.js'
import { LoggerSilent } from './LoggerSilent.js'

describe('LoggerSilent', () => {
	describe('layer properties', () => {
		it('should have silent log level', async () => {
			const program = Effect.gen(function* () {
				const logger = yield* LoggerService
				expect(logger.level).toBe('silent')
				return true
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(LoggerSilent)),
			)
			expect(result).toBe(true)
		})

		it('should have default name', async () => {
			const program = Effect.gen(function* () {
				const logger = yield* LoggerService
				expect(logger.name).toBe('tevm')
				return true
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(LoggerSilent)),
			)
			expect(result).toBe(true)
		})
	})

	describe('logging methods', () => {
		it('should have all logging methods', async () => {
			const program = Effect.gen(function* () {
				const logger = yield* LoggerService
				expect(typeof logger.debug).toBe('function')
				expect(typeof logger.info).toBe('function')
				expect(typeof logger.warn).toBe('function')
				expect(typeof logger.error).toBe('function')
				expect(typeof logger.child).toBe('function')
				return true
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(LoggerSilent)),
			)
			expect(result).toBe(true)
		})

		it('should return Effect.void from all log methods', async () => {
			const program = Effect.gen(function* () {
				const logger = yield* LoggerService

				// All methods should return Effect.void
				const debugResult = yield* logger.debug('test')
				const infoResult = yield* logger.info('test')
				const warnResult = yield* logger.warn('test')
				const errorResult = yield* logger.error('test')

				expect(debugResult).toBeUndefined()
				expect(infoResult).toBeUndefined()
				expect(warnResult).toBeUndefined()
				expect(errorResult).toBeUndefined()

				return true
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(LoggerSilent)),
			)
			expect(result).toBe(true)
		})

		it('should not throw when logging with data', async () => {
			const program = Effect.gen(function* () {
				const logger = yield* LoggerService
				yield* logger.debug('message', { key: 'value' })
				yield* logger.info('message', [1, 2, 3])
				yield* logger.warn('message', { nested: { data: true } })
				yield* logger.error('message', new Error('test'))
				return true
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(LoggerSilent)),
			)
			expect(result).toBe(true)
		})
	})

	describe('child loggers', () => {
		it('should create child loggers with extended name', async () => {
			const program = Effect.gen(function* () {
				const logger = yield* LoggerService
				const child = logger.child('component')
				expect(child.name).toBe('tevm:component')
				return true
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(LoggerSilent)),
			)
			expect(result).toBe(true)
		})

		it('should maintain silent level in child loggers', async () => {
			const program = Effect.gen(function* () {
				const logger = yield* LoggerService
				const child = logger.child('component')
				expect(child.level).toBe('silent')
				return true
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(LoggerSilent)),
			)
			expect(result).toBe(true)
		})

		it('should allow nested child loggers', async () => {
			const program = Effect.gen(function* () {
				const logger = yield* LoggerService
				const child1 = logger.child('module')
				const child2 = child1.child('submodule')
				expect(child2.name).toBe('tevm:module:submodule')
				return true
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(LoggerSilent)),
			)
			expect(result).toBe(true)
		})

		it('should have silent log methods on child loggers', async () => {
			const program = Effect.gen(function* () {
				const logger = yield* LoggerService
				const child = logger.child('component')

				// All should return void
				const result = yield* child.debug('test')
				expect(result).toBeUndefined()

				return true
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(LoggerSilent)),
			)
			expect(result).toBe(true)
		})
	})

	describe('performance', () => {
		it('should handle many log calls efficiently', async () => {
			const program = Effect.gen(function* () {
				const logger = yield* LoggerService
				const iterations = 1000

				for (let i = 0; i < iterations; i++) {
					yield* logger.debug('iteration', { i })
				}

				return true
			})

			const startTime = Date.now()
			const result = await Effect.runPromise(
				program.pipe(Effect.provide(LoggerSilent)),
			)
			const elapsed = Date.now() - startTime

			expect(result).toBe(true)
			// Should complete quickly since nothing is actually logged
			expect(elapsed).toBeLessThan(1000)
		})
	})

	describe('Effect pipeline integration', () => {
		it('should work in Effect.pipe chains', async () => {
			const program = Effect.gen(function* () {
				const logger = yield* LoggerService
				yield* logger.info('Starting')
			}).pipe(Effect.flatMap(() => Effect.succeed(42)))

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(LoggerSilent)),
			)
			expect(result).toBe(42)
		})
	})
})
