import { Effect, Equal, Hash, HashSet } from 'effect'
import { describe, expect, it } from 'vitest'
import { BlockGasLimitExceededError } from './BlockGasLimitExceededError.js'

describe('BlockGasLimitExceededError', () => {
	it('should create a BlockGasLimitExceededError with all properties', () => {
		const error = new BlockGasLimitExceededError({
			blockGasLimit: 30000000n,
			gasUsed: 35000000n,
		})

		expect(error.blockGasLimit).toBe(30000000n)
		expect(error.gasUsed).toBe(35000000n)
		expect(error._tag).toBe('BlockGasLimitExceededError')
		expect(error.code).toBe(-32000)
		expect(error.docsPath).toBe('/reference/tevm/errors/classes/blockgaslimitexceedederror/')
	})

	it('should generate a default message with blockGasLimit and gasUsed', () => {
		const error = new BlockGasLimitExceededError({
			blockGasLimit: 30000000n,
			gasUsed: 35000000n,
		})

		expect(error.message).toBe('Block gas limit exceeded: used 35000000 of 30000000')
	})

	it('should generate a default message with gasUsed only', () => {
		const error = new BlockGasLimitExceededError({
			gasUsed: 35000000n,
		})

		expect(error.message).toBe('Gas usage 35000000 exceeds block gas limit')
	})

	it('should generate a default message without properties', () => {
		const error = new BlockGasLimitExceededError({})

		expect(error.message).toBe('Block gas limit exceeded')
	})

	it('should allow custom message', () => {
		const error = new BlockGasLimitExceededError({
			blockGasLimit: 30000000n,
			gasUsed: 35000000n,
			message: 'Custom gas limit exceeded message',
		})

		expect(error.message).toBe('Custom gas limit exceeded message')
	})

	it('should be usable in Effect.fail', async () => {
		const error = new BlockGasLimitExceededError({
			blockGasLimit: 30000000n,
			gasUsed: 35000000n,
		})

		const program = Effect.fail(error)

		const result = await Effect.runPromise(Effect.either(program))

		expect(result._tag).toBe('Left')
		if (result._tag === 'Left') {
			expect(result.left._tag).toBe('BlockGasLimitExceededError')
		}
	})

	it('should be catchable by tag', async () => {
		const error = new BlockGasLimitExceededError({
			blockGasLimit: 30000000n,
			gasUsed: 35000000n,
		})

		const program = Effect.fail(error).pipe(
			Effect.catchTag('BlockGasLimitExceededError', (e) =>
				Effect.succeed(
					`Exceeded by ${e.gasUsed !== undefined && e.blockGasLimit !== undefined ? e.gasUsed - e.blockGasLimit : 0n}`,
				),
			),
		)

		const result = await Effect.runPromise(program)
		expect(result).toBe('Exceeded by 5000000')
	})

	it('should have correct static properties', () => {
		expect(BlockGasLimitExceededError.code).toBe(-32000)
		expect(BlockGasLimitExceededError.docsPath).toBe('/reference/tevm/errors/classes/blockgaslimitexceedederror/')
	})

	it('should create with empty props', () => {
		const error = new BlockGasLimitExceededError()

		expect(error.blockGasLimit).toBeUndefined()
		expect(error.gasUsed).toBeUndefined()
		expect(error._tag).toBe('BlockGasLimitExceededError')
		expect(error.message).toBe('Block gas limit exceeded')
	})

	it('should NOT be frozen (for Effect trait compatibility)', () => {
		const error = new BlockGasLimitExceededError({
			blockGasLimit: 30000000n,
			gasUsed: 35000000n,
		})

		expect(Object.isFrozen(error)).toBe(false)
		expect(Object.isExtensible(error)).toBe(true)
	})

	it('should accept and store cause property for error chaining', () => {
		const originalError = new Error('Transaction too large')
		const error = new BlockGasLimitExceededError({
			blockGasLimit: 30000000n,
			gasUsed: 35000000n,
			cause: originalError,
		})

		expect(error.cause).toBe(originalError)
		expect(error.cause).toBeInstanceOf(Error)
		expect((error.cause as Error).message).toBe('Transaction too large')
	})

	it('should have undefined cause when not provided', () => {
		const error = new BlockGasLimitExceededError({
			blockGasLimit: 30000000n,
			gasUsed: 35000000n,
		})

		expect(error.cause).toBeUndefined()
	})

	describe('Effect traits', () => {
		it('should support Equal.equals for structural equality', () => {
			const error1 = new BlockGasLimitExceededError({
				blockGasLimit: 30000000n,
				gasUsed: 35000000n,
			})
			const error2 = new BlockGasLimitExceededError({
				blockGasLimit: 30000000n,
				gasUsed: 35000000n,
			})

			expect(Equal.equals(error1, error2)).toBe(true)
		})

		it('should return false for Equal.equals with different properties', () => {
			const error1 = new BlockGasLimitExceededError({
				blockGasLimit: 30000000n,
				gasUsed: 35000000n,
			})
			const error2 = new BlockGasLimitExceededError({
				blockGasLimit: 30000000n,
				gasUsed: 40000000n,
			})

			expect(Equal.equals(error1, error2)).toBe(false)
		})

		it('should have consistent Hash values for equal errors', () => {
			const error1 = new BlockGasLimitExceededError({
				blockGasLimit: 15000000n,
				gasUsed: 20000000n,
			})
			const error2 = new BlockGasLimitExceededError({
				blockGasLimit: 15000000n,
				gasUsed: 20000000n,
			})

			expect(Hash.hash(error1)).toBe(Hash.hash(error2))
		})

		it('should have different Hash values for different errors', () => {
			const error1 = new BlockGasLimitExceededError({
				blockGasLimit: 10000000n,
				gasUsed: 15000000n,
			})
			const error2 = new BlockGasLimitExceededError({
				blockGasLimit: 20000000n,
				gasUsed: 25000000n,
			})

			expect(Hash.hash(error1)).not.toBe(Hash.hash(error2))
		})

		it('should work correctly in Effect HashSet', () => {
			const error1 = new BlockGasLimitExceededError({
				blockGasLimit: 30000000n,
				gasUsed: 35000000n,
			})
			const error2 = new BlockGasLimitExceededError({
				blockGasLimit: 30000000n,
				gasUsed: 35000000n,
			})

			const set = HashSet.make(error1)
			expect(HashSet.has(set, error2)).toBe(true)
		})
	})
})
