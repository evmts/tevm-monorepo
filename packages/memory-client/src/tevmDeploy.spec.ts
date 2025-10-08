import { mineHandler } from '@tevm/actions'
import { optimism } from '@tevm/common'
import { SimpleContract } from '@tevm/contract'
import { createCachedOptimismTransport } from '@tevm/test-utils'
import { type Address, type Client, createClient } from 'viem'
import { beforeEach, describe, expect, it } from 'vitest'
import { createTevmTransport } from './createTevmTransport.js'
import type { TevmTransport } from './TevmTransport.js'
import { tevmContract } from './tevmContract.js'
import { tevmDeploy } from './tevmDeploy.js'
import { tevmMine } from './tevmMine.js'

let client: Client<TevmTransport>
const cachedTransport = createCachedOptimismTransport()

beforeEach(async () => {
	client = createClient({
		transport: createTevmTransport({
			fork: { transport: cachedTransport, blockTag: 142153711n },
		}),
		chain: optimism,
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
		expect(deployResult.createdAddress).toBeAddress()

		// Mine a block to include the deployment transaction
		await mineHandler(client.transport.tevm)({ blockCount: 1 })

		// Interact with the deployed contract
		const contract = SimpleContract.withAddress(deployResult.createdAddress as Address)
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

		expect(deployResult.txHash).toBeHex()
	})

	it('should deploy a contract with createTransaction set to true', async () => {
		const deployResult = await tevmDeploy(client, {
			bytecode: SimpleContract.bytecode,
			abi: SimpleContract.abi,
			args: [42n], // Constructor argument
			createTransaction: true,
		})

		expect(deployResult.createdAddress).toBeAddress()
		await tevmMine(client, { blockCount: 1 })
	})

	it('should deploy a contract using a custom sender address', async () => {
		const senderAddress = '0x0000000000000000000000000000000000000001'
		const deployResult = await tevmDeploy(client, {
			bytecode: SimpleContract.bytecode,
			abi: SimpleContract.abi,
			args: [42n], // Constructor argument
			from: senderAddress,
		})

		expect(deployResult.createdAddress).toBeAddress()
		await tevmMine(client, { blockCount: 1 })
	})
})
