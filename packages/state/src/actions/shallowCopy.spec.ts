import { transports } from '@tevm/test-utils'
import { createAddressFromString } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { createBaseState } from '../createBaseState.js'
import { shallowCopy } from './shallowCopy.js'

describe(shallowCopy.name, () => {
	it('should just create same base state with same options', async () => {
		const options = {
			loggingLevel: 'warn',
			fork: {
				transport: transports.optimism,
			},
		} as const

		const baseState = createBaseState(options)

		const address = createAddressFromString(`0x${'01'.repeat(20)}`)
		const slot = Uint8Array.from([69])
		const value = Uint8Array.from([420])
		baseState.caches.storage.put(address, slot, value)

		const newState = shallowCopy(baseState)()

		expect(newState.options).toBe(options)
		expect(baseState.caches.storage.get(address, slot)).toEqual(value)
		expect(newState.caches.storage.get(address, slot)).toBeUndefined()
	})
})
