import { describe, expect, it } from 'vitest'
import { Effect, Equal, Hash, HashSet } from 'effect'
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

	it('should NOT be frozen (for Effect trait compatibility)', () => {
		const error = new InvalidOpcodeError({
			opcode: 0xfe,
		})

		// Object.freeze is NOT used because Effect.ts requires objects to be extensible
		// for its Equal.equals and Hash.hash trait implementations (Symbol-based caching).
		// Properties are marked @readonly in JSDoc for documentation purposes only.
		expect(Object.isFrozen(error)).toBe(false)
		expect(Object.isExtensible(error)).toBe(true)
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

	describe('Effect traits', () => {
		it('should support Equal.equals for structural equality', () => {
			const error1 = new InvalidOpcodeError({
				opcode: 0xfe,
			})
			const error2 = new InvalidOpcodeError({
				opcode: 0xfe,
			})

			expect(Equal.equals(error1, error2)).toBe(true)
		})

		it('should return false for Equal.equals with different properties', () => {
			const error1 = new InvalidOpcodeError({
				opcode: 0xfe,
			})
			const error2 = new InvalidOpcodeError({
				opcode: 0xff,
			})

			expect(Equal.equals(error1, error2)).toBe(false)
		})

		it('should have consistent Hash values for equal errors', () => {
			const error1 = new InvalidOpcodeError({
				opcode: 0xab,
			})
			const error2 = new InvalidOpcodeError({
				opcode: 0xab,
			})

			expect(Hash.hash(error1)).toBe(Hash.hash(error2))
		})

		it('should have different Hash values for different errors', () => {
			const error1 = new InvalidOpcodeError({
				opcode: 0x01,
			})
			const error2 = new InvalidOpcodeError({
				opcode: 0x02,
			})

			expect(Hash.hash(error1)).not.toBe(Hash.hash(error2))
		})

		it('should work correctly in Effect HashSet', () => {
			const error1 = new InvalidOpcodeError({
				opcode: 0xcd,
			})
			const error2 = new InvalidOpcodeError({
				opcode: 0xcd,
			})

			const set = HashSet.make(error1)
			expect(HashSet.has(set, error2)).toBe(true)
		})
	})
})
