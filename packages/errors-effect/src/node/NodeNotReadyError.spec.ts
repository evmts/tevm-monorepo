import { Effect, Equal, Hash, HashSet } from 'effect'
import { describe, expect, it } from 'vitest'
import { NodeNotReadyError } from './NodeNotReadyError.js'

describe('NodeNotReadyError', () => {
	it('should create a NodeNotReadyError with all properties', () => {
		const error = new NodeNotReadyError({
			reason: 'Fork synchronization in progress',
		})

		expect(error.reason).toBe('Fork synchronization in progress')
		expect(error._tag).toBe('NodeNotReadyError')
		expect(error.code).toBe(-32002)
		expect(error.docsPath).toBe('/reference/tevm/errors/classes/nodenotreadyerror/')
	})

	it('should generate a default message with reason', () => {
		const error = new NodeNotReadyError({
			reason: 'Fork synchronization in progress',
		})

		expect(error.message).toBe('Node not ready: Fork synchronization in progress')
	})

	it('should generate a default message without reason', () => {
		const error = new NodeNotReadyError({})

		expect(error.message).toBe('Node is not ready')
	})

	it('should allow custom message', () => {
		const error = new NodeNotReadyError({
			reason: 'Loading',
			message: 'Custom node not ready message',
		})

		expect(error.message).toBe('Custom node not ready message')
	})

	it('should be usable in Effect.fail', async () => {
		const error = new NodeNotReadyError({
			reason: 'Initializing',
		})

		const program = Effect.fail(error)

		const result = await Effect.runPromise(Effect.either(program))

		expect(result._tag).toBe('Left')
		if (result._tag === 'Left') {
			expect(result.left._tag).toBe('NodeNotReadyError')
		}
	})

	it('should be catchable by tag', async () => {
		const error = new NodeNotReadyError({
			reason: 'State loading',
		})

		const program = Effect.fail(error).pipe(
			Effect.catchTag('NodeNotReadyError', (e) => Effect.succeed(`Please wait: ${e.reason}`)),
		)

		const result = await Effect.runPromise(program)
		expect(result).toBe('Please wait: State loading')
	})

	it('should have correct static properties', () => {
		expect(NodeNotReadyError.code).toBe(-32002)
		expect(NodeNotReadyError.docsPath).toBe('/reference/tevm/errors/classes/nodenotreadyerror/')
	})

	it('should create with empty props', () => {
		const error = new NodeNotReadyError()

		expect(error.reason).toBeUndefined()
		expect(error._tag).toBe('NodeNotReadyError')
		expect(error.message).toBe('Node is not ready')
	})

	it('should NOT be frozen (for Effect trait compatibility)', () => {
		const error = new NodeNotReadyError({
			reason: 'Loading',
		})

		expect(Object.isFrozen(error)).toBe(false)
		expect(Object.isExtensible(error)).toBe(true)
	})

	it('should accept and store cause property for error chaining', () => {
		const originalError = new Error('Async initialization pending')
		const error = new NodeNotReadyError({
			reason: 'Loading',
			cause: originalError,
		})

		expect(error.cause).toBe(originalError)
		expect(error.cause).toBeInstanceOf(Error)
		expect((error.cause as Error).message).toBe('Async initialization pending')
	})

	it('should have undefined cause when not provided', () => {
		const error = new NodeNotReadyError({
			reason: 'Loading',
		})

		expect(error.cause).toBeUndefined()
	})

	describe('Effect traits', () => {
		it('should support Equal.equals for structural equality', () => {
			const error1 = new NodeNotReadyError({
				reason: 'Initializing',
			})
			const error2 = new NodeNotReadyError({
				reason: 'Initializing',
			})

			expect(Equal.equals(error1, error2)).toBe(true)
		})

		it('should return false for Equal.equals with different properties', () => {
			const error1 = new NodeNotReadyError({
				reason: 'Loading state',
			})
			const error2 = new NodeNotReadyError({
				reason: 'Syncing fork',
			})

			expect(Equal.equals(error1, error2)).toBe(false)
		})

		it('should have consistent Hash values for equal errors', () => {
			const error1 = new NodeNotReadyError({
				reason: 'Bootstrapping',
			})
			const error2 = new NodeNotReadyError({
				reason: 'Bootstrapping',
			})

			expect(Hash.hash(error1)).toBe(Hash.hash(error2))
		})

		it('should have different Hash values for different errors', () => {
			const error1 = new NodeNotReadyError({
				reason: 'Reason A',
			})
			const error2 = new NodeNotReadyError({
				reason: 'Reason B',
			})

			expect(Hash.hash(error1)).not.toBe(Hash.hash(error2))
		})

		it('should work correctly in Effect HashSet', () => {
			const error1 = new NodeNotReadyError({
				reason: 'Unique reason',
			})
			const error2 = new NodeNotReadyError({
				reason: 'Unique reason',
			})

			const set = HashSet.make(error1)
			expect(HashSet.has(set, error2)).toBe(true)
		})
	})
})
