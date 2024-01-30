import { ethSignTransactionHandler } from './ethSignTransactionHandler.js'
import { testAccounts } from './utils/testAccounts.js'
import type { EthSignTransactionParams } from '@tevm/actions-types'
import { describe, expect, it } from 'bun:test'
import { parseGwei } from 'viem'

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
			await ethSignTransactionHandler({ accounts: testAccounts, chainId: 10n })(
				transaction,
			),
		).toMatchSnapshot()
	})
	it("should throw an error if account doesn't exist", async () => {
		expect(
			ethSignTransactionHandler({ accounts: testAccounts, chainId: 10n })({
				...transaction,
				from: `0x${'69'.repeat(20)}`,
			}),
		).rejects.toThrow()
	})
})
