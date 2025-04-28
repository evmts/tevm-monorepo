import { Context, Effect, Layer } from 'effect'
import * as Withdrawal from 'ox/execution/withdrawal'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

// Re-export types
export type { Withdrawal as WithdrawalType } from 'ox/execution/withdrawal'

/**
 * Interface for WithdrawalEffect service
 */
export interface WithdrawalEffectService {
	/**
	 * Asserts if the given value is a valid Withdrawal in an Effect
	 */
	assertEffect(value: unknown): Effect.Effect<void, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Checks if the given value is a valid Withdrawal in an Effect
	 */
	isWithdrawalEffect(value: unknown): Effect.Effect<boolean, never, never>

	/**
	 * Validates a Withdrawal in an Effect
	 */
	validateEffect(value: unknown): Effect.Effect<boolean, never, never>
}

/**
 * Tag for WithdrawalEffectService dependency injection
 */
export const WithdrawalEffectTag = Context.Tag<WithdrawalEffectService>('@tevm/ox/WithdrawalEffect')

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
 * Live implementation of WithdrawalEffectService
 */
export const WithdrawalEffectLive: WithdrawalEffectService = {
	assertEffect: (value) =>
		catchOxErrors(
			Effect.try(() => {
				Withdrawal.assert(value)
			}),
		),

	isWithdrawalEffect: (value) => Effect.succeed(Withdrawal.isWithdrawal(value)),

	validateEffect: (value) => Effect.succeed(Withdrawal.validate(value)),
}

/**
 * Layer that provides the WithdrawalEffectService implementation
 */
export const WithdrawalEffectLayer = Layer.succeed(WithdrawalEffectTag, WithdrawalEffectLive)
