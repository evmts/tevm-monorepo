import { describe, expect, it } from 'vitest'
import { Effect } from 'effect'
import { InvalidOpcodeError } from './InvalidOpcodeError.js'

describe('InvalidOpcodeError', () => {
	it('should create an InvalidOpcodeError with opcode', () => {
		const error = new InvalidOpcodeError({
			opcode: 0xfe,
		})

		expect(error.opcode).toBe(0xfe)
		expect(error._tag).toBe('InvalidOpcodeError')
		expect(error.code).toBe(-32015)
		expect(error.docsPath).toBe('/reference/tevm/errors/classes/invalidopcodeerror/')
	})

	it('should generate message from opcode', () => {
		const error = new InvalidOpcodeError({
			opcode: 0xfe,
		})

		expect(error.message).toBe('Invalid opcode: 0xfe')
	})

	it('should use default message when no opcode', () => {
		const error = new InvalidOpcodeError({})

		expect(error.message).toBe('Invalid opcode encountered')
	})

	it('should allow custom message', () => {
		const error = new InvalidOpcodeError({
			message: 'Custom opcode error message',
		})

		expect(error.message).toBe('Custom opcode error message')
	})

	it('should create with empty props', () => {
		const error = new InvalidOpcodeError()

		expect(error.opcode).toBeUndefined()
		expect(error._tag).toBe('InvalidOpcodeError')
	})

	it('should be usable in Effect.fail', async () => {
		const error = new InvalidOpcodeError({
			opcode: 0xff,
		})

		const program = Effect.fail(error)

		const result = await Effect.runPromise(Effect.either(program))

		expect(result._tag).toBe('Left')
		if (result._tag === 'Left') {
			expect(result.left._tag).toBe('InvalidOpcodeError')
		}
	})

	it('should be catchable by tag', async () => {
		const error = new InvalidOpcodeError({
			opcode: 0xfe,
		})

		const program = Effect.fail(error).pipe(
			Effect.catchTag('InvalidOpcodeError', (e) =>
				Effect.succeed(`Invalid opcode detected: 0x${e.opcode?.toString(16)}`)
			)
		)

		const result = await Effect.runPromise(program)
		expect(result).toBe('Invalid opcode detected: 0xfe')
	})

	it('should have correct static properties', () => {
		expect(InvalidOpcodeError.code).toBe(-32015)
		expect(InvalidOpcodeError.docsPath).toBe('/reference/tevm/errors/classes/invalidopcodeerror/')
	})

	it('should be immutable (Object.freeze applied)', () => {
		const error = new InvalidOpcodeError({
			opcode: 0xfe,
		})

		// Verify the object is frozen
		expect(Object.isFrozen(error)).toBe(true)

		// Verify properties cannot be modified
		const originalOpcode = error.opcode
		try {
			// @ts-expect-error - testing runtime immutability
			error.opcode = 0xff
		} catch {
			// Expected in strict mode
		}
		expect(error.opcode).toBe(originalOpcode)
	})

	it('should accept and store cause property for error chaining', () => {
		const originalError = new Error('Original error')
		const error = new InvalidOpcodeError({
			opcode: 0xfe,
			cause: originalError,
		})

		expect(error.cause).toBe(originalError)
		expect(error.cause).toBeInstanceOf(Error)
		expect((error.cause as Error).message).toBe('Original error')
	})

	it('should have undefined cause when not provided', () => {
		const error = new InvalidOpcodeError({
			opcode: 0xfe,
		})

		expect(error.cause).toBeUndefined()
	})
})
