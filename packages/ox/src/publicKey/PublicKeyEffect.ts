import { Context, Effect, Layer } from 'effect'
import type { Bytes } from 'ox/core/Bytes'
import type { Hex } from 'ox/core/Hex'
import * as PublicKey from 'ox/core/PublicKey'
import type { Compute, ExactPartial } from 'ox/core/internal/types'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

/**
 * Interface for PublicKeyEffect service
 */
export interface PublicKeyEffectService {
	/**
	 * Asserts that a PublicKey is valid.
	 */
	assertEffect(
		publicKey: ExactPartial<PublicKey.PublicKey>,
		options?: PublicKey.assert.Options,
	): Effect.Effect<void, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Compresses a PublicKey.
	 */
	compressEffect(
		publicKey: PublicKey.PublicKey<false>,
	): Effect.Effect<PublicKey.PublicKey<true>, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Instantiates a typed PublicKey object from a PublicKey, Bytes, or Hex.
	 */
	fromEffect<
		const publicKey extends
			| PublicKey.PublicKey<true>
			| (Omit<PublicKey.PublicKey<false>, 'prefix'> & { prefix?: PublicKey.PublicKey['prefix'] | undefined })
			| Hex
			| Bytes,
	>(
		value: PublicKey.from.Value<publicKey>,
	): Effect.Effect<PublicKey.from.ReturnType<publicKey>, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Deserializes a PublicKey from a Bytes value.
	 */
	fromBytesEffect(publicKey: Bytes): Effect.Effect<PublicKey.PublicKey, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Deserializes a PublicKey from a Hex value.
	 */
	fromHexEffect(publicKey: Hex): Effect.Effect<PublicKey.PublicKey, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Serializes a PublicKey to Bytes.
	 */
	toBytesEffect(
		publicKey: PublicKey.PublicKey<boolean>,
		options?: PublicKey.toBytes.Options,
	): Effect.Effect<Bytes, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Serializes a PublicKey to Hex.
	 */
	toHexEffect(
		publicKey: PublicKey.PublicKey<boolean>,
		options?: PublicKey.toHex.Options,
	): Effect.Effect<Hex, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Validates a PublicKey. Returns true if valid, false otherwise.
	 */
	validateEffect(
		publicKey: ExactPartial<PublicKey.PublicKey>,
		options?: PublicKey.validate.Options,
	): Effect.Effect<boolean, BaseErrorEffect<Error | undefined>, never>
}

/**
 * Tag for PublicKeyEffectService dependency injection
 */
export const PublicKeyEffectTag = Context.Tag<PublicKeyEffectService>('@tevm/ox/PublicKeyEffect')

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
 * Live implementation of PublicKeyEffectService
 */
export const PublicKeyEffectLive: PublicKeyEffectService = {
	assertEffect: (publicKey, options) =>
		catchOxErrors(
			Effect.try(() => {
				PublicKey.assert(publicKey, options)
				return undefined
			}),
		),

	compressEffect: (publicKey) => catchOxErrors(Effect.try(() => PublicKey.compress(publicKey))),

	fromEffect: (value) => catchOxErrors(Effect.try(() => PublicKey.from(value))),

	fromBytesEffect: (publicKey) => catchOxErrors(Effect.try(() => PublicKey.fromBytes(publicKey))),

	fromHexEffect: (publicKey) => catchOxErrors(Effect.try(() => PublicKey.fromHex(publicKey))),

	toBytesEffect: (publicKey, options) => catchOxErrors(Effect.try(() => PublicKey.toBytes(publicKey, options))),

	toHexEffect: (publicKey, options) => catchOxErrors(Effect.try(() => PublicKey.toHex(publicKey, options))),

	validateEffect: (publicKey, options) => catchOxErrors(Effect.try(() => PublicKey.validate(publicKey, options))),
}

/**
 * Layer that provides the PublicKeyEffectService implementation
 */
export const PublicKeyEffectLayer = Layer.succeed(PublicKeyEffectTag, PublicKeyEffectLive)

// Re-export types from ox for convenience
export {
	InvalidCompressedPrefixError,
	InvalidError,
	InvalidPrefixError,
	InvalidSerializedSizeError,
	InvalidUncompressedPrefixError,
} from 'ox/core/PublicKey'
