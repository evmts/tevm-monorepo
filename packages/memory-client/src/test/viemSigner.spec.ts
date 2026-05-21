import { optimism } from '@tevm/common'
import { SimpleContract } from '@tevm/contract'
import { walletActions } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { describe, expect, it } from 'vitest'
import { createMemoryClient } from '../index.js'

// Same accounts anvil and hardhat prefund
const TEVM_TEST_ACCOUNTS = [
	'0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
	'0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
] as const

describe('using MemoryClient as viem signer', () => {
	it('should be able to pass in an account and use viem wallet api to interact with tevm', async () => {
		const walletClient = createMemoryClient({
			common: optimism,
			account: privateKeyToAccount(TEVM_TEST_ACCOUNTS[1]),
		}).extend(walletActions)

		const txHash = await walletClient.deployContract(SimpleContract.deploy(2n))
		await walletClient.tevmMine()

		const transaction = await walletClient.getTransaction({ hash: txHash })
		expect(transaction.hash).toBe(txHash)

		const contract = SimpleContract.withAddress('0x8464135c8f25da09e49bc8782676a84730c318bc')

		expect(await walletClient.readContract(contract.read.get())).toEqual(2n)
		expect(await walletClient.writeContract(contract.write.set(420n))).toMatch(/^0x[a-fA-F0-9]{64}$/)
		await walletClient.tevmMine()
		expect(await walletClient.readContract(contract.read.get())).toEqual(420n)
	})

	it('should be robust wrt nonces', async () => {
		const client = createMemoryClient({
			common: optimism,
			account: privateKeyToAccount(TEVM_TEST_ACCOUNTS[1]),
		}).extend(walletActions)

		const deployResult = await client.tevmDeploy(SimpleContract.deploy(2n))

		if (!deployResult.createdAddress) {
			throw new Error('No address created')
		}
		expect(deployResult.createdAddresses).toEqual(new Set(['0x5FbDB2315678afecb367f032d93F642f64180aa3']))
		await client.tevmMine()
		const contract = SimpleContract.withAddress(deployResult.createdAddress)
		expect(await client.readContract(contract.read.get())).toEqual(2n)
		expect(await client.writeContract(contract.write.set(420n))).toMatch(/^0x[a-fA-F0-9]{64}$/)
		await client.tevmMine()
		expect(await client.readContract(contract.read.get())).toEqual(420n)

		// Do it again to test that the nonce is being incremented
		expect(await client.writeContract(contract.write.set(69n))).toMatch(/^0x[a-fA-F0-9]{64}$/)
		await client.tevmMine()
		expect(await client.readContract(contract.read.get())).toEqual(69n)

		// Do it again but sending multiple tx in a single block
		expect(await client.writeContract(contract.write.set(100n))).toMatch(/^0x[a-fA-F0-9]{64}$/)
		expect(await client.writeContract(contract.write.set(1000n))).toMatch(/^0x[a-fA-F0-9]{64}$/)
		await client.tevmMine()
		expect(await client.readContract(contract.read.get())).toEqual(1000n)
	})
})
