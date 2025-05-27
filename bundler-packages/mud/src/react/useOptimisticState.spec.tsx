// @vitest-environment jsdom
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useOptimisticState } from './useOptimisticState.js'
import { useOptimisticWrapper } from './useOptimisticWrapper.js'

// Mock the useOptimisticWrapper hook
vi.mock('./useOptimisticWrapper.js', () => ({
	useOptimisticWrapper: vi.fn(),
}))

const mockUseOptimisticWrapper = vi.mocked(useOptimisticWrapper)

describe('useOptimisticState', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('should return undefined when wrapper is not available', () => {
		mockUseOptimisticWrapper.mockReturnValue(undefined)

		const { result } = renderHook(() => useOptimisticState(async () => 'test-data'))

		expect(result.current).toBeUndefined()
	})

	it('should fetch and return initial state', async () => {
		const mockState = { config: {}, records: {} }
		const mockWrapper = {
			getOptimisticState: vi.fn().mockResolvedValue(mockState),
			subscribeOptimisticState: vi.fn().mockReturnValue(() => {}),
		}
		mockUseOptimisticWrapper.mockReturnValue(mockWrapper as any)

		const selector = vi.fn().mockResolvedValue('selected-data')

		const { result } = renderHook(() => useOptimisticState(selector))

		await waitFor(() => {
			expect(result.current).toBe('selected-data')
		})

		expect(mockWrapper.getOptimisticState).toHaveBeenCalled()
		expect(selector).toHaveBeenCalledWith(mockState)
	})

	it('should subscribe to state changes and update when data changes', async () => {
		const mockState = { config: {}, records: {} }
		let subscriber: (() => void) | undefined
		const mockWrapper = {
			getOptimisticState: vi.fn().mockResolvedValue(mockState),
			subscribeOptimisticState: vi.fn().mockImplementation(({ subscriber: sub }) => {
				subscriber = sub
				return () => {}
			}),
		}
		mockUseOptimisticWrapper.mockReturnValue(mockWrapper as any)

		const selector = vi.fn().mockResolvedValueOnce('initial-data').mockResolvedValueOnce('updated-data')

		const { result } = renderHook(() => useOptimisticState(selector))

		await waitFor(() => {
			expect(result.current).toBe('initial-data')
		})

		// Trigger state change
		selector.mockResolvedValueOnce('updated-data')
		subscriber?.()

		await waitFor(() => {
			expect(result.current).toBe('updated-data')
		})
	})

	it('should not update state if data is equal using custom isEqual', async () => {
		const mockState = { config: {}, records: {} }
		const mockWrapper = {
			getOptimisticState: vi.fn().mockResolvedValue(mockState),
			subscribeOptimisticState: vi.fn().mockReturnValue(() => {}),
		}
		mockUseOptimisticWrapper.mockReturnValue(mockWrapper as any)

		const testData = { id: 1, name: 'test' }
		const selector = vi.fn().mockResolvedValue(testData)

		// Mock isEqual to return false initially (so state gets set), then true for subsequent calls
		const isEqual = vi
			.fn()
			.mockReturnValueOnce(false) // First call: undefined vs testData -> false (state gets set)
			.mockReturnValue(true) // Subsequent calls: testData vs testData -> true (no update)

		const { result } = renderHook(() => useOptimisticState(selector, { isEqual }))

		// Wait for initial data to be set
		await waitFor(() => {
			expect(result.current).toEqual(testData)
		})

		// Verify isEqual was called during the initial render
		expect(isEqual).toHaveBeenCalledWith(undefined, testData)
	})

	it('should handle selector errors gracefully', async () => {
		const mockState = { config: {}, records: {} }
		const mockWrapper = {
			getOptimisticState: vi.fn().mockResolvedValue(mockState),
			subscribeOptimisticState: vi.fn().mockReturnValue(() => {}),
		}
		mockUseOptimisticWrapper.mockReturnValue(mockWrapper as any)

		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
		const selector = vi.fn().mockRejectedValue(new Error('Selector failed'))

		const { result } = renderHook(() => useOptimisticState(selector))

		await waitFor(() => {
			expect(consoleSpy).toHaveBeenCalledWith(
				'Error in useOptimisticState while fetching/selecting state:',
				expect.any(Error),
			)
		})

		expect(result.current).toBeUndefined()
		consoleSpy.mockRestore()
	})

	it('should cleanup subscription on unmount', () => {
		const unsubscribe = vi.fn()
		const mockWrapper = {
			getOptimisticState: vi.fn().mockResolvedValue({}),
			subscribeOptimisticState: vi.fn().mockReturnValue(unsubscribe),
		}
		mockUseOptimisticWrapper.mockReturnValue(mockWrapper as any)

		const { unmount } = renderHook(() => useOptimisticState(async () => 'test'))

		unmount()

		expect(unsubscribe).toHaveBeenCalled()
	})
})
