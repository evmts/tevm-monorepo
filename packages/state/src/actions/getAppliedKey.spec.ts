import { createAddress } from '@tevm/address'
import { describe, expect, it } from 'vitest'
import { createBaseState } from '../createBaseState.js'
import { getAppliedKey } from './getAppliedKey.js'

describe(getAppliedKey.name, () => {
	it('should work', () => {
		const state = createBaseState({})
		const getIt = getAppliedKey(state)
		if (!getIt) {
			throw new Error('Unexpected undefined')
		}
		expect(getIt(createAddress(2).toBytes())).toMatchInlineSnapshot(`
			Uint8Array [
			  213,
			  38,
			  136,
			  168,
			  249,
			  38,
			  200,
			  22,
			  202,
			  30,
			  7,
			  144,
			  103,
			  202,
			  186,
			  148,
			  79,
			  21,
			  142,
			  118,
			  72,
			  23,
			  184,
			  63,
			  196,
			  53,
			  148,
			  55,
			  12,
			  169,
			  207,
			  98,
			]
		`)
	})
})
