import { describe, expect, it } from 'vitest'
import { 
	recoverPublicKey, 
	recoverAddress, 
	hashMessage, 
	recoverMessageAddress, 
	verifyMessage,
	signMessage 
} from './signature.js'
import type { Hex } from './abitype.js'

describe('signature', () => {
	// Test vectors from viem signMessage for 'Hello world'
	const testVectors = {
		privateKey: '0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1' as Hex,
		message: 'Hello world',
		messageHash: '0x8144a6fa26be252b86456491fbcd43c1de7e022241845ffea1c3df066f7cfede' as Hex,
		r: 0x157098a1d96fad0945d44978e3c8f2d1d2410f8ed742652cbf13b6b031391e87n,
		s: 0x28521ff547f3c3242084d0d26f560a6ff1c91988d70d3284ff96f32caa373d78n,
		v: 27,
		expectedAddress: '0xED54a7C1d8634BB589f24Bb7F05a5554b36F9618' as Hex,
	}

	// Test vectors from ecrecover precompile tests
	const ecrecoverTestVectors = {
		hash: '0x852daa74cc3c31fe64542bb9b8764cfb91cc30f9acf9389071ffb44a9eefde46' as Hex,
		v: 27,
		r: 0xb814eaab5953337fed2cf504a5b887cddd65a54b7429d7b191ff1331ca0726b1n,
		s: 0x264de2660d307112075c15f08ba9c25c9a0cc6f8119aff3e7efb0a942773abb0n,
		expectedAddress: '0xCDABe213e99dC5f6Bf6ce5B7149895d2097a4ac0' as Hex,
	}

	describe('recoverPublicKey', () => {
		it('should recover public key from signature with v value', () => {
			const publicKey = recoverPublicKey({
				hash: testVectors.messageHash,
				signature: {
					r: testVectors.r,
					s: testVectors.s,
					v: testVectors.v,
				},
			})

			// Should return a 65-byte uncompressed public key
			expect(publicKey).toMatch(/^0x04[0-9a-f]{128}$/i)
		})

		it('should recover public key from signature with yParity', () => {
			const publicKey = recoverPublicKey({
				hash: testVectors.messageHash,
				signature: {
					r: testVectors.r,
					s: testVectors.s,
					v: 27,
					yParity: 0,
				},
			})

			// Should return a 65-byte uncompressed public key
			expect(publicKey).toMatch(/^0x04[0-9a-f]{128}$/i)
		})

		it('should throw for invalid signature', () => {
			expect(() => recoverPublicKey({
				hash: testVectors.messageHash,
				signature: {
					r: 0n,
					s: 0n,
					v: 27,
				},
			})).toThrow()
		})
	})

	describe('recoverAddress', () => {
		it('should recover address from signature', () => {
			const address = recoverAddress({
				hash: testVectors.messageHash,
				signature: {
					r: testVectors.r,
					s: testVectors.s,
					v: testVectors.v,
				},
			})

			expect(address.toLowerCase()).toBe(testVectors.expectedAddress.toLowerCase())
		})

		it('should recover address from ecrecover test vector', () => {
			const address = recoverAddress({
				hash: ecrecoverTestVectors.hash,
				signature: {
					r: ecrecoverTestVectors.r,
					s: ecrecoverTestVectors.s,
					v: ecrecoverTestVectors.v,
				},
			})

			expect(address.toLowerCase()).toBe(ecrecoverTestVectors.expectedAddress.toLowerCase())
		})

		it('should work with yParity instead of v', () => {
			const address = recoverAddress({
				hash: testVectors.messageHash,
				signature: {
					r: testVectors.r,
					s: testVectors.s,
					v: 27,
					yParity: 0,
				},
			})

			expect(address.toLowerCase()).toBe(testVectors.expectedAddress.toLowerCase())
		})
	})

	describe('hashMessage', () => {
		it('should hash message according to EIP-191', () => {
			const message = 'Hello world'
			const hash = hashMessage(message)
			
			// Expected hash from ethereumjs tests
			expect(hash).toBe('0x8144a6fa26be252b86456491fbcd43c1de7e022241845ffea1c3df066f7cfede')
		})

		it('should handle empty message', () => {
			const hash = hashMessage('')
			expect(hash).toBe('0x5f35dce98ba4fba25530a026ed80b2cecdaa31091ba4958b99b52ea1d068adad')
		})

		it('should handle long message', () => {
			const longMessage = 'a'.repeat(1000)
			const hash = hashMessage(longMessage)
			expect(hash).toMatch(/^0x[0-9a-f]{64}$/i)
		})
	})

	describe('recoverMessageAddress', () => {
		it('should recover address from signed message', () => {
			const address = recoverMessageAddress({ 
				message: testVectors.message, 
				signature: {
					r: testVectors.r,
					s: testVectors.s,
					v: testVectors.v,
				}
			})
			expect(address.toLowerCase()).toBe(testVectors.expectedAddress.toLowerCase())
		})
	})

	describe('verifyMessage', () => {
		it('should verify valid signature', () => {
			const isValid = verifyMessage({
				address: testVectors.expectedAddress,
				message: testVectors.message,
				signature: {
					r: testVectors.r,
					s: testVectors.s,
					v: testVectors.v,
				},
			})

			expect(isValid).toBe(true)
		})

		it('should reject invalid signature', () => {
			const isValid = verifyMessage({
				address: testVectors.expectedAddress,
				message: 'Hello world',
				signature: {
					r: 0x123n,
					s: 0x456n,
					v: 27,
				},
			})

			expect(isValid).toBe(false)
		})

		it('should reject wrong address', () => {
			const isValid = verifyMessage({
				address: '0x0000000000000000000000000000000000000000',
				message: testVectors.message,
				signature: {
					r: testVectors.r,
					s: testVectors.s,
					v: testVectors.v,
				},
			})

			expect(isValid).toBe(false)
		})

		it('should handle case-insensitive address comparison', () => {
			const isValid = verifyMessage({
				address: testVectors.expectedAddress.toUpperCase() as Hex,
				message: testVectors.message,
				signature: {
					r: testVectors.r,
					s: testVectors.s,
					v: testVectors.v,
				},
			})

			expect(isValid).toBe(true)
		})
	})

	describe('signMessage', () => {
		it('should sign message correctly', async () => {
			const message = 'Hello world'
			const signature = await signMessage({
				privateKey: testVectors.privateKey,
				message,
			})

			expect(signature).toHaveProperty('r')
			expect(signature).toHaveProperty('s')
			expect(signature).toHaveProperty('v')
			expect(typeof signature.r).toBe('bigint')
			expect(typeof signature.s).toBe('bigint')
			expect([27, 28]).toContain(signature.v)
		})

		it('should produce deterministic signatures', async () => {
			const message = 'Test message'
			const signature1 = await signMessage({
				privateKey: testVectors.privateKey,
				message,
			})
			const signature2 = await signMessage({
				privateKey: testVectors.privateKey,
				message,
			})

			expect(signature1.r).toBe(signature2.r)
			expect(signature1.s).toBe(signature2.s)
			expect(signature1.v).toBe(signature2.v)
		})
	})

	describe('edge cases', () => {
		it('should handle v values 0 and 1 as yParity', () => {
			const address1 = recoverAddress({
				hash: testVectors.messageHash,
				signature: {
					r: testVectors.r,
					s: testVectors.s,
					v: 27,
					yParity: 0,
				},
			})

			const address2 = recoverAddress({
				hash: testVectors.messageHash,
				signature: {
					r: testVectors.r,
					s: testVectors.s,
					v: 27,
				},
			})

			expect(address1).toBe(address2)
		})

		it('should handle hex strings for r and s values', () => {
			const address = recoverAddress({
				hash: testVectors.messageHash,
				signature: {
					r: BigInt('0x157098a1d96fad0945d44978e3c8f2d1d2410f8ed742652cbf13b6b031391e87'),
					s: BigInt('0x28521ff547f3c3242084d0d26f560a6ff1c91988d70d3284ff96f32caa373d78'),
					v: 27,
				},
			})

			expect(address.toLowerCase()).toBe(testVectors.expectedAddress.toLowerCase())
		})
	})
})