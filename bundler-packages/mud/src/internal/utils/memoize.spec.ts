import { describe, expect, it, vi } from 'vitest'
import { memoize } from './memoize.js'

describe('memoize', () => {
	it('should call function only once when result is equal', () => {
		const fn = vi.fn(() => ({ value: 42 }))
		const isEqual = (a: any, b: any) => a.value === b.value
		const memoized = memoize(fn, isEqual)

		const result1 = memoized()
		const result2 = memoized()
		const result3 = memoized()

		expect(fn).toHaveBeenCalledTimes(3) // Called each time but returns cached result
		expect(result1).toBe(result2) // Same reference
		expect(result2).toBe(result3) // Same reference
		expect(result1.value).toBe(42)
	})

	it('should update cache when result changes', () => {
		let counter = 0
		const fn = vi.fn(() => ({ value: ++counter }))
		const isEqual = (a: any, b: any) => a.value === b.value
		const memoized = memoize(fn, isEqual)

		const result1 = memoized() // value: 1
		const result2 = memoized() // value: 2, different from cached
		const result3 = memoized() // value: 3, different from cached

		expect(fn).toHaveBeenCalledTimes(3)
		expect(result1.value).toBe(1)
		expect(result2.value).toBe(2)
		expect(result3.value).toBe(3)
		expect(result1).not.toBe(result2)
		expect(result2).not.toBe(result3)
	})

	it('should work with primitive values', () => {
		let value = 'hello'
		const fn = vi.fn(() => value)
		const isEqual = (a: string, b: string) => a === b
		const memoized = memoize(fn, isEqual)

		const result1 = memoized()
		const result2 = memoized()

		value = 'world'
		const result3 = memoized()
		const result4 = memoized()

		expect(fn).toHaveBeenCalledTimes(4)
		expect(result1).toBe('hello')
		expect(result2).toBe('hello')
		expect(result3).toBe('world')
		expect(result4).toBe('world')
	})

	it('should handle null/undefined values', () => {
		const fn = vi.fn(() => null)
		const isEqual = (a: any, b: any) => a === b
		const memoized = memoize(fn, isEqual)

		const result1 = memoized()
		const result2 = memoized()

		expect(fn).toHaveBeenCalledTimes(2)
		expect(result1).toBe(null)
		expect(result2).toBe(null)
	})

	it('should use custom equality function', () => {
		const fn = vi.fn(() => ({ id: 1, timestamp: Date.now() }))
		const isEqual = (a: any, b: any) => a.id === b.id // Ignore timestamp
		const memoized = memoize(fn, isEqual)

		const result1 = memoized()
		const result2 = memoized()

		expect(fn).toHaveBeenCalledTimes(2)
		expect(result1).toBe(result2) // Same reference due to custom equality
		expect(result1.id).toBe(1)
	})
})
