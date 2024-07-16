import { SimpleContract } from '@tevm/contract'
import { type Address, type Client, createClient } from 'viem'
import { getBlockNumber } from 'viem/actions'
import { beforeEach, describe, expect, it } from 'vitest'
import type { TevmTransport } from './TevmTransport.js'
import { createTevmTransport } from './createTevmTransport.js'
import { tevmContract } from './tevmContract.js'
import { tevmDeploy } from './tevmDeploy.js'
import { tevmMine } from './tevmMine.js'

let client: Client<TevmTransport>
let contractAddress: Address

beforeEach(async () => {
	client = createClient({
		transport: createTevmTransport(),
	})
})

describe('tevmMine', () => {
	it('should mine a block and update the block number', async () => {
		// Deploy the contract
		const deployResult = await tevmDeploy(client, {
			bytecode: SimpleContract.bytecode,
			abi: SimpleContract.abi,
			args: [42n], // Constructor argument
		})

		// Verify the contract's deployment address
		expect(deployResult.createdAddress).toBeDefined()
		contractAddress = deployResult.createdAddress as Address

		// Mine a block to include the deployment transaction
		await tevmMine(client, { blockCount: 1 })

		// Get the block number
		const blockNumber = await getBlockNumber(client)
		expect(blockNumber).toBe(1n)

		// Interact with the deployed contract
		const contract = SimpleContract.withAddress(contractAddress)
		const result = await tevmContract(client, contract.read.get())

		// Verify the interaction result
		expect(result.data).toBe(42n)
	})
})
