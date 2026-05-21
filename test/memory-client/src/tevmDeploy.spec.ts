import { mineHandler } from '@tevm/actions'
import { SimpleContract } from '@tevm/contract'
import { type Address, type Client, createClient, isAddress, isHex } from 'viem'
import { beforeEach, describe, expect, it } from 'vitest'
import { createTevmTransport } from '@tevm/memory-client'
import type { TevmTransport } from '@tevm/memory-client'
import { tevmContract } from '@tevm/memory-client'
import { tevmDeploy } from '@tevm/memory-client'
import { tevmMine } from '@tevm/memory-client'
import { tevmSetAccount } from '@tevm/memory-client'

let client: Client<TevmTransport>

beforeEach(async () => {
	client = createClient({
		transport: createTevmTransport({}),
	})
})

describe('tevmDeploy', () => {
	it('should deploy a contract and interact with it', { timeout: 10_000 }, async () => {
		// Deploy the contract
		const deployResult = await tevmDeploy(client, {
			bytecode: SimpleContract.bytecode,
			abi: SimpleContract.abi,
			args: [42n], // Constructor argument
			})

			// Verify the contract's deployment address
			const createdAddress = deployResult.createdAddress
			expect(createdAddress).toBeDefined()
			if (!createdAddress) throw new Error('Expected tevmDeploy to return a createdAddress')
			expect(isAddress(createdAddress)).toBe(true)

			// Mine a block to include the deployment transaction
			await mineHandler(client.transport.tevm)({ blockCount: 1 })

			// Interact with the deployed contract
			const contract = SimpleContract.withAddress(createdAddress as Address)
		const result = await tevmContract(client, contract.read.get())

		// Verify the interaction result
		expect(result.data).toBe(42n)
	})

	it('should handle errors gracefully during deployment', async () => {
		try {
			await tevmDeploy(client, {
				bytecode: '0xinvalidbytecode',
				abi: SimpleContract.abi,
			})
		} catch (error) {
			expect(error).toBeDefined()
		}
	})

	it('should return the transaction hash of the deployment', async () => {
		const deployResult = await tevmDeploy(client, {
			bytecode: SimpleContract.bytecode,
			abi: SimpleContract.abi,
			args: [42n], // Constructor argument
		})

		expect(isHex(deployResult.txHash)).toBe(true)
	})

	it('should deploy a contract with createTransaction set to true', async () => {
		const deployResult = await tevmDeploy(client, {
			bytecode: SimpleContract.bytecode,
			abi: SimpleContract.abi,
			args: [42n], // Constructor argument
				createTransaction: true,
			})

			const createdAddress = deployResult.createdAddress
			expect(createdAddress).toBeDefined()
			if (!createdAddress) throw new Error('Expected tevmDeploy to return a createdAddress')
			expect(isAddress(createdAddress)).toBe(true)
			await tevmMine(client, { blockCount: 1 })
		})

	it('should deploy a contract using a custom sender address', async () => {
		const senderAddress = '0x0000000000000000000000000000000000000001'
		await tevmSetAccount(client, { address: senderAddress, balance: 1_000_000_000_000_000_000n })
		const deployResult = await tevmDeploy(client, {
			bytecode: SimpleContract.bytecode,
			abi: SimpleContract.abi,
			args: [42n], // Constructor argument
				from: senderAddress,
			})

			const createdAddress = deployResult.createdAddress
			expect(createdAddress).toBeDefined()
			if (!createdAddress) throw new Error('Expected tevmDeploy to return a createdAddress')
			expect(isAddress(createdAddress)).toBe(true)
			await tevmMine(client, { blockCount: 1 })
		})
	})
