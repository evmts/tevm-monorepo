import { describe, expect, it } from 'vitest'
import { Effect, Equal, Hash, HashSet } from 'effect'
import { GasTooLowError } from './GasTooLowError.js'

describe('GasTooLowError', () => {
	it('should create a GasTooLowError with all properties', () => {
		const error = new GasTooLowError({
			gasLimit: 21000n,
			intrinsicGas: 53000n,
		})

		expect(error.gasLimit).toBe(21000n)
		expect(error.intrinsicGas).toBe(53000n)
		expect(error._tag).toBe('GasTooLowError')
		expect(error.code).toBe(-32003)
		expect(error.docsPath).toBe('/reference/tevm/errors/classes/gastoolowerror/')
	})

	it('should generate a default message with gasLimit and intrinsicGas', () => {
		const error = new GasTooLowError({
			gasLimit: 21000n,
			intrinsicGas: 53000n,
		})

		expect(error.message).toBe('Gas too low: provided 21000, but intrinsic gas is 53000')
	})

	it('should generate a default message with gasLimit only', () => {
		const error = new GasTooLowError({
			gasLimit: 21000n,
		})

		expect(error.message).toBe('Gas limit 21000 is too low')
	})

	it('should generate a default message without properties', () => {
		const error = new GasTooLowError({})

		expect(error.message).toBe('Transaction gas limit too low')
	})

	it('should allow custom message', () => {
		const error = new GasTooLowError({
			gasLimit: 21000n,
			intrinsicGas: 53000n,
			message: 'Custom gas too low message',
		})

		expect(error.message).toBe('Custom gas too low message')
	})

	it('should be usable in Effect.fail', async () => {
		const error = new GasTooLowError({
			gasLimit: 21000n,
			intrinsicGas: 53000n,
		})

		const program = Effect.fail(error)

		const result = await Effect.runPromise(Effect.either(program))

		expect(result._tag).toBe('Left')
		if (result._tag === 'Left') {
			expect(result.left._tag).toBe('GasTooLowError')
		}
	})

	it('should be catchable by tag', async () => {
		const error = new GasTooLowError({
			gasLimit: 21000n,
			intrinsicGas: 53000n,
		})

		const program = Effect.fail(error).pipe(
			Effect.catchTag('GasTooLowError', (e) =>
				Effect.succeed(`Need ${e.intrinsicGas !== undefined && e.gasLimit !== undefined ? e.intrinsicGas - e.gasLimit : 0n} more gas`)
			)
		)

		const result = await Effect.runPromise(program)
		expect(result).toBe('Need 32000 more gas')
	})

	it('should have correct static properties', () => {
		expect(GasTooLowError.code).toBe(-32003)
		expect(GasTooLowError.docsPath).toBe('/reference/tevm/errors/classes/gastoolowerror/')
	})

	it('should create with empty props', () => {
		const error = new GasTooLowError()

		expect(error.gasLimit).toBeUndefined()
		expect(error.intrinsicGas).toBeUndefined()
		expect(error._tag).toBe('GasTooLowError')
		expect(error.message).toBe('Transaction gas limit too low')
	})

	it('should NOT be frozen (for Effect trait compatibility)', () => {
		const error = new GasTooLowError({
			gasLimit: 21000n,
			intrinsicGas: 53000n,
		})

		expect(Object.isFrozen(error)).toBe(false)
		expect(Object.isExtensible(error)).toBe(true)
	})

	it('should accept and store cause property for error chaining', () => {
		const originalError = new Error('Insufficient gas')
		const error = new GasTooLowError({
			gasLimit: 21000n,
			intrinsicGas: 53000n,
			cause: originalError,
		})

		expect(error.cause).toBe(originalError)
		expect(error.cause).toBeInstanceOf(Error)
		expect((error.cause as Error).message).toBe('Insufficient gas')
	})

	it('should have undefined cause when not provided', () => {
		const error = new GasTooLowError({
			gasLimit: 21000n,
			intrinsicGas: 53000n,
		})

		expect(error.cause).toBeUndefined()
	})

	describe('Effect traits', () => {
		it('should support Equal.equals for structural equality', () => {
			const error1 = new GasTooLowError({
				gasLimit: 21000n,
				intrinsicGas: 53000n,
			})
			const error2 = new GasTooLowError({
				gasLimit: 21000n,
				intrinsicGas: 53000n,
			})

			expect(Equal.equals(error1, error2)).toBe(true)
		})

		it('should return false for Equal.equals with different properties', () => {
			const error1 = new GasTooLowError({
				gasLimit: 21000n,
				intrinsicGas: 53000n,
			})
			const error2 = new GasTooLowError({
				gasLimit: 30000n,
				intrinsicGas: 53000n,
			})

			expect(Equal.equals(error1, error2)).toBe(false)
		})

		it('should have consistent Hash values for equal errors', () => {
			const error1 = new GasTooLowError({
				gasLimit: 10000n,
				intrinsicGas: 25000n,
			})
			const error2 = new GasTooLowError({
				gasLimit: 10000n,
				intrinsicGas: 25000n,
			})

			expect(Hash.hash(error1)).toBe(Hash.hash(error2))
		})

		it('should have different Hash values for different errors', () => {
			const error1 = new GasTooLowError({
				gasLimit: 10000n,
				intrinsicGas: 25000n,
			})
			const error2 = new GasTooLowError({
				gasLimit: 20000n,
				intrinsicGas: 35000n,
			})

			expect(Hash.hash(error1)).not.toBe(Hash.hash(error2))
		})

		it('should work correctly in Effect HashSet', () => {
			const error1 = new GasTooLowError({
				gasLimit: 21000n,
				intrinsicGas: 53000n,
			})
			const error2 = new GasTooLowError({
				gasLimit: 21000n,
				intrinsicGas: 53000n,
			})

			const set = HashSet.make(error1)
			expect(HashSet.has(set, error2)).toBe(true)
		})
	})
})
