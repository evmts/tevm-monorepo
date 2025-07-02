import { mainnet } from '@tevm/common'
import { SimpleContract } from '@tevm/contract'
import { createTestSnapshotTransport } from '@tevm/test-node'
import { transports } from '@tevm/test-utils'
import { type Address, testActions } from 'viem'
import { beforeEach, describe, expect, it } from 'vitest'
import { createMemoryClient } from '../createMemoryClient.js'

let client: MemoryClient

beforeEach(async () => {
	const cachedTransport = createTestSnapshotTransport({
		transport: transports.mainnet,
		test: {
			autosave: 'onRequest',
		},
	})
	client = createMemoryClient({
		common: mainnet,
		fork: {
			transport: cachedTransport,
		},
	})
	await client.extend(testActions({ mode: 'anvil' })).mine({ blocks: 1 })
})

describe('tevmDeploy', () => {
	it('should deploy a contract and interact with it', async () => {
		// Deploy the contract
		const deployResult = await client.tevmDeploy({
			bytecode: SimpleContract.bytecode,
			abi: SimpleContract.abi,
			args: [42n], // Constructor argument
		})

		// Verify the contract's deployment address
		expect(deployResult.createdAddress).toBeDefined()

		// Mine a block to include the deployment transaction
		await client.tevmMine()

		// Interact with the deployed contract
		const contract = SimpleContract.withAddress(deployResult.createdAddress as Address)
		const result = await client.tevmContract({
			abi: contract.abi,
			functionName: 'get',
			to: deployResult.createdAddress as Address,
		})

		// Verify the interaction result
		expect(result.data).toBe(42n)
	})
})
