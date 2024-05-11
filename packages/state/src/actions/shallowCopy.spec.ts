import { describe, expect, it } from 'bun:test'
import { getAlchemyUrl } from '@tevm/test-utils'
import { EthjsAddress } from '@tevm/utils'
import { createBaseState } from '../createBaseState.js'
import { shallowCopy } from './shallowCopy.js'

describe(shallowCopy.name, () => {
	it('should just create same base state with same options', async () => {
		const options = {
			loggingLevel: 'warn',
			fork: {
				url: getAlchemyUrl(),
			},
		} as const

		const baseState = createBaseState(options)

		const address = EthjsAddress.fromString(`0x${'01'.repeat(20)}`)
		const slot = Uint8Array.from([69])
		const value = Uint8Array.from([420])
		baseState.caches.storage.put(address, slot, value)

		const newState = shallowCopy(baseState)()

		expect(newState.options).toBe(options)
		expect(baseState.caches.storage.get(address, slot)).toEqual(value)
		expect(newState.caches.storage.get(address, slot)).toBeUndefined()
	})
})
