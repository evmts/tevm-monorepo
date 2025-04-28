import { Context, Effect, Layer } from 'effect'
import * as Base64 from 'ox/core/Base64'
import * as Bytes from 'ox/core/Bytes'
import * as Hex from 'ox/core/Hex'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

/**
 * Interface for Base64Effect service
 */
export interface Base64EffectService {
	/**
	 * Encodes a Bytes to a Base64-encoded string in an Effect
	 */
	fromBytesEffect(
		value: Bytes.Bytes,
		options?: Base64.fromBytes.Options,
	): Effect.Effect<string, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Encodes a Hex to a Base64-encoded string in an Effect
	 */
	fromHexEffect(
		value: Hex.Hex,
		options?: Base64.fromHex.Options,
	): Effect.Effect<string, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Encodes a string to a Base64-encoded string in an Effect
	 */
	fromStringEffect(
		value: string,
		options?: Base64.fromString.Options,
	): Effect.Effect<string, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Decodes a Base64-encoded string to Bytes in an Effect
	 */
	toBytesEffect(value: string): Effect.Effect<Bytes.Bytes, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Decodes a Base64-encoded string to Hex in an Effect
	 */
	toHexEffect(value: string): Effect.Effect<Hex.Hex, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Decodes a Base64-encoded string to a string in an Effect
	 */
	toStringEffect(value: string): Effect.Effect<string, BaseErrorEffect<Error | undefined>, never>
}

/**
 * Tag for Base64EffectService dependency injection
 */
export const Base64EffectTag = Context.Tag<Base64EffectService>('@tevm/ox/Base64Effect')

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
 * Live implementation of Base64EffectService
 */
export const Base64EffectLive: Base64EffectService = {
	fromBytesEffect: (value, options) => catchOxErrors(Effect.try(() => Base64.fromBytes(value, options))),

	fromHexEffect: (value, options) => catchOxErrors(Effect.try(() => Base64.fromHex(value, options))),

	fromStringEffect: (value, options) => catchOxErrors(Effect.try(() => Base64.fromString(value, options))),

	toBytesEffect: (value) => catchOxErrors(Effect.try(() => Base64.toBytes(value))),

	toHexEffect: (value) => catchOxErrors(Effect.try(() => Base64.toHex(value))),

	toStringEffect: (value) => catchOxErrors(Effect.try(() => Base64.toString(value))),
}

/**
 * Layer that provides the Base64EffectService implementation
 */
export const Base64EffectLayer = Layer.succeed(Base64EffectTag, Base64EffectLive)
