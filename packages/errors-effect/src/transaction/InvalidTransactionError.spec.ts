import { Effect, Equal, Hash, HashSet } from 'effect'
import { describe, expect, it } from 'vitest'
import { InvalidTransactionError } from './InvalidTransactionError.js'

describe('InvalidTransactionError', () => {
	it('should create a InvalidTransactionError with default properties', () => {
		const error = new InvalidTransactionError({})

		expect(error._tag).toBe('InvalidTransactionError')
		expect(error.code).toBe(-32003)
		expect(error.docsPath).toBe('/reference/tevm/errors/classes/invalidtransactionerror/')
		expect(error.message).toBe('Invalid transaction')
	})

	it('should create with reason property', () => {
		const error = new InvalidTransactionError({
			reason: 'Invalid nonce',
		})

		expect(error.reason).toBe('Invalid nonce')
		expect(error.message).toBe('Invalid transaction: Invalid nonce')
	})

	it('should create with tx property', () => {
		const tx = { to: '0x123', value: 100n }
		const error = new InvalidTransactionError({
			reason: 'Invalid recipient',
			tx,
		})

		expect(error.tx).toBe(tx)
	})

	it('should allow custom message', () => {
		const error = new InvalidTransactionError({
			reason: 'Invalid nonce',
			message: 'Custom invalid transaction message',
		})

		expect(error.message).toBe('Custom invalid transaction message')
	})

	it('should create with empty props', () => {
		const error = new InvalidTransactionError()

		expect(error._tag).toBe('InvalidTransactionError')
	})

	it('should accept cause for error chaining', () => {
		const originalError = new Error('Original error')
		const error = new InvalidTransactionError({
			reason: 'Invalid nonce',
			cause: originalError,
		})

		expect(error.cause).toBe(originalError)
	})

	it('should be usable in Effect.fail', async () => {
		const error = new InvalidTransactionError({
			reason: 'Invalid nonce',
		})

		const program = Effect.fail(error)

		const result = await Effect.runPromise(Effect.either(program))

		expect(result._tag).toBe('Left')
		if (result._tag === 'Left') {
			expect(result.left._tag).toBe('InvalidTransactionError')
		}
	})

	it('should be catchable by tag', async () => {
		const error = new InvalidTransactionError({
			reason: 'Invalid nonce',
		})

		const program = Effect.fail(error).pipe(
			Effect.catchTag('InvalidTransactionError', () => Effect.succeed('Transaction error handled')),
		)

		const result = await Effect.runPromise(program)
		expect(result).toBe('Transaction error handled')
	})

	it('should have correct static properties', () => {
		expect(InvalidTransactionError.code).toBe(-32003)
		expect(InvalidTransactionError.docsPath).toBe('/reference/tevm/errors/classes/invalidtransactionerror/')
	})

	it('should NOT be frozen (for Effect trait compatibility)', () => {
		const error = new InvalidTransactionError({})

		expect(Object.isFrozen(error)).toBe(false)
		expect(Object.isExtensible(error)).toBe(true)
	})

	describe('Effect traits', () => {
		it('should support Equal.equals for structural equality', () => {
			const error1 = new InvalidTransactionError({
				reason: 'Invalid nonce',
			})
			const error2 = new InvalidTransactionError({
				reason: 'Invalid nonce',
			})

			expect(Equal.equals(error1, error2)).toBe(true)
		})

		it('should return false for Equal.equals with different properties', () => {
			const error1 = new InvalidTransactionError({
				reason: 'Invalid nonce',
			})
			const error2 = new InvalidTransactionError({
				reason: 'Invalid gas',
			})

			expect(Equal.equals(error1, error2)).toBe(false)
		})

		it('should have consistent Hash values for equal errors', () => {
			const error1 = new InvalidTransactionError({
				reason: 'Invalid nonce',
			})
			const error2 = new InvalidTransactionError({
				reason: 'Invalid nonce',
			})

			expect(Hash.hash(error1)).toBe(Hash.hash(error2))
		})

		it('should work correctly in Effect HashSet', () => {
			const error1 = new InvalidTransactionError({
				reason: 'Invalid nonce',
			})
			const error2 = new InvalidTransactionError({
				reason: 'Invalid nonce',
			})

			const set = HashSet.make(error1)
			expect(HashSet.has(set, error2)).toBe(true)
		})
	})
})
