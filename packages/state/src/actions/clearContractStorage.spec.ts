import { createAddressFromString } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { createBaseState } from '../createBaseState.js'
import { clearContractStorage } from './clearContractStorage.js'

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
})
