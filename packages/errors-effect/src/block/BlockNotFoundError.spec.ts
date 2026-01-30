import { describe, expect, it } from 'vitest'
import { Effect, Equal, Hash, HashSet } from 'effect'
import { BlockNotFoundError } from './BlockNotFoundError.js'

describe('BlockNotFoundError', () => {
	it('should create a BlockNotFoundError with default properties', () => {
		const error = new BlockNotFoundError({})

		expect(error._tag).toBe('BlockNotFoundError')
		expect(error.code).toBe(-32001)
		expect(error.docsPath).toBe('/reference/tevm/errors/classes/unknownblockerror/')
		expect(error.message).toBe('Block not found')
	})

	it('should create with blockTag string', () => {
		const error = new BlockNotFoundError({
			blockTag: 'latest',
		})

		expect(error.blockTag).toBe('latest')
		expect(error.message).toBe("Block 'latest' not found")
	})

	it('should create with blockTag hex', () => {
		const error = new BlockNotFoundError({
			blockTag: '0x1234',
		})

		expect(error.blockTag).toBe('0x1234')
		expect(error.message).toBe("Block '0x1234' not found")
	})

	it('should create with blockTag bigint', () => {
		const error = new BlockNotFoundError({
			blockTag: 12345n,
		})

		expect(error.blockTag).toBe(12345n)
		expect(error.message).toBe("Block '12345' not found")
	})

	it('should create with blockTag number', () => {
		const error = new BlockNotFoundError({
			blockTag: 12345,
		})

		expect(error.blockTag).toBe(12345)
		expect(error.message).toBe("Block '12345' not found")
	})

	it('should allow custom message', () => {
		const error = new BlockNotFoundError({
			blockTag: 'latest',
			message: 'Custom block not found message',
		})

		expect(error.message).toBe('Custom block not found message')
	})

	it('should create with empty props', () => {
		const error = new BlockNotFoundError()

		expect(error._tag).toBe('BlockNotFoundError')
	})

	it('should accept cause for error chaining', () => {
		const originalError = new Error('Original error')
		const error = new BlockNotFoundError({
			blockTag: 'latest',
			cause: originalError,
		})

		expect(error.cause).toBe(originalError)
	})

	it('should be usable in Effect.fail', async () => {
		const error = new BlockNotFoundError({
			blockTag: 'latest',
		})

		const program = Effect.fail(error)

		const result = await Effect.runPromise(Effect.either(program))

		expect(result._tag).toBe('Left')
		if (result._tag === 'Left') {
			expect(result.left._tag).toBe('BlockNotFoundError')
		}
	})

	it('should be catchable by tag', async () => {
		const error = new BlockNotFoundError({
			blockTag: 'latest',
		})

		const program = Effect.fail(error).pipe(
			Effect.catchTag('BlockNotFoundError', () =>
				Effect.succeed('Block error handled')
			)
		)

		const result = await Effect.runPromise(program)
		expect(result).toBe('Block error handled')
	})

	it('should have correct static properties', () => {
		expect(BlockNotFoundError.code).toBe(-32001)
		expect(BlockNotFoundError.docsPath).toBe('/reference/tevm/errors/classes/unknownblockerror/')
	})

	it('should NOT be frozen (for Effect trait compatibility)', () => {
		const error = new BlockNotFoundError({})

		expect(Object.isFrozen(error)).toBe(false)
		expect(Object.isExtensible(error)).toBe(true)
	})

	describe('Effect traits', () => {
		it('should support Equal.equals for structural equality', () => {
			const error1 = new BlockNotFoundError({
				blockTag: 'latest',
			})
			const error2 = new BlockNotFoundError({
				blockTag: 'latest',
			})

			expect(Equal.equals(error1, error2)).toBe(true)
		})

		it('should return false for Equal.equals with different properties', () => {
			const error1 = new BlockNotFoundError({
				blockTag: 'latest',
			})
			const error2 = new BlockNotFoundError({
				blockTag: 'pending',
			})

			expect(Equal.equals(error1, error2)).toBe(false)
		})

		it('should have consistent Hash values for equal errors', () => {
			const error1 = new BlockNotFoundError({
				blockTag: 'latest',
			})
			const error2 = new BlockNotFoundError({
				blockTag: 'latest',
			})

			expect(Hash.hash(error1)).toBe(Hash.hash(error2))
		})

		it('should work correctly in Effect HashSet', () => {
			const error1 = new BlockNotFoundError({
				blockTag: 'latest',
			})
			const error2 = new BlockNotFoundError({
				blockTag: 'latest',
			})

			const set = HashSet.make(error1)
			expect(HashSet.has(set, error2)).toBe(true)
		})
	})
})
