import { describe, expect, it } from 'vitest'
import { Effect, Equal, Hash, HashSet } from 'effect'
import { MethodNotFoundError } from './MethodNotFoundError.js'

describe('MethodNotFoundError', () => {
	it('should create a MethodNotFoundError with all properties', () => {
		const error = new MethodNotFoundError({
			method: 'eth_unknownMethod',
		})

		expect(error.method).toBe('eth_unknownMethod')
		expect(error._tag).toBe('MethodNotFoundError')
		expect(error.code).toBe(-32601)
		expect(error.docsPath).toBe('/reference/tevm/errors/classes/methodnotfounderror/')
	})

	it('should generate a default message with method', () => {
		const error = new MethodNotFoundError({
			method: 'eth_unknownMethod',
		})

		expect(error.message).toBe("Method 'eth_unknownMethod' not found")
	})

	it('should generate a default message without method', () => {
		const error = new MethodNotFoundError({})

		expect(error.message).toBe('Method not found')
	})

	it('should allow custom message', () => {
		const error = new MethodNotFoundError({
			method: 'eth_test',
			message: 'Custom method not found message',
		})

		expect(error.message).toBe('Custom method not found message')
	})

	it('should be usable in Effect.fail', async () => {
		const error = new MethodNotFoundError({
			method: 'eth_unknownMethod',
		})

		const program = Effect.fail(error)

		const result = await Effect.runPromise(Effect.either(program))

		expect(result._tag).toBe('Left')
		if (result._tag === 'Left') {
			expect(result.left._tag).toBe('MethodNotFoundError')
		}
	})

	it('should be catchable by tag', async () => {
		const error = new MethodNotFoundError({
			method: 'eth_customMethod',
		})

		const program = Effect.fail(error).pipe(
			Effect.catchTag('MethodNotFoundError', (e) =>
				Effect.succeed(`Unknown method: ${e.method}`)
			)
		)

		const result = await Effect.runPromise(program)
		expect(result).toBe('Unknown method: eth_customMethod')
	})

	it('should have correct static properties', () => {
		expect(MethodNotFoundError.code).toBe(-32601)
		expect(MethodNotFoundError.docsPath).toBe('/reference/tevm/errors/classes/methodnotfounderror/')
	})

	it('should create with empty props', () => {
		const error = new MethodNotFoundError()

		expect(error.method).toBeUndefined()
		expect(error._tag).toBe('MethodNotFoundError')
		expect(error.message).toBe('Method not found')
	})

	it('should NOT be frozen (for Effect trait compatibility)', () => {
		const error = new MethodNotFoundError({
			method: 'eth_test',
		})

		expect(Object.isFrozen(error)).toBe(false)
		expect(Object.isExtensible(error)).toBe(true)
	})

	it('should accept and store cause property for error chaining', () => {
		const originalError = new Error('Not implemented')
		const error = new MethodNotFoundError({
			method: 'eth_test',
			cause: originalError,
		})

		expect(error.cause).toBe(originalError)
		expect(error.cause).toBeInstanceOf(Error)
		expect((error.cause as Error).message).toBe('Not implemented')
	})

	it('should have undefined cause when not provided', () => {
		const error = new MethodNotFoundError({
			method: 'eth_test',
		})

		expect(error.cause).toBeUndefined()
	})

	describe('Effect traits', () => {
		it('should support Equal.equals for structural equality', () => {
			const error1 = new MethodNotFoundError({
				method: 'eth_test',
			})
			const error2 = new MethodNotFoundError({
				method: 'eth_test',
			})

			expect(Equal.equals(error1, error2)).toBe(true)
		})

		it('should return false for Equal.equals with different properties', () => {
			const error1 = new MethodNotFoundError({
				method: 'eth_test1',
			})
			const error2 = new MethodNotFoundError({
				method: 'eth_test2',
			})

			expect(Equal.equals(error1, error2)).toBe(false)
		})

		it('should have consistent Hash values for equal errors', () => {
			const error1 = new MethodNotFoundError({
				method: 'eth_custom',
			})
			const error2 = new MethodNotFoundError({
				method: 'eth_custom',
			})

			expect(Hash.hash(error1)).toBe(Hash.hash(error2))
		})

		it('should have different Hash values for different errors', () => {
			const error1 = new MethodNotFoundError({
				method: 'eth_methodA',
			})
			const error2 = new MethodNotFoundError({
				method: 'eth_methodB',
			})

			expect(Hash.hash(error1)).not.toBe(Hash.hash(error2))
		})

		it('should work correctly in Effect HashSet', () => {
			const error1 = new MethodNotFoundError({
				method: 'eth_unique',
			})
			const error2 = new MethodNotFoundError({
				method: 'eth_unique',
			})

			const set = HashSet.make(error1)
			expect(HashSet.has(set, error2)).toBe(true)
		})
	})
})
