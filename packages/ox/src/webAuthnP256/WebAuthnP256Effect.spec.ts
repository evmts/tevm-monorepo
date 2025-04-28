import { Effect } from 'effect'
import { describe, expect, it } from 'vitest'
import { WebAuthnP256EffectLive, WebAuthnP256EffectService } from './WebAuthnP256Effect.js'

describe('WebAuthnP256Effect', () => {
	const webAuthnP256: WebAuthnP256EffectService = WebAuthnP256EffectLive

	it('should generate a key pair', async () => {
		const result = await Effect.runPromise(webAuthnP256.generateKeyPairEffect())
		expect(result).toBeDefined()
		expect(result.privateKey).toBeDefined()
		expect(result.publicKey).toBeDefined()
	})

	it('should sign a message', async () => {
		const keyPair = await Effect.runPromise(webAuthnP256.generateKeyPairEffect())
		const message = new Uint8Array([1, 2, 3, 4, 5])
		const result = await Effect.runPromise(webAuthnP256.signEffect(message, keyPair.privateKey))
		expect(result).toBeDefined()
		expect(result.length).toBeGreaterThan(0)
	})

	it('should verify a signature', async () => {
		const keyPair = await Effect.runPromise(webAuthnP256.generateKeyPairEffect())
		const message = new Uint8Array([1, 2, 3, 4, 5])
		const signature = await Effect.runPromise(webAuthnP256.signEffect(message, keyPair.privateKey))
		const result = await Effect.runPromise(webAuthnP256.verifyEffect(message, signature, keyPair.publicKey))
		expect(result).toBe(true)
	})

	it('should get public key from private key', async () => {
		const keyPair = await Effect.runPromise(webAuthnP256.generateKeyPairEffect())
		const result = await Effect.runPromise(webAuthnP256.getPublicKeyEffect(keyPair.privateKey))
		expect(result).toBeDefined()
		expect(result.length).toBeGreaterThan(0)
	})
})
