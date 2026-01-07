import { SimpleContract } from '@tevm/contract'
import { type Hex } from '@tevm/utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { createClient, publicActions, testActions } from '../../createClient.js'
import { createMemoryClient } from '../../createMemoryClient.js'
import { createTevmTransport } from '../../createTevmTransport.js'
import type { MemoryClient } from '../../MemoryClient.js'

let mc: MemoryClient
let _deployTxHash: Hex
let _c = {
	simpleContract: SimpleContract.withAddress(`0x${'00'.repeat(20)}`),
}

beforeEach(async () => {
	mc = createMemoryClient()
	await mc.tevmReady()
	const deployResult = await mc.tevmDeploy({
		bytecode: SimpleContract.bytecode,
		abi: SimpleContract.abi,
		args: [420n],
	})
	if (!deployResult.createdAddress) {
		throw new Error('contract never deployed')
	}
	_c = {
		simpleContract: SimpleContract.withAddress(deployResult.createdAddress),
	}
	if (!deployResult.txHash) {
		throw new Error('txHash not found')
	}
	_deployTxHash = deployResult.txHash
	await mc.tevmMine()
})

describe('setBlockGasLimit', () => {
	it('should set a new block gas limit', async () => {
		// Get the latest block to check initial gas limit
		const initialBlock = await mc.getBlock()
		const initialGasLimit = initialBlock.gasLimit

		// Set a new gas limit that's different
		const newGasLimit = 15_000_000n
		expect(newGasLimit).not.toBe(initialGasLimit)
		await mc.setBlockGasLimit({ gasLimit: newGasLimit })

		// Mine a new block to get the updated gas limit
		await mc.mine({ blocks: 1 })

		// Check the gas limit of the new block
		const latestBlock = await mc.getBlock()
		expect(latestBlock.gasLimit).toBe(newGasLimit)
	})

	it('should maintain the new block gas limit for future blocks', async () => {
		// Set a specific gas limit
		const newGasLimit = 10_000_000n
		await mc.setBlockGasLimit({ gasLimit: newGasLimit })

		// Mine multiple blocks
		await mc.mine({ blocks: 3 })

		// Check the gas limit in the latest block
		const latestBlock = await mc.getBlock()
		expect(latestBlock.gasLimit).toBe(newGasLimit)

		// Check gas limit in previous blocks
		const block1 = await mc.getBlock({ blockNumber: latestBlock.number - 1n })
		const block2 = await mc.getBlock({ blockNumber: latestBlock.number - 2n })

		expect(block1.gasLimit).toBe(newGasLimit)
		expect(block2.gasLimit).toBe(newGasLimit)
	})

	it('should support very low gas limits', async () => {
		// Set a very low gas limit
		const lowGasLimit = 100_000n
		await mc.setBlockGasLimit({ gasLimit: lowGasLimit })

		// Mine a block
		await mc.mine({ blocks: 1 })

		// Check the gas limit was set correctly
		const block = await mc.getBlock()
		expect(block.gasLimit).toBe(lowGasLimit)
	})

	it('should support very high gas limits', async () => {
		// Set a very high gas limit
		const highGasLimit = 30_000_000n
		await mc.setBlockGasLimit({ gasLimit: highGasLimit })

		// Mine a block
		await mc.mine({ blocks: 1 })

		// Check the gas limit was set correctly
		const block = await mc.getBlock()
		expect(block.gasLimit).toBe(highGasLimit)
	})

	it('should work with traditional client API extended with test actions', async () => {
		// Create a client extended with test actions and public actions
		const client = createClient({
			transport: createTevmTransport({}),
		})
			.extend(testActions({ mode: 'anvil' }))
			.extend(publicActions)

		// Set block gas limit
		const newGasLimit = 8_000_000n
		await client.setBlockGasLimit({ gasLimit: newGasLimit })

		// Mine a block
		await client.mine({ blocks: 1 })

		// Check the gas limit of the new block
		const latestBlock = await client.getBlock()
		expect(latestBlock.gasLimit).toBe(newGasLimit)
	})
})
