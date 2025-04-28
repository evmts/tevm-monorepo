import { Context, Effect, Layer } from 'effect'
import * as WebAuthnP256 from 'ox/crypto/webauthn-p256'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

/**
 * Type alias for Ox WebAuthnP256
 */
export type WebAuthnP256Effect = WebAuthnP256.WebAuthnP256

/**
 * Ox WebAuthnP256 effect service interface
 */
export interface WebAuthnP256EffectService {
	/**
	 * Generate a key pair with Effect
	 */
	generateKeyPairEffect(): Effect.Effect<WebAuthnP256.KeyPair, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Sign a message with Effect
	 */
	signEffect(
		message: Uint8Array,
		privateKey: Uint8Array,
	): Effect.Effect<Uint8Array, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Verify a signature with Effect
	 */
	verifyEffect(
		message: Uint8Array,
		signature: Uint8Array,
		publicKey: Uint8Array,
	): Effect.Effect<boolean, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Get public key from private key with Effect
	 */
	getPublicKeyEffect(privateKey: Uint8Array): Effect.Effect<Uint8Array, BaseErrorEffect<Error | undefined>, never>
}

/**
 * Tag for WebAuthnP256EffectService dependency injection
 */
export const WebAuthnP256EffectTag = Context.Tag<WebAuthnP256EffectService>('@tevm/ox/WebAuthnP256Effect')

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
 * Live implementation of WebAuthnP256EffectService
 */
export const WebAuthnP256EffectLive: WebAuthnP256EffectService = {
	generateKeyPairEffect: () => catchOxErrors(Effect.try(() => WebAuthnP256.generateKeyPair())),

	signEffect: (message, privateKey) => catchOxErrors(Effect.try(() => WebAuthnP256.sign(message, privateKey))),

	verifyEffect: (message, signature, publicKey) =>
		catchOxErrors(Effect.try(() => WebAuthnP256.verify(message, signature, publicKey))),

	getPublicKeyEffect: (privateKey) => catchOxErrors(Effect.try(() => WebAuthnP256.getPublicKey(privateKey))),
}

/**
 * Layer that provides the WebAuthnP256EffectService implementation
 */
export const WebAuthnP256EffectLayer = Layer.succeed(WebAuthnP256EffectTag, WebAuthnP256EffectLive)
