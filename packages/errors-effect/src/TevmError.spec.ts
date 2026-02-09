import { Effect, Equal, Hash } from 'effect'
import { describe, expect, it } from 'vitest'
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

		const result = await Effect.runPromise(Effect.either(program))

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

		const program = Effect.fail(error).pipe(Effect.catchTag('TevmError', (e) => Effect.succeed(`Caught: ${e.message}`)))

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

	it('should NOT be frozen (for Effect trait compatibility)', () => {
		const error = new TevmError({
			message: 'Effect-compatible error',
			code: -32000,
		})

		// Object.freeze is NOT used because Effect.ts requires objects to be extensible
		// for its Equal.equals and Hash.hash trait implementations (Symbol-based caching).
		// Properties are marked @readonly in JSDoc for documentation purposes only.
		expect(Object.isFrozen(error)).toBe(false)
		expect(Object.isExtensible(error)).toBe(true)
	})

	describe('Effect traits', () => {
		it('should support Equal.equals for structural equality', () => {
			const error1 = new TevmError({
				message: 'Test error',
				code: -32000,
				docsPath: '/reference/tevm/errors/',
			})
			const error2 = new TevmError({
				message: 'Test error',
				code: -32000,
				docsPath: '/reference/tevm/errors/',
			})

			// Effect's structural equality should return true for identical properties
			expect(Equal.equals(error1, error2)).toBe(true)
		})

		it('should return false for Equal.equals with different properties', () => {
			const error1 = new TevmError({
				message: 'Error 1',
				code: -32000,
			})
			const error2 = new TevmError({
				message: 'Error 2',
				code: -32000,
			})

			expect(Equal.equals(error1, error2)).toBe(false)
		})

		it('should have consistent Hash values for equal errors', () => {
			const error1 = new TevmError({
				message: 'Test error',
				code: -32001,
				docsPath: '/docs/',
			})
			const error2 = new TevmError({
				message: 'Test error',
				code: -32001,
				docsPath: '/docs/',
			})

			// Equal errors should have the same hash
			expect(Hash.hash(error1)).toBe(Hash.hash(error2))
		})

		it('should have different Hash values for different errors', () => {
			const error1 = new TevmError({
				message: 'Error 1',
				code: -32000,
			})
			const error2 = new TevmError({
				message: 'Error 2',
				code: -32001,
			})

			// Different errors should likely have different hashes
			// (not guaranteed but extremely likely for different content)
			expect(Hash.hash(error1)).not.toBe(Hash.hash(error2))
		})

		it('should work correctly in Effect HashSet/HashMap', async () => {
			const error1 = new TevmError({
				message: 'Unique error',
				code: -32000,
			})
			const error2 = new TevmError({
				message: 'Unique error',
				code: -32000,
			})

			// Using Effect's HashSet to verify the error works with Effect's data structures
			const { HashSet } = await import('effect')
			const set = HashSet.make(error1)

			// Should find the structurally equal error
			expect(HashSet.has(set, error2)).toBe(true)
		})
	})
})
