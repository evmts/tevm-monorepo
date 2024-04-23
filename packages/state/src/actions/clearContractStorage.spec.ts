import { describe, expect, it } from 'bun:test'
import { EthjsAddress } from '@tevm/utils'
import { createBaseState } from '../createBaseState.js'
import { clearContractStorage } from './clearContractStorage.js'

describe(clearContractStorage.name, () => {
	it('should clear all storage entries for the account corresponding to `address`', async () => {
		const baseState = createBaseState()

		const address = EthjsAddress.fromString(`0x${'01'.repeat(20)}`)
		const slot = Uint8Array.from([69])
		const value = Uint8Array.from([420])

		baseState._caches.storage.put(address, slot, value)

		expect(baseState._caches.storage.get(address, slot)).toBe(value)

		clearContractStorage(baseState)(address)

		expect(baseState._caches.storage.get(address, slot)).toBeUndefined()
	})
})
