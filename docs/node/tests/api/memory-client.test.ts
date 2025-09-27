// @ts-nocheck

import { createMemoryClient, http } from 'tevm'
import { optimism } from 'tevm/common'
import { ERC20, SimpleContract } from 'tevm/contract'
import { privateKeyToAccount } from 'viem/accounts'
import { describe, expect, it } from 'vitest'

describe('Memory Client Documentation Examples', () => {
	describe('Basic Usage', () => {
		it('should create a simple memory client', async () => {
			const client = createMemoryClient()
			const blockNumber = await client.getBlockNumber()
			expect(blockNumber).toBe(0n)
		})

		it('should create a forked client', async () => {
			const forkedClient = createMemoryClient({
				fork: {
					transport: http('https://mainnet.optimism.io')({}),
					blockTag: 'latest',
				},
				common: optimism,
			})
			expect(forkedClient).toBeDefined()
		})
	})

	describe('Contract Interactions', () => {
		it('should deploy and interact with SimpleContract', async () => {
			const signerAccount = privateKeyToAccount('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
			const memoryClient = createMemoryClient({
				account: signerAccount,
			})

			// Deploy SimpleContract with initial value = 2
			const txHash = await memoryClient.deployContract(SimpleContract.deploy(2n))
			await memoryClient.mine({ blocks: 1 })

			// Get the deployment receipt
			const receipt = await memoryClient.getTransactionReceipt({ hash: txHash })
			expect(receipt.contractAddress).toBeDefined()
			if (!receipt.contractAddress) throw new Error('Deployment failed')

			// Read from the contract
			const contract = SimpleContract.withAddress(receipt.contractAddress)
			const currentValue = await memoryClient.readContract(contract.read.get())
			expect(currentValue).toBe(2n)

			// Write to the contract
			const _setHash = await memoryClient.writeContract(contract.write.set(420n))
			await memoryClient.mine({ blocks: 1 })

			const newValue = await memoryClient.readContract(contract.read.get())
			expect(newValue).toBe(420n)
		})

		it('should interact with ERC20 contract on forked chain', async () => {
			const memoryClient = createMemoryClient({
				fork: {
					transport: http('https://mainnet.optimism.io')({}),
					blockTag: 'latest',
				},
				common: optimism,
			})

			// DAI on Optimism
			const Dai = ERC20.withAddress('0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1')

			// Read balance of an address
			const balance = await memoryClient.readContract(Dai.read.balanceOf('0xf0d4c12a5768d806021f80a262b4d39d26c58b8d'))
			expect(balance).toBeDefined()
		})
	})

	describe('Test Actions', () => {
		it('should support test actions', async () => {
			const client = createMemoryClient()

			// Test time manipulation
			await client.increaseTime({ seconds: 3600 })

			// Test snapshots
			const snap = await client.snapshot()
			expect(snap).toBeDefined()

			await client.revert({ id: snap })
		})
	})

	describe('Mining Modes', () => {
		it('should support auto mining configuration', async () => {
			const autoMiningClient = createMemoryClient({
				miningConfig: { type: 'auto' },
			})
			expect(autoMiningClient).toBeDefined()
		})
	})
})
