import { describe, expect, it, vi, beforeEach } from 'vitest'
import { pollyAdapter } from './pollyAdapter.js'
import { numberToHex } from 'viem'
import { mainnet } from '@tevm/common'
import path from 'path'

const snapshotDir = '__test_snapshots__'
const chainId = numberToHex(mainnet.id)
const testFile = 'pollyAdapter.spec.ts'

describe('pollyAdapter', () => {
	beforeEach(async () => {
		// Clean up polly instance before each test
		await pollyAdapter.destroy()
	})

	describe('init', () => {
		it('should create new Polly instance with correct configuration', async () => {
			const polly = await pollyAdapter.init(snapshotDir, chainId)

			expect(polly).toBeDefined()
			expect(polly.recordingName).toBe(testFile)
			expect(polly.mode).toBe('replay')
		})

		it('should replace existing instance when called again', async () => {
			const polly1 = await pollyAdapter.init(snapshotDir, chainId)
			const stopSpy = vi.spyOn(polly1, 'stop')

			const polly2 = await pollyAdapter.init(snapshotDir, chainId)

			expect(stopSpy).toHaveBeenCalled() // First instance should be stopped
			expect(polly1).not.toBe(polly2) // Should be different instances
			expect(polly2.recordingName).toBe(testFile)
		})

		it('should set up correct recordings directory', async () => {
			const snapshotDir = '/custom/snapshots'
			const polly = await pollyAdapter.init(snapshotDir, chainId)

			expect(polly.config.persisterOptions?.fs?.recordingsDir).toBe(path.join(snapshotDir, testFile))
		})

		it('should configure request matching correctly', async () => {
			const polly = await pollyAdapter.init(snapshotDir, chainId)

			expect(polly.config.matchRequestsBy?.method).toBe(false)
			expect(polly.config.matchRequestsBy?.url).toBe(false)
			expect(polly.config.matchRequestsBy?.headers).toBe(false)
			expect(polly.config.matchRequestsBy?.order).toBe(false)
			expect(typeof polly.config.matchRequestsBy?.body).toBe('function')
		})
	})

	describe('flush', () => {
		it('should handle no instance gracefully', async () => {
			// Try to flush when no instance exists
			await expect(pollyAdapter.flush()).resolves.not.toThrow()
		})
	})

	describe('destroy', () => {
		it('should stop existing instance', async () => {
			const polly = await pollyAdapter.init(snapshotDir, chainId)
			const stopSpy = vi.spyOn(polly, 'stop')

			await pollyAdapter.destroy()
			expect(stopSpy).toHaveBeenCalled()
		})

		it('should handle no instance gracefully', () => {
			expect(() => pollyAdapter.destroy()).not.toThrow()
		})
	})
})