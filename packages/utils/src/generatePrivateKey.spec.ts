import { describe, expect, it } from 'vitest'
import { generatePrivateKey } from './generatePrivateKey.js'
import { hexToBytes } from './viem.js'

describe('generatePrivateKey', () => {
	it('generates a valid hex string starting with 0x', () => {
		const privateKey = generatePrivateKey()
		expect(privateKey.startsWith('0x')).toBe(true)
	})

	it('generates a key of correct length (66 chars = 0x + 64 hex)', () => {
		const privateKey = generatePrivateKey()
		expect(privateKey.length).toBe(66)
	})

	it('generates different keys on each call (cryptographically random)', () => {
		const key1 = generatePrivateKey()
		const key2 = generatePrivateKey()
		expect(key1).not.toBe(key2)
	})

	it('generates valid hex characters', () => {
		const privateKey = generatePrivateKey()
		const hexPattern = /^0x[0-9a-f]{64}$/i
		expect(hexPattern.test(privateKey)).toBe(true)
	})

	it('generates 32 bytes when converted to bytes', () => {
		const privateKey = generatePrivateKey()
		const bytes = hexToBytes(privateKey)
		expect(bytes.length).toBe(32)
	})

	it('generates keys with high entropy (all bytes should vary)', () => {
		// Generate multiple keys and check they use various byte values
		const keys = Array.from({ length: 10 }, () => generatePrivateKey())
		const allBytes = new Set<number>()

		for (const key of keys) {
			const bytes = hexToBytes(key)
			for (const byte of bytes) {
				allBytes.add(byte)
			}
		}

		// With 320 random bytes, we should have at least 100 unique byte values
		// (statistically very likely with good randomness)
		expect(allBytes.size).toBeGreaterThan(100)
	})
})
