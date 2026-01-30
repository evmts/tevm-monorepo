import { describe, expect, it } from 'vitest'
import { Effect, Equal, Hash, HashSet } from 'effect'
import { StackUnderflowError } from './StackUnderflowError.js'

describe('StackUnderflowError', () => {
	it('should create a StackUnderflowError', () => {
		const error = new StackUnderflowError({})

		expect(error._tag).toBe('StackUnderflowError')
		expect(error.code).toBe(-32015)
		expect(error.docsPath).toBe('/reference/tevm/errors/classes/stackunderflowerror/')
	})

	it('should use default message', () => {
		const error = new StackUnderflowError({})

		expect(error.message).toBe('Stack underflow error occurred.')
	})

	it('should allow custom message', () => {
		const error = new StackUnderflowError({
			message: 'Custom stack underflow message',
		})

		expect(error.message).toBe('Custom stack underflow message')
	})

	it('should create with empty props', () => {
		const error = new StackUnderflowError()

		expect(error._tag).toBe('StackUnderflowError')
	})

	it('should be usable in Effect.fail', async () => {
		const error = new StackUnderflowError({})

		const program = Effect.fail(error)

		const result = await Effect.runPromise(Effect.either(program))

		expect(result._tag).toBe('Left')
		if (result._tag === 'Left') {
			expect(result.left._tag).toBe('StackUnderflowError')
		}
	})

	it('should be catchable by tag', async () => {
		const error = new StackUnderflowError({})

		const program = Effect.fail(error).pipe(
			Effect.catchTag('StackUnderflowError', () =>
				Effect.succeed('Stack underflow handled')
			)
		)

		const result = await Effect.runPromise(program)
		expect(result).toBe('Stack underflow handled')
	})

	it('should have correct static properties', () => {
		expect(StackUnderflowError.code).toBe(-32015)
		expect(StackUnderflowError.docsPath).toBe('/reference/tevm/errors/classes/stackunderflowerror/')
	})

	it('should NOT be frozen (for Effect trait compatibility)', () => {
		const error = new StackUnderflowError({})

		// Object.freeze is NOT used because Effect.ts requires objects to be extensible
		// for its Equal.equals and Hash.hash trait implementations (Symbol-based caching).
		// Properties are marked @readonly in JSDoc for documentation purposes only.
		expect(Object.isFrozen(error)).toBe(false)
		expect(Object.isExtensible(error)).toBe(true)
	})

	it('should accept and store cause property for error chaining', () => {
		const originalError = new Error('Original error')
		const error = new StackUnderflowError({
			cause: originalError,
		})

		expect(error.cause).toBe(originalError)
		expect(error.cause).toBeInstanceOf(Error)
		expect((error.cause as Error).message).toBe('Original error')
	})

	it('should have undefined cause when not provided', () => {
		const error = new StackUnderflowError({})

		expect(error.cause).toBeUndefined()
	})

	describe('Effect traits', () => {
		it('should support Equal.equals for structural equality', () => {
			const error1 = new StackUnderflowError({
				message: 'Test underflow',
			})
			const error2 = new StackUnderflowError({
				message: 'Test underflow',
			})

			expect(Equal.equals(error1, error2)).toBe(true)
		})

		it('should return false for Equal.equals with different properties', () => {
			const error1 = new StackUnderflowError({
				message: 'Error 1',
			})
			const error2 = new StackUnderflowError({
				message: 'Error 2',
			})

			expect(Equal.equals(error1, error2)).toBe(false)
		})

		it('should have consistent Hash values for equal errors', () => {
			const error1 = new StackUnderflowError({
				message: 'Consistent message',
			})
			const error2 = new StackUnderflowError({
				message: 'Consistent message',
			})

			expect(Hash.hash(error1)).toBe(Hash.hash(error2))
		})

		it('should have different Hash values for different errors', () => {
			const error1 = new StackUnderflowError({
				message: 'Message A',
			})
			const error2 = new StackUnderflowError({
				message: 'Message B',
			})

			expect(Hash.hash(error1)).not.toBe(Hash.hash(error2))
		})

		it('should work correctly in Effect HashSet', () => {
			const error1 = new StackUnderflowError({
				message: 'Unique stack underflow',
			})
			const error2 = new StackUnderflowError({
				message: 'Unique stack underflow',
			})

			const set = HashSet.make(error1)
			expect(HashSet.has(set, error2)).toBe(true)
		})
	})
})
