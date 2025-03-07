import { parseGwei } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import type { EthSignTransactionParams } from './EthParams.js'
import { ethSignTransactionHandler } from './ethSignTransactionHandler.js'
import { testAccounts } from './utils/testAccounts.js'

const transaction: EthSignTransactionParams = {
	data: '0x0',
	from: testAccounts[0].address,
	to: `0x${'69'.repeat(20)}`,
	value: 420n,
	gas: 23n,
	gasPrice: parseGwei('1'),
	nonce: 1n,
}

describe('ethSignTransactionHandler', () => {
	it('should sign a message', async () => {
		expect(
			await ethSignTransactionHandler({
				accounts: testAccounts,
				getChainId: async () => 10,
			})(transaction),
		).toMatchSnapshot()
	})
	it("should throw an error if account doesn't exist", async () => {
		await expect(
			ethSignTransactionHandler({
				accounts: testAccounts,
				getChainId: async () => 10,
			})({
				...transaction,
				from: `0x${'69'.repeat(20)}`,
			}),
		).rejects.toThrow()
	})
})