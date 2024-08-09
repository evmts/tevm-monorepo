import { createAddress } from '@tevm/address'
import { EthjsAccount } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { createBaseState } from '../createBaseState.js'
import { getAccount } from './getAccount.js'
import { modifyAccountFields } from './modifyAccountFields.js'
import { putAccount } from './putAccount.js'

describe(modifyAccountFields.name, () => {
	it('allows you to modify account fields with a partial config', async () => {
		const state = createBaseState({})
		await putAccount(state)(createAddress(0), EthjsAccount.fromAccountData({ nonce: 1n, balance: 2n }))
		await modifyAccountFields(state)(createAddress(0), { nonce: 2n, balance: 3n })
		const { nonce, balance } = (await getAccount(state)(createAddress(0))) ?? {}
		expect(nonce).toBe(2n)
		expect(balance).toBe(3n)
	})
})
