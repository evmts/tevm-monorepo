import { Context, Effect, Layer } from 'effect'
import * as TransactionReceipt from 'ox/core/TransactionReceipt'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

// Re-export types
export type {
	TransactionReceipt as TransactionReceiptType,
	Rpc,
	Status,
	RpcStatus,
	Type,
	RpcType,
} from 'ox/core/TransactionReceipt'

// Re-export constants
export const { fromRpcStatus, toRpcStatus, fromRpcType, toRpcType } = TransactionReceipt

/**
 * Interface for TransactionReceiptEffect service
 */
export interface TransactionReceiptEffectService {
	/**
	 * Converts an Rpc receipt to a TransactionReceipt in an Effect
	 */
	fromRpcEffect<const receipt extends TransactionReceipt.Rpc | null>(
		receipt: receipt | TransactionReceipt.Rpc | null,
	): Effect.Effect<
		receipt extends TransactionReceipt.Rpc ? TransactionReceipt.TransactionReceipt : null,
		BaseErrorEffect<Error | undefined>,
		never
	>

	/**
	 * Converts a TransactionReceipt to an Rpc receipt in an Effect
	 */
	toRpcEffect(
		receipt: TransactionReceipt.TransactionReceipt,
	): Effect.Effect<TransactionReceipt.Rpc, BaseErrorEffect<Error | undefined>, never>
}

/**
 * Tag for TransactionReceiptEffectService dependency injection
 */
export const TransactionReceiptEffectTag = Context.Tag<TransactionReceiptEffectService>(
	'@tevm/ox/TransactionReceiptEffect',
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
 * Live implementation of TransactionReceiptEffectService
 */
export const TransactionReceiptEffectLive: TransactionReceiptEffectService = {
	fromRpcEffect: (receipt) => catchOxErrors(Effect.try(() => TransactionReceipt.fromRpc(receipt))),

	toRpcEffect: (receipt) => catchOxErrors(Effect.try(() => TransactionReceipt.toRpc(receipt))),
}

/**
 * Layer that provides the TransactionReceiptEffectService implementation
 */
export const TransactionReceiptEffectLayer = Layer.succeed(TransactionReceiptEffectTag, TransactionReceiptEffectLive)
