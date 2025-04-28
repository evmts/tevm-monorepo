import { Context, Effect, Layer } from 'effect'
import * as Base58 from 'ox/core/Base58'
import * as Bytes from 'ox/core/Bytes'
import * as Hex from 'ox/core/Hex'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

/**
 * Interface for Base58Effect service
 */
export interface Base58EffectService {
	/**
	 * Encodes Bytes to a Base58-encoded string in an Effect
	 */
	fromBytesEffect(value: Bytes.Bytes): Effect.Effect<string, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Encodes Hex to a Base58-encoded string in an Effect
	 */
	fromHexEffect(value: Hex.Hex): Effect.Effect<string, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Encodes a string to a Base58-encoded string in an Effect
	 */
	fromStringEffect(value: string): Effect.Effect<string, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Decodes a Base58-encoded string to Bytes in an Effect
	 */
	toBytesEffect(value: string): Effect.Effect<Bytes.Bytes, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Decodes a Base58-encoded string to Hex in an Effect
	 */
	toHexEffect(value: string): Effect.Effect<Hex.Hex, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Decodes a Base58-encoded string to a string in an Effect
	 */
	toStringEffect(value: string): Effect.Effect<string, BaseErrorEffect<Error | undefined>, never>
}

/**
 * Tag for Base58EffectService dependency injection
 */
export const Base58EffectTag = Context.Tag<Base58EffectService>('@tevm/ox/Base58Effect')

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
 * Live implementation of Base58EffectService
 */
export const Base58EffectLive: Base58EffectService = {
	fromBytesEffect: (value) => catchOxErrors(Effect.try(() => Base58.fromBytes(value))),

	fromHexEffect: (value) => catchOxErrors(Effect.try(() => Base58.fromHex(value))),

	fromStringEffect: (value) => catchOxErrors(Effect.try(() => Base58.fromString(value))),

	toBytesEffect: (value) => catchOxErrors(Effect.try(() => Base58.toBytes(value))),

	toHexEffect: (value) => catchOxErrors(Effect.try(() => Base58.toHex(value))),

	toStringEffect: (value) => catchOxErrors(Effect.try(() => Base58.toString(value))),
}

/**
 * Layer that provides the Base58EffectService implementation
 */
export const Base58EffectLayer = Layer.succeed(Base58EffectTag, Base58EffectLive)
