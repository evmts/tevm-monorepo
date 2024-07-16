import { describe, expect, it } from 'vitest'
import { createBaseState } from '../createBaseState.js'
import { checkpoint } from './checkpoint.js'
import { revert } from './revert.js'

describe(checkpoint.name, () => {
	it('should call the underlying checkpoint', async () => {
		const baseState = createBaseState({
			loggingLevel: 'error',
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
