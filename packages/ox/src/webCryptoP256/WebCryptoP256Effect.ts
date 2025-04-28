import { Context, Effect, Layer } from 'effect'
import * as Bytes from 'ox/core/Bytes'
import * as Hex from 'ox/core/Hex'
import * as PublicKey from 'ox/crypto/PublicKey'
import * as Signature from 'ox/crypto/Signature'
import * as WebCryptoP256 from 'ox/crypto/webcrypto-p256'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

/**
 * Type alias for Ox WebCryptoP256
 */
export type WebCryptoP256Effect = WebCryptoP256.WebCryptoP256

/**
 * Ox WebCryptoP256 effect service interface
 */
export interface WebCryptoP256EffectService {
	/**
	 * Computes the WebCrypto P256 ECDSA public key from a provided private key in an Effect
	 */
	getPublicKeyEffect(options: { privateKey: Hex.Hex | Bytes.Bytes }): Effect.Effect<
		PublicKey.PublicKey,
		BaseErrorEffect<Error | undefined>,
		never
	>

	/**
	 * Imports a private key from JWK format in an Effect
	 */
	importPrivateKeyEffect(options: { jwk: WebCryptoP256.JWK }): Effect.Effect<
		CryptoKey,
		BaseErrorEffect<Error | undefined>,
		never
	>

	/**
	 * Imports a public key from JWK format in an Effect
	 */
	importPublicKeyEffect(options: { jwk: WebCryptoP256.JWK }): Effect.Effect<
		CryptoKey,
		BaseErrorEffect<Error | undefined>,
		never
	>

	/**
	 * Exports a public key to JWK format in an Effect
	 */
	exportPublicKeyEffect(options: { publicKey: CryptoKey }): Effect.Effect<
		WebCryptoP256.JWK,
		BaseErrorEffect<Error | undefined>,
		never
	>

	/**
	 * Exports a private key to JWK format in an Effect
	 */
	exportPrivateKeyEffect(options: { privateKey: CryptoKey }): Effect.Effect<
		WebCryptoP256.JWK,
		BaseErrorEffect<Error | undefined>,
		never
	>

	/**
	 * Generates a new key pair for P256 in an Effect
	 */
	generateKeyPairEffect(): Effect.Effect<WebCryptoP256.KeyPair, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Signs a payload with the provided private key and returns a signature in an Effect
	 */
	signEffect(options: {
		payload: Hex.Hex | Bytes.Bytes
		privateKey: CryptoKey
		hash?: boolean
	}): Effect.Effect<Signature.Signature, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Verifies a payload was signed by the provided public key in an Effect
	 */
	verifyEffect(options: {
		payload: Hex.Hex | Bytes.Bytes
		publicKey: CryptoKey
		signature: Signature.Signature
		hash?: boolean
	}): Effect.Effect<boolean, BaseErrorEffect<Error | undefined>, never>
}

/**
 * Tag for WebCryptoP256EffectService dependency injection
 */
export const WebCryptoP256EffectTag = Context.Tag<WebCryptoP256EffectService>('@tevm/ox/WebCryptoP256Effect')

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
 * Live implementation of WebCryptoP256EffectService
 */
export const WebCryptoP256EffectLive: WebCryptoP256EffectService = {
	getPublicKeyEffect: (options) => catchOxErrors(Effect.try(() => WebCryptoP256.getPublicKey(options))),

	importPrivateKeyEffect: (options) => catchOxErrors(Effect.try(() => WebCryptoP256.importPrivateKey(options))),

	importPublicKeyEffect: (options) => catchOxErrors(Effect.try(() => WebCryptoP256.importPublicKey(options))),

	exportPublicKeyEffect: (options) => catchOxErrors(Effect.try(() => WebCryptoP256.exportPublicKey(options))),

	exportPrivateKeyEffect: (options) => catchOxErrors(Effect.try(() => WebCryptoP256.exportPrivateKey(options))),

	generateKeyPairEffect: () => catchOxErrors(Effect.try(() => WebCryptoP256.generateKeyPair())),

	signEffect: (options) => catchOxErrors(Effect.try(() => WebCryptoP256.sign(options))),

	verifyEffect: (options) => catchOxErrors(Effect.try(() => WebCryptoP256.verify(options))),
}

/**
 * Layer that provides the WebCryptoP256EffectService implementation
 */
export const WebCryptoP256EffectLayer = Layer.succeed(WebCryptoP256EffectTag, WebCryptoP256EffectLive)
