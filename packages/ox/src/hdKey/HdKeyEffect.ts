import { Context, Effect, Layer } from 'effect'
import { Bytes } from 'ox/core/Bytes'
import * as HdKey from 'ox/crypto/hd-key'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

/**
 * Type alias for Ox HdKey
 */
export type HdKeyEffect = HdKey.HdKey

/**
 * Ox HdKey effect service interface
 */
export interface HdKeyEffectService {
	/**
	 * Creates an HD key from seed data
	 */
	fromSeedEffect(seed: Bytes): Effect.Effect<HdKey.HdKey, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Creates an HD key from an extended key
	 */
	fromExtendedKeyEffect(extendedKey: string): Effect.Effect<HdKey.HdKey, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Derives a child HD key from a path
	 */
	deriveEffect(hdKey: HdKey.HdKey, path: string): Effect.Effect<HdKey.HdKey, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Gets the extended private key
	 */
	getExtendedPrivateKeyEffect(hdKey: HdKey.HdKey): Effect.Effect<string, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Gets the extended public key
	 */
	getExtendedPublicKeyEffect(hdKey: HdKey.HdKey): Effect.Effect<string, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Gets the address from an HD key
	 */
	getAddressEffect(hdKey: HdKey.HdKey): Effect.Effect<string, BaseErrorEffect<Error | undefined>, never>
}

/**
 * Tag for HdKeyEffectService dependency injection
 */
export const HdKeyEffectTag = Context.Tag<HdKeyEffectService>('@tevm/ox/HdKeyEffect')

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
 * Live implementation of HdKeyEffectService
 */
export const HdKeyEffectLive: HdKeyEffectService = {
	fromSeedEffect: (seed) => catchOxErrors(Effect.try(() => HdKey.fromSeed(seed))),

	fromExtendedKeyEffect: (extendedKey) => catchOxErrors(Effect.try(() => HdKey.fromExtendedKey(extendedKey))),

	deriveEffect: (hdKey, path) => catchOxErrors(Effect.try(() => HdKey.derive(hdKey, path))),

	getExtendedPrivateKeyEffect: (hdKey) => catchOxErrors(Effect.try(() => HdKey.getExtendedPrivateKey(hdKey))),

	getExtendedPublicKeyEffect: (hdKey) => catchOxErrors(Effect.try(() => HdKey.getExtendedPublicKey(hdKey))),

	getAddressEffect: (hdKey) => catchOxErrors(Effect.try(() => HdKey.getAddress(hdKey))),
}

/**
 * Layer that provides the HdKeyEffectService implementation
 */
export const HdKeyEffectLayer = Layer.succeed(HdKeyEffectTag, HdKeyEffectLive)
