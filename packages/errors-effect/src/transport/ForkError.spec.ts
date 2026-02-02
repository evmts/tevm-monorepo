import { describe, expect, it } from 'vitest'
import { Effect, Equal, Hash, HashSet } from 'effect'
import { ForkError } from './ForkError.js'

describe('ForkError', () => {
	it('should create a ForkError with default properties', () => {
		const error = new ForkError({})

		expect(error._tag).toBe('ForkError')
		expect(error.code).toBe(-32604)
		expect(error.docsPath).toBe('/reference/tevm/errors/classes/forkerror/')
		expect(error.message).toBe('Fork request failed')
	})

	it('should create with method property', () => {
		const error = new ForkError({
			method: 'eth_getBalance',
		})

		expect(error.method).toBe('eth_getBalance')
		expect(error.message).toBe("Fork request failed for method 'eth_getBalance'")
	})

	it('should allow custom message', () => {
		const error = new ForkError({
			method: 'eth_call',
			message: 'Custom fork error message',
		})

		expect(error.message).toBe('Custom fork error message')
	})

	it('should create with empty props', () => {
		const error = new ForkError()

		expect(error._tag).toBe('ForkError')
	})

	it('should use cause error code when available', () => {
		const causeError = { code: -32000, message: 'RPC error' }
		const error = new ForkError({
			method: 'eth_getBalance',
			cause: causeError,
		})

		expect(error.code).toBe(-32000)
		expect(error.cause).toBe(causeError)
	})

	it('should use default code when cause has no code', () => {
		const causeError = new Error('Network timeout')
		const error = new ForkError({
			method: 'eth_getBalance',
			cause: causeError,
		})

		expect(error.code).toBe(-32604)
		expect(error.cause).toBe(causeError)
	})

	it('should be usable in Effect.fail', async () => {
		const error = new ForkError({
			method: 'eth_getBalance',
		})

		const program = Effect.fail(error)

		const result = await Effect.runPromise(Effect.either(program))

		expect(result._tag).toBe('Left')
		if (result._tag === 'Left') {
			expect(result.left._tag).toBe('ForkError')
		}
	})

	it('should be catchable by tag', async () => {
		const error = new ForkError({
			method: 'eth_getBalance',
		})

		const program = Effect.fail(error).pipe(
			Effect.catchTag('ForkError', () =>
				Effect.succeed('Fork error handled')
			)
		)

		const result = await Effect.runPromise(program)
		expect(result).toBe('Fork error handled')
	})

	it('should have correct static properties', () => {
		expect(ForkError.code).toBe(-32604)
		expect(ForkError.docsPath).toBe('/reference/tevm/errors/classes/forkerror/')
	})

	it('should NOT be frozen (for Effect trait compatibility)', () => {
		const error = new ForkError({})

		expect(Object.isFrozen(error)).toBe(false)
		expect(Object.isExtensible(error)).toBe(true)
	})

	describe('Effect traits', () => {
		it('should support Equal.equals for structural equality', () => {
			const error1 = new ForkError({
				method: 'eth_getBalance',
			})
			const error2 = new ForkError({
				method: 'eth_getBalance',
			})

			expect(Equal.equals(error1, error2)).toBe(true)
		})

		it('should return false for Equal.equals with different properties', () => {
			const error1 = new ForkError({
				method: 'eth_getBalance',
			})
			const error2 = new ForkError({
				method: 'eth_call',
			})

			expect(Equal.equals(error1, error2)).toBe(false)
		})

		it('should have consistent Hash values for equal errors', () => {
			const error1 = new ForkError({
				method: 'eth_getBalance',
			})
			const error2 = new ForkError({
				method: 'eth_getBalance',
			})

			expect(Hash.hash(error1)).toBe(Hash.hash(error2))
		})

		it('should work correctly in Effect HashSet', () => {
			const error1 = new ForkError({
				method: 'eth_getBalance',
			})
			const error2 = new ForkError({
				method: 'eth_getBalance',
			})

			const set = HashSet.make(error1)
			expect(HashSet.has(set, error2)).toBe(true)
		})
	})
})
