import { createAddressFromString } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { createBaseState } from '../createBaseState.js'
import { checkpoint } from './checkpoint.js'
import { clearContractStorage } from './clearContractStorage.js'
import { getContractStorage } from './getContractStorage.js'
import { revert } from './revert.js'

describe(clearContractStorage.name, () => {
	it('should clear all storage entries for the account corresponding to `address`', async () => {
		const baseState = createBaseState({
			loggingLevel: 'warn',
		})

		const address = createAddressFromString(`0x${'01'.repeat(20)}`)
		const slot = Uint8Array.from([69])
		const value = Uint8Array.from([420])

		baseState.caches.storage.put(address, slot, value)

		expect(baseState.caches.storage.get(address, slot)).toBe(value)

		clearContractStorage(baseState)(address)

		expect(baseState.caches.storage.get(address, slot)).toBeUndefined()
	})

	// Regression: clearStorage must be checkpoint-aware so that cleared slots are
	// restored on revert (e.g. a SELFDESTRUCT inside a reverted call frame).
	it('storage cache restores cleared slots on revert', () => {
		const baseState = createBaseState({ loggingLevel: 'warn' })
		const address = createAddressFromString(`0x${'02'.repeat(20)}`)
		const slot = Uint8Array.from([69])
		const value = Uint8Array.from([420])
		const storage = baseState.caches.storage

		storage.put(address, slot, value)
		storage.checkpoint()
		storage.clearStorage(address)
		expect(storage.get(address, slot)).toBeUndefined()
		storage.revert()
		expect(storage.get(address, slot)).toEqual(value)
	})

	it('clearContractStorage is undone by revert() at the state-action level', async () => {
		const baseState = createBaseState({ loggingLevel: 'warn' })
		const address = createAddressFromString(`0x${'03'.repeat(20)}`)
		const slot = new Uint8Array(32)
		slot[31] = 7
		const value = Uint8Array.from([42])

		baseState.caches.storage.put(address, slot, value)
		await checkpoint(baseState)()
		await clearContractStorage(baseState)(address)
		// While cleared, reads return empty
		expect(await getContractStorage(baseState)(address, slot)).toEqual(new Uint8Array())
		await revert(baseState)()
		// After revert the cleared storage is restored
		expect(await getContractStorage(baseState)(address, slot)).toEqual(value)
	})
})
