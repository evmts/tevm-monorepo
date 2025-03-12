import { beforeEach, describe, expect, it, vi } from 'vitest'
import { throttle } from './throttle.js'

describe('throttle', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	it('should throttle function calls', () => {
		const mockFn = vi.fn()
		const throttled = throttle(mockFn, 100)

		throttled(1, 2, 3)
		throttled(4, 5, 6)
		throttled(7, 8, 9)

		expect(mockFn).not.toHaveBeenCalled()

		vi.advanceTimersByTime(100)

		expect(mockFn).toHaveBeenCalledTimes(1)
		expect(mockFn).toHaveBeenLastCalledWith(7, 8, 9)
	})

	it('should use the latest args when calling the function', () => {
		const mockFn = vi.fn()
		const throttled = throttle(mockFn, 100)

		throttled('first')
		throttled('second')
		throttled('third')

		vi.advanceTimersByTime(100)

		expect(mockFn).toHaveBeenCalledWith('third')
	})

	it('should execute the throttled function after time elapses', () => {
		const mockFn = vi.fn(() => 'result')
		const throttled = throttle(mockFn, 100)

		throttled()

		expect(mockFn).not.toHaveBeenCalled()
		vi.advanceTimersByTime(100)
		expect(mockFn).toHaveBeenCalledTimes(1)
	})

	it('should use the default throttle time if not provided', () => {
		const mockFn = vi.fn()
		const throttled = throttle(mockFn)

		throttled()
		expect(mockFn).not.toHaveBeenCalled()

		vi.advanceTimersByTime(50)
		expect(mockFn).not.toHaveBeenCalled()

		vi.advanceTimersByTime(50) // Default is 100ms
		expect(mockFn).toHaveBeenCalledTimes(1)
	})
})
