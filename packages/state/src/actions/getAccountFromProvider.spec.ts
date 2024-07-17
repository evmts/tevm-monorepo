import { describe, it, expect } from 'vitest'
import { getAccountFromProvider } from './getAccountFromProvider.js'
import { createAddress } from '@tevm/address'
import { createBaseState } from '../createBaseState.js'

describe(getAccountFromProvider.name, () => {
	it('should get an account from fork transport', () => {
		const address = createAddress(`0x42${'0'.repeat(36)}42`)
		const state = createBaseState({})
		expect(getAccountFromProvider(state)(address))
	})
})
