import { describe, expect, it } from 'bun:test'
import { optimism } from '@tevm/common'
import { SimpleContract } from '@tevm/contract'
import { walletActions } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { createMemoryClient } from '../index.js'

const TEVM_TEST_ACCOUNTS = ['0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'] as const

describe('using MemoryClient as viem signer', () => {
	it('should be able to pass in an account', async () => {
		const client = createMemoryClient({
			common: optimism,
			account: privateKeyToAccount(TEVM_TEST_ACCOUNTS[0]),
		}).extend(walletActions)

		const deployResult = await client.tevmDeploy(SimpleContract.deploy(2n))

		if (!deployResult.createdAddress) {
			throw new Error('No address created')
		} else {
		}
		expect(deployResult.createdAddresses).toEqual(new Set(['0x5FbDB2315678afecb367f032d93F642f64180aa3']))
		await client.tevmMine()
		const contract = SimpleContract.withAddress(deployResult.createdAddress)
		expect(await client.readContract(contract.read.get())).toEqual(2n)
		expect(await client.writeContract(contract.write.set(42n))).toBe('0x')
		// expect(await client.readContract(contract.read.get())).toEqual(42n)
	})
})
