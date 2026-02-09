import { Effect, Equal, Hash, HashSet } from 'effect'
import { describe, expect, it } from 'vitest'
import { StateRootNotFoundError } from './StateRootNotFoundError.js'

describe('StateRootNotFoundError', () => {
	it('should create a StateRootNotFoundError with default properties', () => {
		const error = new StateRootNotFoundError({})

		expect(error._tag).toBe('StateRootNotFoundError')
		expect(error.code).toBe(-32602)
		expect(error.docsPath).toBe('/reference/tevm/errors/classes/staterootnotfounderror/')
		expect(error.message).toBe('State root not found')
	})

	it('should create with stateRoot property', () => {
		const error = new StateRootNotFoundError({
			stateRoot: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
		})

		expect(error.stateRoot).toBe('0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef')
		expect(error.message).toBe(
			"State root '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef' not found",
		)
	})

	it('should allow custom message', () => {
		const error = new StateRootNotFoundError({
			stateRoot: '0x1234',
			message: 'Custom state root error message',
		})

		expect(error.message).toBe('Custom state root error message')
	})

	it('should create with empty props', () => {
		const error = new StateRootNotFoundError()

		expect(error._tag).toBe('StateRootNotFoundError')
	})

	it('should accept cause for error chaining', () => {
		const originalError = new Error('Original error')
		const error = new StateRootNotFoundError({
			stateRoot: '0x1234',
			cause: originalError,
		})

		expect(error.cause).toBe(originalError)
	})

	it('should be usable in Effect.fail', async () => {
		const error = new StateRootNotFoundError({
			stateRoot: '0x1234',
		})

		const program = Effect.fail(error)

		const result = await Effect.runPromise(Effect.either(program))

		expect(result._tag).toBe('Left')
		if (result._tag === 'Left') {
			expect(result.left._tag).toBe('StateRootNotFoundError')
		}
	})

	it('should be catchable by tag', async () => {
		const error = new StateRootNotFoundError({
			stateRoot: '0x1234',
		})

		const program = Effect.fail(error).pipe(
			Effect.catchTag('StateRootNotFoundError', () => Effect.succeed('State root error handled')),
		)

		const result = await Effect.runPromise(program)
		expect(result).toBe('State root error handled')
	})

	it('should have correct static properties', () => {
		expect(StateRootNotFoundError.code).toBe(-32602)
		expect(StateRootNotFoundError.docsPath).toBe('/reference/tevm/errors/classes/staterootnotfounderror/')
	})

	it('should NOT be frozen (for Effect trait compatibility)', () => {
		const error = new StateRootNotFoundError({})

		expect(Object.isFrozen(error)).toBe(false)
		expect(Object.isExtensible(error)).toBe(true)
	})

	describe('Effect traits', () => {
		it('should support Equal.equals for structural equality', () => {
			const error1 = new StateRootNotFoundError({
				stateRoot: '0x1234',
			})
			const error2 = new StateRootNotFoundError({
				stateRoot: '0x1234',
			})

			expect(Equal.equals(error1, error2)).toBe(true)
		})

		it('should return false for Equal.equals with different properties', () => {
			const error1 = new StateRootNotFoundError({
				stateRoot: '0x1234',
			})
			const error2 = new StateRootNotFoundError({
				stateRoot: '0x5678',
			})

			expect(Equal.equals(error1, error2)).toBe(false)
		})

		it('should have consistent Hash values for equal errors', () => {
			const error1 = new StateRootNotFoundError({
				stateRoot: '0x1234',
			})
			const error2 = new StateRootNotFoundError({
				stateRoot: '0x1234',
			})

			expect(Hash.hash(error1)).toBe(Hash.hash(error2))
		})

		it('should work correctly in Effect HashSet', () => {
			const error1 = new StateRootNotFoundError({
				stateRoot: '0x1234',
			})
			const error2 = new StateRootNotFoundError({
				stateRoot: '0x1234',
			})

			const set = HashSet.make(error1)
			expect(HashSet.has(set, error2)).toBe(true)
		})
	})
})
