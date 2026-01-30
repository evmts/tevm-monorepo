import { describe, expect, it } from 'vitest'
import { Effect, Equal, Hash, HashSet } from 'effect'
import { InsufficientBalanceError } from './InsufficientBalanceError.js'

describe('InsufficientBalanceError', () => {
	it('should create an InsufficientBalanceError with all properties', () => {
		const error = new InsufficientBalanceError({
			address: '0x1234567890123456789012345678901234567890',
			required: 1000000000000000000n,
			available: 500000000000000000n,
		})

		expect(error.address).toBe('0x1234567890123456789012345678901234567890')
		expect(error.required).toBe(1000000000000000000n)
		expect(error.available).toBe(500000000000000000n)
		expect(error._tag).toBe('InsufficientBalanceError')
		expect(error.code).toBe(-32015)
		expect(error.docsPath).toBe('/reference/tevm/errors/classes/insufficientbalanceerror/')
	})

	it('should generate a default message', () => {
		const error = new InsufficientBalanceError({
			address: '0xABCD',
			required: 100n,
			available: 50n,
		})

		expect(error.message).toContain('0xABCD')
		expect(error.message).toContain('100')
		expect(error.message).toContain('50')
	})

	it('should allow custom message', () => {
		const error = new InsufficientBalanceError({
			address: '0x1234',
			required: 100n,
			available: 50n,
			message: 'Custom insufficient balance message',
		})

		expect(error.message).toBe('Custom insufficient balance message')
	})

	it('should be usable in Effect.fail', async () => {
		const error = new InsufficientBalanceError({
			address: '0x1234',
			required: 100n,
			available: 50n,
		})

		const program = Effect.fail(error)

		const result = await Effect.runPromise(Effect.either(program))

		expect(result._tag).toBe('Left')
		if (result._tag === 'Left') {
			expect(result.left._tag).toBe('InsufficientBalanceError')
		}
	})

	it('should be catchable by tag', async () => {
		const error = new InsufficientBalanceError({
			address: '0x1234',
			required: 100n,
			available: 50n,
		})

		const program = Effect.fail(error).pipe(
			Effect.catchTag('InsufficientBalanceError', (e) =>
				Effect.succeed(`Need ${e.required - e.available} more`)
			)
		)

		const result = await Effect.runPromise(program)
		expect(result).toBe('Need 50 more')
	})

	it('should have correct static properties', () => {
		expect(InsufficientBalanceError.code).toBe(-32015)
		expect(InsufficientBalanceError.docsPath).toBe('/reference/tevm/errors/classes/insufficientbalanceerror/')
	})

	it('should create with empty props', () => {
		const error = new InsufficientBalanceError()

		expect(error.address).toBeUndefined()
		expect(error.required).toBeUndefined()
		expect(error.available).toBeUndefined()
		expect(error._tag).toBe('InsufficientBalanceError')
		expect(error.message).toBe('Insufficient balance error occurred.')
	})

	it('should use default message when no address provided', () => {
		const error = new InsufficientBalanceError({})

		expect(error.message).toBe('Insufficient balance error occurred.')
	})

	it('should NOT be frozen (for Effect trait compatibility)', () => {
		const error = new InsufficientBalanceError({
			address: '0x1234567890123456789012345678901234567890',
			required: 100n,
			available: 50n,
		})

		// Object.freeze is NOT used because Effect.ts requires objects to be extensible
		// for its Equal.equals and Hash.hash trait implementations (Symbol-based caching).
		// Properties are marked @readonly in JSDoc for documentation purposes only.
		expect(Object.isFrozen(error)).toBe(false)
		expect(Object.isExtensible(error)).toBe(true)
	})

	it('should accept and store cause property for error chaining', () => {
		const originalError = new Error('Original error')
		const error = new InsufficientBalanceError({
			address: '0x1234567890123456789012345678901234567890',
			required: 100n,
			available: 50n,
			cause: originalError,
		})

		expect(error.cause).toBe(originalError)
		expect(error.cause).toBeInstanceOf(Error)
		expect((error.cause as Error).message).toBe('Original error')
	})

	it('should have undefined cause when not provided', () => {
		const error = new InsufficientBalanceError({
			address: '0x1234',
			required: 100n,
			available: 50n,
		})

		expect(error.cause).toBeUndefined()
	})

	describe('Effect traits', () => {
		it('should support Equal.equals for structural equality', () => {
			const error1 = new InsufficientBalanceError({
				address: '0x1234567890123456789012345678901234567890',
				required: 1000n,
				available: 500n,
			})
			const error2 = new InsufficientBalanceError({
				address: '0x1234567890123456789012345678901234567890',
				required: 1000n,
				available: 500n,
			})

			expect(Equal.equals(error1, error2)).toBe(true)
		})

		it('should return false for Equal.equals with different properties', () => {
			const error1 = new InsufficientBalanceError({
				address: '0x1234',
				required: 100n,
				available: 50n,
			})
			const error2 = new InsufficientBalanceError({
				address: '0x1234',
				required: 200n,
				available: 50n,
			})

			expect(Equal.equals(error1, error2)).toBe(false)
		})

		it('should have consistent Hash values for equal errors', () => {
			const error1 = new InsufficientBalanceError({
				address: '0xABCD',
				required: 500n,
				available: 250n,
			})
			const error2 = new InsufficientBalanceError({
				address: '0xABCD',
				required: 500n,
				available: 250n,
			})

			expect(Hash.hash(error1)).toBe(Hash.hash(error2))
		})

		it('should have different Hash values for different errors', () => {
			const error1 = new InsufficientBalanceError({
				address: '0x1111',
				required: 100n,
				available: 50n,
			})
			const error2 = new InsufficientBalanceError({
				address: '0x2222',
				required: 100n,
				available: 50n,
			})

			expect(Hash.hash(error1)).not.toBe(Hash.hash(error2))
		})

		it('should work correctly in Effect HashSet', () => {
			const error1 = new InsufficientBalanceError({
				address: '0xDEAD',
				required: 1000n,
				available: 0n,
			})
			const error2 = new InsufficientBalanceError({
				address: '0xDEAD',
				required: 1000n,
				available: 0n,
			})

			const set = HashSet.make(error1)
			expect(HashSet.has(set, error2)).toBe(true)
		})
	})
})
