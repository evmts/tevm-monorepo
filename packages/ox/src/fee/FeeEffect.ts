import { Context, Effect, Layer } from 'effect'
import * as Fee from 'ox/execution/fee'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

/**
 * Type alias for Ox Fee
 */
export type FeeEffect = typeof Fee

/**
 * Ox Fee effect service interface
 */
export interface FeeEffectService {
	/**
	 * Calculates the base fee for the next block in an Effect
	 */
	calculateNextBaseFeeEffect(
		params: Fee.CalculateNextBaseFeeParams,
	): Effect.Effect<bigint, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Calculates the EIP-1559 priority fee in an Effect
	 */
	calculatePriorityFeeEffect(
		params: Fee.CalculatePriorityFeeParams,
	): Effect.Effect<bigint, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Creates an EIP-1559 fee history from blocks in an Effect
	 */
	createFeeHistoryEffect(
		params: Fee.CreateFeeHistoryParams,
	): Effect.Effect<Fee.FeeHistory, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Formats a fee history to JSON in an Effect
	 */
	formatFeeHistoryEffect(
		feeHistory: Fee.FeeHistory,
	): Effect.Effect<Fee.FeeHistoryJson, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Parses a fee history from JSON in an Effect
	 */
	parseFeeHistoryEffect(
		feeHistoryJson: Fee.FeeHistoryJson,
	): Effect.Effect<Fee.FeeHistory, BaseErrorEffect<Error | undefined>, never>
}

/**
 * Tag for FeeEffectService dependency injection
 */
export const FeeEffectTag = Context.Tag<FeeEffectService>('@tevm/ox/FeeEffect')

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
 * Live implementation of FeeEffectService
 */
export const FeeEffectLive: FeeEffectService = {
	calculateNextBaseFeeEffect: (params) => catchOxErrors(Effect.try(() => Fee.calculateNextBaseFee(params))),

	calculatePriorityFeeEffect: (params) => catchOxErrors(Effect.try(() => Fee.calculatePriorityFee(params))),

	createFeeHistoryEffect: (params) => catchOxErrors(Effect.try(() => Fee.createFeeHistory(params))),

	formatFeeHistoryEffect: (feeHistory) => catchOxErrors(Effect.try(() => Fee.formatFeeHistory(feeHistory))),

	parseFeeHistoryEffect: (feeHistoryJson) => catchOxErrors(Effect.try(() => Fee.parseFeeHistory(feeHistoryJson))),
}

/**
 * Layer that provides the FeeEffectService implementation
 */
export const FeeEffectLayer = Layer.succeed(FeeEffectTag, FeeEffectLive)
