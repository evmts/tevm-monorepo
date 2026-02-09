import { Effect, Equal, Hash, HashSet } from 'effect'
import { describe, expect, it } from 'vitest'
import { OutOfGasError } from './OutOfGasError.js'

describe('OutOfGasError', () => {
	it('should create an OutOfGasError with all properties', () => {
		const error = new OutOfGasError({
			gasUsed: 100000n,
			gasLimit: 21000n,
		})

		expect(error.gasUsed).toBe(100000n)
		expect(error.gasLimit).toBe(21000n)
		expect(error._tag).toBe('OutOfGasError')
		expect(error.code).toBe(-32003)
		expect(error.docsPath).toBe('/reference/tevm/errors/classes/outofgaserror/')
	})

	it('should use default message when no gas info provided', () => {
		const error = new OutOfGasError({})

		expect(error.message).toBe('Out of gas error occurred.')
	})

	it('should include gas info in message when provided', () => {
		const error = new OutOfGasError({
			gasUsed: 100000n,
			gasLimit: 21000n,
		})

		expect(error.message).toBe('Out of gas: used 100000, limit 21000')
	})

	it('should handle partial gas info in message', () => {
		const errorWithOnlyGasUsed = new OutOfGasError({
			gasUsed: 100000n,
		})
		expect(errorWithOnlyGasUsed.message).toBe('Out of gas: used 100000, limit unknown')

		const errorWithOnlyGasLimit = new OutOfGasError({
			gasLimit: 21000n,
		})
		expect(errorWithOnlyGasLimit.message).toBe('Out of gas: used unknown, limit 21000')
	})

	it('should allow custom message', () => {
		const error = new OutOfGasError({
			message: 'Custom gas error message',
		})

		expect(error.message).toBe('Custom gas error message')
	})

	it('should create with empty props', () => {
		const error = new OutOfGasError()

		expect(error.gasUsed).toBeUndefined()
		expect(error.gasLimit).toBeUndefined()
		expect(error._tag).toBe('OutOfGasError')
	})

	it('should be usable in Effect.fail', async () => {
		const error = new OutOfGasError({
			gasUsed: 100000n,
			gasLimit: 21000n,
		})

		const program = Effect.fail(error)

		const result = await Effect.runPromise(Effect.either(program))

		expect(result._tag).toBe('Left')
		if (result._tag === 'Left') {
			expect(result.left._tag).toBe('OutOfGasError')
		}
	})

	it('should be catchable by tag', async () => {
		const error = new OutOfGasError({
			gasUsed: 100000n,
			gasLimit: 21000n,
		})

		const program = Effect.fail(error).pipe(
			Effect.catchTag('OutOfGasError', (e) => Effect.succeed(`Gas exhausted: ${e.gasUsed}/${e.gasLimit}`)),
		)

		const result = await Effect.runPromise(program)
		expect(result).toBe('Gas exhausted: 100000/21000')
	})

	it('should have correct static properties', () => {
		expect(OutOfGasError.code).toBe(-32003)
		expect(OutOfGasError.docsPath).toBe('/reference/tevm/errors/classes/outofgaserror/')
	})

	it('should NOT be frozen (for Effect trait compatibility)', () => {
		const error = new OutOfGasError({
			gasUsed: 100000n,
			gasLimit: 21000n,
		})

		// Object.freeze is NOT used because Effect.ts requires objects to be extensible
		// for its Equal.equals and Hash.hash trait implementations (Symbol-based caching).
		// Properties are marked @readonly in JSDoc for documentation purposes only.
		expect(Object.isFrozen(error)).toBe(false)
		expect(Object.isExtensible(error)).toBe(true)
	})

	it('should accept and store cause property for error chaining', () => {
		const originalError = new Error('Original error')
		const error = new OutOfGasError({
			gasUsed: 100000n,
			gasLimit: 21000n,
			cause: originalError,
		})

		expect(error.cause).toBe(originalError)
		expect(error.cause).toBeInstanceOf(Error)
		expect((error.cause as Error).message).toBe('Original error')
	})

	it('should have undefined cause when not provided', () => {
		const error = new OutOfGasError({
			gasUsed: 100000n,
			gasLimit: 21000n,
		})

		expect(error.cause).toBeUndefined()
	})

	describe('Effect traits', () => {
		it('should support Equal.equals for structural equality', () => {
			const error1 = new OutOfGasError({
				gasUsed: 100000n,
				gasLimit: 21000n,
			})
			const error2 = new OutOfGasError({
				gasUsed: 100000n,
				gasLimit: 21000n,
			})

			expect(Equal.equals(error1, error2)).toBe(true)
		})

		it('should return false for Equal.equals with different properties', () => {
			const error1 = new OutOfGasError({
				gasUsed: 100000n,
				gasLimit: 21000n,
			})
			const error2 = new OutOfGasError({
				gasUsed: 200000n,
				gasLimit: 21000n,
			})

			expect(Equal.equals(error1, error2)).toBe(false)
		})

		it('should have consistent Hash values for equal errors', () => {
			const error1 = new OutOfGasError({
				gasUsed: 50000n,
				gasLimit: 30000n,
			})
			const error2 = new OutOfGasError({
				gasUsed: 50000n,
				gasLimit: 30000n,
			})

			expect(Hash.hash(error1)).toBe(Hash.hash(error2))
		})

		it('should have different Hash values for different errors', () => {
			const error1 = new OutOfGasError({
				gasUsed: 100000n,
				gasLimit: 21000n,
			})
			const error2 = new OutOfGasError({
				gasUsed: 100000n,
				gasLimit: 42000n,
			})

			expect(Hash.hash(error1)).not.toBe(Hash.hash(error2))
		})

		it('should work correctly in Effect HashSet', () => {
			const error1 = new OutOfGasError({
				gasUsed: 75000n,
				gasLimit: 50000n,
			})
			const error2 = new OutOfGasError({
				gasUsed: 75000n,
				gasLimit: 50000n,
			})

			const set = HashSet.make(error1)
			expect(HashSet.has(set, error2)).toBe(true)
		})
	})
})
