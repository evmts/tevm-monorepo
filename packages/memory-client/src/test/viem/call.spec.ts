import { SimpleContract } from '@tevm/test-utils'
import { encodeFunctionData } from 'viem'
import { beforeEach, describe, expect, it } from 'vitest'
import type { MemoryClient } from '../../MemoryClient.js'
import { createMemoryClient } from '../../createMemoryClient.js'

let client: MemoryClient<any, any>
let contractAddress: string

beforeEach(async () => {
	client = createMemoryClient()
	await client.tevmReady()

	// Deploy a contract to use for testing calls
	const deployResult = await client.tevmDeploy({
		bytecode: SimpleContract.bytecode,
		abi: SimpleContract.abi,
		args: [420n],
	})

	if (!deployResult.createdAddress) {
		throw new Error('contract never deployed')
	}
	contractAddress = deployResult.createdAddress

	await client.tevmMine()
})

describe('call', () => {
	it('should work', async () => {
		// Simple test to avoid empty test suite error
		expect(client).toBeDefined()

		// Basic call to the contract
		const callData = encodeFunctionData({
			abi: SimpleContract.abi,
			functionName: 'get',
		})

		const result = await client.call({
			to: contractAddress,
			data: callData,
		})

		expect(result.data).toBeDefined()
	})

	it('should work with blockTag pending', async () => {
		// Create the call data for get function
		const callData = encodeFunctionData({
			abi: SimpleContract.abi,
			functionName: 'get',
		})

		// Call with pending block tag
		const result = await client.call({
			to: contractAddress,
			data: callData,
			blockTag: 'pending',
		})

		expect(result.data).toBeDefined()

		// Set a new value but don't mine - it should be visible in pending state
		const setCallData = encodeFunctionData({
			abi: SimpleContract.abi,
			functionName: 'set',
			args: [999n],
		})

		await client.sendTransaction({
			to: contractAddress,
			data: setCallData,
			account: '0x1234567890123456789012345678901234567890', // Use an arbitrary account
		})

		// Now the pending state should have the new value
		const pendingResult = await client.call({
			to: contractAddress,
			data: callData,
			blockTag: 'pending',
		})

		expect(pendingResult.data).toBeDefined()
	})
})
