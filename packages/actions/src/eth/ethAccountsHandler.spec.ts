import { describe, expect, it } from 'vitest'
import { ethAccountsHandler } from './ethAccountsHandler.js'
import { testAccounts } from './utils/testAccounts.js'

describe('ethAccountsHandler', () => {
	it('should return the accounts', async () => {
		expect(await ethAccountsHandler({ accounts: testAccounts })()).toEqual(
			testAccounts.map((account) => account.address),
		)
	})
})
