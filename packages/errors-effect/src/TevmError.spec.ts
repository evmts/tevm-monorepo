import { describe, expect, it } from 'vitest'
import { Effect } from 'effect'
import { TevmError } from './TevmError.js'

describe('TevmError', () => {
	it('should create a TevmError with all properties', () => {
		const error = new TevmError({
			message: 'Test error message',
			code: -32000,
			docsPath: '/reference/tevm/errors/classes/tevmerror/',
			cause: new Error('Original cause'),
		})

		expect(error.message).toBe('Test error message')
		expect(error.code).toBe(-32000)
		expect(error.docsPath).toBe('/reference/tevm/errors/classes/tevmerror/')
		expect(error.cause).toBeInstanceOf(Error)
		expect(error._tag).toBe('TevmError')
	})

	it('should create a TevmError with default code', () => {
		const error = new TevmError({
			message: 'Test error',
		})

		expect(error.code).toBe(0)
	})

	it('should be usable in Effect.fail', async () => {
		const error = new TevmError({
			message: 'Effect error',
			code: -32001,
		})

		const program = Effect.fail(error)

		const result = await Effect.runPromise(
			Effect.either(program)
		)

		expect(result._tag).toBe('Left')
		if (result._tag === 'Left') {
			expect(result.left).toBe(error)
			expect(result.left._tag).toBe('TevmError')
		}
	})

	it('should be catchable by tag', async () => {
		const error = new TevmError({
			message: 'Catchable error',
			code: -32002,
		})

		const program = Effect.fail(error).pipe(
			Effect.catchTag('TevmError', (e) => Effect.succeed(`Caught: ${e.message}`))
		)

		const result = await Effect.runPromise(program)
		expect(result).toBe('Caught: Catchable error')
	})

	it('should generate a proper toString representation', () => {
		const error = new TevmError({
			message: 'Error with docs',
			code: -32000,
			docsPath: '/reference/tevm/errors/',
		})

		const str = error.toString()
		expect(str).toContain('Error with docs')
		expect(str).toContain('https://tevm.sh/reference/tevm/errors/')
	})

	it('should generate toString without docs when docsPath is undefined', () => {
		const error = new TevmError({
			message: 'Error without docs',
			code: -32000,
		})

		const str = error.toString()
		expect(str).toBe('Error without docs')
		expect(str).not.toContain('https://tevm.sh')
	})

	it('should be immutable (Object.freeze applied)', () => {
		const error = new TevmError({
			message: 'Immutable error',
			code: -32000,
		})

		// Verify the object is frozen
		expect(Object.isFrozen(error)).toBe(true)

		// In strict mode, attempting to modify should throw
		// In non-strict mode, modifications are silently ignored
		// Either way, the value should not change
		const originalMessage = error.message
		try {
			// @ts-expect-error - testing runtime immutability
			error.message = 'Modified message'
		} catch {
			// Expected in strict mode
		}
		expect(error.message).toBe(originalMessage)
	})
})
