import { createMemoryClient } from 'tevm'
import { requestEip1193 } from 'tevm/decorators'
import { BrowserProvider, ContractFactory, Wallet, formatEther, parseEther } from 'ethers'
import { describe, expect, it } from 'vitest'

const counterAbi = ['function number() view returns (uint256)', 'function increment() public'] as const

const counterBytecode =
	'0x608060405234801561001057600080fd5b5060f78061001f6000396000f3fe6080604052348015600f57600080fd5b5060043610603c5760003560e01c80633fb5c1cb1460415780638381f58a146053578063d09de08a14606d575b600080fd5b6051604c3660046083565b600055565b005b605b60005481565b60405190815260200160405180910390f35b6051600080549080607c83609b565b9190505550565b600060208284031215609457600080fd5b5035919050565b60006001820160ba57634e487b7160e01b600052601160045260246000fd5b506001019056fea2646970667358221220d5fb46adf6ce0cfd90fa4324ffd8c48b0fc6fb6c4cac9ca2c69c97e25f355c9d64736f6c63430008110033'

const setupEthersClient = async () => {
	const client = createMemoryClient()
	client.transport.tevm.extend(requestEip1193())
	await client.tevmReady()

	const provider = new BrowserProvider(client.transport.tevm, undefined, {
		cacheTimeout: -1,
	})
	const signer = Wallet.createRandom().connect(provider)

	await client.setBalance({
		address: signer.address,
		value: parseEther('10'),
	})

	return { client, provider, signer }
}

describe('Ethers example docs', () => {
	it('creates an ethers provider and funds a wallet with Tevm test actions', async () => {
		const { provider, signer } = await setupEthersClient()

		expect(await provider.getBlockNumber()).toBe(0)
		expect(formatEther(await provider.getBalance(signer.address))).toBe('10.0')
	})

	it('deploys and writes to a contract through ethers', async () => {
		const { client, provider, signer } = await setupEthersClient()
		const factory = new ContractFactory(counterAbi, counterBytecode, signer)
		const deployment = await factory.deploy()

		await client.mine({ blocks: 1 })

		const counter = await deployment.waitForDeployment()
		expect(await counter.getAddress()).toMatch(/^0x[a-fA-F0-9]{40}$/)
		expect(await counter.number()).toBe(0n)
		expect(await provider.getTransactionCount(signer.address)).toBe(1)

		const tx = await counter.increment()

		await client.mine({ blocks: 1 })
		await tx.wait()

		expect(await counter.number()).toBe(1n)
		expect(await provider.getTransactionCount(signer.address)).toBe(2)
	})
})
