import { describe, expect, it } from 'vitest'
import { deepEqual } from './deepEqual.js'

describe('deepEqual', () => {
	it('should return true for identical references', () => {
		const obj = { a: 1 }
		expect(deepEqual(obj, obj)).toBe(true)
	})

	it('should return true for primitive values that are equal', () => {
		expect(deepEqual(1, 1)).toBe(true)
		expect(deepEqual('hello', 'hello')).toBe(true)
		expect(deepEqual(true, true)).toBe(true)
		expect(deepEqual(null, null)).toBe(true)
		expect(deepEqual(undefined, undefined)).toBe(true)
	})

	it('should return false for primitive values that are not equal', () => {
		expect(deepEqual(1, 2)).toBe(false)
		expect(deepEqual('hello', 'world')).toBe(false)
		expect(deepEqual(true, false)).toBe(false)
		expect(deepEqual(null, undefined)).toBe(false)
	})

	it('should return false when comparing primitive with object', () => {
		expect(deepEqual(1, { a: 1 })).toBe(false)
		expect(deepEqual('hello', { b: 'hello' })).toBe(false)
		expect(deepEqual(true, { c: true })).toBe(false)
	})

	it('should return false when one value is null', () => {
		expect(deepEqual(null, { a: 1 })).toBe(false)
		expect(deepEqual({ a: 1 }, null)).toBe(false)
	})

	it('should return true for empty objects', () => {
		expect(deepEqual({}, {})).toBe(true)
	})

	it('should return true for objects with same properties and values', () => {
		expect(deepEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true)
		expect(deepEqual({ name: 'John', age: 30 }, { name: 'John', age: 30 })).toBe(true)
	})

	it('should return false for objects with different property values', () => {
		expect(deepEqual({ a: 1, b: 2 }, { a: 1, b: 3 })).toBe(false)
		expect(deepEqual({ name: 'John', age: 30 }, { name: 'John', age: 31 })).toBe(false)
	})

	it('should return false for objects with different number of properties', () => {
		expect(deepEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false)
		expect(deepEqual({ a: 1, b: 2 }, { a: 1 })).toBe(false)
	})

	it('should return false for objects with different property names', () => {
		expect(deepEqual({ a: 1 }, { b: 1 })).toBe(false)
		expect(deepEqual({ name: 'John' }, { username: 'John' })).toBe(false)
	})

	it('should handle nested objects', () => {
		const obj1 = { user: { name: 'John', age: 30 } }
		const obj2 = { user: { name: 'John', age: 30 } }
		const obj3 = { user: { name: 'John', age: 31 } }

		expect(deepEqual(obj1, obj2)).toBe(true)
		expect(deepEqual(obj1, obj3)).toBe(false)
	})

	it('should handle deeply nested objects', () => {
		const deep1 = {
			level1: {
				level2: {
					level3: {
						value: 'deep',
					},
				},
			},
		}
		const deep2 = {
			level1: {
				level2: {
					level3: {
						value: 'deep',
					},
				},
			},
		}
		const deep3 = {
			level1: {
				level2: {
					level3: {
						value: 'different',
					},
				},
			},
		}

		expect(deepEqual(deep1, deep2)).toBe(true)
		expect(deepEqual(deep1, deep3)).toBe(false)
	})

	it('should handle objects with array properties', () => {
		const obj1 = { items: [1, 2, 3], name: 'test' }
		const obj2 = { items: [1, 2, 3], name: 'test' }
		const obj3 = { items: [1, 2, 4], name: 'test' }

		expect(deepEqual(obj1, obj2)).toBe(true)
		expect(deepEqual(obj1, obj3)).toBe(false)
	})

	it('should handle objects with null and undefined values', () => {
		expect(deepEqual({ a: null }, { a: null })).toBe(true)
		expect(deepEqual({ a: undefined }, { a: undefined })).toBe(true)
		expect(deepEqual({ a: null }, { a: undefined })).toBe(false)
	})

	it('should handle complex mixed objects', () => {
		const complex1 = {
			id: 1,
			user: {
				name: 'John',
				profile: {
					age: 30,
					hobbies: ['reading', 'coding'],
				},
			},
			settings: {
				theme: 'dark',
				notifications: true,
			},
			metadata: null,
		}

		const complex2 = {
			id: 1,
			user: {
				name: 'John',
				profile: {
					age: 30,
					hobbies: ['reading', 'coding'],
				},
			},
			settings: {
				theme: 'dark',
				notifications: true,
			},
			metadata: null,
		}

		const complex3 = {
			id: 1,
			user: {
				name: 'John',
				profile: {
					age: 30,
					hobbies: ['reading', 'gaming'], // different hobby
				},
			},
			settings: {
				theme: 'dark',
				notifications: true,
			},
			metadata: null,
		}

		expect(deepEqual(complex1, complex2)).toBe(true)
		expect(deepEqual(complex1, complex3)).toBe(false)
	})

	it('should handle objects with different property order', () => {
		const obj1 = { a: 1, b: 2, c: 3 }
		const obj2 = { c: 3, a: 1, b: 2 }

		expect(deepEqual(obj1, obj2)).toBe(true)
	})

	it('should handle arrays as objects', () => {
		expect(deepEqual([1, 2, 3], [1, 2, 3])).toBe(true)
		expect(deepEqual([1, 2, 3], [1, 2, 4])).toBe(false)
		expect(deepEqual([], [])).toBe(true)
	})

	it('should handle edge cases with special values', () => {
		expect(deepEqual({ a: Number.NaN }, { a: Number.NaN })).toBe(false) // NaN !== NaN
		expect(deepEqual({ a: 0 }, { a: -0 })).toBe(true) // 0 === -0
		expect(deepEqual({ a: Number.POSITIVE_INFINITY }, { a: Number.POSITIVE_INFINITY })).toBe(true)
	})
})
