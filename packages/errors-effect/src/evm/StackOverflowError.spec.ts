import { Effect, Equal, Hash, HashSet } from 'effect'
import { describe, expect, it } from 'vitest'
import { StackOverflowError } from './StackOverflowError.js'

describe('StackOverflowError', () => {
	it('should create a StackOverflowError with stackSize', () => {
		const error = new StackOverflowError({
			stackSize: 1025,
		})

		expect(error.stackSize).toBe(1025)
		expect(error._tag).toBe('StackOverflowError')
		expect(error.code).toBe(-32015)
		expect(error.docsPath).toBe('/reference/tevm/errors/classes/stackoverflowerror/')
	})

	it('should use default message when not provided and no stackSize', () => {
		const error = new StackOverflowError({})

		expect(error.message).toBe('Stack overflow error occurred.')
	})

	it('should include stackSize in auto-generated message when provided', () => {
		const error = new StackOverflowError({
			stackSize: 1025,
		})

		expect(error.message).toBe('Stack overflow error occurred. Stack size: 1025 (max: 1024).')
	})

	it('should allow custom message', () => {
		const error = new StackOverflowError({
			message: 'Custom stack overflow message',
		})

		expect(error.message).toBe('Custom stack overflow message')
	})

	it('should create with empty props', () => {
		const error = new StackOverflowError()

		expect(error.stackSize).toBeUndefined()
		expect(error._tag).toBe('StackOverflowError')
	})

	it('should be usable in Effect.fail', async () => {
		const error = new StackOverflowError({
			stackSize: 1025,
		})

		const program = Effect.fail(error)

		const result = await Effect.runPromise(Effect.either(program))

		expect(result._tag).toBe('Left')
		if (result._tag === 'Left') {
			expect(result.left._tag).toBe('StackOverflowError')
		}
	})

	it('should be catchable by tag', async () => {
		const error = new StackOverflowError({
			stackSize: 1025,
		})

		const program = Effect.fail(error).pipe(
			Effect.catchTag('StackOverflowError', (e) => Effect.succeed(`Stack exceeded: ${e.stackSize} items`)),
		)

		const result = await Effect.runPromise(program)
		expect(result).toBe('Stack exceeded: 1025 items')
	})

	it('should have correct static properties', () => {
		expect(StackOverflowError.code).toBe(-32015)
		expect(StackOverflowError.docsPath).toBe('/reference/tevm/errors/classes/stackoverflowerror/')
	})

	it('should NOT be frozen (for Effect trait compatibility)', () => {
		const error = new StackOverflowError({
			stackSize: 1025,
		})

		// Object.freeze is NOT used because Effect.ts requires objects to be extensible
		// for its Equal.equals and Hash.hash trait implementations (Symbol-based caching).
		// Properties are marked @readonly in JSDoc for documentation purposes only.
		expect(Object.isFrozen(error)).toBe(false)
		expect(Object.isExtensible(error)).toBe(true)
	})

	it('should accept and store cause property for error chaining', () => {
		const originalError = new Error('Original error')
		const error = new StackOverflowError({
			stackSize: 1025,
			cause: originalError,
		})

		expect(error.cause).toBe(originalError)
		expect(error.cause).toBeInstanceOf(Error)
		expect((error.cause as Error).message).toBe('Original error')
	})

	it('should have undefined cause when not provided', () => {
		const error = new StackOverflowError({
			stackSize: 1025,
		})

		expect(error.cause).toBeUndefined()
	})

	describe('Effect traits', () => {
		it('should support Equal.equals for structural equality', () => {
			const error1 = new StackOverflowError({
				stackSize: 1025,
			})
			const error2 = new StackOverflowError({
				stackSize: 1025,
			})

			expect(Equal.equals(error1, error2)).toBe(true)
		})

		it('should return false for Equal.equals with different properties', () => {
			const error1 = new StackOverflowError({
				stackSize: 1025,
			})
			const error2 = new StackOverflowError({
				stackSize: 1026,
			})

			expect(Equal.equals(error1, error2)).toBe(false)
		})

		it('should have consistent Hash values for equal errors', () => {
			const error1 = new StackOverflowError({
				stackSize: 2000,
			})
			const error2 = new StackOverflowError({
				stackSize: 2000,
			})

			expect(Hash.hash(error1)).toBe(Hash.hash(error2))
		})

		it('should have different Hash values for different errors', () => {
			const error1 = new StackOverflowError({
				stackSize: 1025,
			})
			const error2 = new StackOverflowError({
				stackSize: 1030,
			})

			expect(Hash.hash(error1)).not.toBe(Hash.hash(error2))
		})

		it('should work correctly in Effect HashSet', () => {
			const error1 = new StackOverflowError({
				stackSize: 1500,
			})
			const error2 = new StackOverflowError({
				stackSize: 1500,
			})

			const set = HashSet.make(error1)
			expect(HashSet.has(set, error2)).toBe(true)
		})
	})
})
