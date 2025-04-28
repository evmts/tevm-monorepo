import { Effect, pipe } from 'effect'
import * as Bytes from 'ox/core/Bytes'
import { describe, expect, it } from 'vitest'
import { WebCryptoP256EffectLayer, WebCryptoP256EffectTag } from './WebCryptoP256Effect.js'

describe('WebCryptoP256Effect', () => {
	it('should generate a key pair using effect', async () => {
		const program = pipe(
			Effect.provide(
				Effect.flatMap(WebCryptoP256EffectTag, (webCryptoP256) => webCryptoP256.generateKeyPairEffect()),
				WebCryptoP256EffectLayer,
			),
		)

		const keyPair = await Effect.runPromise(program)
		expect(keyPair).toBeDefined()
		expect(keyPair.privateKey).toBeDefined()
		expect(keyPair.publicKey).toBeDefined()
	})

	it('should export and import public key using effect', async () => {
		const program = pipe(
			Effect.provide(
				Effect.flatMap(WebCryptoP256EffectTag, (webCryptoP256) =>
					Effect.flatMap(webCryptoP256.generateKeyPairEffect(), (keyPair) =>
						Effect.flatMap(webCryptoP256.exportPublicKeyEffect({ publicKey: keyPair.publicKey }), (jwk) =>
							webCryptoP256.importPublicKeyEffect({ jwk }),
						),
					),
				),
				WebCryptoP256EffectLayer,
			),
		)

		const importedPublicKey = await Effect.runPromise(program)
		expect(importedPublicKey).toBeDefined()
	})

	it('should export and import private key using effect', async () => {
		const program = pipe(
			Effect.provide(
				Effect.flatMap(WebCryptoP256EffectTag, (webCryptoP256) =>
					Effect.flatMap(webCryptoP256.generateKeyPairEffect(), (keyPair) =>
						Effect.flatMap(webCryptoP256.exportPrivateKeyEffect({ privateKey: keyPair.privateKey }), (jwk) =>
							webCryptoP256.importPrivateKeyEffect({ jwk }),
						),
					),
				),
				WebCryptoP256EffectLayer,
			),
		)

		const importedPrivateKey = await Effect.runPromise(program)
		expect(importedPrivateKey).toBeDefined()
	})

	it('should sign and verify a message using effect', async () => {
		const message = Bytes.fromString('Hello, world!')

		const program = pipe(
			Effect.provide(
				Effect.flatMap(WebCryptoP256EffectTag, (webCryptoP256) =>
					Effect.flatMap(webCryptoP256.generateKeyPairEffect(), (keyPair) =>
						Effect.flatMap(
							webCryptoP256.signEffect({
								payload: message,
								privateKey: keyPair.privateKey,
							}),
							(signature) =>
								webCryptoP256.verifyEffect({
									payload: message,
									publicKey: keyPair.publicKey,
									signature,
								}),
						),
					),
				),
				WebCryptoP256EffectLayer,
			),
		)

		const isValid = await Effect.runPromise(program)
		expect(isValid).toBe(true)
	})

	it('should fail verification with wrong message', async () => {
		const message = Bytes.fromString('Hello, world!')
		const wrongMessage = Bytes.fromString('Wrong message!')

		const program = pipe(
			Effect.provide(
				Effect.flatMap(WebCryptoP256EffectTag, (webCryptoP256) =>
					Effect.flatMap(webCryptoP256.generateKeyPairEffect(), (keyPair) =>
						Effect.flatMap(
							webCryptoP256.signEffect({
								payload: message,
								privateKey: keyPair.privateKey,
							}),
							(signature) =>
								webCryptoP256.verifyEffect({
									payload: wrongMessage, // Using wrong message
									publicKey: keyPair.publicKey,
									signature,
								}),
						),
					),
				),
				WebCryptoP256EffectLayer,
			),
		)

		const isValid = await Effect.runPromise(program)
		expect(isValid).toBe(false)
	})

	it('should derive public key from private key', async () => {
		const program = pipe(
			Effect.provide(
				Effect.flatMap(WebCryptoP256EffectTag, (webCryptoP256) =>
					Effect.flatMap(webCryptoP256.generateKeyPairEffect(), (keyPair) =>
						Effect.flatMap(webCryptoP256.exportPrivateKeyEffect({ privateKey: keyPair.privateKey }), (privateJwk) =>
							Effect.succeed({
								privateKey: privateJwk,
								publicKey: keyPair.publicKey,
							}),
						),
					),
				),
				WebCryptoP256EffectLayer,
			),
		)

		const { privateKey, publicKey } = await Effect.runPromise(program)

		// Convert the private key JWK to hex bytes
		const privateKeyHex = privateKey.d // 'd' is the private key parameter in JWK
		expect(privateKeyHex).toBeDefined()

		// Now use getPublicKeyEffect to derive the public key from the private key
		const derivationProgram = pipe(
			Effect.provide(
				Effect.flatMap(WebCryptoP256EffectTag, (webCryptoP256) =>
					webCryptoP256.getPublicKeyEffect({
						privateKey: Bytes.fromHex(`0x${privateKeyHex}`),
					}),
				),
				WebCryptoP256EffectLayer,
			),
		)

		const derivedPublicKey = await Effect.runPromise(derivationProgram)
		expect(derivedPublicKey).toBeDefined()
	})

	it('should handle errors gracefully', async () => {
		// Test with invalid input to trigger error
		const program = pipe(
			Effect.provide(
				Effect.flatMap(WebCryptoP256EffectTag, (webCryptoP256) =>
					Effect.either(
						webCryptoP256.importPublicKeyEffect({
							jwk: { kty: 'INVALID' } as any,
						}),
					),
				),
				WebCryptoP256EffectLayer,
			),
		)

		const result = await Effect.runPromise(program)
		expect(result._tag).toBe('Left')
	})
})
