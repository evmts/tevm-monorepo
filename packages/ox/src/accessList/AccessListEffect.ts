import { Context, Effect, Layer } from 'effect'
import * as AccessList from 'ox/execution/access-list'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

// Re-export types
export type { AccessList as AccessListType } from 'ox/execution/access-list'

/**
 * Interface for AccessListEffect service
 */
export interface AccessListEffectService {
	/**
	 * Asserts if the given value is a valid AccessList in an Effect
	 */
	assertEffect(value: unknown): Effect.Effect<void, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Checks if the given value is a valid AccessList in an Effect
	 */
	isAccessListEffect(value: unknown): Effect.Effect<boolean, never, never>

	/**
	 * Validates an AccessList in an Effect
	 */
	validateEffect(value: unknown): Effect.Effect<boolean, never, never>
}

/**
 * Tag for AccessListEffectService dependency injection
 */
export const AccessListEffectTag = Context.Tag<AccessListEffectService>('@tevm/ox/AccessListEffect')

/**
 * Catch Ox errors and convert them to BaseErrorEffect
 */
function catchOxErrors<A>(
	effect: Effect.Effect<A, unknown, never>,
): Effect.Effect<A, BaseErrorEffect<Error | undefined>, never> {
	return Effect.catchAll(effect, (error) => {
		if (error instanceof Error) {
			return Effect.fail(new BaseErrorEffect(error.message, { cause: error }))
		}
		return Effect.fail(new BaseErrorEffect('Unknown error', { cause: error instanceof Error ? error : undefined }))
	})
}

/**
 * Live implementation of AccessListEffectService
 */
export const AccessListEffectLive: AccessListEffectService = {
	assertEffect: (value) =>
		catchOxErrors(
			Effect.try(() => {
				AccessList.assert(value)
			}),
		),

	isAccessListEffect: (value) => Effect.succeed(AccessList.isAccessList(value)),

	validateEffect: (value) => Effect.succeed(AccessList.validate(value)),
}

/**
 * Layer that provides the AccessListEffectService implementation
 */
export const AccessListEffectLayer = Layer.succeed(AccessListEffectTag, AccessListEffectLive)
