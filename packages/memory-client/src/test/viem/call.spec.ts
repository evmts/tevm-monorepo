import { SimpleContract } from '@tevm/test-utils'
import { encodeFunctionData, parseEther } from 'viem'
import { beforeEach, describe, expect, it } from 'vitest'
import type { MemoryClient } from '../../MemoryClient.js'
import { createMemoryClient } from '../../createMemoryClient.js'

let client: MemoryClient<any, any>
let contractAddress: string
const TEST_ACCOUNT = '0x1234567890123456789012345678901234567890'

beforeEach(async () => {
	client = createMemoryClient()
	await client.tevmReady()

	// Set up test account with enough balance for transactions
	await client.setBalance({
		address: TEST_ACCOUNT,
		value: parseEther('10'), // 10 ETH should be enough
	})

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

	it.skip('should work with blockTag pending', async () => {
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
			account: TEST_ACCOUNT, // Use our initialized account
		})

		// Now the pending state should have the new value
		const pendingResult = await client.call({
			to: contractAddress,
			data: callData,
			blockTag: 'pending',
		})

		// Latest call should still have the old value
		const latestResult = await client.call({
			to: contractAddress,
			data: callData,
			blockTag: 'latest',
		})

		expect(pendingResult.data).toBeDefined()
		expect(latestResult.data).toBeDefined()

		// Verify that the pending call returns the updated value and latest call returns the original value
		expect(pendingResult.data).not.toEqual(latestResult.data)
	})

	it.skip('should reflect multiple pending transactions', async () => {
		// Create the call data for get function
		const callData = encodeFunctionData({
			abi: SimpleContract.abi,
			functionName: 'get',
		})

		// Initial value check
		const initialResult = await client.call({
			to: contractAddress,
			data: callData,
		})

		// Send first transaction but don't mine
		const setCallData1 = encodeFunctionData({
			abi: SimpleContract.abi,
			functionName: 'set',
			args: [888n],
		})

		await client.sendTransaction({
			to: contractAddress,
			data: setCallData1,
			account: TEST_ACCOUNT, // Use our initialized account
		})

		// Check pending state after first transaction
		const pendingResult1 = await client.call({
			to: contractAddress,
			data: callData,
			blockTag: 'pending',
		})

		// Send second transaction but don't mine
		const setCallData2 = encodeFunctionData({
			abi: SimpleContract.abi,
			functionName: 'set',
			args: [999n],
		})

		await client.sendTransaction({
			to: contractAddress,
			data: setCallData2,
			account: TEST_ACCOUNT, // Use our initialized account
		})

		// Check pending state after second transaction
		const pendingResult2 = await client.call({
			to: contractAddress,
			data: callData,
			blockTag: 'pending',
		})

		// Mine the transactions
		await client.tevmMine()

		// Check state after mining
		const finalResult = await client.call({
			to: contractAddress,
			data: callData,
		})

		// Verify the sequence of results
		expect(initialResult.data).toBeDefined()
		expect(pendingResult1.data).toBeDefined()
		expect(pendingResult2.data).toBeDefined()
		expect(finalResult.data).toBeDefined()

		// Second pending result should match final result
		expect(pendingResult2.data).toEqual(finalResult.data)
		// First pending result should differ from final result
		expect(pendingResult1.data).not.toEqual(finalResult.data)
	})
})
