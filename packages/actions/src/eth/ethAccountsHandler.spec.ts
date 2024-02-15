import { ethAccountsHandler } from './ethAccountsHandler.js'
import { testAccounts } from './utils/testAccounts.js'
import { describe, expect, it } from 'bun:test'

describe('ethAccountsHandler', () => {
	it('should return the accounts', async () => {
		expect(await ethAccountsHandler({ accounts: testAccounts })()).toEqual(
			testAccounts.map((account) => account.address),
		)
	})
})
