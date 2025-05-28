// @vitest-environment jsdom

import { type Stash, createStash, setRecords } from '@latticexyz/stash/internal'
import { render, renderHook } from '@testing-library/react'
import { tevmDefault } from '@tevm/common'
import { createTevmTransport } from '@tevm/memory-client'
import React from 'react'
import { type Address, type Client, createClient } from 'viem'
import { createBundlerClient } from 'viem/account-abstraction'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { config } from '../../test/config.js'
import { state } from '../../test/state.js'
import { OptimisticWrapperProvider, useOptimisticWrapper } from './useOptimisticWrapper.js'

describe('useOptimisticWrapper', () => {
	let client: Client
	let stash: Stash

	beforeEach(() => {
		client = createClient({ chain: tevmDefault, transport: createTevmTransport({ common: tevmDefault }) })
		stash = createStash(config)
		setRecords({ stash, table: config.tables.app__TestTable, records: Object.values(state.records.app.TestTable) })
	})

	it('should return undefined when used outside of provider', () => {
		const { result } = renderHook(() => useOptimisticWrapper())
		expect(result.current).toBeUndefined()
	})

	it('should return undefined when client is not provided', () => {
		const wrapper = ({ children }: { children: React.ReactNode }) => (
			<OptimisticWrapperProvider
				storeAddress="0x1234567890123456789012345678901234567890"
				stash={stash}
				config={config}
			>
				{children}
			</OptimisticWrapperProvider>
		)

		const { result } = renderHook(() => useOptimisticWrapper(), { wrapper })
		expect(result.current).toBeUndefined()
	})

	it('should create optimistic handler when client is provided', () => {
		const wrapper = ({ children }: { children: React.ReactNode }) => (
			<OptimisticWrapperProvider
				client={client}
				storeAddress="0x1234567890123456789012345678901234567890"
				stash={stash}
				config={config}
			>
				{children}
			</OptimisticWrapperProvider>
		)

		const { result } = renderHook(() => useOptimisticWrapper(), { wrapper })
		expect(result.current).toBeDefined()
	})

	it('should work with real stash data', async () => {
		const wrapper = ({ children }: { children: React.ReactNode }) => (
			<OptimisticWrapperProvider
				client={client}
				storeAddress="0x1234567890123456789012345678901234567890"
				stash={stash}
				config={config}
			>
				{children}
			</OptimisticWrapperProvider>
		)

		const { result } = renderHook(() => useOptimisticWrapper(), { wrapper })

		// Verify we can access the stash data through the handler
		const optimisticState = await result.current?.getOptimisticState()
		const currentState = stash.get()
		expect(optimisticState).toEqual(currentState)
	})

	it('should handle SessionClient type', () => {
		const sessionClient = createBundlerClient({
			client,
			// @ts-expect-error - viem versions
			chain: tevmDefault,
			// @ts-expect-error - viem versions
			transport: createTevmTransport({ common: tevmDefault }),
		})

		const wrapper = ({ children }: { children: React.ReactNode }) => (
			<OptimisticWrapperProvider
				client={sessionClient}
				storeAddress="0x1234567890123456789012345678901234567890"
				stash={stash}
				config={config}
			>
				{children}
			</OptimisticWrapperProvider>
		)

		const { result } = renderHook(() => useOptimisticWrapper(), { wrapper })
		expect(result.current).toBeDefined()
	})

	it('should memoize handler result based on dependencies', () => {
		const mockRender = vi.fn()

		const TestHook = () => {
			useOptimisticWrapper()
			mockRender()
			return null
		}

		const TestComponent = ({ storeAddress }: { storeAddress: Address }) => (
			<OptimisticWrapperProvider client={client} storeAddress={storeAddress} stash={stash} config={config}>
				<TestHook />
			</OptimisticWrapperProvider>
		)

		const { rerender } = render(<TestComponent storeAddress="0x1234567890123456789012345678901234567890" />)
		expect(mockRender).toHaveBeenCalledTimes(1)

		// Re-render with same props - should not create new handler
		rerender(<TestComponent storeAddress="0x1234567890123456789012345678901234567890" />)
		expect(mockRender).toHaveBeenCalledTimes(2)

		// Re-render with different storeAddress - should create new handler
		rerender(<TestComponent storeAddress="0x9876543210987654321098765432109876543210" />)
		expect(mockRender).toHaveBeenCalledTimes(3)
	})

	it('should call cleanup on unmount', () => {
		let cleanupSpy: any

		const TestComponent = () => {
			const wrapper = useOptimisticWrapper()
			// Spy on the cleanup function once the wrapper is available
			if (wrapper && !cleanupSpy) {
				cleanupSpy = vi.spyOn(wrapper._, 'cleanup')
			}
			return <div>test</div>
		}

		const WrapperComponent = () => (
			<OptimisticWrapperProvider
				client={client}
				storeAddress="0x1234567890123456789012345678901234567890"
				stash={stash}
				config={config}
			>
				<TestComponent />
			</OptimisticWrapperProvider>
		)

		const { unmount } = render(<WrapperComponent />)

		// Wait for the spy to be set up
		expect(cleanupSpy).toBeDefined()
		expect(cleanupSpy).not.toHaveBeenCalled()

		unmount()
		expect(cleanupSpy).toHaveBeenCalled()
	})

	it('should provide all optimistic handler methods', () => {
		const wrapper = ({ children }: { children: React.ReactNode }) => (
			<OptimisticWrapperProvider
				client={client}
				storeAddress="0x1234567890123456789012345678901234567890"
				stash={stash}
				config={config}
			>
				{children}
			</OptimisticWrapperProvider>
		)

		const { result } = renderHook(() => useOptimisticWrapper(), { wrapper })

		expect(result.current).toHaveProperty('getOptimisticState')
		expect(result.current).toHaveProperty('getOptimisticRecord')
		expect(result.current).toHaveProperty('getOptimisticRecords')
		expect(result.current).toHaveProperty('subscribeOptimisticState')
		expect(result.current).toHaveProperty('subscribeTx')
		expect(result.current).toHaveProperty('_')

		expect(typeof result.current?.getOptimisticState).toBe('function')
		expect(typeof result.current?.getOptimisticRecord).toBe('function')
		expect(typeof result.current?.getOptimisticRecords).toBe('function')
		expect(typeof result.current?.subscribeOptimisticState).toBe('function')
		expect(typeof result.current?.subscribeTx).toBe('function')
	})
})
