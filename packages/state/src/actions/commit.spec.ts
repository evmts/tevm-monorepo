import { beforeEach, describe, expect, it, jest } from 'bun:test'
import { createAddress } from '@tevm/address'
import { EthjsAccount } from '@tevm/utils'
import { createBaseState } from '../createBaseState.js'
import { checkpoint } from './checkpoint.js'
import { commit } from './commit.js'
import { putAccount } from './putAccount.js'

describe(commit.name, () => {
	it('should clear all storage entries for the account corresponding to `address`', async () => {
		// No mocks
		const baseState = createBaseState({
			loggingLevel: 'warn',
		})
		await putAccount(baseState)(createAddress(69696969), EthjsAccount.fromAccountData({ balance: 20n }))
		expect(baseState.caches.storage._checkpoints).toBe(0)
		expect(baseState.caches.accounts._checkpoints).toBe(0)
		expect(baseState.caches.contracts._checkpoints).toBe(0)
		await checkpoint(baseState)()
		expect(baseState.caches.storage._checkpoints).toBe(1)
		expect(baseState.caches.accounts._checkpoints).toBe(1)
		expect(baseState.caches.contracts._checkpoints).toBe(1)
		expect(baseState.caches.accounts._diffCache).toEqual([
			new Map(
				Object.entries({
					'0000000000000000000000000000000004277dc9': undefined,
				}),
			),
			new Map(),
		])
		expect(baseState.caches.storage._diffCache).toEqual([new Map(), new Map()])
		await commit(baseState)(true)
		expect(baseState.caches.storage._checkpoints).toBe(1)
		expect(baseState.caches.accounts._checkpoints).toBe(1)
		expect(baseState.caches.contracts._checkpoints).toBe(1)
		expect(baseState.caches.accounts._diffCache).toEqual([
			new Map(
				Object.entries({
					'0000000000000000000000000000000004277dc9': undefined,
				}),
			),
			new Map(),
		])
		expect(baseState.caches.storage._diffCache).toEqual([new Map(), new Map()])
		expect(baseState.getCurrentStateRoot()).toEqual(
			'0x886f43e0144bf4f5748e999d0178ed7e4edea8ad708e0bf26a61341e8ae91d1e',
		)
	})

	let baseState: ReturnType<typeof createBaseState>

	beforeEach(() => {
		baseState = createBaseState({
			loggingLevel: 'warn',
		})
		baseState.getCurrentStateRoot = jest.fn(() => 'existingStateRoot') as any
		baseState.setCurrentStateRoot = jest.fn()
		baseState.logger.debug = jest.fn()
		baseState.options.onCommit = jest.fn()
		baseState.stateRoots.set = jest.fn()
		baseState.caches.accounts.commit = jest.fn()
		baseState.caches.contracts.commit = jest.fn()
		baseState.caches.storage.commit = jest.fn()
	})

	it('should commit to existing state root', async () => {
		await checkpoint(baseState)()
		await commit(baseState)()

		expect(baseState.getCurrentStateRoot).toHaveBeenCalled()
		expect(baseState.setCurrentStateRoot).toHaveBeenCalledWith('existingStateRoot')
		expect(baseState.logger.debug).toHaveBeenCalledWith('Comitting to existing state root...')
		expect(baseState.stateRoots.set).toHaveBeenCalledWith('existingStateRoot', expect.any(Object))
		expect(baseState.caches.accounts.commit).toHaveBeenCalled()
		expect(baseState.caches.contracts.commit).toHaveBeenCalled()
		expect(baseState.caches.storage.commit).toHaveBeenCalled()
		expect(baseState.options.onCommit).toHaveBeenCalledWith(baseState)
	})

	it('should commit to a new state root', async () => {
		await checkpoint(baseState)()
		await commit(baseState)(true)

		expect(baseState.setCurrentStateRoot).toHaveBeenCalledWith(expect.any(String))
		expect(baseState.logger.debug).toHaveBeenCalledWith(
			expect.objectContaining({ root: expect.any(String) }),
			'Committing to new state root...',
		)
		expect(baseState.stateRoots.set).toHaveBeenCalledWith(expect.any(String), expect.any(Object))
		expect(baseState.caches.accounts.commit).toHaveBeenCalled()
		expect(baseState.caches.contracts.commit).toHaveBeenCalled()
		expect(baseState.caches.storage.commit).toHaveBeenCalled()
		expect(baseState.options.onCommit).toHaveBeenCalledWith(baseState)
	})

	it('should handle onCommit callback correctly', async () => {
		const onCommitMock = jest.fn()
		baseState.options.onCommit = onCommitMock

		await checkpoint(baseState)()
		await commit(baseState)()

		expect(onCommitMock).toHaveBeenCalledWith(baseState)
	})
})
