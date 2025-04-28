import { Effect, pipe } from 'effect'
import { describe, expect, it } from 'vitest'
import { Secp256k1EffectLayer, Secp256k1EffectTag } from './Secp256k1Effect.js'

describe('Secp256k1Effect', () => {
	it('should generate a random private key and derive public key using effect', async () => {
		const program = pipe(
			Effect.provide(
				Effect.flatMap(Secp256k1EffectTag, (secp256k1) =>
					Effect.flatMap(secp256k1.randomPrivateKeyEffect(), (privateKey) =>
						secp256k1.getPublicKeyEffect({ privateKey }),
					),
				),
				Secp256k1EffectLayer,
			),
		)

		const publicKey = await Effect.runPromise(program)
		expect(publicKey).toBeDefined()
		expect(publicKey.bytes).toBeInstanceOf(Uint8Array)
		expect(publicKey.bytes.length).toBeGreaterThan(0)
	})

	it('should sign and verify a message with address using effect', async () => {
		const message = new TextEncoder().encode('Hello, world!')

		const program = pipe(
			Effect.provide(
				Effect.flatMap(Secp256k1EffectTag, (secp256k1) =>
					Effect.flatMap(secp256k1.randomPrivateKeyEffect(), (privateKey) =>
						Effect.flatMap(secp256k1.signEffect({ payload: message, privateKey }), (signature) =>
							Effect.flatMap(secp256k1.recoverAddressEffect({ payload: message, signature }), (address) =>
								secp256k1.verifyWithAddressEffect({
									payload: message,
									address,
									signature,
								}),
							),
						),
					),
				),
				Secp256k1EffectLayer,
			),
		)

		const isValid = await Effect.runPromise(program)
		expect(isValid).toBe(true)
	})

	it('should sign and verify a message with public key using effect', async () => {
		const message = new TextEncoder().encode('Hello, world!')

		const program = pipe(
			Effect.provide(
				Effect.flatMap(Secp256k1EffectTag, (secp256k1) =>
					Effect.flatMap(secp256k1.randomPrivateKeyEffect(), (privateKey) =>
						Effect.flatMap(secp256k1.getPublicKeyEffect({ privateKey }), (publicKey) =>
							Effect.flatMap(secp256k1.signEffect({ payload: message, privateKey }), (signature) =>
								secp256k1.verifyWithPublicKeyEffect({
									payload: message,
									publicKey,
									signature,
								}),
							),
						),
					),
				),
				Secp256k1EffectLayer,
			),
		)

		const isValid = await Effect.runPromise(program)
		expect(isValid).toBe(true)
	})

	it('should recover public key from signature using effect', async () => {
		const message = new TextEncoder().encode('Hello, world!')

		const program = pipe(
			Effect.provide(
				Effect.flatMap(Secp256k1EffectTag, (secp256k1) =>
					Effect.flatMap(secp256k1.randomPrivateKeyEffect(), (privateKey) =>
						Effect.flatMap(secp256k1.getPublicKeyEffect({ privateKey }), (originalPublicKey) =>
							Effect.flatMap(secp256k1.signEffect({ payload: message, privateKey }), (signature) =>
								Effect.flatMap(
									secp256k1.recoverPublicKeyEffect({ payload: message, signature }),
									(recoveredPublicKey) =>
										Effect.succeed({
											originalPublicKey,
											recoveredPublicKey,
										}),
								),
							),
						),
					),
				),
				Secp256k1EffectLayer,
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
