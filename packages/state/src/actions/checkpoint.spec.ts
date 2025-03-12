import { describe, expect, it } from 'vitest'
import { createBaseState } from '../createBaseState.js'
import { checkpoint } from './checkpoint.js'
import { commit } from './commit.js'
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

	it('should verify that checkpoints increases with each checkpoint call', async () => {
		const baseState = createBaseState({
			loggingLevel: 'error',
		})

		// Verify initial state
		const initialCount = baseState.caches.storage._checkpoints

		// Create a checkpoint
		await checkpoint(baseState)()

		// Verify checkpoint count increased
		expect(baseState.caches.storage._checkpoints).toBe(initialCount + 1)

		// Create another checkpoint
		await checkpoint(baseState)()

		// Verify checkpoint count increased again
		expect(baseState.caches.storage._checkpoints).toBe(initialCount + 2)
	})

	it('should verify commit operation works', async () => {
		// This test verifies the commit operation exists
		const baseState = createBaseState({
			loggingLevel: 'error',
		})

		// Create a checkpoint first
		await checkpoint(baseState)()

		// Commit should not throw an error
		await expect(commit(baseState)()).resolves.not.toThrow()
	})
})
