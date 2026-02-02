import { describe, expect, it } from 'vitest'
import { Effect, Equal, Hash, HashSet } from 'effect'
import { NetworkError } from './NetworkError.js'

describe('NetworkError', () => {
	it('should create a NetworkError with all properties', () => {
		const error = new NetworkError({
			url: 'https://mainnet.infura.io/v3/...',
		})

		expect(error.url).toBe('https://mainnet.infura.io/v3/...')
		expect(error._tag).toBe('NetworkError')
		expect(error.code).toBe(-32603)
		expect(error.docsPath).toBe('/reference/tevm/errors/classes/networkerror/')
	})

	it('should generate a default message with url', () => {
		const error = new NetworkError({
			url: 'https://example.com',
		})

		expect(error.message).toBe("Network request failed for 'https://example.com'")
	})

	it('should generate a default message without url', () => {
		const error = new NetworkError({})

		expect(error.message).toBe('Network request failed')
	})

	it('should allow custom message', () => {
		const error = new NetworkError({
			url: 'https://example.com',
			message: 'Custom network error message',
		})

		expect(error.message).toBe('Custom network error message')
	})

	it('should be usable in Effect.fail', async () => {
		const error = new NetworkError({
			url: 'https://example.com',
		})

		const program = Effect.fail(error)

		const result = await Effect.runPromise(Effect.either(program))

		expect(result._tag).toBe('Left')
		if (result._tag === 'Left') {
			expect(result.left._tag).toBe('NetworkError')
		}
	})

	it('should be catchable by tag', async () => {
		const error = new NetworkError({
			url: 'https://example.com',
		})

		const program = Effect.fail(error).pipe(
			Effect.catchTag('NetworkError', (e) =>
				Effect.succeed(`Failed to fetch from ${e.url}`)
			)
		)

		const result = await Effect.runPromise(program)
		expect(result).toBe('Failed to fetch from https://example.com')
	})

	it('should have correct static properties', () => {
		expect(NetworkError.code).toBe(-32603)
		expect(NetworkError.docsPath).toBe('/reference/tevm/errors/classes/networkerror/')
	})

	it('should create with empty props', () => {
		const error = new NetworkError()

		expect(error.url).toBeUndefined()
		expect(error._tag).toBe('NetworkError')
		expect(error.message).toBe('Network request failed')
	})

	it('should NOT be frozen (for Effect trait compatibility)', () => {
		const error = new NetworkError({
			url: 'https://example.com',
		})

		expect(Object.isFrozen(error)).toBe(false)
		expect(Object.isExtensible(error)).toBe(true)
	})

	it('should accept and store cause property for error chaining', () => {
		const originalError = new Error('Connection refused')
		const error = new NetworkError({
			url: 'https://example.com',
			cause: originalError,
		})

		expect(error.cause).toBe(originalError)
		expect(error.cause).toBeInstanceOf(Error)
		expect((error.cause as Error).message).toBe('Connection refused')
	})

	it('should have undefined cause when not provided', () => {
		const error = new NetworkError({
			url: 'https://example.com',
		})

		expect(error.cause).toBeUndefined()
	})

	describe('Effect traits', () => {
		it('should support Equal.equals for structural equality', () => {
			const error1 = new NetworkError({
				url: 'https://example.com',
			})
			const error2 = new NetworkError({
				url: 'https://example.com',
			})

			expect(Equal.equals(error1, error2)).toBe(true)
		})

		it('should return false for Equal.equals with different properties', () => {
			const error1 = new NetworkError({
				url: 'https://example1.com',
			})
			const error2 = new NetworkError({
				url: 'https://example2.com',
			})

			expect(Equal.equals(error1, error2)).toBe(false)
		})

		it('should have consistent Hash values for equal errors', () => {
			const error1 = new NetworkError({
				url: 'https://test.com',
			})
			const error2 = new NetworkError({
				url: 'https://test.com',
			})

			expect(Hash.hash(error1)).toBe(Hash.hash(error2))
		})

		it('should have different Hash values for different errors', () => {
			const error1 = new NetworkError({
				url: 'https://test1.com',
			})
			const error2 = new NetworkError({
				url: 'https://test2.com',
			})

			expect(Hash.hash(error1)).not.toBe(Hash.hash(error2))
		})

		it('should work correctly in Effect HashSet', () => {
			const error1 = new NetworkError({
				url: 'https://mainnet.infura.io',
			})
			const error2 = new NetworkError({
				url: 'https://mainnet.infura.io',
			})

			const set = HashSet.make(error1)
			expect(HashSet.has(set, error2)).toBe(true)
		})
	})
})
