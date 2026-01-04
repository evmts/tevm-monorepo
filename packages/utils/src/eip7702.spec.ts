import { describe, it, expect } from 'vitest'
import {
	EOA_CODE_7702_AUTHORITY_SIGNING_MAGIC,
	eoaCode7702AuthorizationListBytesItemToJSON,
	eoaCode7702AuthorizationListJSONItemToBytes,
	eoaCode7702AuthorizationMessageToSign,
	eoaCode7702AuthorizationHashedMessageToSign,
	eoaCode7702SignAuthorization,
	eoaCode7702RecoverAuthority,
	isEOACode7702AuthorizationListBytes,
	isEOACode7702AuthorizationList,
} from './eip7702.js'
import { hexToBytes, bytesToHex } from './viem.js'
import { secp256k1 } from '@noble/curves/secp256k1.js'

// Test private key (DO NOT USE IN PRODUCTION)
const testPrivateKey = hexToBytes('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80')
// Corresponding address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

describe('EIP-7702 utilities', () => {
	describe('EOA_CODE_7702_AUTHORITY_SIGNING_MAGIC', () => {
		it('should be 0x05', () => {
			expect(EOA_CODE_7702_AUTHORITY_SIGNING_MAGIC).toEqual(new Uint8Array([0x05]))
		})
	})

	describe('eoaCode7702AuthorizationListBytesItemToJSON', () => {
		it('should convert bytes tuple to JSON format', () => {
			const bytesAuth: [Uint8Array, Uint8Array, Uint8Array, Uint8Array, Uint8Array, Uint8Array] = [
				hexToBytes('0x01'), // chainId
				hexToBytes('0x1234567890123456789012345678901234567890'), // address
				hexToBytes('0x00'), // nonce
				hexToBytes('0x00'), // yParity
				hexToBytes('0xabcdef'), // r
				hexToBytes('0x123456'), // s
			]

			const json = eoaCode7702AuthorizationListBytesItemToJSON(bytesAuth)

			expect(json.chainId).toBe('0x01')
			expect(json.address).toBe('0x1234567890123456789012345678901234567890')
			expect(json.nonce).toBe('0x00')
			expect(json.yParity).toBe('0x00')
			expect(json.r).toBe('0xabcdef')
			expect(json.s).toBe('0x123456')
		})
	})

	describe('eoaCode7702AuthorizationListJSONItemToBytes', () => {
		it('should convert JSON to bytes format', () => {
			const jsonAuth = {
				chainId: '0x01' as const,
				address: '0x1234567890123456789012345678901234567890' as const,
				nonce: '0x00' as const,
				yParity: '0x00' as const,
				r: '0xabcdef' as const,
				s: '0x123456' as const,
			}

			const bytes = eoaCode7702AuthorizationListJSONItemToBytes(jsonAuth)

			expect(bytes[0]).toEqual(hexToBytes('0x01'))
			expect(bytes[1]).toEqual(hexToBytes('0x1234567890123456789012345678901234567890'))
			expect(bytes[2]).toEqual(hexToBytes('0x00'))
			expect(bytes[3]).toEqual(hexToBytes('0x00'))
			expect(bytes[4]).toEqual(hexToBytes('0xabcdef'))
			expect(bytes[5]).toEqual(hexToBytes('0x123456'))
		})

		it('should throw if required field is missing', () => {
			const incompleteAuth = {
				chainId: '0x01' as const,
				address: '0x1234567890123456789012345678901234567890' as const,
				// missing nonce, yParity, r, s
			}

			expect(() => eoaCode7702AuthorizationListJSONItemToBytes(incompleteAuth as any)).toThrow(
				'EIP-7702 authorization list invalid: nonce is not defined'
			)
		})
	})

	describe('eoaCode7702AuthorizationMessageToSign', () => {
		it('should create message from JSON input', () => {
			const jsonInput = {
				chainId: '0x01' as const,
				address: '0x1234567890123456789012345678901234567890' as const,
				nonce: '0x00' as const,
			}

			const message = eoaCode7702AuthorizationMessageToSign(jsonInput)

			// Should start with magic byte 0x05
			expect(message[0]).toBe(0x05)
			// Rest should be RLP encoded
			expect(message.length).toBeGreaterThan(1)
		})

		it('should create message from bytes input', () => {
			const bytesInput: [Uint8Array, Uint8Array, Uint8Array] = [
				hexToBytes('0x01'), // chainId
				hexToBytes('0x1234567890123456789012345678901234567890'), // address (20 bytes)
				hexToBytes('0x00'), // nonce
			]

			const message = eoaCode7702AuthorizationMessageToSign(bytesInput)

			// Should start with magic byte 0x05
			expect(message[0]).toBe(0x05)
		})

		it('should throw if address is not 20 bytes in bytes input', () => {
			const bytesInput: [Uint8Array, Uint8Array, Uint8Array] = [
				hexToBytes('0x01'), // chainId
				hexToBytes('0x1234'), // address (only 2 bytes - invalid)
				hexToBytes('0x00'), // nonce
			]

			expect(() => eoaCode7702AuthorizationMessageToSign(bytesInput)).toThrow(
				'Cannot sign authority: address length should be 20 bytes'
			)
		})

		it('should produce consistent results for bytes and JSON input', () => {
			const jsonInput = {
				chainId: '0x01' as const,
				address: '0x1234567890123456789012345678901234567890' as const,
				nonce: '0x00' as const,
			}
			const bytesInput: [Uint8Array, Uint8Array, Uint8Array] = [
				hexToBytes('0x01'),
				hexToBytes('0x1234567890123456789012345678901234567890'),
				hexToBytes('0x00'),
			]

			const messageFromJson = eoaCode7702AuthorizationMessageToSign(jsonInput)
			const messageFromBytes = eoaCode7702AuthorizationMessageToSign(bytesInput)

			expect(messageFromJson).toEqual(messageFromBytes)
		})
	})

	describe('eoaCode7702AuthorizationHashedMessageToSign', () => {
		it('should return 32-byte hash', () => {
			const jsonInput = {
				chainId: '0x01' as const,
				address: '0x1234567890123456789012345678901234567890' as const,
				nonce: '0x00' as const,
			}

			const hash = eoaCode7702AuthorizationHashedMessageToSign(jsonInput)

			expect(hash).toBeInstanceOf(Uint8Array)
			expect(hash.length).toBe(32)
		})

		it('should produce consistent hash for same input', () => {
			const jsonInput = {
				chainId: '0x01' as const,
				address: '0x1234567890123456789012345678901234567890' as const,
				nonce: '0x00' as const,
			}

			const hash1 = eoaCode7702AuthorizationHashedMessageToSign(jsonInput)
			const hash2 = eoaCode7702AuthorizationHashedMessageToSign(jsonInput)

			expect(hash1).toEqual(hash2)
		})
	})

	describe('eoaCode7702SignAuthorization', () => {
		it('should sign authorization from JSON input', () => {
			const jsonInput = {
				chainId: '0x01' as const,
				address: '0x1234567890123456789012345678901234567890' as const,
				nonce: '0x00' as const,
			}

			const signed = eoaCode7702SignAuthorization(jsonInput, testPrivateKey)

			expect(signed).toHaveLength(6)
			expect(signed[0]).toEqual(hexToBytes('0x01')) // chainId preserved
			// address should be padded to 20 bytes
			expect(signed[1].length).toBe(20)
			// yParity should be 0 or 1
			const yParity = signed[3].length === 0 ? 0n : BigInt(bytesToHex(signed[3]))
			expect(yParity === 0n || yParity === 1n).toBe(true)
			// r and s should exist
			expect(signed[4].length).toBeGreaterThan(0)
			expect(signed[5].length).toBeGreaterThan(0)
		})

		it('should sign authorization from bytes input', () => {
			const bytesInput: [Uint8Array, Uint8Array, Uint8Array] = [
				hexToBytes('0x01'),
				hexToBytes('0x1234567890123456789012345678901234567890'),
				hexToBytes('0x00'),
			]

			const signed = eoaCode7702SignAuthorization(bytesInput, testPrivateKey)

			expect(signed).toHaveLength(6)
			expect(signed[1]).toEqual(hexToBytes('0x1234567890123456789012345678901234567890'))
		})

		it('should allow custom signing function', () => {
			const jsonInput = {
				chainId: '0x01' as const,
				address: '0x1234567890123456789012345678901234567890' as const,
				nonce: '0x00' as const,
			}

			let customSignCalled = false
			const customSign = (msgHash: Uint8Array, privateKey: Uint8Array) => {
				customSignCalled = true
				return secp256k1.sign(msgHash, privateKey)
			}

			eoaCode7702SignAuthorization(jsonInput, testPrivateKey, customSign)
			expect(customSignCalled).toBe(true)
		})
	})

	describe('eoaCode7702RecoverAuthority', () => {
		it('should recover authority from signed authorization', () => {
			const jsonInput = {
				chainId: '0x01' as const,
				address: '0x1234567890123456789012345678901234567890' as const,
				nonce: '0x00' as const,
			}

			// Sign with test private key
			const signed = eoaCode7702SignAuthorization(jsonInput, testPrivateKey)

			// Recover the authority
			const authority = eoaCode7702RecoverAuthority(signed)

			// The recovered address should be the address corresponding to testPrivateKey
			// testPrivateKey corresponds to 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
			expect(authority.toString().toLowerCase()).toBe('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266')
		})

		it('should recover authority from JSON format', () => {
			const jsonInput = {
				chainId: '0x01' as const,
				address: '0x1234567890123456789012345678901234567890' as const,
				nonce: '0x00' as const,
			}

			// Sign and convert to JSON
			const signedBytes = eoaCode7702SignAuthorization(jsonInput, testPrivateKey)
			const signedJson = eoaCode7702AuthorizationListBytesItemToJSON(signedBytes)

			// Recover from JSON
			const authority = eoaCode7702RecoverAuthority(signedJson)

			expect(authority.toString().toLowerCase()).toBe('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266')
		})
	})

	describe('isEOACode7702AuthorizationListBytes', () => {
		it('should return true for empty array', () => {
			expect(isEOACode7702AuthorizationListBytes([])).toBe(true)
		})

		it('should return true for array of byte tuples', () => {
			const bytesAuth: [Uint8Array, Uint8Array, Uint8Array, Uint8Array, Uint8Array, Uint8Array][] = [
				[
					hexToBytes('0x01'),
					hexToBytes('0x1234567890123456789012345678901234567890'),
					hexToBytes('0x00'),
					hexToBytes('0x00'),
					hexToBytes('0xabcdef'),
					hexToBytes('0x123456'),
				],
			]

			expect(isEOACode7702AuthorizationListBytes(bytesAuth)).toBe(true)
		})

		it('should return false for array of JSON objects', () => {
			const jsonAuth = [
				{
					chainId: '0x01' as const,
					address: '0x1234567890123456789012345678901234567890' as const,
					nonce: '0x00' as const,
					yParity: '0x00' as const,
					r: '0xabcdef' as const,
					s: '0x123456' as const,
				},
			]

			expect(isEOACode7702AuthorizationListBytes(jsonAuth as any)).toBe(false)
		})
	})

	describe('isEOACode7702AuthorizationList', () => {
		it('should return true for array of JSON objects', () => {
			const jsonAuth = [
				{
					chainId: '0x01' as const,
					address: '0x1234567890123456789012345678901234567890' as const,
					nonce: '0x00' as const,
					yParity: '0x00' as const,
					r: '0xabcdef' as const,
					s: '0x123456' as const,
				},
			]

			expect(isEOACode7702AuthorizationList(jsonAuth as any)).toBe(true)
		})

		it('should return false for array of byte tuples', () => {
			const bytesAuth: [Uint8Array, Uint8Array, Uint8Array, Uint8Array, Uint8Array, Uint8Array][] = [
				[
					hexToBytes('0x01'),
					hexToBytes('0x1234567890123456789012345678901234567890'),
					hexToBytes('0x00'),
					hexToBytes('0x00'),
					hexToBytes('0xabcdef'),
					hexToBytes('0x123456'),
				],
			]

			expect(isEOACode7702AuthorizationList(bytesAuth)).toBe(false)
		})

		it('should return false for empty array', () => {
			// Empty array is considered bytes format by convention
			expect(isEOACode7702AuthorizationList([])).toBe(false)
		})
	})

	describe('round trip JSON <-> bytes', () => {
		it('should preserve data through conversion', () => {
			const originalJson = {
				chainId: '0x01' as const,
				address: '0x1234567890123456789012345678901234567890' as const,
				nonce: '0x05' as const,
				yParity: '0x01' as const,
				r: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890' as const,
				s: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef' as const,
			}

			const bytes = eoaCode7702AuthorizationListJSONItemToBytes(originalJson)
			const backToJson = eoaCode7702AuthorizationListBytesItemToJSON(bytes)

			expect(backToJson.chainId).toBe(originalJson.chainId)
			expect(backToJson.address).toBe(originalJson.address)
			expect(backToJson.nonce).toBe(originalJson.nonce)
			expect(backToJson.yParity).toBe(originalJson.yParity)
			expect(backToJson.r).toBe(originalJson.r)
			expect(backToJson.s).toBe(originalJson.s)
		})
	})
})
