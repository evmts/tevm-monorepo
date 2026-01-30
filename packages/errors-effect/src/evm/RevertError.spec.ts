import { describe, expect, it } from 'vitest'
import { Effect } from 'effect'
import { RevertError } from './RevertError.js'

describe('RevertError', () => {
	it('should create a RevertError with data and reason', () => {
		const error = new RevertError({
			data: '0x08c379a00000000000000000000000000000000000000000000000000000000000000020',
			reason: 'Insufficient allowance',
		})

		expect(error.data).toBe('0x08c379a00000000000000000000000000000000000000000000000000000000000000020')
		expect(error.reason).toBe('Insufficient allowance')
		expect(error._tag).toBe('RevertError')
		expect(error.code).toBe(3)
		expect(error.docsPath).toBe('/reference/tevm/errors/classes/reverterror/')
	})

	it('should generate message from reason', () => {
		const error = new RevertError({
			reason: 'Test revert reason',
		})

		expect(error.message).toBe('Reverted: Test revert reason')
	})

	it('should use default message when no reason', () => {
		const error = new RevertError({})

		expect(error.message).toBe('Execution reverted')
	})

	it('should allow custom message', () => {
		const error = new RevertError({
			message: 'Custom revert message',
		})

		expect(error.message).toBe('Custom revert message')
	})

	it('should create with empty props', () => {
		const error = new RevertError()

		expect(error.data).toBeUndefined()
		expect(error.reason).toBeUndefined()
		expect(error._tag).toBe('RevertError')
	})

	it('should be usable in Effect.fail', async () => {
		const error = new RevertError({
			reason: 'Access denied',
		})

		const program = Effect.fail(error)

		const result = await Effect.runPromise(Effect.either(program))

		expect(result._tag).toBe('Left')
		if (result._tag === 'Left') {
			expect(result.left._tag).toBe('RevertError')
		}
	})

	it('should be catchable by tag', async () => {
		const error = new RevertError({
			reason: 'Access denied',
		})

		const program = Effect.fail(error).pipe(
			Effect.catchTag('RevertError', (e) =>
				Effect.succeed(`Transaction reverted: ${e.reason}`)
			)
		)

		const result = await Effect.runPromise(program)
		expect(result).toBe('Transaction reverted: Access denied')
	})

	it('should have correct static properties', () => {
		expect(RevertError.code).toBe(3)
		expect(RevertError.docsPath).toBe('/reference/tevm/errors/classes/reverterror/')
	})
})
