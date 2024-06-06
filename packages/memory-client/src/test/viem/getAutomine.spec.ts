import { describe, it, expect } from 'bun:test'
import { createMemoryClient } from '../../createMemoryClient.js'
import { testActions } from 'viem'

describe('getAutomine', () => {
	it('should return false if mining config is manual', async () => {
		const mc = createMemoryClient({
			miningConfig: {
				type: 'manual',
			},
		}).extend(testActions({ mode: 'anvil' }))
		expect(await mc.getAutomine()).toBe(false)
	})
	it('should return true if mining config is auto', async () => {
		const mc = createMemoryClient({
			miningConfig: {
				type: 'auto',
			},
		}).extend(testActions({ mode: 'anvil' }))
		expect(await mc.getAutomine()).toBe(true)
	})
})
