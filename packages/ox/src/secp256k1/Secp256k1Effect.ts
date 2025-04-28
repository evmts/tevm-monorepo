import { Context, Effect, Layer } from 'effect'
import * as Address from 'ox/core/Address'
import * as Bytes from 'ox/core/Bytes'
import * as Hex from 'ox/core/Hex'
import * as PublicKey from 'ox/crypto/PublicKey'
import * as Signature from 'ox/crypto/Signature'
import * as Secp256k1 from 'ox/crypto/secp256k1'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

/**
 * Type alias for Ox Secp256k1
 */
export type Secp256k1Effect = Secp256k1.Secp256k1

/**
 * Ox Secp256k1 effect service interface
 */
export interface Secp256k1EffectService {
	/**
	 * Computes the secp256k1 ECDSA public key from a provided private key in an Effect
	 */
	getPublicKeyEffect(options: { privateKey: Hex.Hex | Bytes.Bytes }): Effect.Effect<
		PublicKey.PublicKey,
		BaseErrorEffect<Error | undefined>,
		never
	>

	/**
	 * Generates a random ECDSA private key on the secp256k1 curve in an Effect
	 */
	randomPrivateKeyEffect<as extends 'Hex' | 'Bytes' = 'Hex'>(options?: { as?: as }): Effect.Effect<
		ReturnType<typeof Secp256k1.randomPrivateKey<as>>,
		BaseErrorEffect<Error | undefined>,
		never
	>

	/**
	 * Recovers the signing address from the signed payload and signature in an Effect
	 */
	recoverAddressEffect(options: { payload: Hex.Hex | Bytes.Bytes; signature: Signature.Signature }): Effect.Effect<
		Address.Address,
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
	 * Signs a payload with the provided private key in an Effect
	 */
	signEffect(options: {
		payload: Hex.Hex | Bytes.Bytes
		privateKey: Hex.Hex | Bytes.Bytes
		extraEntropy?: boolean | Hex.Hex | Bytes.Bytes
		hash?: boolean
	}): Effect.Effect<Signature.Signature, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Verifies a payload was signed by the provided address in an Effect
	 */
	verifyWithAddressEffect(options: {
		payload: Hex.Hex | Bytes.Bytes
		address: Address.Address
		signature: Signature.Signature
		hash?: boolean
	}): Effect.Effect<boolean, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Verifies a payload was signed by the provided public key in an Effect
	 */
	verifyWithPublicKeyEffect(options: {
		payload: Hex.Hex | Bytes.Bytes
		publicKey: PublicKey.PublicKey
		signature: Signature.Signature
		hash?: boolean
	}): Effect.Effect<boolean, BaseErrorEffect<Error | undefined>, never>
}

/**
 * Tag for Secp256k1EffectService dependency injection
 */
export const Secp256k1EffectTag = Context.Tag<Secp256k1EffectService>('@tevm/ox/Secp256k1Effect')

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
 * Live implementation of Secp256k1EffectService
 */
export const Secp256k1EffectLive: Secp256k1EffectService = {
	getPublicKeyEffect: (options) => catchOxErrors(Effect.try(() => Secp256k1.getPublicKey(options))),

	randomPrivateKeyEffect: (options) => catchOxErrors(Effect.try(() => Secp256k1.randomPrivateKey(options))),

	recoverAddressEffect: (options) => catchOxErrors(Effect.try(() => Secp256k1.recoverAddress(options))),

	recoverPublicKeyEffect: (options) => catchOxErrors(Effect.try(() => Secp256k1.recoverPublicKey(options))),

	signEffect: (options) => catchOxErrors(Effect.try(() => Secp256k1.sign(options))),

	verifyWithAddressEffect: (options) => catchOxErrors(Effect.try(() => Secp256k1.verify(options))),

	verifyWithPublicKeyEffect: (options) => catchOxErrors(Effect.try(() => Secp256k1.verify(options))),
}

/**
 * Layer that provides the Secp256k1EffectService implementation
 */
export const Secp256k1EffectLayer = Layer.succeed(Secp256k1EffectTag, Secp256k1EffectLive)
