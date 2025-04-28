import { Context, Effect, Layer } from 'effect'
import * as Bls from 'ox/core/Bls'
import * as BlsPoint from 'ox/core/BlsPoint'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

/**
 * Type alias for Ox Bls
 */
export type BlsEffect = typeof Bls

/**
 * Ox Bls effect service interface
 */
export interface BlsEffectService {
	/**
	 * Aggregates multiple BLS points (signatures/public keys) into a single point
	 */
	aggregateEffect(
		points: BlsPoint.BlsPoint[],
	): Effect.Effect<BlsPoint.BlsPoint, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Derives a BLS public key from a private key
	 */
	getPublicKeyEffect(
		privateKey: Uint8Array,
	): Effect.Effect<BlsPoint.BlsPoint, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Generates a random BLS private key
	 */
	randomPrivateKeyEffect(): Effect.Effect<Uint8Array, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Signs a message with a BLS private key
	 */
	signEffect(
		message: Uint8Array,
		privateKey: Uint8Array,
	): Effect.Effect<BlsPoint.BlsPoint, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Verifies a BLS signature against a message and public key
	 */
	verifyEffect(
		message: Uint8Array,
		signature: BlsPoint.BlsPoint,
		publicKey: BlsPoint.BlsPoint,
	): Effect.Effect<boolean, BaseErrorEffect<Error | undefined>, never>
}

/**
 * Tag for BlsEffectService dependency injection
 */
export const BlsEffectTag = Context.Tag<BlsEffectService>('@tevm/ox/BlsEffect')

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
 * Live implementation of BlsEffectService
 */
export const BlsEffectLive: BlsEffectService = {
	aggregateEffect: (points) => catchOxErrors(Effect.try(() => Bls.aggregate(points))),

	getPublicKeyEffect: (privateKey) => catchOxErrors(Effect.try(() => Bls.getPublicKey(privateKey))),

	randomPrivateKeyEffect: () => catchOxErrors(Effect.try(() => Bls.randomPrivateKey())),

	signEffect: (message, privateKey) => catchOxErrors(Effect.try(() => Bls.sign(message, privateKey))),

	verifyEffect: (message, signature, publicKey) =>
		catchOxErrors(Effect.try(() => Bls.verify(message, signature, publicKey))),
}

/**
 * Layer that provides the BlsEffectService implementation
 */
export const BlsEffectLayer = Layer.succeed(BlsEffectTag, BlsEffectLive)
