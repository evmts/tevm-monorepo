import { describe, expect, it } from 'vitest'
import { setLengthLeft } from './setLengthLeft.js'

describe('setLengthLeft', () => {
	it('should left pad bytes to the specified length', () => {
		const bytes = new Uint8Array([1, 2, 3])
		const result = setLengthLeft(bytes, 5)
		expect(result).toEqual(new Uint8Array([0, 0, 1, 2, 3]))
	})

	it('should return unchanged if bytes length equals target', () => {
		const bytes = new Uint8Array([1, 2, 3])
		const result = setLengthLeft(bytes, 3)
		expect(result).toBe(bytes) // Same reference
		expect(result).toEqual(new Uint8Array([1, 2, 3]))
	})

	it('should return unchanged if bytes length exceeds target', () => {
		const bytes = new Uint8Array([1, 2, 3, 4, 5])
		const result = setLengthLeft(bytes, 3)
		expect(result).toBe(bytes) // Same reference
		expect(result).toEqual(new Uint8Array([1, 2, 3, 4, 5]))
	})

	it('should handle empty bytes', () => {
		const bytes = new Uint8Array([])
		const result = setLengthLeft(bytes, 3)
		expect(result).toEqual(new Uint8Array([0, 0, 0]))
	})

	it('should handle padding to much larger length', () => {
		const bytes = new Uint8Array([0xff])
		const result = setLengthLeft(bytes, 32)
		const expected = new Uint8Array(32)
		expected[31] = 0xff
		expect(result).toEqual(expected)
	})

	it('should handle single byte padding by one', () => {
		const bytes = new Uint8Array([0xab])
		const result = setLengthLeft(bytes, 2)
		expect(result).toEqual(new Uint8Array([0x00, 0xab]))
	})

	it('should preserve all original bytes', () => {
		const bytes = new Uint8Array([0x12, 0x34, 0x56, 0x78])
		const result = setLengthLeft(bytes, 8)
		expect(result).toEqual(new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x12, 0x34, 0x56, 0x78]))
	})
})
