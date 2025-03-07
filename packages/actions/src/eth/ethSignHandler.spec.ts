import { describe, expect, it } from 'vitest'
import { ethSignHandler } from './ethSignHandler.js'
import { testAccounts } from './utils/testAccounts.js'

describe('ethSignHandler', () => {
	it('should sign a message', async () => {
		const data = '0x42069'
		expect(
			await ethSignHandler({ accounts: testAccounts })({
				data,
				address: testAccounts[0].address,
			}),
		).toEqual(await testAccounts[0].signMessage({ message: data }))
	})
	it("should throw an error if account doesn't exist", async () => {
		const data = '0x42069'
		await expect(
			ethSignHandler({ accounts: testAccounts })({
				data,
				address: `0x${'69'.repeat(20)}`,
			}),
		).rejects.toThrow()
	})
})