// @vitest-environment jsdom
import { renderHook, waitFor } from '@testing-library/react'
import React from 'react'
import { type Hex } from 'viem'
import { beforeAll, describe, expect, it } from 'vitest'
import { config } from '../../test/config.js'
import { prepare, sessionClient, stash, testContract, writeRecords } from '../../test/prepare.js'
import { randomRecord } from '../../test/state.js'
import { useOptimisticRecord } from './useOptimisticRecord.js'
import { OptimisticWrapperProvider } from './useOptimisticWrapper.js'

describe('useOptimisticRecord', () => {
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

	it('should return record when it exists', async () => {
		const records = Object.values(stash.get().records.app.TestTable)
		const firstRecord = records[0]!
		const firstRecordKey = { key1: firstRecord.key1, key2: firstRecord.key2 }

		const { result } = renderHook(
			() =>
				useOptimisticRecord({
					table: config.tables.app__TestTable,
					key: firstRecordKey,
				}),
			{ wrapper: createWrapper },
		)

		await waitFor(() => {
			expect(result.current).toBeDefined()
			expect(result.current).toEqual(firstRecord)
		})
	})

	it('should return undefined when record does not exist', async () => {
		const nonExistentKey = { key1: 999999n, key2: 999 }

		const { result } = renderHook(
			() =>
				useOptimisticRecord({
					table: config.tables.app__TestTable,
					key: nonExistentKey,
				}),
			{ wrapper: createWrapper },
		)

		await waitFor(() => {
			expect(result.current).toBeUndefined()
		})
	})

	it('should return record with correct schema structure', async () => {
		const records = Object.values(stash.get().records.app.TestTable)
		const firstRecord = records[0]!
		const firstRecordKey = { key1: firstRecord.key1, key2: firstRecord.key2 }

		const { result } = renderHook(
			() =>
				useOptimisticRecord({
					table: config.tables.app__TestTable,
					key: firstRecordKey,
				}),
			{ wrapper: createWrapper },
		)

		await waitFor(() => {
			expect(result.current).toBeDefined()
		})

		const record = result.current!
		const schemaKeys = Object.keys(config.tables.app__TestTable.schema)

		schemaKeys.forEach((key) => {
			expect(record).toHaveProperty(key)
		})

		// Verify types match schema
		expect(typeof record.key1).toBe('bigint') // uint200
		expect(typeof record.key2).toBe('number') // uint8
		expect(typeof record.val1).toBe('bigint') // uint200
		expect(typeof record.val2).toBe('number') // uint8
		expect(typeof record.val3).toBe('number') // uint16
		expect(typeof record.val4).toBe('boolean') // bool
		expect(typeof record.val5).toBe('string') // address
		expect(typeof record.dyn1).toBe('string') // string
		expect(typeof record.dyn2).toBe('string') // bytes
		expect(Array.isArray(record.dyn3)).toBe(true) // int16[]
	})

	it('should update when record changes', async () => {
		const records = Object.values(stash.get().records.app.TestTable)
		const firstRecord = records[0]!
		const firstRecordKey = { key1: firstRecord.key1, key2: firstRecord.key2 }

		const { result } = renderHook(
			() =>
				useOptimisticRecord({
					table: config.tables.app__TestTable,
					key: firstRecordKey,
				}),
			{ wrapper: createWrapper },
		)

		// Initial state
		await waitFor(() => {
			expect(result.current).toEqual(firstRecord)
		})

		// Update the record
		const updatedRecord = { ...firstRecord, val1: firstRecord.val1 + 100n }
		await writeRecords([updatedRecord])

		// Should update with new value
		await waitFor(() => {
			expect(result.current?.val1).toBe(firstRecord.val1 + 100n)
		})
	})

	it('should handle different key combinations', async () => {
		const records = Object.values(stash.get().records.app.TestTable)
		const secondRecord = records[1]!
		const secondRecordKey = { key1: secondRecord.key1, key2: secondRecord.key2 }

		const { result } = renderHook(
			() =>
				useOptimisticRecord({
					table: config.tables.app__TestTable,
					key: secondRecordKey,
				}),
			{ wrapper: createWrapper },
		)

		await waitFor(() => {
			expect(result.current).toEqual(secondRecord)
		})
	})

	it('should return default value when record does not exist and default is provided', async () => {
		const nonExistentKey = { key1: 999999n, key2: 999 }
		const defaultValue = {
			val1: 123n,
			val2: 45,
			val3: 67,
			val4: true,
			val5: '0x0000000000000000000000000000000000000000' as Hex,
			dyn1: 'default string',
			dyn2: '0x1234' as Hex,
			dyn3: [1, 2, 3],
		}

		const { result } = renderHook(
			() =>
				useOptimisticRecord({
					table: config.tables.app__TestTable,
					key: nonExistentKey,
					defaultValue,
				}),
			{ wrapper: createWrapper },
		)

		await waitFor(() => {
			expect(result.current).toBeDefined()
		})

		// Should include both key and default value
		expect(result.current).toEqual(defaultValue)
	})

	it('should handle multiple hooks with different keys', async () => {
		const records = Object.values(stash.get().records.app.TestTable)
		const firstRecord = records[0]!
		const secondRecord = records[1]!
		const firstRecordKey = { key1: firstRecord.key1, key2: firstRecord.key2 }
		const secondRecordKey = { key1: secondRecord.key1, key2: secondRecord.key2 }

		const { result: result1 } = renderHook(
			() =>
				useOptimisticRecord({
					table: config.tables.app__TestTable,
					key: firstRecordKey,
				}),
			{ wrapper: createWrapper },
		)

		const { result: result2 } = renderHook(
			() =>
				useOptimisticRecord({
					table: config.tables.app__TestTable,
					key: secondRecordKey,
				}),
			{ wrapper: createWrapper },
		)

		await waitFor(() => {
			expect(result1.current).toEqual(firstRecord)
			expect(result2.current).toEqual(secondRecord)
		})
	})

	it('should handle new record being added', async () => {
		const [, newRecord] = randomRecord()
		const newKey = { key1: newRecord.key1, key2: newRecord.key2 }

		const { result } = renderHook(
			() =>
				useOptimisticRecord({
					table: config.tables.app__TestTable,
					key: newKey,
				}),
			{ wrapper: createWrapper },
		)

		// Initially should be undefined
		await waitFor(() => {
			expect(result.current).toBeUndefined()
		})

		// Add the record
		await writeRecords([newRecord])

		// Should now return the new record
		await waitFor(() => {
			expect({ ...result.current, val5: result.current?.val5.toLowerCase() }).toEqual({
				...newRecord,
				val5: newRecord.val5.toLowerCase(),
			})
		})
	})

	it('should work when wrapper is undefined initially', async () => {
		const records = Object.values(stash.get().records.app.TestTable)
		const firstRecord = records[0]!
		const firstRecordKey = { key1: firstRecord.key1, key2: firstRecord.key2 }

		// Render without wrapper
		const { result } = renderHook(() =>
			useOptimisticRecord({
				table: config.tables.app__TestTable,
				key: firstRecordKey,
			}),
		)

		// Should return undefined when no wrapper
		expect(result.current).toBeUndefined()
	})

	it('should cleanup subscription on unmount', async () => {
		const records = Object.values(stash.get().records.app.TestTable)
		const firstRecord = records[0]!
		const firstRecordKey = { key1: firstRecord.key1, key2: firstRecord.key2 }

		const { unmount } = renderHook(
			() =>
				useOptimisticRecord({
					table: config.tables.app__TestTable,
					key: firstRecordKey,
				}),
			{ wrapper: createWrapper },
		)

		await waitFor(() => {
			// Hook is mounted and working
		})

		// Should not throw when unmounting
		expect(() => unmount()).not.toThrow()
	})

	it('should handle records with all schema field types', async () => {
		const records = Object.values(stash.get().records.app.TestTable)
		const testRecord = records[0]!
		const key = { key1: testRecord.key1, key2: testRecord.key2 }

		const { result } = renderHook(
			() =>
				useOptimisticRecord({
					table: config.tables.app__TestTable,
					key,
				}),
			{ wrapper: createWrapper },
		)

		await waitFor(() => {
			expect(result.current).toBeDefined()
		})

		const record = result.current!

		// Test each field type from the schema
		expect(record.key1).toBeDefined() // uint200
		expect(record.key2).toBeDefined() // uint8
		expect(record.val1).toBeDefined() // uint200
		expect(record.val2).toBeDefined() // uint8
		expect(record.val3).toBeDefined() // uint16
		expect(record.val4).toBeDefined() // bool
		expect(record.val5).toBeDefined() // address
		expect(record.dyn1).toBeDefined() // string
		expect(record.dyn2).toBeDefined() // bytes
		expect(record.dyn3).toBeDefined() // int16[]
	})
})
