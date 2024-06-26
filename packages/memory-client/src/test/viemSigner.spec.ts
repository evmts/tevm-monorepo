import { describe, expect, it } from 'bun:test'
import { optimism } from '@tevm/common'
import { SimpleContract } from '@tevm/contract'
import { walletActions } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { createMemoryClient } from '../index.js'

const TEVM_TEST_ACCOUNTS = [
	'0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
	'0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
] as const

describe('using MemoryClient as viem signer', () => {
	it('should be able to pass in an account', async () => {
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
		expect(await client.writeContract(contract.write.set(420n))).toBe(
			'0xb9efaaa8a2873f58058a8f426692c7774453e05664f56fbd925d15c063de5e54',
		)
		await client.tevmMine()
		expect(await client.readContract(contract.read.get())).toEqual(420n)

		// Do it again to test that the nonce is being incremented
		expect(await client.writeContract(contract.write.set(69n))).toBe(
			'0x642df8bb60feddc3589b9762a7824b031a2ee4e6dad0b47b66ef732c07511b06',
		)
		await client.tevmMine()
		expect(await client.readContract(contract.read.get())).toEqual(69n)

		// Do it again but sending multiple tx in a single block
		expect(await client.writeContract(contract.write.set(100n))).toBe(
			'0x4bff729330d84c1e868f16b8f38d9313c38db9f54f7bcc0a9a06a0a32e0fb54f',
		)
		expect(await client.writeContract(contract.write.set(1000n))).toBe(
			'0x5b8f2b6d26b16a90dccd80f9478f28beb7d8908555378d6d8b2cadde86791b96',
		)
		await client.tevmMine()
		expect(await client.readContract(contract.read.get())).toEqual(1000n)
	})
})
