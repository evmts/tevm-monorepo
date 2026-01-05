import { describe, expect, it } from 'vitest'
import { randomBytes } from './randomBytes.js'

describe('randomBytes', () => {
	it('should generate bytes of the specified length', () => {
		const bytes16 = randomBytes(16)
		expect(bytes16).toBeInstanceOf(Uint8Array)
		expect(bytes16.length).toBe(16)

		const bytes32 = randomBytes(32)
		expect(bytes32).toBeInstanceOf(Uint8Array)
		expect(bytes32.length).toBe(32)

		const bytes64 = randomBytes(64)
		expect(bytes64).toBeInstanceOf(Uint8Array)
		expect(bytes64.length).toBe(64)
	})

	it('should generate empty array for length 0', () => {
		const bytes = randomBytes(0)
		expect(bytes).toBeInstanceOf(Uint8Array)
		expect(bytes.length).toBe(0)
	})

	it('should throw for negative length', () => {
		expect(() => randomBytes(-1)).toThrow('randomBytes: length must be a non-negative integer')
	})

	it('should throw for non-integer length', () => {
		expect(() => randomBytes(1.5)).toThrow('randomBytes: length must be a non-negative integer')
		expect(() => randomBytes(NaN)).toThrow('randomBytes: length must be a non-negative integer')
	})

	it('should generate different bytes on each call', () => {
		const bytes1 = randomBytes(32)
		const bytes2 = randomBytes(32)
		// The probability of two 32-byte random sequences being identical is astronomically low
		expect(bytes1).not.toEqual(bytes2)
	})

	it('should generate Uint8Array with correct length', () => {
		// Verify that our native implementation matches the expected behavior
		const native = randomBytes(32)
		expect(native).toBeInstanceOf(Uint8Array)
		expect(native.length).toBe(32)

		// Test various sizes
		const sizes = [1, 16, 20, 32, 64, 128]
		for (const size of sizes) {
			const bytes = randomBytes(size)
			expect(bytes).toBeInstanceOf(Uint8Array)
			expect(bytes.length).toBe(size)
		}
	})

	it('should generate bytes with good distribution', () => {
		// Generate a larger sample and verify bytes are not all the same
		const bytes = randomBytes(256)
		const uniqueValues = new Set(bytes)
		// With 256 random bytes, we'd expect to see many unique values
		// The probability of all 256 bytes being the same is (1/256)^255 ≈ 0
		expect(uniqueValues.size).toBeGreaterThan(10)
	})
})
