import { describe, expect, it } from 'vitest'
import { createBaseState } from '../createBaseState.js'
import { checkpoint } from './checkpoint.js'
import { revert } from './revert.js'

describe(revert.name, () => {
	it('should revert checkpoints', async () => {
		const baseState = createBaseState({
			loggingLevel: 'warn',
		})
		expect(baseState.caches.storage._checkpoints).toBe(0)
		expect(baseState.caches.accounts._checkpoints).toBe(0)
		expect(baseState.caches.contracts._checkpoints).toBe(0)
		await checkpoint(baseState)()
		expect(baseState.caches.storage._checkpoints).toBe(1)
		expect(baseState.caches.accounts._checkpoints).toBe(1)
		expect(baseState.caches.contracts._checkpoints).toBe(1)
		await revert(baseState)()
		expect(baseState.caches.storage._checkpoints).toBe(0)
		expect(baseState.caches.accounts._checkpoints).toBe(0)
		expect(baseState.caches.contracts._checkpoints).toBe(0)
	})
})
