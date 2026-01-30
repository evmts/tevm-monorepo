import { describe, expect, it } from 'vitest'
import { Effect } from 'effect'
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
		expect(error.code).toBe(-32000)
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
		expect(InsufficientBalanceError.code).toBe(-32000)
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

	it('should be immutable (Object.freeze applied)', () => {
		const error = new InsufficientBalanceError({
			address: '0x1234567890123456789012345678901234567890',
			required: 100n,
			available: 50n,
		})

		// Verify the object is frozen
		expect(Object.isFrozen(error)).toBe(true)

		// Verify properties cannot be modified
		const originalAddress = error.address
		try {
			// @ts-expect-error - testing runtime immutability
			error.address = '0xABCD'
		} catch {
			// Expected in strict mode
		}
		expect(error.address).toBe(originalAddress)
	})
})
