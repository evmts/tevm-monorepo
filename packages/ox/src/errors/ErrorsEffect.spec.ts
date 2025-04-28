import { Effect, pipe } from 'effect'
import { BaseError } from 'ox/core/Errors'
import { describe, expect, it } from 'vitest'
import { BaseErrorEffect, ErrorsEffectLayer, ErrorsEffectTag } from './ErrorsEffect.js'

describe('ErrorsEffect', () => {
	it('should create a BaseErrorEffect', async () => {
		const program = pipe(
			Effect.provide(
				Effect.flatMap(ErrorsEffectTag, (errors) => Effect.succeed(errors.createBaseError('Test error message'))),
				ErrorsEffectLayer,
			),
		)

		const result = await Effect.runPromise(program)
		expect(result).toBeInstanceOf(BaseErrorEffect)
		expect(result.shortMessage).toBe('Test error message')
	})

	it('should convert a BaseError to BaseErrorEffect', async () => {
		const originalError = new BaseError('Original error', {
			details: 'Error details',
			docsPath: '/docs/path',
		})

		const program = pipe(
			Effect.provide(
				Effect.flatMap(ErrorsEffectTag, (errors) => Effect.succeed(errors.fromBaseError(originalError))),
				ErrorsEffectLayer,
			),
		)

		const result = await Effect.runPromise(program)
		expect(result).toBeInstanceOf(BaseErrorEffect)
		expect(result.shortMessage).toBe('Original error')
		expect(result.details).toBe('Error details')
		expect(result.docsPath).toBe('/docs/path')
	})

	it('should create an Effect that fails with the error', async () => {
		const program = pipe(
			Effect.provide(
				Effect.flatMap(ErrorsEffectTag, (errors) => {
					const error = errors.createBaseError('Test failure')
					return error.toEffect()
				}),
				ErrorsEffectLayer,
			),
			Effect.catchAll((error) => {
				expect(error).toBeInstanceOf(BaseErrorEffect)
				expect(error.shortMessage).toBe('Test failure')
				return Effect.succeed('Caught error successfully')
			}),
		)

		const result = await Effect.runPromise(program)
		expect(result).toBe('Caught error successfully')
	})

	it('should maintain cause in error chain', async () => {
		const originalCause = new Error('Root cause')

		const program = pipe(
			Effect.provide(
				Effect.flatMap(ErrorsEffectTag, (errors) => {
					const error = errors.createBaseError('Wrapping error', {
						cause: originalCause,
					})
					return error.toEffect()
				}),
				ErrorsEffectLayer,
			),
			Effect.catchAll((error) => {
				expect(error).toBeInstanceOf(BaseErrorEffect)
				expect(error.cause).toBe(originalCause)
				return Effect.succeed('Caught error with cause')
			}),
		)

		const result = await Effect.runPromise(program)
		expect(result).toBe('Caught error with cause')
	})
})
