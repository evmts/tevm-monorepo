import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createTevmNode } from './createTevmNode.js'

// Mock timers for precise timing control in tests
vi.useFakeTimers()

describe('createIntervalMiner', () => {
	let cleanup: (() => void)[] = []

	beforeEach(() => {
		cleanup.forEach(fn => fn())
		cleanup = []
		vi.clearAllTimers()
	})

	describe('Time drift prevention', () => {
		it('should mine blocks at precise intervals regardless of execution time', async () => {
			const node = createTevmNode({
				miningConfig: { type: 'interval', blockTime: 1 }
			})
			
			await node.ready()
			
			// Mock the mine handler to take some time
			let mineCallCount = 0
			const originalMineHandler = node.getVm
			vi.spyOn(node, 'getVm' as any).mockImplementation(async () => {
				mineCallCount++
				// Simulate mining taking 100ms
				await new Promise(resolve => setTimeout(resolve, 100))
				return originalMineHandler()
			})

			const startTime = Date.now()
			const miningTimes: number[] = []

			// Capture actual mining times
			const originalLogger = node.logger.debug
			vi.spyOn(node.logger, 'debug').mockImplementation((data: any, message?: string) => {
				if (message === 'Starting interval mining operation') {
					miningTimes.push(Date.now() - startTime)
				}
				return originalLogger.call(node.logger, data, message)
			})

			// Start interval mining
			node.startIntervalMining()

			// Advance timers to trigger mining operations
			vi.advanceTimersByTime(1000) // First mine at 1s
			vi.advanceTimersByTime(1000) // Second mine at 2s  
			vi.advanceTimersByTime(1000) // Third mine at 3s

			// Allow mining operations to complete
			await vi.runAllTimersAsync()

			expect(miningTimes).toHaveLength(3)
			
			// Check that mining happens at precise intervals (1000ms apart)
			// despite execution time
			expect(miningTimes[0]).toBeCloseTo(0, -1) // ~0ms (immediate first run)
			expect(miningTimes[1]).toBeCloseTo(1000, -1) // ~1000ms
			expect(miningTimes[2]).toBeCloseTo(2000, -1) // ~2000ms

			node.stopIntervalMining()
		}, 10000)

		it('should prevent time drift accumulation over many intervals', async () => {
			const node = createTevmNode({
				miningConfig: { type: 'interval', blockTime: 0.1 } // 100ms intervals
			})
			
			await node.ready()

			const miningTimes: number[] = []
			const startTime = Date.now()

			vi.spyOn(node.logger, 'debug').mockImplementation((data: any, message?: string) => {
				if (message === 'Starting interval mining operation') {
					miningTimes.push(Date.now() - startTime)
				}
			})

			node.startIntervalMining()

			// Run for 10 intervals (1 second total)
			for (let i = 0; i < 10; i++) {
				vi.advanceTimersByTime(100)
			}

			await vi.runAllTimersAsync()

			expect(miningTimes).toHaveLength(10)

			// Check that even after many intervals, there's no significant drift
			const expectedTimes = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900]
			expectedTimes.forEach((expectedTime, index) => {
				expect(miningTimes[index]).toBeCloseTo(expectedTime, -1)
			})

			node.stopIntervalMining()
		}, 10000)
	})

	describe('Race condition prevention', () => {
		it('should wait for current mining operation before starting next', async () => {
			const node = createTevmNode({
				miningConfig: { type: 'interval', blockTime: 0.05 } // 50ms intervals
			})
			
			await node.ready()

			let miningInProgress = false
			let raceconditionDetected = false

			// Mock mining to take longer than interval
			const originalGetVm = node.getVm
			vi.spyOn(node, 'getVm' as any).mockImplementation(async () => {
				if (miningInProgress) {
					raceconditionDetected = true
				}
				miningInProgress = true
				
				// Mining takes 100ms, but interval is only 50ms
				await new Promise(resolve => setTimeout(resolve, 100))
				
				miningInProgress = false
				return originalGetVm()
			})

			node.startIntervalMining()

			// Advance time to trigger overlapping intervals
			vi.advanceTimersByTime(150) // Should trigger 3 intervals, but mining takes 100ms each
			await vi.runAllTimersAsync()

			expect(raceconditionDetected).toBe(false)
			
			node.stopIntervalMining()
		}, 10000)
	})

	describe('Configuration changes', () => {
		it('should handle switching from interval to auto mining', async () => {
			const node = createTevmNode({
				miningConfig: { type: 'interval', blockTime: 1 }
			})
			
			await node.ready()
			
			// Start interval mining
			node.startIntervalMining()
			expect(node.isIntervalMiningRunning()).toBe(true)

			// Switch to auto mining
			node.stopIntervalMining()
			node.miningConfig = { type: 'auto' }
			
			expect(node.isIntervalMiningRunning()).toBe(false)
		})

		it('should handle changing interval timing', async () => {
			const node = createTevmNode({
				miningConfig: { type: 'interval', blockTime: 1 }
			})
			
			await node.ready()

			let miningCount = 0
			vi.spyOn(node.logger, 'debug').mockImplementation((data: any, message?: string) => {
				if (message === 'Starting interval mining operation') {
					miningCount++
				}
			})

			// Start with 1 second interval
			node.startIntervalMining()
			vi.advanceTimersByTime(1000)
			expect(miningCount).toBe(1)

			// Change to 0.5 second interval
			node.stopIntervalMining()
			node.miningConfig = { type: 'interval', blockTime: 0.5 }
			node.startIntervalMining()

			// Should mine twice in 1 second now
			miningCount = 0 // Reset counter
			vi.advanceTimersByTime(1000)
			await vi.runAllTimersAsync()
			expect(miningCount).toBe(2)

			node.stopIntervalMining()
		})

		it('should not start interval mining when blockTime is 0', async () => {
			const node = createTevmNode({
				miningConfig: { type: 'interval', blockTime: 0 }
			})
			
			await node.ready()

			let miningStarted = false
			vi.spyOn(node.logger, 'debug').mockImplementation((data: any, message?: string) => {
				if (message === 'Starting interval mining operation') {
					miningStarted = true
				}
			})

			node.startIntervalMining()
			vi.advanceTimersByTime(5000) // Wait a long time
			await vi.runAllTimersAsync()

			expect(miningStarted).toBe(false)
			expect(node.isIntervalMiningRunning()).toBe(false)
		})
	})

	describe('Clean shutdown', () => {
		it('should stop all mining operations on shutdown', async () => {
			const node = createTevmNode({
				miningConfig: { type: 'interval', blockTime: 0.1 }
			})
			
			await node.ready()

			let miningCount = 0
			vi.spyOn(node.logger, 'debug').mockImplementation((data: any, message?: string) => {
				if (message === 'Starting interval mining operation') {
					miningCount++
				}
			})

			node.startIntervalMining()
			expect(node.isIntervalMiningRunning()).toBe(true)

			// Let it mine a few times
			vi.advanceTimersByTime(300)
			const miningCountBeforeStop = miningCount

			// Stop mining
			node.stopIntervalMining()
			expect(node.isIntervalMiningRunning()).toBe(false)

			// Advance more time - should not mine anymore
			vi.advanceTimersByTime(1000)
			await vi.runAllTimersAsync()

			expect(miningCount).toBe(miningCountBeforeStop)
		})
	})

	describe('Edge cases', () => {
		it('should handle system clock adjustments gracefully', async () => {
			const node = createTevmNode({
				miningConfig: { type: 'interval', blockTime: 1 }
			})
			
			await node.ready()

			const miningTimes: number[] = []
			let customTime = Date.now()
			
			// Mock Date.now to simulate clock adjustments
			const originalDateNow = Date.now
			vi.spyOn(Date, 'now').mockImplementation(() => customTime)

			vi.spyOn(node.logger, 'debug').mockImplementation((data: any, message?: string) => {
				if (message === 'Starting interval mining operation') {
					miningTimes.push(customTime - originalDateNow)
				}
			})

			node.startIntervalMining()

			// Normal progression
			customTime += 1000
			vi.advanceTimersByTime(1000)

			// Simulate clock jumping backwards (system clock adjustment)
			customTime -= 500
			vi.advanceTimersByTime(1000)

			// Normal progression again
			customTime += 1000
			vi.advanceTimersByTime(1000)

			await vi.runAllTimersAsync()

			// Should still mine at reasonable intervals despite clock adjustments
			expect(miningTimes.length).toBeGreaterThanOrEqual(2)

			node.stopIntervalMining()
		})

		it('should handle being stopped before started', () => {
			const node = createTevmNode({
				miningConfig: { type: 'interval', blockTime: 1 }
			})

			// Should not throw
			expect(() => node.stopIntervalMining()).not.toThrow()
			expect(node.isIntervalMiningRunning()).toBe(false)
		})

		it('should handle multiple start calls', async () => {
			const node = createTevmNode({
				miningConfig: { type: 'interval', blockTime: 1 }
			})
			
			await node.ready()

			node.startIntervalMining()
			expect(node.isIntervalMiningRunning()).toBe(true)

			// Should not start multiple miners
			node.startIntervalMining()
			node.startIntervalMining()
			expect(node.isIntervalMiningRunning()).toBe(true)

			node.stopIntervalMining()
		})
	})
})