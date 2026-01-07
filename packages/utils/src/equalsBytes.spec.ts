import { describe, expect, it } from 'vitest'
import { equalsBytes } from './equalsBytes.js'

describe('equalsBytes', () => {
	it('should return true for equal arrays', () => {
		const a = new Uint8Array([1, 2, 3])
		const b = new Uint8Array([1, 2, 3])
		expect(equalsBytes(a, b)).toBe(true)
	})

	it('should return false for arrays with different content', () => {
		const a = new Uint8Array([1, 2, 3])
		const b = new Uint8Array([1, 2, 4])
		expect(equalsBytes(a, b)).toBe(false)
	})

	it('should return false for arrays with different lengths', () => {
		const a = new Uint8Array([1, 2, 3])
		const b = new Uint8Array([1, 2])
		expect(equalsBytes(a, b)).toBe(false)
	})

	it('should return false when first array is longer', () => {
		const a = new Uint8Array([1, 2, 3, 4])
		const b = new Uint8Array([1, 2, 3])
		expect(equalsBytes(a, b)).toBe(false)
	})

	it('should return false when second array is longer', () => {
		const a = new Uint8Array([1, 2, 3])
		const b = new Uint8Array([1, 2, 3, 4])
		expect(equalsBytes(a, b)).toBe(false)
	})

	it('should return true for empty arrays', () => {
		const a = new Uint8Array([])
		const b = new Uint8Array([])
		expect(equalsBytes(a, a)).toBe(true)
		expect(equalsBytes(a, b)).toBe(true)
	})

	it('should return false for empty vs non-empty array', () => {
		const a = new Uint8Array([])
		const b = new Uint8Array([1])
		expect(equalsBytes(a, b)).toBe(false)
		expect(equalsBytes(b, a)).toBe(false)
	})

	it('should return true for same reference', () => {
		const a = new Uint8Array([1, 2, 3])
		expect(equalsBytes(a, a)).toBe(true)
	})

	it('should return true for large equal arrays', () => {
		const a = new Uint8Array(1000).fill(42)
		const b = new Uint8Array(1000).fill(42)
		expect(equalsBytes(a, b)).toBe(true)
	})

	it('should return false when only first byte differs', () => {
		const a = new Uint8Array([1, 2, 3])
		const b = new Uint8Array([9, 2, 3])
		expect(equalsBytes(a, b)).toBe(false)
	})

	it('should return false when only last byte differs', () => {
		const a = new Uint8Array([1, 2, 3])
		const b = new Uint8Array([1, 2, 9])
		expect(equalsBytes(a, b)).toBe(false)
	})

	it('should handle 32-byte arrays (like hashes)', () => {
		const hash1 = new Uint8Array(32).fill(0)
		const hash2 = new Uint8Array(32).fill(0)
		const hash3 = new Uint8Array(32).fill(1)

		expect(equalsBytes(hash1, hash2)).toBe(true)
		expect(equalsBytes(hash1, hash3)).toBe(false)
	})

	it('should handle 20-byte arrays (like addresses)', () => {
		const addr1 = new Uint8Array(20).fill(0xab)
		const addr2 = new Uint8Array(20).fill(0xab)
		const addr3 = new Uint8Array(20).fill(0xcd)

		expect(equalsBytes(addr1, addr2)).toBe(true)
		expect(equalsBytes(addr1, addr3)).toBe(false)
	})
})
