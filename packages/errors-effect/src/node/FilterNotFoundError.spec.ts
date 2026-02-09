import { Effect, Equal, Hash, HashSet } from 'effect'
import { describe, expect, it } from 'vitest'
import { FilterNotFoundError } from './FilterNotFoundError.js'

describe('FilterNotFoundError', () => {
	it('should create a FilterNotFoundError with all properties', () => {
		const error = new FilterNotFoundError({
			filterId: '0xabc123',
		})

		expect(error.filterId).toBe('0xabc123')
		expect(error._tag).toBe('FilterNotFoundError')
		expect(error.code).toBe(-32001)
		expect(error.docsPath).toBe('/reference/tevm/errors/classes/filternotfounderror/')
	})

	it('should generate a default message with filterId', () => {
		const error = new FilterNotFoundError({
			filterId: '0xabc123',
		})

		expect(error.message).toBe("Filter '0xabc123' not found")
	})

	it('should generate a default message without filterId', () => {
		const error = new FilterNotFoundError({})

		expect(error.message).toBe('Filter not found')
	})

	it('should allow custom message', () => {
		const error = new FilterNotFoundError({
			filterId: '0x123',
			message: 'Custom filter not found message',
		})

		expect(error.message).toBe('Custom filter not found message')
	})

	it('should be usable in Effect.fail', async () => {
		const error = new FilterNotFoundError({
			filterId: '0x123',
		})

		const program = Effect.fail(error)

		const result = await Effect.runPromise(Effect.either(program))

		expect(result._tag).toBe('Left')
		if (result._tag === 'Left') {
			expect(result.left._tag).toBe('FilterNotFoundError')
		}
	})

	it('should be catchable by tag', async () => {
		const error = new FilterNotFoundError({
			filterId: '0xfilter123',
		})

		const program = Effect.fail(error).pipe(
			Effect.catchTag('FilterNotFoundError', (e) => Effect.succeed(`Filter ${e.filterId} has expired or was removed`)),
		)

		const result = await Effect.runPromise(program)
		expect(result).toBe('Filter 0xfilter123 has expired or was removed')
	})

	it('should have correct static properties', () => {
		expect(FilterNotFoundError.code).toBe(-32001)
		expect(FilterNotFoundError.docsPath).toBe('/reference/tevm/errors/classes/filternotfounderror/')
	})

	it('should create with empty props', () => {
		const error = new FilterNotFoundError()

		expect(error.filterId).toBeUndefined()
		expect(error._tag).toBe('FilterNotFoundError')
		expect(error.message).toBe('Filter not found')
	})

	it('should NOT be frozen (for Effect trait compatibility)', () => {
		const error = new FilterNotFoundError({
			filterId: '0x123',
		})

		expect(Object.isFrozen(error)).toBe(false)
		expect(Object.isExtensible(error)).toBe(true)
	})

	it('should accept and store cause property for error chaining', () => {
		const originalError = new Error('Filter expired')
		const error = new FilterNotFoundError({
			filterId: '0x123',
			cause: originalError,
		})

		expect(error.cause).toBe(originalError)
		expect(error.cause).toBeInstanceOf(Error)
		expect((error.cause as Error).message).toBe('Filter expired')
	})

	it('should have undefined cause when not provided', () => {
		const error = new FilterNotFoundError({
			filterId: '0x123',
		})

		expect(error.cause).toBeUndefined()
	})

	describe('Effect traits', () => {
		it('should support Equal.equals for structural equality', () => {
			const error1 = new FilterNotFoundError({
				filterId: '0xfilter1',
			})
			const error2 = new FilterNotFoundError({
				filterId: '0xfilter1',
			})

			expect(Equal.equals(error1, error2)).toBe(true)
		})

		it('should return false for Equal.equals with different properties', () => {
			const error1 = new FilterNotFoundError({
				filterId: '0xfilter1',
			})
			const error2 = new FilterNotFoundError({
				filterId: '0xfilter2',
			})

			expect(Equal.equals(error1, error2)).toBe(false)
		})

		it('should have consistent Hash values for equal errors', () => {
			const error1 = new FilterNotFoundError({
				filterId: '0xtest123',
			})
			const error2 = new FilterNotFoundError({
				filterId: '0xtest123',
			})

			expect(Hash.hash(error1)).toBe(Hash.hash(error2))
		})

		it('should have different Hash values for different errors', () => {
			const error1 = new FilterNotFoundError({
				filterId: '0xaaa',
			})
			const error2 = new FilterNotFoundError({
				filterId: '0xbbb',
			})

			expect(Hash.hash(error1)).not.toBe(Hash.hash(error2))
		})

		it('should work correctly in Effect HashSet', () => {
			const error1 = new FilterNotFoundError({
				filterId: '0xunique',
			})
			const error2 = new FilterNotFoundError({
				filterId: '0xunique',
			})

			const set = HashSet.make(error1)
			expect(HashSet.has(set, error2)).toBe(true)
		})
	})
})
