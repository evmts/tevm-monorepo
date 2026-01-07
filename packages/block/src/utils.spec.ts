import { describe, it, expect } from 'vitest'
import { zeros, createZeroAddress, createAddressFromPublicKey, safeToType, getSignatureV } from './utils.js'
import { EthjsAddress, hexToBytes } from '@tevm/utils'

describe('utils.ts', () => {
	describe('zeros', () => {
		it('should create a zero-filled Uint8Array of specified length', () => {
			const result = zeros(20)
			expect(result).toBeInstanceOf(Uint8Array)
			expect(result.length).toBe(20)
			expect(result.every((b) => b === 0)).toBe(true)
		})

		it('should create empty array for length 0', () => {
			const result = zeros(0)
			expect(result).toBeInstanceOf(Uint8Array)
			expect(result.length).toBe(0)
		})

		it('should create array of length 32', () => {
			const result = zeros(32)
			expect(result.length).toBe(32)
			expect(result.every((b) => b === 0)).toBe(true)
		})

		it('should create array of length 65 (signature size)', () => {
			const result = zeros(65)
			expect(result.length).toBe(65)
			expect(result.every((b) => b === 0)).toBe(true)
		})

		it('should create large arrays', () => {
			const result = zeros(1000)
			expect(result.length).toBe(1000)
			expect(result.every((b) => b === 0)).toBe(true)
		})
	})

	describe('createZeroAddress', () => {
		it('should create a zero address', () => {
			const result = createZeroAddress()
			expect(result).toBeInstanceOf(EthjsAddress)
			expect(result.bytes.length).toBe(20)
			expect(result.bytes.every((b) => b === 0)).toBe(true)
		})

		it('should create the canonical zero address string', () => {
			const result = createZeroAddress()
			expect(result.toString()).toBe('0x0000000000000000000000000000000000000000')
		})

		it('should create new instances each time', () => {
			const result1 = createZeroAddress()
			const result2 = createZeroAddress()
			expect(result1).not.toBe(result2)
			expect(result1.toString()).toBe(result2.toString())
		})
	})

	describe('createAddressFromPublicKey', () => {
		it('should create address from 64-byte uncompressed public key', () => {
			// Known test case: a 64-byte public key
			// The address is derived by taking keccak256 of the public key and using last 20 bytes
			const publicKey = hexToBytes(
				'0x04bfcab17da04289c0a44dacd259c36f92d96e97a6b8f5e8e52e6a93e67e8e3a9d5e8a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8',
			)
			const result = createAddressFromPublicKey(publicKey)
			expect(result).toBeInstanceOf(EthjsAddress)
			expect(result.bytes.length).toBe(20)
		})

		it('should produce consistent addresses for same public key', () => {
			const publicKey = hexToBytes(
				'0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
			)
			const result1 = createAddressFromPublicKey(publicKey)
			const result2 = createAddressFromPublicKey(publicKey)
			expect(result1.toString()).toBe(result2.toString())
		})

		it('should produce different addresses for different public keys', () => {
			const publicKey1 = hexToBytes(
				'0x1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111',
			)
			const publicKey2 = hexToBytes(
				'0x2222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222',
			)
			const result1 = createAddressFromPublicKey(publicKey1)
			const result2 = createAddressFromPublicKey(publicKey2)
			expect(result1.toString()).not.toBe(result2.toString())
		})

		it('should handle 32-byte public key (compressed format)', () => {
			const publicKey = hexToBytes('0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef')
			const result = createAddressFromPublicKey(publicKey)
			expect(result).toBeInstanceOf(EthjsAddress)
			expect(result.bytes.length).toBe(20)
		})
	})

	describe('safeToType', () => {
		it('should return undefined for null input', () => {
			const result = safeToType(null, 2)
			expect(result).toBeUndefined()
		})

		it('should return undefined for undefined input', () => {
			const result = safeToType(undefined, 2)
			expect(result).toBeUndefined()
		})

		it('should convert hex string to bytes when outputType is 2', () => {
			const result = safeToType('0xdeadbeef', 2)
			expect(result).toBeInstanceOf(Uint8Array)
		})

		it('should handle BigInt input', () => {
			const result = safeToType(12345n, 0)
			expect(result).toBeDefined()
		})

		it('should handle number input', () => {
			const result = safeToType(12345, 0)
			expect(result).toBeDefined()
		})

		it('should handle Uint8Array input', () => {
			const input = new Uint8Array([0xde, 0xad, 0xbe, 0xef])
			const result = safeToType(input, 2)
			expect(result).toBeInstanceOf(Uint8Array)
		})

		it('should convert empty string for outputType 2', () => {
			const result = safeToType('0x', 2)
			expect(result).toBeInstanceOf(Uint8Array)
		})
	})

	describe('getSignatureV', () => {
		it('should extract v from signature with v property', () => {
			const signature = { v: 27, r: '0x123', s: '0x456' }
			const result = getSignatureV(signature)
			expect(result).toBe(27n)
		})

		it('should extract v from signature with bigint v', () => {
			const signature = { v: 28n, r: '0x123', s: '0x456' }
			const result = getSignatureV(signature)
			expect(result).toBe(28n)
		})

		it('should calculate v from recovery value 0', () => {
			const signature = { recovery: 0, r: '0x123', s: '0x456' }
			const result = getSignatureV(signature)
			expect(result).toBe(27n)
		})

		it('should calculate v from recovery value 1', () => {
			const signature = { recovery: 1, r: '0x123', s: '0x456' }
			const result = getSignatureV(signature)
			expect(result).toBe(28n)
		})

		it('should calculate v from bigint recovery value', () => {
			const signature = { recovery: 0n, r: '0x123', s: '0x456' }
			const result = getSignatureV(signature)
			expect(result).toBe(27n)
		})

		it('should prefer v over recovery when both present', () => {
			const signature = { v: 35, recovery: 0, r: '0x123', s: '0x456' }
			const result = getSignatureV(signature)
			expect(result).toBe(35n)
		})

		it('should handle EIP-155 v values', () => {
			// EIP-155 v value = chainId * 2 + 35 + recovery
			// For chainId 1, recovery 0: v = 1 * 2 + 35 + 0 = 37
			const signature = { v: 37, r: '0x123', s: '0x456' }
			const result = getSignatureV(signature)
			expect(result).toBe(37n)
		})

		it('should handle EIP-155 v values for other chains', () => {
			// For mainnet with recovery 1: v = 1 * 2 + 35 + 1 = 38
			const signature = { v: 38, r: '0x123', s: '0x456' }
			const result = getSignatureV(signature)
			expect(result).toBe(38n)
		})

		it('should throw for signature without v or recovery', () => {
			const signature = { r: '0x123', s: '0x456' }
			expect(() => getSignatureV(signature)).toThrow('Invalid signature format: missing v or recovery')
		})

		it('should throw for empty signature object', () => {
			const signature = {}
			expect(() => getSignatureV(signature)).toThrow('Invalid signature format: missing v or recovery')
		})

		it('should handle v value of 0 (which is truthy check edge case)', () => {
			// v: 0 is a valid value and should not fall through to recovery
			const signature = { v: 0, recovery: 1, r: '0x123', s: '0x456' }
			const result = getSignatureV(signature)
			expect(result).toBe(0n)
		})
	})
})
