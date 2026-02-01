import { describe, expect, it } from 'vitest'
import { Effect, Equal, Hash, HashSet } from 'effect'
import { InvalidFilterTypeError } from './InvalidFilterTypeError.js'

describe('InvalidFilterTypeError', () => {
	it('should create an InvalidFilterTypeError with all properties', () => {
		const error = new InvalidFilterTypeError({
			filterId: '0xabc123',
			expectedType: 'Log',
			actualType: 'Block',
		})

		expect(error.filterId).toBe('0xabc123')
		expect(error.expectedType).toBe('Log')
		expect(error.actualType).toBe('Block')
		expect(error._tag).toBe('InvalidFilterTypeError')
		expect(error.code).toBe(-32602)
		expect(error.docsPath).toBe('/reference/tevm/errors/classes/invalidfiltertypeerror/')
	})

	it('should generate a default message with filterId and expectedType', () => {
		const error = new InvalidFilterTypeError({
			filterId: '0xabc123',
			expectedType: 'Log',
		})

		expect(error.message).toBe("Filter '0xabc123' is not a Log filter")
	})

	it('should generate a default message with only filterId', () => {
		const error = new InvalidFilterTypeError({
			filterId: '0xabc123',
		})

		expect(error.message).toBe("Filter '0xabc123' has invalid type")
	})

	it('should generate a default message without any props', () => {
		const error = new InvalidFilterTypeError({})

		expect(error.message).toBe('Invalid filter type')
	})

	it('should allow custom message', () => {
		const error = new InvalidFilterTypeError({
			filterId: '0x123',
			message: 'Custom invalid filter type message',
		})

		expect(error.message).toBe('Custom invalid filter type message')
	})

	it('should be usable in Effect.fail', async () => {
		const error = new InvalidFilterTypeError({
			filterId: '0x123',
			expectedType: 'Block',
		})

		const program = Effect.fail(error)

		const result = await Effect.runPromise(Effect.either(program))

		expect(result._tag).toBe('Left')
		if (result._tag === 'Left') {
			expect(result.left._tag).toBe('InvalidFilterTypeError')
		}
	})

	it('should be catchable by tag', async () => {
		const error = new InvalidFilterTypeError({
			filterId: '0xfilter123',
			expectedType: 'Log',
			actualType: 'PendingTransaction',
		})

		const program = Effect.fail(error).pipe(
			Effect.catchTag('InvalidFilterTypeError', (e) =>
				Effect.succeed(`Filter ${e.filterId} is ${e.actualType}, expected ${e.expectedType}`)
			)
		)

		const result = await Effect.runPromise(program)
		expect(result).toBe('Filter 0xfilter123 is PendingTransaction, expected Log')
	})

	it('should have correct static properties', () => {
		expect(InvalidFilterTypeError.code).toBe(-32602)
		expect(InvalidFilterTypeError.docsPath).toBe('/reference/tevm/errors/classes/invalidfiltertypeerror/')
	})

	it('should create with empty props', () => {
		const error = new InvalidFilterTypeError()

		expect(error.filterId).toBeUndefined()
		expect(error.expectedType).toBeUndefined()
		expect(error.actualType).toBeUndefined()
		expect(error._tag).toBe('InvalidFilterTypeError')
		expect(error.message).toBe('Invalid filter type')
	})

	it('should NOT be frozen (for Effect trait compatibility)', () => {
		const error = new InvalidFilterTypeError({
			filterId: '0x123',
		})

		expect(Object.isFrozen(error)).toBe(false)
		expect(Object.isExtensible(error)).toBe(true)
	})

	it('should accept and store cause property for error chaining', () => {
		const originalError = new Error('Original cause')
		const error = new InvalidFilterTypeError({
			filterId: '0x123',
			cause: originalError,
		})

		expect(error.cause).toBe(originalError)
		expect(error.cause).toBeInstanceOf(Error)
		expect((error.cause as Error).message).toBe('Original cause')
	})

	it('should have undefined cause when not provided', () => {
		const error = new InvalidFilterTypeError({
			filterId: '0x123',
		})

		expect(error.cause).toBeUndefined()
	})

	describe('Effect traits', () => {
		it('should support Equal.equals for structural equality', () => {
			const error1 = new InvalidFilterTypeError({
				filterId: '0xfilter1',
				expectedType: 'Log',
			})
			const error2 = new InvalidFilterTypeError({
				filterId: '0xfilter1',
				expectedType: 'Log',
			})

			expect(Equal.equals(error1, error2)).toBe(true)
		})

		it('should return false for Equal.equals with different properties', () => {
			const error1 = new InvalidFilterTypeError({
				filterId: '0xfilter1',
				expectedType: 'Log',
			})
			const error2 = new InvalidFilterTypeError({
				filterId: '0xfilter2',
				expectedType: 'Block',
			})

			expect(Equal.equals(error1, error2)).toBe(false)
		})

		it('should have consistent Hash values for equal errors', () => {
			const error1 = new InvalidFilterTypeError({
				filterId: '0xtest123',
				expectedType: 'PendingTransaction',
			})
			const error2 = new InvalidFilterTypeError({
				filterId: '0xtest123',
				expectedType: 'PendingTransaction',
			})

			expect(Hash.hash(error1)).toBe(Hash.hash(error2))
		})

		it('should have different Hash values for different errors', () => {
			const error1 = new InvalidFilterTypeError({
				filterId: '0xaaa',
				expectedType: 'Log',
			})
			const error2 = new InvalidFilterTypeError({
				filterId: '0xbbb',
				expectedType: 'Block',
			})

			expect(Hash.hash(error1)).not.toBe(Hash.hash(error2))
		})

		it('should work correctly in Effect HashSet', () => {
			const error1 = new InvalidFilterTypeError({
				filterId: '0xunique',
				expectedType: 'Log',
			})
			const error2 = new InvalidFilterTypeError({
				filterId: '0xunique',
				expectedType: 'Log',
			})

			const set = HashSet.make(error1)
			expect(HashSet.has(set, error2)).toBe(true)
		})
	})
})
