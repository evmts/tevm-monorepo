import { privateKeyToAccount } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { ethAccountsHandler } from './ethAccountsHandler.js'
import { testAccounts } from './utils/testAccounts.js'

describe('ethAccountsHandler', () => {
	it('should return the accounts', async () => {
		expect(await ethAccountsHandler({ accounts: testAccounts })()).toEqual(
			testAccounts.map((account) => account.address),
		)
	})

	it('should return empty array when no accounts exist', async () => {
		expect(await ethAccountsHandler({ accounts: [] })()).toEqual([])
	})

	it('should handle custom account list properly', async () => {
		// Use type assertion to tell TypeScript that these accounts are defined
		const account1 = privateKeyToAccount('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80')
		const account2 = privateKeyToAccount('0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d')

		const customAccounts = [account1, account2]

		expect(await ethAccountsHandler({ accounts: customAccounts })()).toEqual([account1.address, account2.address])
	})
})
