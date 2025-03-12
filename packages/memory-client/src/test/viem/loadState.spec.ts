import { beforeEach, describe, expect, it } from 'vitest'
import { SimpleContract } from '@tevm/contract'
import { type Hex } from '@tevm/utils'
import type { MemoryClient } from '../../MemoryClient.js'
import { createMemoryClient } from '../../createMemoryClient.js'
import type { DumpStateResult } from '@tevm/actions'

let mc: MemoryClient
let deployTxHash: Hex
let c = {
	simpleContract: SimpleContract.withAddress(`0x${'00'.repeat(20)}`),
}
let savedState: DumpStateResult

beforeEach(async () => {
	// Create first client and set up state
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
	c = {
		simpleContract: SimpleContract.withAddress(deployResult.createdAddress),
	}
	if (!deployResult.txHash) {
		throw new Error('txHash not found')
	}
	deployTxHash = deployResult.txHash
	await mc.tevmMine()
	
	// Set a value in the contract
	await c.simpleContract.write.setValue([999n])
	await mc.tevmMine()
	
	// Save state for later use in tests
	savedState = await mc.tevmDumpState()
})

describe('loadState', () => {
	it('should restore state structure correctly', async () => {
		// Create a fresh client
		const newClient = createMemoryClient()
		await newClient.tevmReady()
		
		// Load the saved state
		const result = await newClient.tevmLoadState(savedState)
		
		// Check the result
		expect(result).toBeDefined()
		expect(result.success).toBe(true)
	})

	it('should restore contract code and allow interaction', async () => {
		// Create a fresh client
		const newClient = createMemoryClient()
		await newClient.tevmReady()
		
		// Load the saved state
		await newClient.tevmLoadState(savedState)
		
		// Create contract instance on new client
		const contractAddress = c.simpleContract.address
		const newContract = SimpleContract.withAddress(contractAddress)
		
		// Verify contract code exists
		const codeResult = await newClient.getBytecode({
			address: contractAddress,
		})
		expect(codeResult).toBeDefined()
		expect(codeResult).not.toBe('0x')
		expect(codeResult.length > 2).toBe(true)
		
		// Verify we can call contract methods
		const value = await newContract.read.getValue({ client: newClient })
		expect(value).toBe(999n)
	})

	it('should restore contract storage values', async () => {
		// Create a fresh client
		const newClient = createMemoryClient()
		await newClient.tevmReady()
		
		// Load the saved state
		await newClient.tevmLoadState(savedState)
		
		// Create contract instance on new client
		const contractAddress = c.simpleContract.address
		const newContract = SimpleContract.withAddress(contractAddress)
		
		// Check that storage values are restored
		const storageValue = await newClient.getStorageAt({
			address: contractAddress,
			slot: '0x0', // First storage slot holds the value in SimpleContract
		})
		expect(storageValue).toBeDefined()
		expect(storageValue).not.toBe('0x0')
		
		// Can also check via contract call
		const value = await newContract.read.getValue({ client: newClient })
		expect(value).toBe(999n)
	})

	it('should restore blockchain state including block number', async () => {
		// Create a fresh client
		const newClient = createMemoryClient()
		await newClient.tevmReady()
		
		// Get current block number in original client
		const originalBlockNumber = await mc.getBlockNumber()
		
		// Load the saved state to new client
		await newClient.tevmLoadState(savedState)
		
		// Check that block number matches
		const newBlockNumber = await newClient.getBlockNumber()
		expect(newBlockNumber).toBe(originalBlockNumber)
	})

	it('should allow further state changes after loading', async () => {
		// Create a fresh client
		const newClient = createMemoryClient()
		await newClient.tevmReady()
		
		// Load the saved state
		await newClient.tevmLoadState(savedState)
		
		// Create contract instance on new client
		const contractAddress = c.simpleContract.address
		const newContract = SimpleContract.withAddress(contractAddress)
		
		// Make additional state changes
		await newContract.write.setValue([1234n], { client: newClient })
		await newClient.tevmMine()
		
		// Verify the value was updated
		const value = await newContract.read.getValue({ client: newClient })
		expect(value).toBe(1234n)
	})
})
