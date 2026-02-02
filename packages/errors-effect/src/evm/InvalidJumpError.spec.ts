import { describe, expect, it } from 'vitest'
import { Effect, Equal, Hash, HashSet } from 'effect'
import { InvalidJumpError } from './InvalidJumpError.js'

describe('InvalidJumpError', () => {
	it('should create an InvalidJumpError with all properties', () => {
		const error = new InvalidJumpError({
			destination: 0x1234,
			pc: 0x100,
		})

		expect(error.destination).toBe(0x1234)
		expect(error.pc).toBe(0x100)
		expect(error._tag).toBe('InvalidJumpError')
		expect(error.code).toBe(-32015)
		expect(error.docsPath).toBe('/reference/tevm/errors/classes/invalidjumperror/')
	})

	it('should generate a default message with destination', () => {
		const error = new InvalidJumpError({
			destination: 0x1234,
			pc: 0x100,
		})

		expect(error.message).toBe('Invalid jump destination: 0x1234')
	})

	it('should generate a default message without destination', () => {
		const error = new InvalidJumpError({
			pc: 0x100,
		})

		expect(error.message).toBe('Invalid jump destination')
	})

	it('should allow custom message', () => {
		const error = new InvalidJumpError({
			destination: 0x1234,
			pc: 0x100,
			message: 'Custom invalid jump message',
		})

		expect(error.message).toBe('Custom invalid jump message')
	})

	it('should be usable in Effect.fail', async () => {
		const error = new InvalidJumpError({
			destination: 0x1234,
			pc: 0x100,
		})

		const program = Effect.fail(error)

		const result = await Effect.runPromise(Effect.either(program))

		expect(result._tag).toBe('Left')
		if (result._tag === 'Left') {
			expect(result.left._tag).toBe('InvalidJumpError')
		}
	})

	it('should be catchable by tag', async () => {
		const error = new InvalidJumpError({
			destination: 0x1234,
			pc: 0x100,
		})

		const program = Effect.fail(error).pipe(
			Effect.catchTag('InvalidJumpError', (e) =>
				Effect.succeed(`Jump to 0x${e.destination?.toString(16)} from pc 0x${e.pc?.toString(16)}`)
			)
		)

		const result = await Effect.runPromise(program)
		expect(result).toBe('Jump to 0x1234 from pc 0x100')
	})

	it('should have correct static properties', () => {
		expect(InvalidJumpError.code).toBe(-32015)
		expect(InvalidJumpError.docsPath).toBe('/reference/tevm/errors/classes/invalidjumperror/')
	})

	it('should create with empty props', () => {
		const error = new InvalidJumpError()

		expect(error.destination).toBeUndefined()
		expect(error.pc).toBeUndefined()
		expect(error._tag).toBe('InvalidJumpError')
		expect(error.message).toBe('Invalid jump destination')
	})

	it('should NOT be frozen (for Effect trait compatibility)', () => {
		const error = new InvalidJumpError({
			destination: 0x1234,
			pc: 0x100,
		})

		expect(Object.isFrozen(error)).toBe(false)
		expect(Object.isExtensible(error)).toBe(true)
	})

	it('should accept and store cause property for error chaining', () => {
		const originalError = new Error('Original error')
		const error = new InvalidJumpError({
			destination: 0x1234,
			pc: 0x100,
			cause: originalError,
		})

		expect(error.cause).toBe(originalError)
		expect(error.cause).toBeInstanceOf(Error)
		expect((error.cause as Error).message).toBe('Original error')
	})

	it('should have undefined cause when not provided', () => {
		const error = new InvalidJumpError({
			destination: 0x1234,
			pc: 0x100,
		})

		expect(error.cause).toBeUndefined()
	})

	describe('Effect traits', () => {
		it('should support Equal.equals for structural equality', () => {
			const error1 = new InvalidJumpError({
				destination: 0x1234,
				pc: 0x100,
			})
			const error2 = new InvalidJumpError({
				destination: 0x1234,
				pc: 0x100,
			})

			expect(Equal.equals(error1, error2)).toBe(true)
		})

		it('should return false for Equal.equals with different properties', () => {
			const error1 = new InvalidJumpError({
				destination: 0x1234,
				pc: 0x100,
			})
			const error2 = new InvalidJumpError({
				destination: 0x5678,
				pc: 0x100,
			})

			expect(Equal.equals(error1, error2)).toBe(false)
		})

		it('should have consistent Hash values for equal errors', () => {
			const error1 = new InvalidJumpError({
				destination: 0xABCD,
				pc: 0x200,
			})
			const error2 = new InvalidJumpError({
				destination: 0xABCD,
				pc: 0x200,
			})

			expect(Hash.hash(error1)).toBe(Hash.hash(error2))
		})

		it('should have different Hash values for different errors', () => {
			const error1 = new InvalidJumpError({
				destination: 0x1111,
				pc: 0x100,
			})
			const error2 = new InvalidJumpError({
				destination: 0x2222,
				pc: 0x100,
			})

			expect(Hash.hash(error1)).not.toBe(Hash.hash(error2))
		})

		it('should work correctly in Effect HashSet', () => {
			const error1 = new InvalidJumpError({
				destination: 0xDEAD,
				pc: 0x300,
			})
			const error2 = new InvalidJumpError({
				destination: 0xDEAD,
				pc: 0x300,
			})

			const set = HashSet.make(error1)
			expect(HashSet.has(set, error2)).toBe(true)
		})
	})
})
