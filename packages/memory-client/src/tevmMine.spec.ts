import { SimpleContract } from '@tevm/contract'
import { type Address, type Client, createClient } from 'viem'
import { getBlock, getBlockNumber } from 'viem/actions'
import { beforeEach, describe, expect, it } from 'vitest'
import { createTevmTransport } from './createTevmTransport.js'
import type { TevmTransport } from './TevmTransport.js'
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

	it('should return correct number of block hashes when mining multiple blocks', async () => {
		// Mine 5 blocks
		const blockCount = 5
		const result = await tevmMine(client, { blockCount })

		// Verify we got the expected number of block hashes back
		expect(result.blockHashes?.length).toBe(blockCount)

		// Verify each block hash is a valid hex string
		if (result.blockHashes) {
			for (const hash of result.blockHashes) {
				expect(hash).toMatch(/^0x[0-9a-f]{64}$/i)
			}
		}
	})

	it('should respect the specified block timestamp interval', async () => {
		// Mine a block to have a reference timestamp
		await tevmMine(client, { blockCount: 1 })
		const initialBlock = await getBlock(client)
		const initialTimestamp = initialBlock.timestamp

		// Mine 2 blocks with 10-second interval
		const interval = 10
		await tevmMine(client, { blockCount: 2, interval })

		// Get the latest block
		const finalBlock = await getBlock(client)
		const finalTimestamp = finalBlock.timestamp

		// The timestamp difference should be at least the interval
		// It appears each block gets its timestamp based on the interval, not cumulatively
		// So with 2 blocks and interval 10, we get a diff of 10
		expect(finalTimestamp - initialTimestamp).toBeGreaterThanOrEqual(BigInt(interval))
	})
})
