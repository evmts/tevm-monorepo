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
		const customAccounts = [
			{ address: '0x1234567890123456789012345678901234567890', privateKey: '0xabcdef' },
			{ address: '0x0987654321098765432109876543210987654321', privateKey: '0x123456' },
		]
		expect(await ethAccountsHandler({ accounts: customAccounts })()).toEqual([
			'0x1234567890123456789012345678901234567890',
			'0x0987654321098765432109876543210987654321',
		])
	})
})
