import { describe, expect, it } from 'vitest'
import { getAppliedKey } from './getAppliedKey.js'
import { createBaseState } from '../createBaseState.js'
import { createAddress } from '@tevm/address'

describe(getAppliedKey.name, () => {
	it('should work', () => {
		const state = createBaseState({})
		const getIt = getAppliedKey(state)
		if (!getIt) {
			throw new Error('Unexpected undefined')
		}
		expect(getIt(createAddress(2).toBytes())).toMatchInlineSnapshot()
	})
})
