import { Context, Effect, Layer } from 'effect'
import * as TransactionRequest from 'ox/execution/transaction-request'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

// Re-export types
export type { TransactionRequest as TransactionRequestType } from 'ox/execution/transaction-request'

/**
 * Interface for TransactionRequestEffect service
 */
export interface TransactionRequestEffectService {
	/**
	 * Asserts if the given value is a valid TransactionRequest in an Effect
	 */
	assertEffect(value: unknown): Effect.Effect<void, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Checks if the given value is a valid TransactionRequest in an Effect
	 */
	isTransactionRequestEffect(value: unknown): Effect.Effect<boolean, never, never>

	/**
	 * Validates a TransactionRequest in an Effect
	 */
	validateEffect(value: unknown): Effect.Effect<boolean, never, never>
}

/**
 * Tag for TransactionRequestEffectService dependency injection
 */
export const TransactionRequestEffectTag = Context.Tag<TransactionRequestEffectService>(
	'@tevm/ox/TransactionRequestEffect',
)

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
 * Live implementation of TransactionRequestEffectService
 */
export const TransactionRequestEffectLive: TransactionRequestEffectService = {
	assertEffect: (value) =>
		catchOxErrors(
			Effect.try(() => {
				TransactionRequest.assert(value)
			}),
		),

	isTransactionRequestEffect: (value) => Effect.succeed(TransactionRequest.isTransactionRequest(value)),

	validateEffect: (value) => Effect.succeed(TransactionRequest.validate(value)),
}

/**
 * Layer that provides the TransactionRequestEffectService implementation
 */
export const TransactionRequestEffectLayer = Layer.succeed(TransactionRequestEffectTag, TransactionRequestEffectLive)
