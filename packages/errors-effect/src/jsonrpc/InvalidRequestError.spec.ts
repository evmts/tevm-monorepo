import { Effect, Equal, Hash, HashSet } from 'effect'
import { describe, expect, it } from 'vitest'
import { InvalidRequestError } from './InvalidRequestError.js'

describe('InvalidRequestError', () => {
	it('should create an InvalidRequestError with message', () => {
		const error = new InvalidRequestError({
			message: 'Missing "method" field in request',
		})

		expect(error.message).toBe('Missing "method" field in request')
		expect(error._tag).toBe('InvalidRequestError')
		expect(error.code).toBe(-32600)
		expect(error.docsPath).toBe('/reference/tevm/errors/classes/invalidrequesterror/')
	})

	it('should generate a default message', () => {
		const error = new InvalidRequestError({})

		expect(error.message).toBe('Invalid JSON-RPC request')
	})

	it('should be usable in Effect.fail', async () => {
		const error = new InvalidRequestError({
			message: 'Malformed JSON',
		})

		const program = Effect.fail(error)

		const result = await Effect.runPromise(Effect.either(program))

		expect(result._tag).toBe('Left')
		if (result._tag === 'Left') {
			expect(result.left._tag).toBe('InvalidRequestError')
		}
	})

	it('should be catchable by tag', async () => {
		const error = new InvalidRequestError({
			message: 'Invalid request format',
		})

		const program = Effect.fail(error).pipe(
			Effect.catchTag('InvalidRequestError', (e) => Effect.succeed(`Request error: ${e.message}`)),
		)

		const result = await Effect.runPromise(program)
		expect(result).toBe('Request error: Invalid request format')
	})

	it('should have correct static properties', () => {
		expect(InvalidRequestError.code).toBe(-32600)
		expect(InvalidRequestError.docsPath).toBe('/reference/tevm/errors/classes/invalidrequesterror/')
	})

	it('should create with empty props', () => {
		const error = new InvalidRequestError()

		expect(error._tag).toBe('InvalidRequestError')
		expect(error.message).toBe('Invalid JSON-RPC request')
	})

	it('should NOT be frozen (for Effect trait compatibility)', () => {
		const error = new InvalidRequestError({
			message: 'Test message',
		})

		expect(Object.isFrozen(error)).toBe(false)
		expect(Object.isExtensible(error)).toBe(true)
	})

	it('should accept and store cause property for error chaining', () => {
		const originalError = new Error('JSON parse error')
		const error = new InvalidRequestError({
			message: 'Invalid JSON',
			cause: originalError,
		})

		expect(error.cause).toBe(originalError)
		expect(error.cause).toBeInstanceOf(Error)
		expect((error.cause as Error).message).toBe('JSON parse error')
	})

	it('should have undefined cause when not provided', () => {
		const error = new InvalidRequestError({
			message: 'Test',
		})

		expect(error.cause).toBeUndefined()
	})

	describe('Effect traits', () => {
		it('should support Equal.equals for structural equality', () => {
			const error1 = new InvalidRequestError({
				message: 'Same message',
			})
			const error2 = new InvalidRequestError({
				message: 'Same message',
			})

			expect(Equal.equals(error1, error2)).toBe(true)
		})

		it('should return false for Equal.equals with different properties', () => {
			const error1 = new InvalidRequestError({
				message: 'Message 1',
			})
			const error2 = new InvalidRequestError({
				message: 'Message 2',
			})

			expect(Equal.equals(error1, error2)).toBe(false)
		})

		it('should have consistent Hash values for equal errors', () => {
			const error1 = new InvalidRequestError({
				message: 'Test message',
			})
			const error2 = new InvalidRequestError({
				message: 'Test message',
			})

			expect(Hash.hash(error1)).toBe(Hash.hash(error2))
		})

		it('should have different Hash values for different errors', () => {
			const error1 = new InvalidRequestError({
				message: 'Message A',
			})
			const error2 = new InvalidRequestError({
				message: 'Message B',
			})

			expect(Hash.hash(error1)).not.toBe(Hash.hash(error2))
		})

		it('should work correctly in Effect HashSet', () => {
			const error1 = new InvalidRequestError({
				message: 'Unique message',
			})
			const error2 = new InvalidRequestError({
				message: 'Unique message',
			})

			const set = HashSet.make(error1)
			expect(HashSet.has(set, error2)).toBe(true)
		})
	})
})
