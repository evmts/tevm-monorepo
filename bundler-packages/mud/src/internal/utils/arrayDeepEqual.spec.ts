import { describe, expect, it } from 'vitest'
import { arrayDeepEqual } from './arrayDeepEqual.js'

describe('arrayDeepEqual', () => {
	it('should return true for identical array references', () => {
		const arr = [1, 2, 3]
		expect(arrayDeepEqual(arr, arr)).toBe(true)
	})

	it('should return true for both undefined arrays', () => {
		expect(arrayDeepEqual(undefined, undefined)).toBe(true)
	})

	it('should return false when one array is undefined', () => {
		expect(arrayDeepEqual([1, 2, 3], undefined)).toBe(false)
		expect(arrayDeepEqual(undefined, [1, 2, 3])).toBe(false)
	})

	it('should return false for arrays with different lengths', () => {
		expect(arrayDeepEqual([1, 2], [1, 2, 3])).toBe(false)
		expect(arrayDeepEqual([1, 2, 3], [1, 2])).toBe(false)
	})

	it('should return true for empty arrays', () => {
		expect(arrayDeepEqual([], [])).toBe(true)
	})

	it('should return true for arrays with identical primitive values', () => {
		expect(arrayDeepEqual([1, 2, 3], [1, 2, 3])).toBe(true)
		expect(arrayDeepEqual(['a', 'b', 'c'], ['a', 'b', 'c'])).toBe(true)
		expect(arrayDeepEqual([true, false, true], [true, false, true])).toBe(true)
		expect(arrayDeepEqual([null, undefined], [null, undefined])).toBe(true)
	})

	it('should return false for arrays with different primitive values', () => {
		expect(arrayDeepEqual([1, 2, 3], [1, 2, 4])).toBe(false)
		expect(arrayDeepEqual(['a', 'b', 'c'], ['a', 'b', 'd'])).toBe(false)
		expect(arrayDeepEqual([true, false], [false, true])).toBe(false)
	})

	it('should handle arrays with objects using deep equality', () => {
		expect(arrayDeepEqual([{ a: 1 }, { b: 2 }], [{ a: 1 }, { b: 2 }])).toBe(true)
		expect(arrayDeepEqual([{ a: 1 }, { b: 2 }], [{ a: 1 }, { b: 3 }])).toBe(false)
	})

	it('should handle nested arrays', () => {
		expect(
			arrayDeepEqual(
				[
					[1, 2],
					[3, 4],
				],
				[
					[1, 2],
					[3, 4],
				],
			),
		).toBe(true)
		expect(
			arrayDeepEqual(
				[
					[1, 2],
					[3, 4],
				],
				[
					[1, 2],
					[3, 5],
				],
			),
		).toBe(false)
	})

	it('should handle mixed types', () => {
		const arr1 = [1, 'hello', { a: 1 }, [2, 3], null, undefined, true]
		const arr2 = [1, 'hello', { a: 1 }, [2, 3], null, undefined, true]
		const arr3 = [1, 'hello', { a: 2 }, [2, 3], null, undefined, true]

		expect(arrayDeepEqual(arr1, arr2)).toBe(true)
		expect(arrayDeepEqual(arr1, arr3)).toBe(false)
	})

	it('should handle readonly arrays', () => {
		const arr1: readonly number[] = [1, 2, 3]
		const arr2: readonly number[] = [1, 2, 3]
		const arr3: readonly number[] = [1, 2, 4]

		expect(arrayDeepEqual(arr1, arr2)).toBe(true)
		expect(arrayDeepEqual(arr1, arr3)).toBe(false)
	})

	it('should handle arrays with complex nested objects', () => {
		const complex1 = [
			{
				user: { name: 'John', age: 30 },
				items: [{ id: 1, name: 'item1' }],
			},
		]
		const complex2 = [
			{
				user: { name: 'John', age: 30 },
				items: [{ id: 1, name: 'item1' }],
			},
		]
		const complex3 = [
			{
				user: { name: 'John', age: 31 },
				items: [{ id: 1, name: 'item1' }],
			},
		]

		expect(arrayDeepEqual(complex1, complex2)).toBe(true)
		expect(arrayDeepEqual(complex1, complex3)).toBe(false)
	})
})
