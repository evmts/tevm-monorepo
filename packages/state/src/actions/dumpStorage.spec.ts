import { createAddressFromString, hexToBytes } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { createBaseState } from '../createBaseState.js'
import { dumpStorage } from './dumpStorage.js'

describe(dumpStorage.name, () => {
	it('should dump storage from a given contract address', async () => {
		const baseState = createBaseState({
			loggingLevel: 'warn',
		})

		const address = createAddressFromString(`0x${'01'.repeat(20)}`)

		const key0 = hexToBytes('0x0')
		const key1 = hexToBytes('0x1')
		const value0 = hexToBytes('0x42')
		const value1 = hexToBytes('0x69')

		baseState.caches.storage.put(address, key0, value0)
		baseState.caches.storage.put(address, key1, value1)

		expect(await dumpStorage(baseState)(address)).toEqual({
			'00': '0x42',
			'01': '0x69',
		})
	})

	it('should handle an object reference changing', async () => {
		const baseState = createBaseState({
			loggingLevel: 'warn',
		})
		baseState.caches.storage = createBaseState({ loggingLevel: 'warn' }).caches.storage

		const address = createAddressFromString(`0x${'01'.repeat(20)}`)

		const key0 = hexToBytes('0x0')
		const key1 = hexToBytes('0x1')
		const value0 = hexToBytes('0x42')
		const value1 = hexToBytes('0x69')

		baseState.caches.storage.put(address, key0, value0)
		baseState.caches.storage.put(address, key1, value1)

		expect(await dumpStorage(baseState)(address)).toEqual({
			'00': '0x42',
			'01': '0x69',
		})
	})
})
