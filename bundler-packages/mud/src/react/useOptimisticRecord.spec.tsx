// @vitest-environment jsdom
import { renderHook } from '@testing-library/react'
import type { Hex } from 'viem'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { config } from '../../test/config.js'
import { state } from '../../test/state.js'
import { useOptimisticRecord } from './useOptimisticRecord.js'
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
	getRecord: vi.fn(),
}))

const mockUseOptimisticState = vi.mocked(useOptimisticState)
const mockUseOptimisticWrapper = vi.mocked(useOptimisticWrapper)

describe('useOptimisticRecord', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	const testTable = config.tables.app__TestTable
	const testRecords = state.records.app.TestTable
	const firstRecord = Object.values(testRecords)[0]!
	const firstRecordKey = { key1: firstRecord.key1, key2: firstRecord.key2 }

	const mockArgs = {
		table: testTable,
		key: firstRecordKey,
	}

	it('should call useOptimisticState with correct selector', () => {
		mockUseOptimisticState.mockReturnValue(firstRecord)
		mockUseOptimisticWrapper.mockReturnValue({
			getOptimisticRecord: vi.fn().mockResolvedValue(firstRecord),
		} as any)

		const { result } = renderHook(() => useOptimisticRecord(mockArgs))

		expect(mockUseOptimisticState).toHaveBeenCalledWith(expect.any(Function))
		expect(result.current).toBe(firstRecord)
	})

	it('should return undefined when no record is found', () => {
		mockUseOptimisticState.mockReturnValue(undefined)
		mockUseOptimisticWrapper.mockReturnValue({
			getOptimisticRecord: vi.fn().mockResolvedValue(undefined),
		} as any)

		const { result } = renderHook(() => useOptimisticRecord(mockArgs))

		expect(result.current).toBeUndefined()
	})

	it('should use wrapper.getOptimisticRecord when wrapper is available', async () => {
		const mockWrapper = {
			getOptimisticRecord: vi.fn().mockResolvedValue(firstRecord),
		}
		mockUseOptimisticWrapper.mockReturnValue(mockWrapper as any)

		let capturedSelector: any
		mockUseOptimisticState.mockImplementation((selector) => {
			capturedSelector = selector
			return firstRecord
		})

		renderHook(() => useOptimisticRecord(mockArgs))

		// Test the selector function
		const result = await capturedSelector(state)

		expect(mockWrapper.getOptimisticRecord).toHaveBeenCalledWith({
			state,
			...mockArgs,
		})
		expect(result).toBe(firstRecord)
	})

	it('should handle different key combinations', () => {
		// Get a different record from the test data
		const secondRecord = Object.values(testRecords)[1]!
		const secondRecordKey = { key1: secondRecord.key1, key2: secondRecord.key2 }

		const argsWithDifferentKey = {
			table: testTable,
			key: secondRecordKey,
		}

		mockUseOptimisticState.mockReturnValue(secondRecord)
		mockUseOptimisticWrapper.mockReturnValue({
			getOptimisticRecord: vi.fn().mockResolvedValue(secondRecord),
		} as any)

		const { result } = renderHook(() => useOptimisticRecord(argsWithDifferentKey))

		expect(result.current).toBe(secondRecord)
		expect(mockUseOptimisticState).toHaveBeenCalledWith(expect.any(Function))
	})

	it('should handle real TestTable record structure', () => {
		// Verify the record has the expected structure from the schema
		expect(firstRecord).toHaveProperty('key1')
		expect(firstRecord).toHaveProperty('key2')
		expect(firstRecord).toHaveProperty('val1')
		expect(firstRecord).toHaveProperty('val2')
		expect(firstRecord).toHaveProperty('val3')
		expect(firstRecord).toHaveProperty('val4')
		expect(firstRecord).toHaveProperty('val5')
		expect(firstRecord).toHaveProperty('dyn1')
		expect(firstRecord).toHaveProperty('dyn2')
		expect(firstRecord).toHaveProperty('dyn3')

		// Verify types match schema
		expect(typeof firstRecord.key1).toBe('bigint') // uint200
		expect(typeof firstRecord.key2).toBe('number') // uint8
		expect(typeof firstRecord.val1).toBe('bigint') // uint200
		expect(typeof firstRecord.val2).toBe('number') // uint8
		expect(typeof firstRecord.val3).toBe('number') // uint16
		expect(typeof firstRecord.val4).toBe('boolean') // bool
		expect(typeof firstRecord.val5).toBe('string') // address
		expect(typeof firstRecord.dyn1).toBe('string') // string
		expect(typeof firstRecord.dyn2).toBe('string') // bytes
		expect(Array.isArray(firstRecord.dyn3)).toBe(true) // int16[]

		mockUseOptimisticState.mockReturnValue(firstRecord)
		mockUseOptimisticWrapper.mockReturnValue({
			getOptimisticRecord: vi.fn().mockResolvedValue(firstRecord),
		} as any)

		const { result } = renderHook(() => useOptimisticRecord(mockArgs))

		expect(result.current).toEqual(firstRecord)
	})

	it('should handle record with default value', () => {
		const defaultValue = {
			val1: 999n,
			val2: 99,
			val3: 9999,
			val4: true,
			val5: '0x0000000000000000000000000000000000000000' as Hex,
			dyn1: 'default',
			dyn2: '0x' as Hex,
			dyn3: [0],
		}

		const argsWithDefault = {
			table: testTable,
			key: { key1: 999n, key2: 99 }, // Non-existent key
			defaultValue,
		}

		mockUseOptimisticState.mockReturnValue({ ...firstRecordKey, ...defaultValue })
		mockUseOptimisticWrapper.mockReturnValue({
			getOptimisticRecord: vi.fn().mockResolvedValue({ ...firstRecordKey, ...defaultValue }),
		} as any)

		const { result } = renderHook(() => useOptimisticRecord(argsWithDefault))

		expect(result.current).toEqual({ ...firstRecordKey, ...defaultValue })
	})
})
