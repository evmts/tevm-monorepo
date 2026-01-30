import { describe, expect, it } from 'vitest'
import { Effect } from 'effect'
import { LoggerService } from './LoggerService.js'
import { LoggerTest, isTestLogger } from './LoggerTest.js'

describe('LoggerTest', () => {
	describe('layer creation', () => {
		it('should create a layer with default parameters', async () => {
			const program = Effect.gen(function* () {
				const logger = yield* LoggerService
				expect(logger.level).toBe('debug')
				expect(logger.name).toBe('tevm')
				return true
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(LoggerTest())),
			)
			expect(result).toBe(true)
		})

		it('should create a layer with custom level', async () => {
			const program = Effect.gen(function* () {
				const logger = yield* LoggerService
				expect(logger.level).toBe('error')
				return true
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(LoggerTest('error'))),
			)
			expect(result).toBe(true)
		})

		it('should create a layer with custom name', async () => {
			const program = Effect.gen(function* () {
				const logger = yield* LoggerService
				expect(logger.name).toBe('custom-test-logger')
				return true
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(LoggerTest('debug', 'custom-test-logger'))),
			)
			expect(result).toBe(true)
		})
	})

	describe('test-specific methods', () => {
		it('should have getLogs method', async () => {
			const program = Effect.gen(function* () {
				const logger = yield* LoggerService
				if (isTestLogger(logger)) {
					const logs = yield* logger.getLogs()
					expect(Array.isArray(logs)).toBe(true)
					expect(logs).toHaveLength(0)
				}
				return true
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(LoggerTest())),
			)
			expect(result).toBe(true)
		})

		it('should have getLogsByLevel method', async () => {
			const program = Effect.gen(function* () {
				const logger = yield* LoggerService
				if (isTestLogger(logger)) {
					yield* logger.info('info message')
					yield* logger.error('error message')

					const infoLogs = yield* logger.getLogsByLevel('info')
					const errorLogs = yield* logger.getLogsByLevel('error')

					expect(infoLogs).toHaveLength(1)
					expect(errorLogs).toHaveLength(1)
				}
				return true
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(LoggerTest())),
			)
			expect(result).toBe(true)
		})

		it('should have clearLogs method', async () => {
			const program = Effect.gen(function* () {
				const logger = yield* LoggerService
				if (isTestLogger(logger)) {
					yield* logger.info('test')
					let logs = yield* logger.getLogs()
					expect(logs).toHaveLength(1)

					yield* logger.clearLogs()
					logs = yield* logger.getLogs()
					expect(logs).toHaveLength(0)
				}
				return true
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(LoggerTest())),
			)
			expect(result).toBe(true)
		})

		it('should have getLastLog method', async () => {
			const program = Effect.gen(function* () {
				const logger = yield* LoggerService
				if (isTestLogger(logger)) {
					yield* logger.info('first')
					yield* logger.warn('second')
					yield* logger.error('third')

					const lastLog = yield* logger.getLastLog()
					expect(lastLog?.message).toBe('third')
					expect(lastLog?.level).toBe('error')
				}
				return true
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(LoggerTest())),
			)
			expect(result).toBe(true)
		})

		it('should return undefined for getLastLog when empty', async () => {
			const program = Effect.gen(function* () {
				const logger = yield* LoggerService
				if (isTestLogger(logger)) {
					const lastLog = yield* logger.getLastLog()
					expect(lastLog).toBeUndefined()
				}
				return true
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(LoggerTest())),
			)
			expect(result).toBe(true)
		})

		it('should have getLogCount method', async () => {
			const program = Effect.gen(function* () {
				const logger = yield* LoggerService
				if (isTestLogger(logger)) {
					let count = yield* logger.getLogCount()
					expect(count).toBe(0)

					yield* logger.info('one')
					yield* logger.info('two')
					yield* logger.info('three')

					count = yield* logger.getLogCount()
					expect(count).toBe(3)
				}
				return true
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(LoggerTest())),
			)
			expect(result).toBe(true)
		})
	})

	describe('log capture', () => {
		it('should capture log messages', async () => {
			const program = Effect.gen(function* () {
				const logger = yield* LoggerService
				if (isTestLogger(logger)) {
					yield* logger.info('test message')

					const logs = yield* logger.getLogs()
					expect(logs).toHaveLength(1)
					expect(logs[0]?.message).toBe('test message')
				}
				return true
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(LoggerTest())),
			)
			expect(result).toBe(true)
		})

		it('should capture log level', async () => {
			const program = Effect.gen(function* () {
				const logger = yield* LoggerService
				if (isTestLogger(logger)) {
					yield* logger.debug('debug msg')
					yield* logger.info('info msg')
					yield* logger.warn('warn msg')
					yield* logger.error('error msg')

					const logs = yield* logger.getLogs()
					expect(logs[0]?.level).toBe('debug')
					expect(logs[1]?.level).toBe('info')
					expect(logs[2]?.level).toBe('warn')
					expect(logs[3]?.level).toBe('error')
				}
				return true
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(LoggerTest())),
			)
			expect(result).toBe(true)
		})

		it('should capture log data', async () => {
			const program = Effect.gen(function* () {
				const logger = yield* LoggerService
				if (isTestLogger(logger)) {
					yield* logger.info('test', { key: 'value', count: 42 })

					const logs = yield* logger.getLogs()
					expect(logs[0]?.data).toEqual({ key: 'value', count: 42 })
				}
				return true
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(LoggerTest())),
			)
			expect(result).toBe(true)
		})

		it('should capture timestamp', async () => {
			const program = Effect.gen(function* () {
				const logger = yield* LoggerService
				if (isTestLogger(logger)) {
					const beforeTimestamp = Date.now()
					yield* logger.info('test')
					const afterTimestamp = Date.now()

					const logs = yield* logger.getLogs()
					expect(logs[0]?.timestamp).toBeGreaterThanOrEqual(beforeTimestamp)
					expect(logs[0]?.timestamp).toBeLessThanOrEqual(afterTimestamp)
				}
				return true
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(LoggerTest())),
			)
			expect(result).toBe(true)
		})

		it('should capture logger name', async () => {
			const program = Effect.gen(function* () {
				const logger = yield* LoggerService
				if (isTestLogger(logger)) {
					yield* logger.info('test')

					const logs = yield* logger.getLogs()
					expect(logs[0]?.loggerName).toBe('tevm')
				}
				return true
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(LoggerTest())),
			)
			expect(result).toBe(true)
		})
	})

	describe('log level filtering', () => {
		it('should filter logs below configured level', async () => {
			const program = Effect.gen(function* () {
				const logger = yield* LoggerService
				if (isTestLogger(logger)) {
					yield* logger.debug('should be filtered')
					yield* logger.info('should be filtered')
					yield* logger.warn('should be captured')
					yield* logger.error('should be captured')

					const logs = yield* logger.getLogs()
					expect(logs).toHaveLength(2)
					expect(logs[0]?.level).toBe('warn')
					expect(logs[1]?.level).toBe('error')
				}
				return true
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(LoggerTest('warn'))),
			)
			expect(result).toBe(true)
		})

		it('should capture all logs at debug level', async () => {
			const program = Effect.gen(function* () {
				const logger = yield* LoggerService
				if (isTestLogger(logger)) {
					yield* logger.debug('debug')
					yield* logger.info('info')
					yield* logger.warn('warn')
					yield* logger.error('error')

					const logs = yield* logger.getLogs()
					expect(logs).toHaveLength(4)
				}
				return true
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(LoggerTest('debug'))),
			)
			expect(result).toBe(true)
		})
	})

	describe('child loggers', () => {
		it('should capture logs from child loggers', async () => {
			const program = Effect.gen(function* () {
				const logger = yield* LoggerService
				if (isTestLogger(logger)) {
					const child = logger.child('component')
					yield* child.info('child log')

					const logs = yield* logger.getLogs()
					expect(logs).toHaveLength(1)
					expect(logs[0]?.loggerName).toBe('tevm:component')
				}
				return true
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(LoggerTest())),
			)
			expect(result).toBe(true)
		})

		it('should share log storage between parent and child', async () => {
			const program = Effect.gen(function* () {
				const logger = yield* LoggerService
				if (isTestLogger(logger)) {
					yield* logger.info('parent log')

					const child = logger.child('component')
					yield* child.info('child log')

					// Both logs should be visible from parent
					const logs = yield* logger.getLogs()
					expect(logs).toHaveLength(2)
				}
				return true
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(LoggerTest())),
			)
			expect(result).toBe(true)
		})

		it('should allow nested child loggers', async () => {
			const program = Effect.gen(function* () {
				const logger = yield* LoggerService
				if (isTestLogger(logger)) {
					const child1 = logger.child('module')
					const child2 = child1.child('submodule')
					yield* child2.info('nested log')

					const logs = yield* logger.getLogs()
					expect(logs[0]?.loggerName).toBe('tevm:module:submodule')
				}
				return true
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(LoggerTest())),
			)
			expect(result).toBe(true)
		})
	})

	describe('isTestLogger type guard', () => {
		it('should return true for test logger', async () => {
			const program = Effect.gen(function* () {
				const logger = yield* LoggerService
				expect(isTestLogger(logger)).toBe(true)
				return true
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(LoggerTest())),
			)
			expect(result).toBe(true)
		})

		it('should return false for non-test logger', async () => {
			// Create a mock logger shape without test methods
			const mockLogger = {
				level: 'info' as const,
				name: 'mock',
				debug: () => Effect.void,
				info: () => Effect.void,
				warn: () => Effect.void,
				error: () => Effect.void,
				child: () => mockLogger,
			}

			expect(isTestLogger(mockLogger)).toBe(false)
		})
	})

	describe('silent level behavior', () => {
		it('should capture no logs when level is silent', async () => {
			const program = Effect.gen(function* () {
				const logger = yield* LoggerService
				if (isTestLogger(logger)) {
					// Try to log at all levels
					yield* logger.debug('debug')
					yield* logger.info('info')
					yield* logger.warn('warn')
					yield* logger.error('error')

					// No logs should be captured since silent level is higher than all
					const logs = yield* logger.getLogs()
					expect(logs).toHaveLength(0)
				}
				return true
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(LoggerTest('silent'))),
			)
			expect(result).toBe(true)
		})
	})

	describe('getAndClearLogs method', () => {
		it('should return logs and clear them atomically', async () => {
			const program = Effect.gen(function* () {
				const logger = yield* LoggerService
				if (isTestLogger(logger)) {
					yield* logger.info('first')
					yield* logger.warn('second')

					// Get and clear should return logs
					const logs = yield* logger.getAndClearLogs()
					expect(logs).toHaveLength(2)
					expect(logs[0]?.message).toBe('first')
					expect(logs[1]?.message).toBe('second')

					// Logs should now be empty
					const remainingLogs = yield* logger.getLogs()
					expect(remainingLogs).toHaveLength(0)
				}
				return true
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(LoggerTest())),
			)
			expect(result).toBe(true)
		})

		it('should return empty array when no logs exist', async () => {
			const program = Effect.gen(function* () {
				const logger = yield* LoggerService
				if (isTestLogger(logger)) {
					const logs = yield* logger.getAndClearLogs()
					expect(logs).toHaveLength(0)
				}
				return true
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(LoggerTest())),
			)
			expect(result).toBe(true)
		})
	})

	describe('child logger type', () => {
		it('should return TestLoggerShape from child(), allowing test methods', async () => {
			const program = Effect.gen(function* () {
				const logger = yield* LoggerService
				if (isTestLogger(logger)) {
					const child = logger.child('component')

					// Child should have all test methods
					yield* child.info('child log')

					// Should be able to call getLogs on child
					const childLogs = yield* child.getLogs()
					expect(childLogs).toHaveLength(1)

					// Should be able to call getLogCount on child
					const count = yield* child.getLogCount()
					expect(count).toBe(1)

					// Should be able to call clearLogs on child (affects shared storage)
					yield* child.clearLogs()
					const logsAfterClear = yield* logger.getLogs()
					expect(logsAfterClear).toHaveLength(0)

					// Should be able to call getAndClearLogs on child
					yield* child.warn('after clear')
					const clearedLogs = yield* child.getAndClearLogs()
					expect(clearedLogs).toHaveLength(1)
				}
				return true
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(LoggerTest())),
			)
			expect(result).toBe(true)
		})

		it('should allow nested children with test methods', async () => {
			const program = Effect.gen(function* () {
				const logger = yield* LoggerService
				if (isTestLogger(logger)) {
					const child1 = logger.child('level1')
					const child2 = child1.child('level2')

					yield* child2.error('deep log')

					// Test methods should work on deeply nested child
					const lastLog = yield* child2.getLastLog()
					expect(lastLog?.loggerName).toBe('tevm:level1:level2')
					expect(lastLog?.message).toBe('deep log')
				}
				return true
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(LoggerTest())),
			)
			expect(result).toBe(true)
		})
	})

	describe('isolation between layers', () => {
		it('should not share logs between different LoggerTest instances', async () => {
			// First program with its own layer
			const program1 = Effect.gen(function* () {
				const logger = yield* LoggerService
				if (isTestLogger(logger)) {
					yield* logger.info('program 1 log')
					const count = yield* logger.getLogCount()
					return count
				}
				return 0
			})

			// Second program with its own layer
			const program2 = Effect.gen(function* () {
				const logger = yield* LoggerService
				if (isTestLogger(logger)) {
					yield* logger.info('program 2 log')
					yield* logger.info('program 2 second log')
					const count = yield* logger.getLogCount()
					return count
				}
				return 0
			})

			const result1 = await Effect.runPromise(
				program1.pipe(Effect.provide(LoggerTest())),
			)
			const result2 = await Effect.runPromise(
				program2.pipe(Effect.provide(LoggerTest())),
			)

			expect(result1).toBe(1)
			expect(result2).toBe(2)
		})
	})
})
