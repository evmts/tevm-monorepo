import type { TableRecord } from '@latticexyz/protocol-parser/internal'
// @vitest-environment jsdom
import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { config } from '../../test/config.js'
import { state } from '../../test/state.js'
import { arrayDeepEqual } from '../internal/utils/arrayDeepEqual.js'
import { useOptimisticRecords } from './useOptimisticRecords.js'
import { useOptimisticState } from './useOptimisticState.js'
import { useOptimisticWrapper } from './useOptimisticWrapper.js'

// Mock dependencies
vi.mock('./useOptimisticState.js', () => ({
	useOptimisticState: vi.fn(),
}))

vi.mock('./useOptimisticWrapper.js', () => ({
	useOptimisticWrapper: vi.fn(),
}))

vi.mock('@latticexyz/stash/internal', () => ({
	getRecords: vi.fn(),
}))

vi.mock('../internal/utils/arrayDeepEqual.js', () => ({
	arrayDeepEqual: vi.fn(),
}))

const mockUseOptimisticState = vi.mocked(useOptimisticState)
const mockUseOptimisticWrapper = vi.mocked(useOptimisticWrapper)

describe('useOptimisticRecords', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	const testTable = config.tables.app__TestTable
	const testRecords = state.records.app.TestTable
	const testRecordsArray = Object.values(testRecords)

	const mockArgs = {
		table: testTable,
	}

	it('should call useOptimisticState with arrayDeepEqual', () => {
		mockUseOptimisticState.mockReturnValue(testRecordsArray)
		mockUseOptimisticWrapper.mockReturnValue({
			getOptimisticRecords: vi.fn().mockResolvedValue(testRecords),
		} as any)

		const { result } = renderHook(() => useOptimisticRecords(mockArgs))

		expect(mockUseOptimisticState).toHaveBeenCalledWith(expect.any(Function), { isEqual: arrayDeepEqual })
		expect(result.current).toBe(testRecordsArray)
	})

	it('should return empty array when no records are found', () => {
		mockUseOptimisticState.mockReturnValue([])
		mockUseOptimisticWrapper.mockReturnValue({
			getOptimisticRecords: vi.fn().mockResolvedValue({}),
		} as any)

		const { result } = renderHook(() => useOptimisticRecords(mockArgs))

		expect(result.current).toEqual([])
	})

	it('should return undefined when hook returns undefined', () => {
		mockUseOptimisticState.mockReturnValue(undefined)
		mockUseOptimisticWrapper.mockReturnValue({
			getOptimisticRecords: vi.fn().mockResolvedValue({}),
		} as any)

		const { result } = renderHook(() => useOptimisticRecords(mockArgs))

		expect(result.current).toBeUndefined()
	})

	it('should use wrapper.getOptimisticRecords when wrapper is available', async () => {
		const mockWrapper = {
			getOptimisticRecords: vi.fn().mockResolvedValue(testRecords),
		}
		mockUseOptimisticWrapper.mockReturnValue(mockWrapper as any)

		let capturedSelector: any
		mockUseOptimisticState.mockImplementation((selector) => {
			capturedSelector = selector
			return testRecordsArray
		})

		renderHook(() => useOptimisticRecords(mockArgs))

		// Test the selector function
		const result = await capturedSelector(state)

		expect(mockWrapper.getOptimisticRecords).toHaveBeenCalledWith({
			state,
			...mockArgs,
		})
		expect(result).toEqual(testRecordsArray)
	})

	it('should fallback to getRecords when wrapper is not available', async () => {
		const { getRecords } = await import('@latticexyz/stash/internal')
		const mockGetRecords = vi.mocked(getRecords)

		mockGetRecords.mockReturnValue(testRecords)
		mockUseOptimisticWrapper.mockReturnValue(undefined)

		let capturedSelector: any
		mockUseOptimisticState.mockImplementation((selector) => {
			capturedSelector = selector
			return testRecordsArray
		})

		renderHook(() => useOptimisticRecords(mockArgs))

		// Test the selector function
		const result = await capturedSelector(state)

		expect(mockGetRecords).toHaveBeenCalledWith({
			state,
			...mockArgs,
		})
		expect(result).toEqual(testRecordsArray)
	})

	it('should transform records map to array correctly', async () => {
		// Take a subset of records for testing
		const recordKeys = Object.keys(testRecords).slice(0, 3)
		const subsetRecords = Object.fromEntries(recordKeys.map((key) => [key, testRecords[key]]))
		const expectedArray = Object.values(subsetRecords)

		const mockWrapper = {
			getOptimisticRecords: vi.fn().mockResolvedValue(subsetRecords),
		}
		mockUseOptimisticWrapper.mockReturnValue(mockWrapper as any)

		let capturedSelector: any
		mockUseOptimisticState.mockImplementation((selector) => {
			capturedSelector = selector
			return expectedArray
		})

		renderHook(() => useOptimisticRecords(mockArgs))

		// Test the selector function
		const result = await capturedSelector(state)

		expect(result).toEqual(expectedArray)
		expect(Array.isArray(result)).toBe(true)
		expect(result).toHaveLength(3)

		// Verify each record has the correct structure
		result.forEach((record: TableRecord) => {
			expect(record).toHaveProperty('key1')
			expect(record).toHaveProperty('key2')
			expect(record).toHaveProperty('val1')
			expect(record).toHaveProperty('dyn1')
			expect(record).toHaveProperty('dyn3')
			expect('dyn3' in record && Array.isArray(record.dyn3)).toBe(true)
		})
	})

	it('should handle real TestTable records with all 100 entries', () => {
		mockUseOptimisticState.mockReturnValue(testRecordsArray)
		mockUseOptimisticWrapper.mockReturnValue({
			getOptimisticRecords: vi.fn().mockResolvedValue(testRecords),
		} as any)

		const { result } = renderHook(() => useOptimisticRecords(mockArgs))

		expect(result.current).toHaveLength(100) // As defined in state.ts
		expect(Array.isArray(result.current)).toBe(true)

		// Verify all records have unique keys
		const keys = result.current?.map((record) => `${record.key1}-${record.key2}`)
		const uniqueKeys = new Set(keys)
		expect(uniqueKeys.size).toBe(100) // All keys should be unique
	})

	it('should handle filtering with where clause', async () => {
		// Filter records where val4 is true
		const filteredRecords = Object.fromEntries(
			Object.entries(testRecords).filter(([_, record]) => record.val4 === true),
		)
		const filteredArray = Object.values(filteredRecords)

		const argsWithWhere = {
			table: testTable,
			where: { val4: true },
		}

		const mockWrapper = {
			getOptimisticRecords: vi.fn().mockResolvedValue(filteredRecords),
		}
		mockUseOptimisticWrapper.mockReturnValue(mockWrapper as any)

		let capturedSelector: any
		mockUseOptimisticState.mockImplementation((selector) => {
			capturedSelector = selector
			return filteredArray
		})

		renderHook(() => useOptimisticRecords(argsWithWhere))

		// Test the selector function
		const result = await capturedSelector(state)

		expect(mockWrapper.getOptimisticRecords).toHaveBeenCalledWith({
			state,
			...argsWithWhere,
		})

		// Verify all returned records have val4 = true
		result.forEach((record: any) => {
			expect(record.val4).toBe(true)
		})
	})

	it('should handle ordering with orderBy clause', async () => {
		// Sort records by val1 in descending order
		const sortedArray = testRecordsArray.slice().sort((a, b) => Number(b.val1 - a.val1))

		const argsWithOrderBy = {
			table: testTable,
			orderBy: { field: 'val1', direction: 'desc' as const },
		}

		const mockWrapper = {
			getOptimisticRecords: vi.fn().mockResolvedValue(testRecords),
		}
		mockUseOptimisticWrapper.mockReturnValue(mockWrapper as any)

		let capturedSelector: any
		mockUseOptimisticState.mockImplementation((selector) => {
			capturedSelector = selector
			return sortedArray
		})

		renderHook(() => useOptimisticRecords(argsWithOrderBy))

		// Test the selector function
		await capturedSelector(state)

		expect(mockWrapper.getOptimisticRecords).toHaveBeenCalledWith({
			state,
			...argsWithOrderBy,
		})
	})
})
