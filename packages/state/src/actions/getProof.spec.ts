import { describe, expect, it } from 'vitest'
import { getProof } from './getProof.js'
import { createBaseState } from '../createBaseState.js'
import { createAddress } from '@tevm/address'
import { transports } from '@tevm/test-utils'

describe(getProof.name, () => {
	it('getProof from fork url', async () => {
		const state = createBaseState({
			fork: {
				transport: transports.optimism,
				blockTag: 420n,
			},
		})
		await state.ready()
		expect(getProof(state)(createAddress(0))).toMatchInlineSnapshot()
	})

	it('throws error if attempting to getProof with no fork uri', () => {
		const state = createBaseState({})
		expect(() => getProof(state)(createAddress(0))).toThrowErrorMatchingInlineSnapshot()
	})
})
