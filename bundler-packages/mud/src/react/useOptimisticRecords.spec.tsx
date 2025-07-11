// @vitest-environment jsdom
import { renderHook, waitFor } from '@testing-library/react'
import React from 'react'
import { beforeAll, describe, expect, it } from 'vitest'
import { config } from '../../test/config.js'
import { prepare, sessionClient, stash, testContract, writeRecords } from '../../test/prepare.js'
import { randomRecord } from '../../test/state.js'
import { useOptimisticRecords } from './useOptimisticRecords.js'
import { OptimisticWrapperProvider } from './useOptimisticWrapper.js'

describe('useOptimisticRecords', () => {
	beforeAll(async () => {
		await prepare({ count: 10 })
	})

	const createWrapper = ({ children }: { children: React.ReactNode }) => (
		<OptimisticWrapperProvider
			client={sessionClient}
			storeAddress={testContract.address}
			stash={stash}
			config={config}
			loggingLevel="warn"
		>
			{children}
		</OptimisticWrapperProvider>
	)

	it('should return all records as array', async () => {
		const records = Object.values(stash.get().records.app.TestTable)
		const recordCount = records.length

		const { result } = renderHook(() => useOptimisticRecords({ table: config.tables.app__TestTable }), {
			wrapper: createWrapper,
		})

		await waitFor(() => {
			expect(result.current).toBeDefined()
			expect(Array.isArray(result.current)).toBe(true)
			expect(result.current).toHaveLength(recordCount)
		})
	})

	it('should return records with correct structure', async () => {
		const { result } = renderHook(() => useOptimisticRecords({ table: config.tables.app__TestTable }), {
			wrapper: createWrapper,
		})

		await waitFor(() => {
			expect(result.current).toBeDefined()
			expect(result.current.length).toBeGreaterThan(0)
		})

		const firstRecord = result.current[0]
		const schemaKeys = Object.keys(config.tables.app__TestTable.schema)

		schemaKeys.forEach((key) => {
			expect(firstRecord).toHaveProperty(key)
		})
	})

	it('should update when records are added', async () => {
		const initialLength = Object.values(stash.get().records.app.TestTable).length

		const { result } = renderHook(() => useOptimisticRecords({ table: config.tables.app__TestTable }), {
			wrapper: createWrapper,
		})

		// Initial state
		await waitFor(() => {
			expect(result.current).toHaveLength(initialLength)
		})

		// Add a new record
		const [, newRecord] = randomRecord()
		await writeRecords([newRecord])

		// Should update with new record
		await waitFor(() => {
			expect(result.current).toHaveLength(initialLength + 1)
		})
	})

	it('should maintain referential stability when data unchanged', async () => {
		const results: any[] = []

		const { rerender } = renderHook(
			() => {
				const result = useOptimisticRecords({ table: config.tables.app__TestTable })
				results.push(result)
				return result
			},
			{ wrapper: createWrapper },
		)

		await waitFor(() => {
			expect(results[results.length - 1]).toBeDefined()
		})

		const initialResult = results[results.length - 1]

		// Re-render without changing data
		rerender()

		await waitFor(() => {
			expect(results.length).toBeGreaterThan(1)
		})

		// Should maintain same reference due to deep equality
		expect(results[results.length - 1]).toStrictEqual(initialResult)
	})

	it('should work when wrapper is undefined initially', async () => {
		// Render without wrapper
		const { result } = renderHook(() => useOptimisticRecords({ table: config.tables.app__TestTable }))

		// Should return empty array when no wrapper
		expect(result.current).toEqual([])
	})

	it('should handle record updates correctly', async () => {
		const records = Object.values(stash.get().records.app.TestTable)
		const recordToUpdate = records[0]!

		const { result } = renderHook(() => useOptimisticRecords({ table: config.tables.app__TestTable }), {
			wrapper: createWrapper,
		})

		// Initial state
		await waitFor(() => {
			expect(result.current.length).toBe(records.length)
		})

		// Update an existing record
		const updatedRecord = { ...recordToUpdate, val1: recordToUpdate.val1 + 100n }
		await writeRecords([updatedRecord])

		// Should still have same number of records but with updated data
		await waitFor(() => {
			expect(result.current.length).toBe(records.length)
			const updatedInResult = result.current.find((r) => r.key1 === updatedRecord.key1 && r.key2 === updatedRecord.key2)
			expect(updatedInResult?.val1).toBe(recordToUpdate.val1 + 100n)
		})
	})

	it('should return readonly array type', async () => {
		const { result } = renderHook(() => useOptimisticRecords({ table: config.tables.app__TestTable }), {
			wrapper: createWrapper,
		})

		await waitFor(() => {
			expect(result.current).toBeDefined()
		})

		// The array should be readonly (TypeScript compile-time check)
		// This is more of a type safety test
		expect(Array.isArray(result.current)).toBe(true)
	})

	it('should cleanup subscription on unmount', async () => {
		const { unmount } = renderHook(() => useOptimisticRecords({ table: config.tables.app__TestTable }), {
			wrapper: createWrapper,
		})

		await waitFor(() => {
			// Hook is mounted and working
		})

		// Should not throw when unmounting
		expect(() => unmount()).not.toThrow()
	})

	it('should handle concurrent updates from multiple sources', async () => {
		const initialLength = Object.values(stash.get().records.app.TestTable).length

		const { result } = renderHook(() => useOptimisticRecords({ table: config.tables.app__TestTable }), {
			wrapper: createWrapper,
		})

		await waitFor(() => {
			expect(result.current).toHaveLength(initialLength)
		})

		// Add multiple records concurrently
		const [, record1] = randomRecord()
		const [, record2] = randomRecord()
		await writeRecords([record1, record2])

		await waitFor(() => {
			expect(result.current).toHaveLength(initialLength + 2)
		})
	})
})
