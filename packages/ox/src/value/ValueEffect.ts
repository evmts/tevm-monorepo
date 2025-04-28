import { Context, Effect, Layer } from 'effect'
import * as Value from 'ox/core/Value'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

/**
 * Interface for ValueEffect service
 */
export interface ValueEffectService {
	/**
	 * Formats a `bigint` Value to its string representation (divided by the given exponent).
	 */
	formatEffect(value: bigint, decimals?: number): Effect.Effect<string, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Formats a `bigint` Value (default: wei) to a string representation of Ether.
	 */
	formatEtherEffect(
		wei: bigint,
		unit?: 'wei' | 'gwei' | 'szabo' | 'finney',
	): Effect.Effect<string, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Formats a `bigint` Value (default: wei) to a string representation of Gwei.
	 */
	formatGweiEffect(wei: bigint, unit?: 'wei'): Effect.Effect<string, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Parses a `string` representation of a Value to `bigint` (multiplied by the given exponent).
	 */
	fromEffect(value: string, decimals?: number): Effect.Effect<bigint, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Parses a string representation of Ether to a `bigint` Value (default: wei).
	 */
	fromEtherEffect(
		ether: string,
		unit?: 'wei' | 'gwei' | 'szabo' | 'finney',
	): Effect.Effect<bigint, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Parses a string representation of Gwei to a `bigint` Value (default: wei).
	 */
	fromGweiEffect(gwei: string, unit?: 'wei'): Effect.Effect<bigint, BaseErrorEffect<Error | undefined>, never>
}

/**
 * Tag for ValueEffectService dependency injection
 */
export const ValueEffectTag = Context.Tag<ValueEffectService>('@tevm/ox/ValueEffect')

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
 * Live implementation of ValueEffectService
 */
export const ValueEffectLive: ValueEffectService = {
	formatEffect: (value, decimals = 0) => catchOxErrors(Effect.try(() => Value.format(value, decimals))),

	formatEtherEffect: (wei, unit = 'wei') => catchOxErrors(Effect.try(() => Value.formatEther(wei, unit))),

	formatGweiEffect: (wei, unit = 'wei') => catchOxErrors(Effect.try(() => Value.formatGwei(wei, unit))),

	fromEffect: (value, decimals = 0) => catchOxErrors(Effect.try(() => Value.from(value, decimals))),

	fromEtherEffect: (ether, unit = 'wei') => catchOxErrors(Effect.try(() => Value.fromEther(ether, unit))),

	fromGweiEffect: (gwei, unit = 'wei') => catchOxErrors(Effect.try(() => Value.fromGwei(gwei, unit))),
}

/**
 * Layer that provides the ValueEffectService implementation
 */
export const ValueEffectLayer = Layer.succeed(ValueEffectTag, ValueEffectLive)

// Re-export types from ox for convenience
export { exponents } from 'ox/core/Value'
