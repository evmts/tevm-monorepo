import { describe, expect, it } from 'vitest'
import { Effect, Equal, Hash, HashSet } from 'effect'
import { TimeoutError } from './TimeoutError.js'

describe('TimeoutError', () => {
	it('should create a TimeoutError with all properties', () => {
		const error = new TimeoutError({
			timeout: 30000,
			operation: 'eth_call',
		})

		expect(error.timeout).toBe(30000)
		expect(error.operation).toBe('eth_call')
		expect(error._tag).toBe('TimeoutError')
		expect(error.code).toBe(-32002)
		expect(error.docsPath).toBe('/reference/tevm/errors/classes/timeouterror/')
	})

	it('should generate a default message with operation and timeout', () => {
		const error = new TimeoutError({
			operation: 'eth_call',
			timeout: 30000,
		})

		expect(error.message).toBe("Operation 'eth_call' timed out after 30000ms")
	})

	it('should generate a default message with timeout only', () => {
		const error = new TimeoutError({
			timeout: 5000,
		})

		expect(error.message).toBe('Request timed out after 5000ms')
	})

	it('should generate a default message with operation only', () => {
		const error = new TimeoutError({
			operation: 'eth_getBalance',
		})

		expect(error.message).toBe("Operation 'eth_getBalance' timed out")
	})

	it('should generate a default message without properties', () => {
		const error = new TimeoutError({})

		expect(error.message).toBe('Request timed out')
	})

	it('should allow custom message', () => {
		const error = new TimeoutError({
			timeout: 30000,
			operation: 'eth_call',
			message: 'Custom timeout message',
		})

		expect(error.message).toBe('Custom timeout message')
	})

	it('should be usable in Effect.fail', async () => {
		const error = new TimeoutError({
			timeout: 30000,
			operation: 'eth_call',
		})

		const program = Effect.fail(error)

		const result = await Effect.runPromise(Effect.either(program))

		expect(result._tag).toBe('Left')
		if (result._tag === 'Left') {
			expect(result.left._tag).toBe('TimeoutError')
		}
	})

	it('should be catchable by tag', async () => {
		const error = new TimeoutError({
			timeout: 30000,
			operation: 'eth_call',
		})

		const program = Effect.fail(error).pipe(
			Effect.catchTag('TimeoutError', (e) =>
				Effect.succeed(`${e.operation} exceeded ${e.timeout}ms limit`)
			)
		)

		const result = await Effect.runPromise(program)
		expect(result).toBe('eth_call exceeded 30000ms limit')
	})

	it('should have correct static properties', () => {
		expect(TimeoutError.code).toBe(-32002)
		expect(TimeoutError.docsPath).toBe('/reference/tevm/errors/classes/timeouterror/')
	})

	it('should create with empty props', () => {
		const error = new TimeoutError()

		expect(error.timeout).toBeUndefined()
		expect(error.operation).toBeUndefined()
		expect(error._tag).toBe('TimeoutError')
		expect(error.message).toBe('Request timed out')
	})

	it('should NOT be frozen (for Effect trait compatibility)', () => {
		const error = new TimeoutError({
			timeout: 30000,
			operation: 'eth_call',
		})

		expect(Object.isFrozen(error)).toBe(false)
		expect(Object.isExtensible(error)).toBe(true)
	})

	it('should accept and store cause property for error chaining', () => {
		const originalError = new Error('Network timeout')
		const error = new TimeoutError({
			timeout: 30000,
			operation: 'eth_call',
			cause: originalError,
		})

		expect(error.cause).toBe(originalError)
		expect(error.cause).toBeInstanceOf(Error)
		expect((error.cause as Error).message).toBe('Network timeout')
	})

	it('should have undefined cause when not provided', () => {
		const error = new TimeoutError({
			timeout: 30000,
			operation: 'eth_call',
		})

		expect(error.cause).toBeUndefined()
	})

	describe('Effect traits', () => {
		it('should support Equal.equals for structural equality', () => {
			const error1 = new TimeoutError({
				timeout: 30000,
				operation: 'eth_call',
			})
			const error2 = new TimeoutError({
				timeout: 30000,
				operation: 'eth_call',
			})

			expect(Equal.equals(error1, error2)).toBe(true)
		})

		it('should return false for Equal.equals with different properties', () => {
			const error1 = new TimeoutError({
				timeout: 30000,
				operation: 'eth_call',
			})
			const error2 = new TimeoutError({
				timeout: 60000,
				operation: 'eth_call',
			})

			expect(Equal.equals(error1, error2)).toBe(false)
		})

		it('should have consistent Hash values for equal errors', () => {
			const error1 = new TimeoutError({
				timeout: 5000,
				operation: 'eth_getBalance',
			})
			const error2 = new TimeoutError({
				timeout: 5000,
				operation: 'eth_getBalance',
			})

			expect(Hash.hash(error1)).toBe(Hash.hash(error2))
		})

		it('should have different Hash values for different errors', () => {
			const error1 = new TimeoutError({
				timeout: 5000,
				operation: 'eth_getBalance',
			})
			const error2 = new TimeoutError({
				timeout: 10000,
				operation: 'eth_getBalance',
			})

			expect(Hash.hash(error1)).not.toBe(Hash.hash(error2))
		})

		it('should work correctly in Effect HashSet', () => {
			const error1 = new TimeoutError({
				timeout: 30000,
				operation: 'eth_call',
			})
			const error2 = new TimeoutError({
				timeout: 30000,
				operation: 'eth_call',
			})

			const set = HashSet.make(error1)
			expect(HashSet.has(set, error2)).toBe(true)
		})
	})
})
