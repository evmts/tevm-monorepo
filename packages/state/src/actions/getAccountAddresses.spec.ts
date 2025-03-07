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

		expect(getAccountAddresses(state)()).toEqual(
			new Set([
				createAddress(11).toString(),
				createAddress(111).toString(),
				createAddress(1111).toString(),
				createAddress(11111).toString(),
				createAddress(1).toString(),
				createAddress(111111).toString(),
			]),
		)
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

		expect(getAccountAddresses(state)()).toEqual(
			new Set([
				createAddress(1).toString(),
				createAddress(11).toString(),
				createAddress(111).toString(),
				createAddress(1111).toString(),
				createAddress(11111).toString(),
				createAddress(111111).toString(),
			]),
		)
	})

	it('works with empty state', async () => {
		const state = createBaseState({})

		// No accounts added
		expect(getAccountAddresses(state)()).toEqual(new Set())
	})

	it('works with custom cache type', async () => {
		const state = createBaseState({
			accountsCache: new AccountCache({ size: 10, type: CacheType.SIMPLE }),
		})

		await putAccount(state)(createAddress(1), EthjsAccount.fromAccountData({ balance: 100n }))
		await putAccount(state)(createAddress(2), EthjsAccount.fromAccountData({ balance: 200n }))

		expect(getAccountAddresses(state)()).toEqual(new Set([createAddress(1).toString(), createAddress(2).toString()]))
	})

	it('handles deleted accounts properly', async () => {
		const state = createBaseState({})

		// Add accounts
		await putAccount(state)(createAddress(1), EthjsAccount.fromAccountData({ balance: 100n }))
		await putAccount(state)(createAddress(2), EthjsAccount.fromAccountData({ balance: 200n }))

		// Delete one account (by setting its properties to zero)
		await putAccount(state)(
			createAddress(1),
			EthjsAccount.fromAccountData({
				balance: 0n,
				nonce: 0n,
				storageRoot: new Uint8Array(32),
				codeHash: new Uint8Array(32),
			}),
		)

		// Should still include both addresses
		expect(getAccountAddresses(state)()).toEqual(new Set([createAddress(1).toString(), createAddress(2).toString()]))
	})
})
