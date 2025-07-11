import { type State } from '@latticexyz/stash/internal'
// @vitest-environment jsdom
import { renderHook, waitFor } from '@testing-library/react'
import React from 'react'
import { beforeAll, describe, expect, it } from 'vitest'
import { config } from '../../test/config.js'
import { prepare, sessionClient, stash, testContract, writeRecords } from '../../test/prepare.js'
import { randomRecord } from '../../test/state.js'
import { deepEqual } from '../internal/utils/deepEqual.js'
import { useOptimisticState } from './useOptimisticState.js'
import { OptimisticWrapperProvider } from './useOptimisticWrapper.js'

describe('useOptimisticState', () => {
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

	it('should call selector with optimistic state and return result', async () => {
		const length = Object.keys(stash.get().records.app.TestTable).length
		const { result } = renderHook(
			() => useOptimisticState((state: State<typeof config>) => state.records.app.TestTable),
			{ wrapper: createWrapper },
		)

		await waitFor(() => {
			expect(result.current).toBeDefined()
			expect(Object.keys(result.current ?? {})).toHaveLength(length)
		})
	})

	it('should return undefined when selector returns undefined', async () => {
		const { result } = renderHook(() => useOptimisticState(() => undefined), { wrapper: createWrapper })

		await waitFor(() => {
			expect(result.current).toBeUndefined()
		})
	})

	it('should update when stash state changes', async () => {
		const length = Object.keys(stash.get().records.app.TestTable).length
		const { result } = renderHook(
			() => useOptimisticState((state: State<typeof config>) => Object.keys(state.records.app.TestTable).length),
			{ wrapper: createWrapper },
		)

		// Initial state
		await waitFor(() => {
			expect(result.current).toBe(length)
		})

		// Add a record to stash (simulating canonical update)
		const [_, record] = randomRecord()
		await writeRecords([record])

		// Should update with new count
		await waitFor(() => {
			expect(result.current).toBe(length + 1)
		})
	})

	it('should use custom isEqual function', async () => {
		const length = Object.keys(stash.get().records.app.TestTable).length

		let callCount = 0
		const customIsEqual = (a: unknown, b: unknown) => {
			callCount++
			return deepEqual(a, b)
		}

		const { result } = renderHook(() => useOptimisticState(() => ({ count: length }), { isEqual: customIsEqual }), {
			wrapper: createWrapper,
		})

		await waitFor(() => {
			expect(result.current).toEqual({ count: length })
		})

		// Custom isEqual should have been called
		expect(callCount).toBeGreaterThan(0)
	})

	it('should not re-render when selector returns same reference', async () => {
		const stableObject = { value: 'stable' }
		const selector = () => stableObject
		let renderCount = 0

		const { result } = renderHook(
			() => {
				renderCount++
				return useOptimisticState(selector)
			},
			{ wrapper: createWrapper },
		)

		await waitFor(() => {
			expect(result.current).toBe(stableObject)
		})

		const initialRenderCount = renderCount

		// Force a re-render by triggering stash update (but selector returns same object)
		stash._.storeSubscribers.forEach((subscriber) => subscriber({ type: 'records', updates: [] }))
		await new Promise((resolve) => setTimeout(resolve, 50))

		// Should not have caused additional renders due to stable reference
		expect(renderCount).toBe(initialRenderCount)
	})

	it('should cleanup subscription on unmount', async () => {
		const { unmount } = renderHook(
			() => useOptimisticState((state: State<typeof config>) => Object.keys(state.records.app.TestTable).length),
			{ wrapper: createWrapper },
		)

		await waitFor(() => {
			// Hook is mounted and working
		})

		// Should not throw when unmounting
		expect(() => unmount()).not.toThrow()
	})

	it('should work when wrapper is undefined initially', async () => {
		// Render without wrapper first
		const { result } = renderHook(() =>
			useOptimisticState((state: State<typeof config>) => state.records.app.TestTable),
		)

		// Should return undefined when no wrapper
		expect(result.current).toBeUndefined()
	})

	it('should handle multiple hooks with same selector', async () => {
		const length = Object.keys(stash.get().records.app.TestTable).length
		const selector = (state: State<typeof config>) => Object.keys(state.records.app.TestTable).length

		const { result: result1 } = renderHook(() => useOptimisticState(selector), { wrapper: createWrapper })
		const { result: result2 } = renderHook(() => useOptimisticState(selector), { wrapper: createWrapper })

		await waitFor(() => {
			expect(result1.current).toBe(length)
			expect(result2.current).toBe(length)
		})

		// Both should update when state changes
		const [, newRecord] = randomRecord()
		await writeRecords([newRecord])

		await waitFor(() => {
			expect(result1.current).toBe(length + 1)
			expect(result2.current).toBe(length + 1)
		})
	})

	it('should provide correct state structure to selector', async () => {
		let receivedState: State<typeof config> | undefined = undefined
		const selector = (state: State<typeof config>) => {
			receivedState = state
			return 'test'
		}

		const { result } = renderHook(() => useOptimisticState(selector), { wrapper: createWrapper })

		await waitFor(() => {
			expect(result.current).toBe('test')
		})

		// Verify the state structure passed to selector
		expect(receivedState).toBeDefined()
		const _state = receivedState as unknown as State<typeof config>
		expect(_state.config).toBeDefined()
		expect(_state.records).toBeDefined()
		expect(_state.records.app).toBeDefined()
		expect(_state.records.app.TestTable).toBeDefined()
	})
})
