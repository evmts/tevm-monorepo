import { AccountCache, CacheType } from '@ethereumjs/statemanager'
import { createAddress } from '@tevm/address'
import { EthjsAccount } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { createBaseState } from '../createBaseState.js'
import { getAccountAddresses } from './getAccountAddresses.js'
import { putAccount } from './putAccount.js'

describe(getAccountAddresses.name, () => {
	it('should get all account addresses', async () => {
		const state = createBaseState({})

		await putAccount(state)(createAddress(1), EthjsAccount.fromAccountData({ balance: 420n }))
		await putAccount(state)(createAddress(11), EthjsAccount.fromAccountData({ balance: 420n }))
		await putAccount(state)(createAddress(111), EthjsAccount.fromAccountData({ balance: 420n }))
		await putAccount(state)(createAddress(1111), EthjsAccount.fromAccountData({ balance: 420n }))
		await putAccount(state)(createAddress(11111), EthjsAccount.fromAccountData({ balance: 420n }))
		await putAccount(state)(createAddress(111111), EthjsAccount.fromAccountData({ balance: 420n }))

		expect(getAccountAddresses(state)()).toEqual([
			createAddress(11).toString(),
			createAddress(111).toString(),
			createAddress(1111).toString(),
			createAddress(11111).toString(),
			createAddress(1).toString(),
			createAddress(111111).toString(),
		])
	})
	it('works with ordered map cache', async () => {
		const state = createBaseState({
			accountsCache: new AccountCache({ size: 200, type: CacheType.ORDERED_MAP }),
		})

		await putAccount(state)(createAddress(1), EthjsAccount.fromAccountData({ balance: 420n }))
		await putAccount(state)(createAddress(11), EthjsAccount.fromAccountData({ balance: 420n }))
		await putAccount(state)(createAddress(111), EthjsAccount.fromAccountData({ balance: 420n }))
		await putAccount(state)(createAddress(1111), EthjsAccount.fromAccountData({ balance: 420n }))
		await putAccount(state)(createAddress(11111), EthjsAccount.fromAccountData({ balance: 420n }))
		await putAccount(state)(createAddress(111111), EthjsAccount.fromAccountData({ balance: 420n }))

		expect(getAccountAddresses(state)()).toEqual([
			createAddress(1).toString(),
			createAddress(11).toString(),
			createAddress(111).toString(),
			createAddress(1111).toString(),
			createAddress(11111).toString(),
			createAddress(111111).toString(),
		])
	})
})
