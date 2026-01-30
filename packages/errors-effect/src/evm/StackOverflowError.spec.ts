import { describe, expect, it } from 'vitest'
import { Effect } from 'effect'
import { StackOverflowError } from './StackOverflowError.js'

describe('StackOverflowError', () => {
	it('should create a StackOverflowError with stackSize', () => {
		const error = new StackOverflowError({
			stackSize: 1025,
		})

		expect(error.stackSize).toBe(1025)
		expect(error._tag).toBe('StackOverflowError')
		expect(error.code).toBe(-32015)
		expect(error.docsPath).toBe('/reference/tevm/errors/classes/stackoverflowerror/')
	})

	it('should use default message when not provided and no stackSize', () => {
		const error = new StackOverflowError({})

		expect(error.message).toBe('Stack overflow error occurred.')
	})

	it('should include stackSize in auto-generated message when provided', () => {
		const error = new StackOverflowError({
			stackSize: 1025,
		})

		expect(error.message).toBe('Stack overflow error occurred. Stack size: 1025 (max: 1024).')
	})

	it('should allow custom message', () => {
		const error = new StackOverflowError({
			message: 'Custom stack overflow message',
		})

		expect(error.message).toBe('Custom stack overflow message')
	})

	it('should create with empty props', () => {
		const error = new StackOverflowError()

		expect(error.stackSize).toBeUndefined()
		expect(error._tag).toBe('StackOverflowError')
	})

	it('should be usable in Effect.fail', async () => {
		const error = new StackOverflowError({
			stackSize: 1025,
		})

		const program = Effect.fail(error)

		const result = await Effect.runPromise(Effect.either(program))

		expect(result._tag).toBe('Left')
		if (result._tag === 'Left') {
			expect(result.left._tag).toBe('StackOverflowError')
		}
	})

	it('should be catchable by tag', async () => {
		const error = new StackOverflowError({
			stackSize: 1025,
		})

		const program = Effect.fail(error).pipe(
			Effect.catchTag('StackOverflowError', (e) =>
				Effect.succeed(`Stack exceeded: ${e.stackSize} items`)
			)
		)

		const result = await Effect.runPromise(program)
		expect(result).toBe('Stack exceeded: 1025 items')
	})

	it('should have correct static properties', () => {
		expect(StackOverflowError.code).toBe(-32015)
		expect(StackOverflowError.docsPath).toBe('/reference/tevm/errors/classes/stackoverflowerror/')
	})
})
