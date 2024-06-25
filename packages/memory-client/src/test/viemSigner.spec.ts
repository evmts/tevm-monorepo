import { describe, expect, it } from 'bun:test'
import { createMemoryClient } from '../index.js'
import { privateKeyToAccount } from 'viem/accounts'
import { walletActions } from 'viem'

const TEVM_TEST_ACCOUNTS = ['0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'] as const

describe('using MemoryClient as viem signer', () => {
	it('should be able to pass in an account', async () => {
		const client = createMemoryClient({
			account: privateKeyToAccount(TEVM_TEST_ACCOUNTS[0]),
		}).extend(walletActions)
		expect(await client.sendTransaction({ to: `0x${'0420'.repeat(10)}`, value: 420n })).toMatchSnapshot()
		expect(await client.getBalance({ address: `0x${'0420'.repeat(10)}` }))
	})
})
