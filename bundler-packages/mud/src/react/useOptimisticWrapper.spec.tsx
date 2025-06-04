// @vitest-environment jsdom
import { renderHook, waitFor } from '@testing-library/react'
import React from 'react'
import { assert, beforeAll, describe, expect, it } from 'vitest'
import { config } from '../../test/config.js'
import { randomRecord } from '../../test/state.js'
import { OptimisticWrapperProvider, useOptimisticWrapper } from './useOptimisticWrapper.js'
import { prepare, testContract, sessionClient, stash } from '../../test/prepare.js'
import { PREFUNDED_ACCOUNTS } from '@tevm/utils'

describe('useOptimisticWrapper', () => {
	beforeAll(async () => {
		await prepare({ count: 10 })
	})

	const createWrapper = ({ children }: { children: React.ReactNode }) => (
		<OptimisticWrapperProvider
			client={sessionClient}
			storeAddress={testContract.address}
			stash={stash}
			config={config}
			loggingLevel="debug"
		>
			{children}
		</OptimisticWrapperProvider>
	)

	it('should return undefined when used outside of provider', () => {
		const { result } = renderHook(() => useOptimisticWrapper())
		expect(result.current).toBeUndefined()
	})

	it('should return optimistic handler when used inside provider', () => {
		const { result } = renderHook(() => useOptimisticWrapper(), { wrapper: createWrapper })

		expect(result.current).toBeDefined()
		expect(result.current).toHaveProperty('getOptimisticState')
		expect(result.current).toHaveProperty('getOptimisticRecord')
		expect(result.current).toHaveProperty('getOptimisticRecords')
		expect(result.current).toHaveProperty('subscribeOptimisticState')
		expect(result.current).toHaveProperty('subscribeTx')
		expect(result.current).toHaveProperty('syncAdapter')
		expect(result.current).toHaveProperty('_')
	})

	it('should provide the canonical state with no pending transactions', async () => {
		const { result } = renderHook(() => useOptimisticWrapper(), { wrapper: createWrapper })

		await waitFor(() => {
			expect(result.current).toBeDefined()
		})

		const optimisticState = result.current.getOptimisticState()
		const currentState = stash.get()

		expect(optimisticState.config).toEqual(currentState.config)
		expect(optimisticState.records).toEqual(currentState.records)
	})

	// TODO: not working until eth_getProof supported
	it.todo('should update the optimistic state when a transaction is pending', async () => {
		const { result } = renderHook(() => useOptimisticWrapper(), { wrapper: createWrapper })

		await waitFor(() => {
			expect(result.current).toBeDefined()
		})

		const optimisticState = result.current.getOptimisticState()
		const currentState = stash.get()

		expect(optimisticState.config).toEqual(currentState.config)
		expect(optimisticState.records).toEqual(currentState.records)

		const [, record] = randomRecord()
		await sessionClient.writeContract({
			account: PREFUNDED_ACCOUNTS[0],
			// @ts-expect-error - cannot type args
			...testContract.write.set(...Object.values(record)),
		})

		await waitFor(() => {
			expect(result.current.getOptimisticState().records).not.toEqual(currentState.records)
		})

    // Optimistic state should be updated with the new record
		expect(result.current.getOptimisticRecord({ table: config.tables.app__TestTable, key: {key1: record.key1, key2: record.key2} })).toEqual(record)
	})

	it('should provide all handler methods with correct types', () => {
		const { result } = renderHook(() => useOptimisticWrapper(), { wrapper: createWrapper })

		assert(result.current, 'result.current is undefined')
		expect(typeof result.current.getOptimisticState).toBe('function')
		expect(typeof result.current.getOptimisticRecord).toBe('function')
		expect(typeof result.current.getOptimisticRecords).toBe('function')
		expect(typeof result.current.subscribeOptimisticState).toBe('function')
		expect(typeof result.current.subscribeTx).toBe('function')
		expect(typeof result.current.syncAdapter).toBe('function')
	})

	// TODO: not working until eth_getProof supported
	it.todo('should handle subscription to optimistic state', async () => {
		const { result } = renderHook(() => useOptimisticWrapper(), { wrapper: createWrapper })

		await waitFor(() => {
			expect(result.current).toBeDefined()
		})

		let notificationCount = 0
		const unsubscribe = result.current.subscribeOptimisticState({
			subscriber: () => {
				notificationCount++
			},
		})

		expect(typeof unsubscribe).toBe('function')
		expect(notificationCount).toBe(0)

		const [, record] = randomRecord()
		await sessionClient.writeContract({
			account: PREFUNDED_ACCOUNTS[0],
			// @ts-expect-error - cannot type args
			...testContract.write.set(...Object.values(record)),

		})

		await waitFor(() => {
			expect(notificationCount).toBe(1)
		})

		// Cleanup
		unsubscribe()
	})

	// TODO: not working until eth_getProof supported
	it.todo('should handle transaction subscription', async () => {
		const { result } = renderHook(() => useOptimisticWrapper(), { wrapper: createWrapper })

		await waitFor(() => {
			expect(result.current).toBeDefined()
		})

		const txStatuses: any[] = []
		const unsubscribe = result.current?.subscribeTx({
			subscriber: (status) => {
				txStatuses.push(status)
			},
		})

		expect(typeof unsubscribe).toBe('function')
		expect(txStatuses.length).toBe(0)

		const [, record] = randomRecord()
		await sessionClient.writeContract({
			account: PREFUNDED_ACCOUNTS[0],
			// @ts-expect-error - cannot type args
			...testContract.write.set(...Object.values(record)),

		})

		await waitFor(() => {
			expect(txStatuses.length).toBe(4)
		})

		// Cleanup
		unsubscribe()
	})

	it('should provide access to internal properties', async () => {
		const { result } = renderHook(() => useOptimisticWrapper(), { wrapper: createWrapper })

		await waitFor(() => {
			expect(result.current).toBeDefined()
		})

		const internal = result.current?._
		expect(internal).toHaveProperty('optimisticClient')
		expect(internal).toHaveProperty('internalClient')
		expect(internal).toHaveProperty('cleanup')
		expect(typeof internal.cleanup).toBe('function')
	})

	it('should cleanup properly when provider unmounts', async () => {
		const { unmount } = renderHook(() => useOptimisticWrapper(), { wrapper: createWrapper })

		await waitFor(() => {
			// Hook is mounted and working
		})

		// Should not throw when unmounting
		expect(() => unmount()).not.toThrow()
	})

	it('should provide consistent state across multiple hook calls', async () => {
		const { result: result1 } = renderHook(() => useOptimisticWrapper(), { wrapper: createWrapper })
		const { result: result2 } = renderHook(() => useOptimisticWrapper(), { wrapper: createWrapper })

		await waitFor(() => {
			expect(result1.current).toBeDefined()
			expect(result2.current).toBeDefined()
		})

		const state1 = result1.current?.getOptimisticState()
		const state2 = result2.current?.getOptimisticState()

		expect(state1).toEqual(state2)
	})
})
