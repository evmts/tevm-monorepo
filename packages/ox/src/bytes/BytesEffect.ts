import { concatBytes, toBytes } from '@tevm/utils'
import { Effect } from 'effect'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

/**
 * Type alias for Bytes
 */
export type Bytes = Uint8Array

/**
 * Catch errors and convert them to BaseErrorEffect
 */
function catchOxErrors<A>(
	effect: Effect.Effect<A, unknown, never>,
): Effect.Effect<A, BaseErrorEffect<Error | undefined>, never> {
	return Effect.catchAll(effect, (error) => {
		if (error instanceof Error) {
			return Effect.fail(new BaseErrorEffect(error.message, { cause: error }))
		}
		return Effect.fail(
			new BaseErrorEffect('Unknown error', {
				cause: error instanceof Error ? error : undefined,
			}),
		)
	})
}

/**
 * Converts from Array to Bytes in an Effect
 */
export function fromArrayEffect(value: readonly number[] | Uint8Array): Effect.Effect<Uint8Array, never, never> {
	return Effect.succeed(new Uint8Array(value))
}

/**
 * Converts from Boolean to Bytes in an Effect
 */
export function fromBooleanEffect(
	value: boolean,
): Effect.Effect<Uint8Array, BaseErrorEffect<Error | undefined>, never> {
	return catchOxErrors(Effect.try(() => toBytes(value)))
}

/**
 * Converts from Hex to Bytes in an Effect
 */
export function fromHexEffect(value: string): Effect.Effect<Uint8Array, BaseErrorEffect<Error | undefined>, never> {
	return catchOxErrors(Effect.try(() => toBytes(value)))
}

/**
 * Converts from Number to Bytes in an Effect
 */
export function fromNumberEffect(
	value: number | bigint,
): Effect.Effect<Uint8Array, BaseErrorEffect<Error | undefined>, never> {
	return catchOxErrors(Effect.try(() => toBytes(value)))
}

/**
 * Converts from String to Bytes in an Effect
 */
export function fromStringEffect(value: string): Effect.Effect<Uint8Array, BaseErrorEffect<Error | undefined>, never> {
	return catchOxErrors(Effect.try(() => toBytes(value)))
}

/**
 * Concatenates multiple Bytes in an Effect
 */
export function concatEffect(...values: readonly Uint8Array[]): Effect.Effect<Uint8Array, never, never> {
	return Effect.succeed(concatBytes(...values))
}
