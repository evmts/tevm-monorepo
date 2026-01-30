import { describe, expect, it } from 'vitest'
import { Effect, Equal, Hash, HashSet } from 'effect'
import { InternalError } from './InternalError.js'

describe('InternalError', () => {
	it('should create an InternalError with all properties', () => {
		const error = new InternalError({
			message: 'Database connection failed',
			meta: { database: 'state-db', retries: 3 },
		})

		expect(error.message).toBe('Database connection failed')
		expect(error.meta).toEqual({ database: 'state-db', retries: 3 })
		expect(error._tag).toBe('InternalError')
		expect(error.code).toBe(-32603)
		expect(error.docsPath).toBe('/reference/tevm/errors/classes/internalerror/')
	})

	it('should generate a default message', () => {
		const error = new InternalError({
			meta: { info: 'some data' },
		})

		expect(error.message).toBe('Internal JSON-RPC error')
	})

	it('should allow custom message', () => {
		const error = new InternalError({
			message: 'Custom internal error message',
		})

		expect(error.message).toBe('Custom internal error message')
	})

	it('should be usable in Effect.fail', async () => {
		const error = new InternalError({
			message: 'Server error',
		})

		const program = Effect.fail(error)

		const result = await Effect.runPromise(Effect.either(program))

		expect(result._tag).toBe('Left')
		if (result._tag === 'Left') {
			expect(result.left._tag).toBe('InternalError')
		}
	})

	it('should be catchable by tag', async () => {
		const error = new InternalError({
			message: 'Processing failed',
			meta: { step: 'validation' },
		})

		const program = Effect.fail(error).pipe(
			Effect.catchTag('InternalError', (e) =>
				Effect.succeed(`Internal error: ${e.message}`)
			)
		)

		const result = await Effect.runPromise(program)
		expect(result).toBe('Internal error: Processing failed')
	})

	it('should have correct static properties', () => {
		expect(InternalError.code).toBe(-32603)
		expect(InternalError.docsPath).toBe('/reference/tevm/errors/classes/internalerror/')
	})

	it('should create with empty props', () => {
		const error = new InternalError()

		expect(error.meta).toBeUndefined()
		expect(error._tag).toBe('InternalError')
		expect(error.message).toBe('Internal JSON-RPC error')
	})

	it('should NOT be frozen (for Effect trait compatibility)', () => {
		const error = new InternalError({
			message: 'Test',
			meta: { test: true },
		})

		expect(Object.isFrozen(error)).toBe(false)
		expect(Object.isExtensible(error)).toBe(true)
	})

	it('should accept and store cause property for error chaining', () => {
		const originalError = new Error('Database timeout')
		const error = new InternalError({
			message: 'Internal error',
			meta: { database: 'state' },
			cause: originalError,
		})

		expect(error.cause).toBe(originalError)
		expect(error.cause).toBeInstanceOf(Error)
		expect((error.cause as Error).message).toBe('Database timeout')
	})

	it('should have undefined cause when not provided', () => {
		const error = new InternalError({
			message: 'Test',
		})

		expect(error.cause).toBeUndefined()
	})

	describe('Effect traits', () => {
		it('should support Equal.equals for structural equality', () => {
			const error1 = new InternalError({
				message: 'Same error',
			})
			const error2 = new InternalError({
				message: 'Same error',
			})

			expect(Equal.equals(error1, error2)).toBe(true)
		})

		it('should return false for Equal.equals with different properties', () => {
			const error1 = new InternalError({
				message: 'Error 1',
			})
			const error2 = new InternalError({
				message: 'Error 2',
			})

			expect(Equal.equals(error1, error2)).toBe(false)
		})

		it('should have consistent Hash values for equal errors', () => {
			const error1 = new InternalError({
				message: 'Test error',
			})
			const error2 = new InternalError({
				message: 'Test error',
			})

			expect(Hash.hash(error1)).toBe(Hash.hash(error2))
		})

		it('should have different Hash values for different errors', () => {
			const error1 = new InternalError({
				message: 'Error A',
			})
			const error2 = new InternalError({
				message: 'Error B',
			})

			expect(Hash.hash(error1)).not.toBe(Hash.hash(error2))
		})

		it('should work correctly in Effect HashSet', () => {
			const error1 = new InternalError({
				message: 'Unique error',
			})
			const error2 = new InternalError({
				message: 'Unique error',
			})

			const set = HashSet.make(error1)
			expect(HashSet.has(set, error2)).toBe(true)
		})
	})
})
