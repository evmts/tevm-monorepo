import { Context, Effect, Layer } from 'effect'
import * as Bytes from 'ox/core/Bytes'
import * as Hex from 'ox/core/Hex'
import * as PublicKey from 'ox/crypto/PublicKey'
import * as Signature from 'ox/crypto/Signature'
import * as P256 from 'ox/crypto/p256'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

/**
 * Type alias for Ox P256
 */
export type P256Effect = P256.P256

/**
 * Ox P256 effect service interface
 */
export interface P256EffectService {
	/**
	 * Computes the P256 ECDSA public key from a provided private key in an Effect
	 */
	getPublicKeyEffect(options: { privateKey: Hex.Hex | Bytes.Bytes }): Effect.Effect<
		PublicKey.PublicKey,
		BaseErrorEffect<Error | undefined>,
		never
	>

	/**
	 * Generates a random P256 ECDSA private key in an Effect
	 */
	randomPrivateKeyEffect<as extends 'Hex' | 'Bytes' = 'Hex'>(options?: { as?: as }): Effect.Effect<
		ReturnType<typeof P256.randomPrivateKey<as>>,
		BaseErrorEffect<Error | undefined>,
		never
	>

	/**
	 * Recovers the signing public key from the signed payload and signature in an Effect
	 */
	recoverPublicKeyEffect(options: { payload: Hex.Hex | Bytes.Bytes; signature: Signature.Signature }): Effect.Effect<
		PublicKey.PublicKey,
		BaseErrorEffect<Error | undefined>,
		never
	>

	/**
	 * Signs a payload with the provided private key and returns a P256 signature in an Effect
	 */
	signEffect(options: {
		payload: Hex.Hex | Bytes.Bytes
		privateKey: Hex.Hex | Bytes.Bytes
		extraEntropy?: boolean | Hex.Hex | Bytes.Bytes
		hash?: boolean
	}): Effect.Effect<Signature.Signature, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Verifies a payload was signed by the provided public key in an Effect
	 */
	verifyEffect(options: {
		payload: Hex.Hex | Bytes.Bytes
		publicKey: PublicKey.PublicKey<boolean>
		signature: Signature.Signature<boolean>
		hash?: boolean
	}): Effect.Effect<boolean, BaseErrorEffect<Error | undefined>, never>
}

/**
 * Tag for P256EffectService dependency injection
 */
export const P256EffectTag = Context.Tag<P256EffectService>('@tevm/ox/P256Effect')

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
 * Live implementation of P256EffectService
 */
export const P256EffectLive: P256EffectService = {
	getPublicKeyEffect: (options) => catchOxErrors(Effect.try(() => P256.getPublicKey(options))),

	randomPrivateKeyEffect: (options) => catchOxErrors(Effect.try(() => P256.randomPrivateKey(options))),

	recoverPublicKeyEffect: (options) => catchOxErrors(Effect.try(() => P256.recoverPublicKey(options))),

	signEffect: (options) => catchOxErrors(Effect.try(() => P256.sign(options))),

	verifyEffect: (options) => catchOxErrors(Effect.try(() => P256.verify(options))),
}

/**
 * Layer that provides the P256EffectService implementation
 */
export const P256EffectLayer = Layer.succeed(P256EffectTag, P256EffectLive)
