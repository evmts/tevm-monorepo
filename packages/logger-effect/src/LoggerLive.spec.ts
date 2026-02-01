import { describe, expect, it, vi, beforeEach } from 'vitest'
import { Effect } from 'effect'
import { LoggerService } from './LoggerService.js'
import { LoggerLive } from './LoggerLive.js'

describe('LoggerLive', () => {
	describe('layer creation', () => {
		it('should create a layer with default parameters', async () => {
			const program = Effect.gen(function* () {
				const logger = yield* LoggerService
				expect(logger.level).toBe('warn')
				expect(logger.name).toBe('tevm')
				return 'success'
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(LoggerLive())),
			)
			expect(result).toBe('success')
		})

		it('should create a layer with custom level', async () => {
			const program = Effect.gen(function* () {
				const logger = yield* LoggerService
				expect(logger.level).toBe('debug')
				return 'success'
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(LoggerLive('debug'))),
			)
			expect(result).toBe('success')
		})

		it('should create a layer with custom name', async () => {
			const program = Effect.gen(function* () {
				const logger = yield* LoggerService
				expect(logger.name).toBe('custom-logger')
				return 'success'
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(LoggerLive('info', 'custom-logger'))),
			)
			expect(result).toBe('success')
		})

		it('should create a layer with silent level', async () => {
			const program = Effect.gen(function* () {
				const logger = yield* LoggerService
				expect(logger.level).toBe('silent')
				return 'success'
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(LoggerLive('silent'))),
			)
			expect(result).toBe('success')
		})
	})

	describe('logging methods', () => {
		it('should have all required logging methods', async () => {
			const program = Effect.gen(function* () {
				const logger = yield* LoggerService
				expect(typeof logger.debug).toBe('function')
				expect(typeof logger.info).toBe('function')
				expect(typeof logger.warn).toBe('function')
				expect(typeof logger.error).toBe('function')
				return true
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(LoggerLive('silent'))),
			)
			expect(result).toBe(true)
		})

		it('should return Effect.Effect from log methods', async () => {
			const program = Effect.gen(function* () {
				const logger = yield* LoggerService
				const debugEffect = logger.debug('test')
				const infoEffect = logger.info('test')
				const warnEffect = logger.warn('test')
				const errorEffect = logger.error('test')

				// All should be Effect instances
				expect(Effect.isEffect(debugEffect)).toBe(true)
				expect(Effect.isEffect(infoEffect)).toBe(true)
				expect(Effect.isEffect(warnEffect)).toBe(true)
				expect(Effect.isEffect(errorEffect)).toBe(true)

				// Execute them to ensure they don't throw
				yield* debugEffect
				yield* infoEffect
				yield* warnEffect
				yield* errorEffect

				return true
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(LoggerLive('silent'))),
			)
			expect(result).toBe(true)
		})

		it('should accept optional data parameter', async () => {
			const program = Effect.gen(function* () {
				const logger = yield* LoggerService
				// With data
				yield* logger.info('test', { key: 'value' })
				yield* logger.debug('test', { nested: { data: true } })
				yield* logger.warn('test', [1, 2, 3])
				yield* logger.error('test', new Error('test error'))
				// Without data
				yield* logger.info('test')
				return true
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(LoggerLive('silent'))),
			)
			expect(result).toBe(true)
		})
	})

	describe('child loggers', () => {
		it('should create child logger with extended name', async () => {
			const program = Effect.gen(function* () {
				const logger = yield* LoggerService
				const child = logger.child('component')
				expect(child.name).toBe('tevm:component')
				return true
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(LoggerLive('info'))),
			)
			expect(result).toBe(true)
		})

		it('should inherit log level in child loggers', async () => {
			const program = Effect.gen(function* () {
				const logger = yield* LoggerService
				const child = logger.child('component')
				expect(child.level).toBe('debug')
				return true
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(LoggerLive('debug'))),
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
				program.pipe(Effect.provide(LoggerLive('info'))),
			)
			expect(result).toBe(true)
		})

		it('should have functional log methods on child loggers', async () => {
			const program = Effect.gen(function* () {
				const logger = yield* LoggerService
				const child = logger.child('component')

				// All methods should work
				yield* child.debug('debug message')
				yield* child.info('info message')
				yield* child.warn('warn message')
				yield* child.error('error message')

				return true
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(LoggerLive('silent'))),
			)
			expect(result).toBe(true)
		})
	})

	describe('log level filtering', () => {
		it('should respect log level configuration', async () => {
			// This is a behavioral test - we verify the logger respects levels
			// by checking the configuration (actual output filtering is handled by Pino)
			const program = Effect.gen(function* () {
				const logger = yield* LoggerService
				expect(logger.level).toBe('error')

				// These should all execute without error (filtering is internal)
				yield* logger.debug('should be filtered')
				yield* logger.info('should be filtered')
				yield* logger.warn('should be filtered')
				yield* logger.error('should be logged')

				return true
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(LoggerLive('error'))),
			)
			expect(result).toBe(true)
		})
	})

	describe('Effect pipeline integration', () => {
		it('should work in Effect.pipe chains', async () => {
			const program = Effect.gen(function* () {
				const logger = yield* LoggerService
				yield* logger.info('Starting operation')
			}).pipe(
				Effect.flatMap(() => Effect.succeed(42)),
				Effect.tap(() =>
					Effect.gen(function* () {
						const logger = yield* LoggerService
						yield* logger.debug('Operation complete')
					}),
				),
			)

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(LoggerLive('silent'))),
			)
			expect(result).toBe(42)
		})

		it('should be usable across multiple Effect.gen blocks', async () => {
			const logSomething = Effect.gen(function* () {
				const logger = yield* LoggerService
				yield* logger.info('First block')
			})

			const logSomethingElse = Effect.gen(function* () {
				const logger = yield* LoggerService
				yield* logger.info('Second block')
			})

			const program = Effect.gen(function* () {
				yield* logSomething
				yield* logSomethingElse
				return 'done'
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(LoggerLive('silent'))),
			)
			expect(result).toBe('done')
		})
	})
})
