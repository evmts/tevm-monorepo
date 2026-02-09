import { Effect, Equal, Hash, HashSet } from 'effect'
import { describe, expect, it } from 'vitest'
import { InvalidBlockError } from './InvalidBlockError.js'

describe('InvalidBlockError', () => {
	it('should create an InvalidBlockError with all properties', () => {
		const error = new InvalidBlockError({
			blockNumber: 12345n,
			blockHash: '0xabc123',
			reason: 'Invalid state root',
		})

		expect(error.blockNumber).toBe(12345n)
		expect(error.blockHash).toBe('0xabc123')
		expect(error.reason).toBe('Invalid state root')
		expect(error._tag).toBe('InvalidBlockError')
		expect(error.code).toBe(-32000)
		expect(error.docsPath).toBe('/reference/tevm/errors/classes/invalidblockerror/')
	})

	it('should generate a default message with blockNumber and reason', () => {
		const error = new InvalidBlockError({
			blockNumber: 12345n,
			reason: 'Invalid state root',
		})

		expect(error.message).toBe('Invalid block 12345: Invalid state root')
	})

	it('should generate a default message with blockNumber only', () => {
		const error = new InvalidBlockError({
			blockNumber: 12345n,
		})

		expect(error.message).toBe('Block 12345 is invalid')
	})

	it('should generate a default message with reason only', () => {
		const error = new InvalidBlockError({
			reason: 'Invalid state root',
		})

		expect(error.message).toBe('Invalid block: Invalid state root')
	})

	it('should generate a default message without properties', () => {
		const error = new InvalidBlockError({})

		expect(error.message).toBe('Invalid block')
	})

	it('should allow custom message', () => {
		const error = new InvalidBlockError({
			blockNumber: 12345n,
			reason: 'Invalid state root',
			message: 'Custom invalid block message',
		})

		expect(error.message).toBe('Custom invalid block message')
	})

	it('should be usable in Effect.fail', async () => {
		const error = new InvalidBlockError({
			blockNumber: 12345n,
			reason: 'Invalid state root',
		})

		const program = Effect.fail(error)

		const result = await Effect.runPromise(Effect.either(program))

		expect(result._tag).toBe('Left')
		if (result._tag === 'Left') {
			expect(result.left._tag).toBe('InvalidBlockError')
		}
	})

	it('should be catchable by tag', async () => {
		const error = new InvalidBlockError({
			blockNumber: 12345n,
			reason: 'Invalid state root',
		})

		const program = Effect.fail(error).pipe(
			Effect.catchTag('InvalidBlockError', (e) => Effect.succeed(`Block ${e.blockNumber} failed: ${e.reason}`)),
		)

		const result = await Effect.runPromise(program)
		expect(result).toBe('Block 12345 failed: Invalid state root')
	})

	it('should have correct static properties', () => {
		expect(InvalidBlockError.code).toBe(-32000)
		expect(InvalidBlockError.docsPath).toBe('/reference/tevm/errors/classes/invalidblockerror/')
	})

	it('should create with empty props', () => {
		const error = new InvalidBlockError()

		expect(error.blockNumber).toBeUndefined()
		expect(error.blockHash).toBeUndefined()
		expect(error.reason).toBeUndefined()
		expect(error._tag).toBe('InvalidBlockError')
		expect(error.message).toBe('Invalid block')
	})

	it('should NOT be frozen (for Effect trait compatibility)', () => {
		const error = new InvalidBlockError({
			blockNumber: 12345n,
			reason: 'Invalid state root',
		})

		expect(Object.isFrozen(error)).toBe(false)
		expect(Object.isExtensible(error)).toBe(true)
	})

	it('should accept and store cause property for error chaining', () => {
		const originalError = new Error('State root mismatch')
		const error = new InvalidBlockError({
			blockNumber: 12345n,
			reason: 'Invalid state root',
			cause: originalError,
		})

		expect(error.cause).toBe(originalError)
		expect(error.cause).toBeInstanceOf(Error)
		expect((error.cause as Error).message).toBe('State root mismatch')
	})

	it('should have undefined cause when not provided', () => {
		const error = new InvalidBlockError({
			blockNumber: 12345n,
			reason: 'Invalid state root',
		})

		expect(error.cause).toBeUndefined()
	})

	describe('Effect traits', () => {
		it('should support Equal.equals for structural equality', () => {
			const error1 = new InvalidBlockError({
				blockNumber: 12345n,
				reason: 'Invalid state root',
			})
			const error2 = new InvalidBlockError({
				blockNumber: 12345n,
				reason: 'Invalid state root',
			})

			expect(Equal.equals(error1, error2)).toBe(true)
		})

		it('should return false for Equal.equals with different properties', () => {
			const error1 = new InvalidBlockError({
				blockNumber: 12345n,
				reason: 'Invalid state root',
			})
			const error2 = new InvalidBlockError({
				blockNumber: 67890n,
				reason: 'Invalid state root',
			})

			expect(Equal.equals(error1, error2)).toBe(false)
		})

		it('should have consistent Hash values for equal errors', () => {
			const error1 = new InvalidBlockError({
				blockNumber: 555n,
				reason: 'Bad header',
			})
			const error2 = new InvalidBlockError({
				blockNumber: 555n,
				reason: 'Bad header',
			})

			expect(Hash.hash(error1)).toBe(Hash.hash(error2))
		})

		it('should have different Hash values for different errors', () => {
			const error1 = new InvalidBlockError({
				blockNumber: 111n,
				reason: 'Bad header',
			})
			const error2 = new InvalidBlockError({
				blockNumber: 222n,
				reason: 'Bad header',
			})

			expect(Hash.hash(error1)).not.toBe(Hash.hash(error2))
		})

		it('should work correctly in Effect HashSet', () => {
			const error1 = new InvalidBlockError({
				blockNumber: 999n,
				blockHash: '0xdeadbeef',
				reason: 'Invalid',
			})
			const error2 = new InvalidBlockError({
				blockNumber: 999n,
				blockHash: '0xdeadbeef',
				reason: 'Invalid',
			})

			const set = HashSet.make(error1)
			expect(HashSet.has(set, error2)).toBe(true)
		})
	})
})
