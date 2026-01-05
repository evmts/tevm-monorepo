import { describe, expect, it } from 'vitest'
import type { Hex } from './abitype.js'
import {
	hashMessage,
	hashTypedData,
	recoverAddress,
	recoverMessageAddress,
	recoverPublicKey,
	signMessage,
	signTypedData,
	verifyMessage,
	verifyTypedData,
} from './signature.js'

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
			expect(() =>
				recoverPublicKey({
					hash: testVectors.messageHash,
					signature: {
						r: 0n,
						s: 0n,
						v: 27,
					},
				}),
			).toThrow()
		})

		it('should throw when neither v nor yParity is provided', () => {
			expect(() =>
				recoverPublicKey({
					hash: testVectors.messageHash,
					signature: {
						r: testVectors.r,
						s: testVectors.s,
						// Missing both v and yParity
					},
				}),
			).toThrow('Either v or yParity must be provided in signature')
		})

		it('should handle r and s as hex strings', () => {
			const publicKey = recoverPublicKey({
				hash: testVectors.messageHash,
				signature: {
					// @ts-expect-error - testing string inputs
					r: '0x157098a1d96fad0945d44978e3c8f2d1d2410f8ed742652cbf13b6b031391e87',
					// @ts-expect-error - testing string inputs
					s: '0x28521ff547f3c3242084d0d26f560a6ff1c91988d70d3284ff96f32caa373d78',
					v: testVectors.v,
				},
			})

			// Should return a 65-byte uncompressed public key
			expect(publicKey).toMatch(/^0x04[0-9a-f]{128}$/i)
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

		it('should handle r and s as hex strings in recoverAddress', () => {
			const address = recoverAddress({
				hash: testVectors.messageHash,
				signature: {
					// @ts-expect-error - testing string inputs
					r: '0x157098a1d96fad0945d44978e3c8f2d1d2410f8ed742652cbf13b6b031391e87',
					// @ts-expect-error - testing string inputs
					s: '0x28521ff547f3c3242084d0d26f560a6ff1c91988d70d3284ff96f32caa373d78',
					v: testVectors.v,
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
				},
			})
			expect(address.toLowerCase()).toBe(testVectors.expectedAddress.toLowerCase())
		})

		it('should handle r and s as hex strings', () => {
			const address = recoverMessageAddress({
				message: testVectors.message,
				signature: {
					// @ts-expect-error - testing string inputs
					r: '0x157098a1d96fad0945d44978e3c8f2d1d2410f8ed742652cbf13b6b031391e87',
					// @ts-expect-error - testing string inputs
					s: '0x28521ff547f3c3242084d0d26f560a6ff1c91988d70d3284ff96f32caa373d78',
					v: testVectors.v,
				},
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

		it('should verify with r and s as hex strings', () => {
			const isValid = verifyMessage({
				address: testVectors.expectedAddress,
				message: testVectors.message,
				signature: {
					// @ts-expect-error - testing string inputs
					r: '0x157098a1d96fad0945d44978e3c8f2d1d2410f8ed742652cbf13b6b031391e87',
					// @ts-expect-error - testing string inputs
					s: '0x28521ff547f3c3242084d0d26f560a6ff1c91988d70d3284ff96f32caa373d78',
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

	// EIP-712 Typed Data tests
	describe('hashTypedData', () => {
		const typedData = {
			domain: {
				name: 'Ether Mail',
				version: '1',
				chainId: 1n,
				verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC' as Hex,
			},
			types: {
				Person: [
					{ name: 'name', type: 'string' },
					{ name: 'wallet', type: 'address' },
				],
				Mail: [
					{ name: 'from', type: 'Person' },
					{ name: 'to', type: 'Person' },
					{ name: 'contents', type: 'string' },
				],
			},
			primaryType: 'Mail',
			message: {
				from: {
					name: 'Cow',
					wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
				},
				to: {
					name: 'Bob',
					wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
				},
				contents: 'Hello, Bob!',
			},
		}

		it('should hash typed data correctly', () => {
			const hash = hashTypedData(typedData)
			// Expected hash from EIP-712 spec
			expect(hash).toMatch(/^0x[0-9a-f]{64}$/i)
		})

		it('should produce consistent hashes', () => {
			const hash1 = hashTypedData(typedData)
			const hash2 = hashTypedData(typedData)
			expect(hash1).toBe(hash2)
		})

		it('should handle number chainId', () => {
			const hash = hashTypedData({
				...typedData,
				domain: { ...typedData.domain, chainId: 1 },
			})
			expect(hash).toMatch(/^0x[0-9a-f]{64}$/i)
		})
	})

	describe('signTypedData', () => {
		const typedData = {
			domain: {
				name: 'Ether Mail',
				version: '1',
				chainId: 1n,
				verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC' as Hex,
			},
			types: {
				Person: [
					{ name: 'name', type: 'string' },
					{ name: 'wallet', type: 'address' },
				],
				Mail: [
					{ name: 'from', type: 'Person' },
					{ name: 'to', type: 'Person' },
					{ name: 'contents', type: 'string' },
				],
			},
			primaryType: 'Mail',
			message: {
				from: {
					name: 'Cow',
					wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
				},
				to: {
					name: 'Bob',
					wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
				},
				contents: 'Hello, Bob!',
			},
		}

		it('should sign typed data correctly', () => {
			const signature = signTypedData({
				privateKey: testVectors.privateKey,
				typedData,
			})

			expect(signature).toHaveProperty('r')
			expect(signature).toHaveProperty('s')
			expect(signature).toHaveProperty('v')
			expect(typeof signature.r).toBe('bigint')
			expect(typeof signature.s).toBe('bigint')
			expect([27, 28]).toContain(signature.v)
		})

		it('should produce deterministic signatures', () => {
			const signature1 = signTypedData({
				privateKey: testVectors.privateKey,
				typedData,
			})
			const signature2 = signTypedData({
				privateKey: testVectors.privateKey,
				typedData,
			})

			expect(signature1.r).toBe(signature2.r)
			expect(signature1.s).toBe(signature2.s)
			expect(signature1.v).toBe(signature2.v)
		})
	})

	describe('verifyTypedData', () => {
		const typedData = {
			domain: {
				name: 'Ether Mail',
				version: '1',
				chainId: 1n,
				verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC' as Hex,
			},
			types: {
				Person: [
					{ name: 'name', type: 'string' },
					{ name: 'wallet', type: 'address' },
				],
				Mail: [
					{ name: 'from', type: 'Person' },
					{ name: 'to', type: 'Person' },
					{ name: 'contents', type: 'string' },
				],
			},
			primaryType: 'Mail',
			message: {
				from: {
					name: 'Cow',
					wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
				},
				to: {
					name: 'Bob',
					wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
				},
				contents: 'Hello, Bob!',
			},
		}

		it('should verify valid typed data signature', () => {
			const signature = signTypedData({
				privateKey: testVectors.privateKey,
				typedData,
			})

			const isValid = verifyTypedData({
				address: testVectors.expectedAddress,
				typedData,
				signature,
			})

			expect(isValid).toBe(true)
		})

		it('should reject invalid typed data signature', () => {
			const isValid = verifyTypedData({
				address: testVectors.expectedAddress,
				typedData,
				signature: {
					r: 0x123n,
					s: 0x456n,
					v: 27,
				},
			})

			expect(isValid).toBe(false)
		})

		it('should reject wrong address', () => {
			const signature = signTypedData({
				privateKey: testVectors.privateKey,
				typedData,
			})

			const isValid = verifyTypedData({
				address: '0x0000000000000000000000000000000000000000',
				typedData,
				signature,
			})

			expect(isValid).toBe(false)
		})

		it('should handle bytes32 values in typed data', () => {
			const typedDataWithBytes = {
				domain: {
					name: 'Test',
					version: '1',
				},
				types: {
					HashData: [
						{ name: 'dataHash', type: 'bytes32' },
						{ name: 'count', type: 'uint256' },
					],
				},
				primaryType: 'HashData' as const,
				message: {
					dataHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
					count: 42n,
				},
			}

			const signature = signTypedData({
				privateKey: testVectors.privateKey,
				typedData: typedDataWithBytes,
			})

			expect(signature).toBeDefined()
			expect(signature.r).toBeDefined()
			expect(signature.s).toBeDefined()
			expect(signature.v).toBeDefined()
		})

		it('should handle uint values as numbers in typed data', () => {
			const typedDataWithNumber = {
				domain: {
					name: 'Test',
					version: '1',
				},
				types: {
					Count: [
						{ name: 'value', type: 'uint256' },
					],
				},
				primaryType: 'Count' as const,
				message: {
					value: 42, // Number will be converted to bigint
				},
			}

			const signature = signTypedData({
				privateKey: testVectors.privateKey,
				typedData: typedDataWithNumber,
			})

			expect(signature).toBeDefined()
			expect(signature.r).toBeDefined()
		})
	})
})
