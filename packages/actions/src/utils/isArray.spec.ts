import { describe, expect, it } from 'vitest'
import { isArray } from './isArray.js'

describe('isArray utility', () => {
	it('should correctly identify arrays', () => {
		expect(isArray([])).toBe(true)
		expect(isArray([1, 2, 3])).toBe(true)
		expect(isArray(new Array())).toBe(true)
		expect(isArray(Array.from('hello'))).toBe(true)
	})

	it('should correctly identify non-arrays', () => {
		expect(isArray(null)).toBe(false)
		expect(isArray(undefined)).toBe(false)
		expect(isArray({})).toBe(false)
		expect(isArray('string')).toBe(false)
		expect(isArray(123)).toBe(false)
		expect(isArray(true)).toBe(false)
		expect(isArray(() => {})).toBe(false)
		expect(isArray(new Set())).toBe(false)
		expect(isArray(new Map())).toBe(false)
	})

	it('should handle array-like objects', () => {
		// Array-like objects (objects with length property and indexed elements)
		const arrayLike = { 0: 'a', 1: 'b', length: 2 }
		expect(isArray(arrayLike)).toBe(false)

		// Create arguments-like object
		const argumentsLike = { 0: 'a', 1: 'b', length: 2, callee: () => {} }
		expect(isArray(argumentsLike)).toBe(false)

		// Rest parameters (array-like but actually a real array)
		function testRestParams(...params) {
			return isArray(params)
		}
		expect(testRestParams('a', 'b')).toBe(true)
	})

	it('should handle typed arrays', () => {
		expect(isArray(new Int8Array())).toBe(false)
		expect(isArray(new Uint8Array())).toBe(false)
		expect(isArray(new Uint8ClampedArray())).toBe(false)
		expect(isArray(new Int16Array())).toBe(false)
		expect(isArray(new Uint16Array())).toBe(false)
		expect(isArray(new Int32Array())).toBe(false)
		expect(isArray(new Uint32Array())).toBe(false)
		expect(isArray(new Float32Array())).toBe(false)
		expect(isArray(new Float64Array())).toBe(false)
		expect(isArray(new BigInt64Array())).toBe(false)
		expect(isArray(new BigUint64Array())).toBe(false)
	})

	it('should handle readonly arrays', () => {
		// Setup a readonly array (via TypeScript type system)
		const readonlyArray = [1, 2, 3] as const
		expect(isArray(readonlyArray)).toBe(true)
	})
})
