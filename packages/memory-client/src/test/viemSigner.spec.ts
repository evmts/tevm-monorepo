import { describe, expect, it } from 'bun:test'
import { walletActions } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { createMemoryClient } from '../index.js'
import { optimism } from '@tevm/common'
import { SimpleContract } from '@tevm/contract'

const TEVM_TEST_ACCOUNTS = ['0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'] as const

describe('using MemoryClient as viem signer', () => {
	it('should be able to pass in an account', async () => {
		const client = createMemoryClient({
			common: optimism,
			account: privateKeyToAccount(TEVM_TEST_ACCOUNTS[0]),
		}).extend(walletActions)

		const deployResult = await client.tevmDeploy(SimpleContract.deploy())

		if (!deployResult.createdAddress) {
			throw new Error('No address created')
		}
		const contract = SimpleContract.withAddress(deployResult.createdAddress)

		expect(await client.writeContract(contract.write.set(42n))).toMatchSnapshot()
		expect(await client.readContract(contract.read.get())).toMatchSnapshot()
	})
})
