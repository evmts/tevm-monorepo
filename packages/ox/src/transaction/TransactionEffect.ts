import { Context, Effect, Layer } from 'effect'
import * as Transaction from 'ox/core/Transaction'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

// Re-export types
export type {
	Transaction as TransactionType,
	Rpc,
	Base,
	BaseRpc,
	Eip1559,
	Eip1559Rpc,
	Eip2930,
	Eip2930Rpc,
	Eip4844,
	Eip4844Rpc,
	Eip7702,
	Eip7702Rpc,
	Legacy,
	LegacyRpc,
	ToRpcType,
	FromRpcType,
} from 'ox/core/Transaction'

// Re-export constants
export const { toRpcType, fromRpcType } = Transaction

/**
 * Interface for TransactionEffect service
 */
export interface TransactionEffectService {
	/**
	 * Converts an Rpc transaction to a Transaction in an Effect
	 */
	fromRpcEffect<const transaction extends Transaction.Rpc | null, pending extends boolean = false>(
		transaction: transaction | Transaction.Rpc<pending> | null,
		options?: Transaction.fromRpc.Options<pending>,
	): Effect.Effect<
		transaction extends Transaction.Rpc<pending> ? Transaction.Transaction<pending> : null,
		BaseErrorEffect<Error | undefined>,
		never
	>

	/**
	 * Converts a Transaction to an Rpc transaction in an Effect
	 */
	toRpcEffect<pending extends boolean = false>(
		transaction: Transaction.Transaction<pending>,
		options?: Transaction.toRpc.Options<pending>,
	): Effect.Effect<Transaction.Rpc<pending>, BaseErrorEffect<Error | undefined>, never>
}

/**
 * Tag for TransactionEffectService dependency injection
 */
export const TransactionEffectTag = Context.Tag<TransactionEffectService>('@tevm/ox/TransactionEffect')

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
 * Live implementation of TransactionEffectService
 */
export const TransactionEffectLive: TransactionEffectService = {
	fromRpcEffect: (transaction, options) =>
		catchOxErrors(Effect.try(() => Transaction.fromRpc(transaction, options || {}))),

	toRpcEffect: (transaction, options) => catchOxErrors(Effect.try(() => Transaction.toRpc(transaction, options))),
}

/**
 * Layer that provides the TransactionEffectService implementation
 */
export const TransactionEffectLayer = Layer.succeed(TransactionEffectTag, TransactionEffectLive)
