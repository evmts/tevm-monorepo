import { describe, expect, it } from 'vitest'
import { concatBytes } from './concatBytes.js'

describe('concatBytes', () => {
	it('should concatenate two arrays', () => {
		const bytes1 = new Uint8Array([1, 2])
		const bytes2 = new Uint8Array([3, 4])
		const result = concatBytes(bytes1, bytes2)
		expect(result).toEqual(new Uint8Array([1, 2, 3, 4]))
	})

	it('should concatenate multiple arrays', () => {
		const a = new Uint8Array([1])
		const b = new Uint8Array([2, 3])
		const c = new Uint8Array([4, 5, 6])
		const result = concatBytes(a, b, c)
		expect(result).toEqual(new Uint8Array([1, 2, 3, 4, 5, 6]))
	})

	it('should handle single array', () => {
		const bytes = new Uint8Array([1, 2, 3])
		const result = concatBytes(bytes)
		expect(result).toEqual(new Uint8Array([1, 2, 3]))
	})

	it('should handle empty arrays', () => {
		const empty = new Uint8Array([])
		const bytes = new Uint8Array([1, 2])
		const result = concatBytes(empty, bytes, empty)
		expect(result).toEqual(new Uint8Array([1, 2]))
	})

	it('should handle all empty arrays', () => {
		const empty = new Uint8Array([])
		const result = concatBytes(empty, empty)
		expect(result).toEqual(new Uint8Array([]))
		expect(result.length).toBe(0)
	})

	it('should handle no arguments', () => {
		const result = concatBytes()
		expect(result).toEqual(new Uint8Array([]))
		expect(result.length).toBe(0)
	})

	it('should preserve byte values', () => {
		const bytes1 = new Uint8Array([0xff, 0x00])
		const bytes2 = new Uint8Array([0xde, 0xad, 0xbe, 0xef])
		const result = concatBytes(bytes1, bytes2)
		expect(result).toEqual(new Uint8Array([0xff, 0x00, 0xde, 0xad, 0xbe, 0xef]))
	})

	it('should return new array instance', () => {
		const bytes1 = new Uint8Array([1, 2])
		const bytes2 = new Uint8Array([3, 4])
		const result = concatBytes(bytes1, bytes2)
		expect(result).not.toBe(bytes1)
		expect(result).not.toBe(bytes2)
	})
})
