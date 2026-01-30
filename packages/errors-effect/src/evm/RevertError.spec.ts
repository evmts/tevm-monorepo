import { describe, expect, it } from 'vitest'
import { Effect, Equal, Hash, HashSet } from 'effect'
import { RevertError } from './RevertError.js'

describe('RevertError', () => {
	it('should create a RevertError with data and reason', () => {
		const error = new RevertError({
			raw: '0x08c379a00000000000000000000000000000000000000000000000000000000000000020',
			reason: 'Insufficient allowance',
		})

		expect(error.raw).toBe('0x08c379a00000000000000000000000000000000000000000000000000000000000000020')
		expect(error.reason).toBe('Insufficient allowance')
		expect(error._tag).toBe('RevertError')
		expect(error.code).toBe(3)
		expect(error.docsPath).toBe('/reference/tevm/errors/classes/reverterror/')
	})

	it('should generate message from reason', () => {
		const error = new RevertError({
			reason: 'Test revert reason',
		})

		expect(error.message).toBe('Reverted: Test revert reason')
	})

	it('should use default message when no reason', () => {
		const error = new RevertError({})

		expect(error.message).toBe('Execution reverted')
	})

	it('should allow custom message', () => {
		const error = new RevertError({
			message: 'Custom revert message',
		})

		expect(error.message).toBe('Custom revert message')
	})

	it('should create with empty props', () => {
		const error = new RevertError()

		expect(error.raw).toBeUndefined()
		expect(error.reason).toBeUndefined()
		expect(error._tag).toBe('RevertError')
	})

	it('should be usable in Effect.fail', async () => {
		const error = new RevertError({
			reason: 'Access denied',
		})

		const program = Effect.fail(error)

		const result = await Effect.runPromise(Effect.either(program))

		expect(result._tag).toBe('Left')
		if (result._tag === 'Left') {
			expect(result.left._tag).toBe('RevertError')
		}
	})

	it('should be catchable by tag', async () => {
		const error = new RevertError({
			reason: 'Access denied',
		})

		const program = Effect.fail(error).pipe(
			Effect.catchTag('RevertError', (e) =>
				Effect.succeed(`Transaction reverted: ${e.reason}`)
			)
		)

		const result = await Effect.runPromise(program)
		expect(result).toBe('Transaction reverted: Access denied')
	})

	it('should have correct static properties', () => {
		expect(RevertError.code).toBe(3)
		expect(RevertError.docsPath).toBe('/reference/tevm/errors/classes/reverterror/')
	})

	it('should NOT be frozen (for Effect trait compatibility)', () => {
		const error = new RevertError({
			raw: '0x08c379a0',
			reason: 'Test reason',
		})

		// Object.freeze is NOT used because Effect.ts requires objects to be extensible
		// for its Equal.equals and Hash.hash trait implementations (Symbol-based caching).
		// Properties are marked @readonly in JSDoc for documentation purposes only.
		expect(Object.isFrozen(error)).toBe(false)
		expect(Object.isExtensible(error)).toBe(true)
	})

	it('should accept and store cause property for error chaining', () => {
		const originalError = new Error('Original error')
		const error = new RevertError({
			reason: 'Test reason',
			cause: originalError,
		})

		expect(error.cause).toBe(originalError)
		expect(error.cause).toBeInstanceOf(Error)
		expect((error.cause as Error).message).toBe('Original error')
	})

	it('should have undefined cause when not provided', () => {
		const error = new RevertError({
			reason: 'Test reason',
		})

		expect(error.cause).toBeUndefined()
	})

	describe('Effect traits', () => {
		it('should support Equal.equals for structural equality', () => {
			const error1 = new RevertError({
				raw: '0x08c379a0',
				reason: 'Test reason',
			})
			const error2 = new RevertError({
				raw: '0x08c379a0',
				reason: 'Test reason',
			})

			expect(Equal.equals(error1, error2)).toBe(true)
		})

		it('should return false for Equal.equals with different properties', () => {
			const error1 = new RevertError({
				reason: 'Reason 1',
			})
			const error2 = new RevertError({
				reason: 'Reason 2',
			})

			expect(Equal.equals(error1, error2)).toBe(false)
		})

		it('should have consistent Hash values for equal errors', () => {
			const error1 = new RevertError({
				raw: '0xABCD',
				reason: 'Access denied',
			})
			const error2 = new RevertError({
				raw: '0xABCD',
				reason: 'Access denied',
			})

			expect(Hash.hash(error1)).toBe(Hash.hash(error2))
		})

		it('should have different Hash values for different errors', () => {
			const error1 = new RevertError({
				reason: 'Reason A',
			})
			const error2 = new RevertError({
				reason: 'Reason B',
			})

			expect(Hash.hash(error1)).not.toBe(Hash.hash(error2))
		})

		it('should work correctly in Effect HashSet', () => {
			const error1 = new RevertError({
				raw: '0xDEADBEEF',
				reason: 'Unique reason',
			})
			const error2 = new RevertError({
				raw: '0xDEADBEEF',
				reason: 'Unique reason',
			})

			const set = HashSet.make(error1)
			expect(HashSet.has(set, error2)).toBe(true)
		})
	})
})
