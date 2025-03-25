import { createCommon } from '@tevm/common'
import { GasMiningConfig, TxPool } from '@tevm/txpool'
import { EthjsAccount, EthjsAddress, hexToBytes } from '@tevm/utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createTevmNode } from './createTevmNode.js'

// Mock dependencies
vi.mock('@tevm/actions', () => ({
	mineHandler: vi.fn().mockReturnValue(vi.fn()),
}))

// Access the mineHandler mock
const mineHandler = vi.hoisted(() => vi.fn().mockReturnValue(vi.fn()))

// Setup global variables
let originalSetInterval: typeof global.setInterval
let intervalIds: NodeJS.Timeout[] = []

describe('createTevmNode mining configurations', () => {
	beforeEach(() => {
		// Mock setInterval to track intervals
		originalSetInterval = global.setInterval
		global.setInterval = vi.fn((...args) => {
			const id = originalSetInterval(...args)
			intervalIds.push(id)
			return id
		})

		// Reset mocks
		vi.clearAllMocks()
		intervalIds = []
	})

	afterEach(() => {
		// Clear all interval timers
		intervalIds.forEach((id) => clearInterval(id))
		global.setInterval = originalSetInterval
	})

	describe('Interval Mining', () => {
		it('should set up interval mining with the specified interval', async () => {
			const interval = 5000 // 5 seconds
			const client = createTevmNode({
				miningConfig: {
					type: 'interval',
					interval,
				},
			})

			// Wait for the client to be ready
			await client.ready()

			// Verify setInterval was called with the correct interval
			expect(global.setInterval).toHaveBeenCalled()
			const setIntervalCalls = (global.setInterval as unknown as vi.Mock).mock.calls
			expect(setIntervalCalls[0][1]).toBe(interval)

			// Verify the mining handler was created
			expect(mineHandler).toHaveBeenCalledWith(client)

			// Clean up
			client.cleanup()
		})

		it('should store the intervalMiningId and clean it up properly', async () => {
			const client = createTevmNode({
				miningConfig: {
					type: 'interval',
					interval: 1000,
				},
			})

			await client.ready()

			// Verify interval ID is stored
			expect(client.intervalMiningId).toBeDefined()

			// Test cleanup
			const clearIntervalSpy = vi.spyOn(global, 'clearInterval')
			client.cleanup()

			// Check that the interval was cleared
			expect(clearIntervalSpy).toHaveBeenCalledWith(client.intervalMiningId)
			expect(client.intervalMiningId).toBeNull()
			expect(client.status).toBe('STOPPED')
		})

		it('should not run mining if client status is not READY', async () => {
			const mockMine = vi.fn()
			mineHandler.mockReturnValue(mockMine)

			const client = createTevmNode({
				miningConfig: {
					type: 'interval',
					interval: 100, // Fast interval for testing
				},
			})

			await client.ready()
			// Verify the client is in READY state
			expect(client.status).toBe('READY')

			// Force status change to trigger the condition
			client.status = 'STOPPED'

			// Allow time for the interval to execute
			await new Promise((resolve) => setTimeout(resolve, 200))

			// Mine shouldn't have been called since status is STOPPED
			expect(mockMine).not.toHaveBeenCalled()

			client.cleanup()
		})
	})

	describe('Gas Mining', () => {
		it('should pass gas mining configuration to TxPool', async () => {
			const gasLimit = 15000000n

			const client = createTevmNode({
				miningConfig: {
					type: 'gas',
					limit: gasLimit,
				},
			})

			await client.ready()
			const txPool = await client.getTxPool()

			// Verify that the gas mining config was passed correctly
			expect(txPool.gasMiningConfig).toBeDefined()
			expect(txPool.gasMiningConfig?.enabled).toBe(true)
			expect(txPool.gasMiningConfig?.threshold).toBe(gasLimit)
			expect(txPool.gasMiningConfig?.blocks).toBe(1)
		})

		it('should not set up interval mining when gas mining is configured', async () => {
			const client = createTevmNode({
				miningConfig: {
					type: 'gas',
					limit: 15000000n,
				},
			})

			await client.ready()

			// No interval mining should be set up
			expect(client.intervalMiningId).toBeUndefined()
		})
	})

	describe('Manual Mining', () => {
		it('should default to manual mining when no config is specified', async () => {
			const client = createTevmNode()

			expect(client.miningConfig).toEqual({ type: 'manual' })

			await client.ready()
			const txPool = await client.getTxPool()

			// No special mining config
			expect(txPool.gasMiningConfig).toBeUndefined()
			expect(client.intervalMiningId).toBeUndefined()
		})
	})

	describe('DeepCopy', () => {
		it('should preserve mining configuration when deep copying', async () => {
			// Test with gas mining config
			const clientWithGasMining = createTevmNode({
				miningConfig: {
					type: 'gas',
					limit: 15000000n,
				},
			})

			await clientWithGasMining.ready()
			const copy = await clientWithGasMining.deepCopy()

			expect(copy.miningConfig).toEqual(clientWithGasMining.miningConfig)

			// Verify TxPool config was copied
			const originalTxPool = await clientWithGasMining.getTxPool()
			const copiedTxPool = await copy.getTxPool()

			expect(copiedTxPool.gasMiningConfig).toEqual(originalTxPool.gasMiningConfig)
		})
	})
})
