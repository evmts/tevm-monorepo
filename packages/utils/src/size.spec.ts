import { describe, expect, it } from 'vitest'
import { size } from './size.js'

describe('size', () => {
	describe('hex values', () => {
		it('should return the size of a hex string in bytes', () => {
			expect(size('0x1234')).toBe(2)
			expect(size('0x123456')).toBe(3)
			expect(size('0x12345678')).toBe(4)
		})

		it('should handle empty hex string', () => {
			expect(size('0x')).toBe(0)
		})

		it('should handle single byte hex', () => {
			expect(size('0x00')).toBe(1)
			expect(size('0xff')).toBe(1)
		})

		it('should handle odd-length hex strings', () => {
			// '0x123' is 1.5 bytes, ceil rounds to 2
			expect(size('0x123')).toBe(2)
			expect(size('0x1')).toBe(1)
		})

		it('should handle 32 byte hex strings', () => {
			const hash = '0x' + '00'.repeat(32)
			expect(size(hash)).toBe(32)
		})

		it('should handle address-sized hex strings', () => {
			const address = '0x' + '00'.repeat(20)
			expect(size(address)).toBe(20)
		})
	})

	describe('byte arrays', () => {
		it('should return the length of a Uint8Array', () => {
			expect(size(new Uint8Array([1, 2, 3]))).toBe(3)
			expect(size(new Uint8Array([1, 2]))).toBe(2)
			expect(size(new Uint8Array([1]))).toBe(1)
		})

		it('should handle empty Uint8Array', () => {
			expect(size(new Uint8Array([]))).toBe(0)
			expect(size(new Uint8Array(0))).toBe(0)
		})

		it('should handle large Uint8Arrays', () => {
			expect(size(new Uint8Array(32))).toBe(32)
			expect(size(new Uint8Array(100))).toBe(100)
		})
	})
})
