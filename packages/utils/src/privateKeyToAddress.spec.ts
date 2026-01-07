import { describe, expect, it } from 'vitest'
import { privateKeyToAddress } from './privateKeyToAddress.js'
import { PREFUNDED_PRIVATE_KEYS, PREFUNDED_PUBLIC_KEYS } from './prefundedAccounts.js'

describe('privateKeyToAddress', () => {
	it('should derive correct address from private key', () => {
		// Test with the first prefunded account
		const address = privateKeyToAddress(PREFUNDED_PRIVATE_KEYS[0])
		expect(address).toBe(PREFUNDED_PUBLIC_KEYS[0])
	})

	it('should derive correct addresses for all prefunded accounts', () => {
		for (let i = 0; i < PREFUNDED_PRIVATE_KEYS.length; i++) {
			const address = privateKeyToAddress(PREFUNDED_PRIVATE_KEYS[i])
			expect(address).toBe(PREFUNDED_PUBLIC_KEYS[i])
		}
	})

	it('should return checksummed address', () => {
		const address = privateKeyToAddress('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80')
		// Verify it's checksummed (has mixed case)
		expect(address).toBe('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
	})

	it('should throw error for invalid private key length', () => {
		expect(() => privateKeyToAddress('0x1234')).toThrow('Private key must be 32 bytes')
	})

	it('should throw error for non-hex string', () => {
		expect(() => privateKeyToAddress('not-a-hex-string' as `0x${string}`)).toThrow()
	})
})
