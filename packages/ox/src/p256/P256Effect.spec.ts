import { Effect, pipe } from 'effect'
import { describe, expect, it } from 'vitest'
import { P256EffectLayer, P256EffectTag } from './P256Effect.js'

describe('P256Effect', () => {
	it('should generate a random private key and derive public key using effect', async () => {
		const program = pipe(
			Effect.provide(
				Effect.flatMap(P256EffectTag, (p256) =>
					Effect.flatMap(p256.randomPrivateKeyEffect(), (privateKey) => p256.getPublicKeyEffect({ privateKey })),
				),
				P256EffectLayer,
			),
		)

		const publicKey = await Effect.runPromise(program)
		expect(publicKey).toBeDefined()
		expect(publicKey.bytes).toBeInstanceOf(Uint8Array)
		expect(publicKey.bytes.length).toBeGreaterThan(0)
	})

	it('should sign and verify a message using effect', async () => {
		const message = new TextEncoder().encode('Hello, world!')

		const program = pipe(
			Effect.provide(
				Effect.flatMap(P256EffectTag, (p256) =>
					Effect.flatMap(p256.randomPrivateKeyEffect(), (privateKey) =>
						Effect.flatMap(p256.getPublicKeyEffect({ privateKey }), (publicKey) =>
							Effect.flatMap(p256.signEffect({ payload: message, privateKey }), (signature) =>
								p256.verifyEffect({
									payload: message,
									publicKey,
									signature,
								}),
							),
						),
					),
				),
				P256EffectLayer,
			),
		)

		const isValid = await Effect.runPromise(program)
		expect(isValid).toBe(true)
	})

	it('should recover public key from signature using effect', async () => {
		const message = new TextEncoder().encode('Hello, world!')

		const program = pipe(
			Effect.provide(
				Effect.flatMap(P256EffectTag, (p256) =>
					Effect.flatMap(p256.randomPrivateKeyEffect(), (privateKey) =>
						Effect.flatMap(p256.getPublicKeyEffect({ privateKey }), (originalPublicKey) =>
							Effect.flatMap(p256.signEffect({ payload: message, privateKey }), (signature) =>
								Effect.flatMap(p256.recoverPublicKeyEffect({ payload: message, signature }), (recoveredPublicKey) =>
									Effect.succeed({
										originalPublicKey,
										recoveredPublicKey,
									}),
								),
							),
						),
					),
				),
				P256EffectLayer,
			),
		)

		const { originalPublicKey, recoveredPublicKey } = await Effect.runPromise(program)
		expect(recoveredPublicKey).toBeDefined()
		expect(recoveredPublicKey.bytes).toBeInstanceOf(Uint8Array)

		// Convert to hex for comparison since the objects might have different references
		const originalHex = Buffer.from(originalPublicKey.bytes).toString('hex')
		const recoveredHex = Buffer.from(recoveredPublicKey.bytes).toString('hex')
		expect(recoveredHex).toBe(originalHex)
	})
})
