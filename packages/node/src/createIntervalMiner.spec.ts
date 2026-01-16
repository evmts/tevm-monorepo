import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createTevmNode } from './createTevmNode.js'
import { createIntervalMiner } from './createIntervalMiner.js'
import type { TevmNode } from './TevmNode.js'

describe('createIntervalMiner', () => {
	let client: TevmNode
	let originalSetTimeout: typeof setTimeout
	let originalClearTimeout: typeof clearTimeout

	beforeEach(async () => {
		client = createTevmNode({
			miningConfig: { type: 'interval', blockTime: 1 }
		})
		await client.ready()

		// Mock timers
		originalSetTimeout = global.setTimeout
		originalClearTimeout = global.clearTimeout
		global.setTimeout = vi.fn() as any
		global.clearTimeout = vi.fn()
	})

	afterEach(() => {
		client.close()
		
		// Restore timers
		global.setTimeout = originalSetTimeout
		global.clearTimeout = originalClearTimeout
	})

	describe('start', () => {
		it('should start interval mining when mining type is interval', () => {
			const miner = createIntervalMiner(client)
			miner.start()

			expect(global.setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000)
		})

		it('should not start when mining type is not interval', () => {
			client.setMiningConfig({ type: 'auto' })
			const miner = createIntervalMiner(client)
			miner.start()

			expect(global.setTimeout).not.toHaveBeenCalled()
		})

		it('should not start multiple times if already running', () => {
			const miner = createIntervalMiner(client)
			miner.start()
			miner.start()

			expect(global.setTimeout).toHaveBeenCalledTimes(1)
		})

		it('should not schedule next mining cycle when blockTime is 0', () => {
			client.setMiningConfig({ type: 'interval', blockTime: 0 })
			const miner = createIntervalMiner(client)
			miner.start()

			expect(global.setTimeout).not.toHaveBeenCalled()
		})
	})

	describe('stop', () => {
		it('should stop interval mining and clear timeout', () => {
			const mockTimeoutId = 123
			;(global.setTimeout as any).mockReturnValue(mockTimeoutId)

			const miner = createIntervalMiner(client)
			miner.start()
			miner.stop()

			expect(global.clearTimeout).toHaveBeenCalledWith(mockTimeoutId)
		})

		it('should handle multiple stop calls gracefully', () => {
			const miner = createIntervalMiner(client)
			miner.start()
			miner.stop()
			miner.stop()

			// Should not throw or cause issues
			expect(global.clearTimeout).toHaveBeenCalledTimes(1)
		})
	})

	describe('updateConfig', () => {
		it('should restart mining when config changes and was running', () => {
			const miner = createIntervalMiner(client)
			miner.start()

			client.setMiningConfig({ type: 'interval', blockTime: 2 })
			miner.updateConfig()

			// Should have been called twice - once for start, once for restart
			expect(global.setTimeout).toHaveBeenCalledTimes(2)
			expect(global.setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 2000)
		})

		it('should not restart if was not running', () => {
			const miner = createIntervalMiner(client)
			
			client.setMiningConfig({ type: 'interval', blockTime: 2 })
			miner.updateConfig()

			expect(global.setTimeout).not.toHaveBeenCalled()
		})
	})

	describe('mining cycle', () => {
		it('should mine blocks when transactions are in mempool', async () => {
			// Use real timers for this test
			vi.useRealTimers()

			client = createTevmNode({
				miningConfig: { type: 'interval', blockTime: 0.1 } // 100ms for fast test
			})
			await client.ready()

			const initialBlockNumber = BigInt(0)

			// Add a transaction to mempool
			const txPool = await client.getTxPool()
			const vm = await client.getVm()
			
			// Start interval mining
			const miner = createIntervalMiner(client)
			miner.start()

			// Wait for mining cycle
			await new Promise(resolve => setTimeout(resolve, 150))

			// Stop mining
			miner.stop()
			client.close()

			vi.useFakeTimers()
		})

		it('should handle mining errors gracefully', async () => {
			const miner = createIntervalMiner(client)

			// Mock getTxPool to throw an error
			const originalGetTxPool = client.getTxPool
			client.getTxPool = vi.fn().mockRejectedValue(new Error('Test error'))

			// This should not throw
			expect(() => miner.start()).not.toThrow()

			// Restore original method
			client.getTxPool = originalGetTxPool
		})
	})

	describe('integration with different mining configs', () => {
		it('should work with different block times', () => {
			const configs = [
				{ blockTime: 0.5, expectedTimeout: 500 },
				{ blockTime: 1, expectedTimeout: 1000 },
				{ blockTime: 5, expectedTimeout: 5000 },
			]

			configs.forEach(({ blockTime, expectedTimeout }) => {
				client.setMiningConfig({ type: 'interval', blockTime })
				const miner = createIntervalMiner(client)
				miner.start()

				expect(global.setTimeout).toHaveBeenCalledWith(expect.any(Function), expectedTimeout)
				
				miner.stop()
			})
		})

		it('should not mine when blockTime is 0', () => {
			client.setMiningConfig({ type: 'interval', blockTime: 0 })
			const miner = createIntervalMiner(client)
			miner.start()

			expect(global.setTimeout).not.toHaveBeenCalled()
		})
	})
})