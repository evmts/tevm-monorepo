import { createAddress } from '@tevm/address'
import { hexToBytes } from 'viem'
import { describe, expect, it } from 'vitest'
import { createBaseState } from '../createBaseState.js'
import { createStateManager } from '../createStateManager.js'
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

	it('should handle multiple nested checkpoints', async () => {
		const baseState = createBaseState({
			loggingLevel: 'error',
		})
		// Create 3 nested checkpoints
		await checkpoint(baseState)()
		await checkpoint(baseState)()
		await checkpoint(baseState)()

		expect(baseState.caches.storage._checkpoints).toBe(3)
		expect(baseState.caches.accounts._checkpoints).toBe(3)
		expect(baseState.caches.contracts._checkpoints).toBe(3)

		// Revert one checkpoint
		await revert(baseState)()
		expect(baseState.caches.storage._checkpoints).toBe(2)

		// Commit one checkpoint
		await commit(baseState)()
		expect(baseState.caches.storage._checkpoints).toBe(1)

		// Revert final checkpoint
		await revert(baseState)()
		expect(baseState.caches.storage._checkpoints).toBe(0)
	})

	it('should integrate with state modifications', async () => {
		const stateManager = createStateManager({
			loggingLevel: 'error',
		})
		const address = createAddress('0x1111111111111111111111111111111111111111')

		// Initial state
		await stateManager.putAccount(address, {
			nonce: 0n,
			balance: 100n,
		})

		// First checkpoint
		await stateManager.checkpoint()

		// Modify state in first checkpoint
		await stateManager.putAccount(address, {
			nonce: 1n,
			balance: 150n,
		})

		// Second checkpoint
		await stateManager.checkpoint()

		// Modify state in second checkpoint
		await stateManager.putAccount(address, {
			nonce: 2n,
			balance: 200n,
		})

		// Verify current state reflects latest changes
		let account = await stateManager.getAccount(address)
		expect(account.nonce).toBe(2n)
		expect(account.balance).toBe(200n)

		// Revert second checkpoint
		await stateManager.revert()

		// State should be back to first checkpoint state
		account = await stateManager.getAccount(address)
		expect(account.nonce).toBe(1n)
		expect(account.balance).toBe(150n)

		// Commit first checkpoint
		await stateManager.commit()

		// State should persist
		account = await stateManager.getAccount(address)
		expect(account.nonce).toBe(1n)
		expect(account.balance).toBe(150n)
	})
})
