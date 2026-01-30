import { describe, expect, it } from 'vitest'
import { Effect } from 'effect'
import { StackUnderflowError } from './StackUnderflowError.js'

describe('StackUnderflowError', () => {
	it('should create a StackUnderflowError', () => {
		const error = new StackUnderflowError({})

		expect(error._tag).toBe('StackUnderflowError')
		expect(error.code).toBe(-32015)
		expect(error.docsPath).toBe('/reference/tevm/errors/classes/stackunderflowerror/')
	})

	it('should use default message', () => {
		const error = new StackUnderflowError({})

		expect(error.message).toBe('Stack underflow error occurred.')
	})

	it('should allow custom message', () => {
		const error = new StackUnderflowError({
			message: 'Custom stack underflow message',
		})

		expect(error.message).toBe('Custom stack underflow message')
	})

	it('should create with empty props', () => {
		const error = new StackUnderflowError()

		expect(error._tag).toBe('StackUnderflowError')
	})

	it('should be usable in Effect.fail', async () => {
		const error = new StackUnderflowError({})

		const program = Effect.fail(error)

		const result = await Effect.runPromise(Effect.either(program))

		expect(result._tag).toBe('Left')
		if (result._tag === 'Left') {
			expect(result.left._tag).toBe('StackUnderflowError')
		}
	})

	it('should be catchable by tag', async () => {
		const error = new StackUnderflowError({})

		const program = Effect.fail(error).pipe(
			Effect.catchTag('StackUnderflowError', () =>
				Effect.succeed('Stack underflow handled')
			)
		)

		const result = await Effect.runPromise(program)
		expect(result).toBe('Stack underflow handled')
	})

	it('should have correct static properties', () => {
		expect(StackUnderflowError.code).toBe(-32015)
		expect(StackUnderflowError.docsPath).toBe('/reference/tevm/errors/classes/stackunderflowerror/')
	})

	it('should be immutable (Object.freeze applied)', () => {
		const error = new StackUnderflowError({})

		// Verify the object is frozen
		expect(Object.isFrozen(error)).toBe(true)

		// Verify properties cannot be modified
		const originalMessage = error.message
		try {
			// @ts-expect-error - testing runtime immutability
			error.message = 'Modified message'
		} catch {
			// Expected in strict mode
		}
		expect(error.message).toBe(originalMessage)
	})

	it('should accept and store cause property for error chaining', () => {
		const originalError = new Error('Original error')
		const error = new StackUnderflowError({
			cause: originalError,
		})

		expect(error.cause).toBe(originalError)
		expect(error.cause).toBeInstanceOf(Error)
		expect((error.cause as Error).message).toBe('Original error')
	})

	it('should have undefined cause when not provided', () => {
		const error = new StackUnderflowError({})

		expect(error.cause).toBeUndefined()
	})
})
