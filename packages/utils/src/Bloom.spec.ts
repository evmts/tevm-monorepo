import { describe, expect, it } from 'vitest'
import { Bloom } from './Bloom.js'
import { hexToBytes, keccak256 } from './viem.js'

describe('Bloom', () => {
	it('should initialize with zeros if no bitvector is provided', () => {
		const bloom = new Bloom()
		expect(bloom.bitvector).toEqual(new Uint8Array(256))
	})

	it('should throw an error if bitvector length is not 256', () => {
		expect(() => new Bloom(new Uint8Array(255))).toThrow('Bloom bitvectors must be 256 bytes long')
		expect(() => new Bloom(new Uint8Array(257))).toThrow('Bloom bitvectors must be 256 bytes long')
	})

	it('should add an element to the bloom filter', () => {
		const bloom = new Bloom()
		const element = new Uint8Array([1, 2, 3, 4, 5])
		bloom.add(element)
		const eBytes = hexToBytes(keccak256(element))
		const mask = 2047
		for (let i = 0; i < 3; i++) {
			const first2bytes = new DataView(eBytes.buffer).getUint16(i * 2)
			const loc = mask & first2bytes
			const byteLoc = loc >> 3
			const bitLoc = 1 << (loc % 8)
			const item = bloom.bitvector[256 - byteLoc - 1]
			if (!item) throw new Error('item is not defined')
			expect(item & bitLoc).not.toBe(0)
		}
	})

	it('should check if an element is in the bloom filter', () => {
		const bloom = new Bloom()
		const element = new Uint8Array([1, 2, 3, 4, 5])
		bloom.add(element)
		expect(bloom.check(element)).toBe(true)
		const nonExistentElement = new Uint8Array([6, 7, 8, 9, 10])
		expect(bloom.check(nonExistentElement)).toBe(false)
	})

	it('should check if multiple topics are in the bloom filter', () => {
		const bloom = new Bloom()
		const element1 = new Uint8Array([1, 2, 3, 4, 5])
		const element2 = new Uint8Array([6, 7, 8, 9, 10])
		bloom.add(element1)
		bloom.add(element2)
		expect(bloom.multiCheck([element1, element2])).toBe(true)
		const nonExistentElement = new Uint8Array([11, 12, 13, 14, 15])
		expect(bloom.multiCheck([element1, nonExistentElement])).toBe(false)
	})

	it('should bitwise-or another bloom filter', () => {
		const bloom1 = new Bloom()
		const bloom2 = new Bloom()
		const element1 = new Uint8Array([1, 2, 3, 4, 5])
		const element2 = new Uint8Array([6, 7, 8, 9, 10])
		bloom1.add(element1)
		bloom2.add(element2)
		bloom1.or(bloom2)
		expect(bloom1.check(element1)).toBe(true)
		expect(bloom1.check(element2)).toBe(true)
	})
})
