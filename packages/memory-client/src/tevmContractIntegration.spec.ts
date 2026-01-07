import { SimpleContract } from '@tevm/contract'
import { type Address, encodeFunctionData, parseEther } from '@tevm/utils'
import { createClient } from './createClient.js'
import { getBalance } from 'viem/actions'
import { describe, expect, it } from 'vitest'
import { createTevmTransport } from './createTevmTransport.js'
import { tevmCall } from './tevmCall.js'
import { tevmContract } from './tevmContract.js'
import { tevmDeploy } from './tevmDeploy.js'
import { tevmMine } from './tevmMine.js'
import { tevmSetAccount } from './tevmSetAccount.js'

describe('Tevm Contract Integration', () => {
	const testAddress = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' as Address

	it('should deploy and interact with a contract', async () => {
		// Create a client
		const client = createClient({
			transport: createTevmTransport(),
		})

		// Set up a funded account
		await tevmSetAccount(client, {
			address: testAddress,
			balance: parseEther('10'),
			nonce: 0n,
		})

		// Deploy the contract with an initial value
		const initialValue = 42n
		const deployResult = await tevmDeploy(client, {
			bytecode: SimpleContract.bytecode,
			abi: SimpleContract.abi,
			args: [initialValue],
			from: testAddress,
		})

		expect(deployResult.createdAddress).toBeDefined()
		const contractAddress = deployResult.createdAddress as Address

		// Mine a block to include the deployment
		await tevmMine(client, { blockCount: 1 })

		// Create a contract instance
		const contract = SimpleContract.withAddress(contractAddress)

		// Read the initial value using tevmContract
		const readResult = await tevmContract(client, contract.read.get())
		expect(readResult.data).toBe(initialValue)

		// Update the value using tevmCall
		const newValue = 99n
		// Encode the function call data
		const callData = encodeFunctionData({
			abi: SimpleContract.abi,
			functionName: 'set',
			args: [newValue],
		})

		// Call with createTransaction=true to update state
		await tevmCall(client, {
			to: contractAddress,
			data: callData,
			from: testAddress,
			createTransaction: true,
		})

		// Mine a block to include the transaction
		await tevmMine(client, { blockCount: 1 })

		// Read the updated value
		const updatedResult = await tevmContract(client, contract.read.get())
		expect(updatedResult.data).toBe(newValue)
	})

	it('should support value transfers to contracts', async () => {
		// Create a client
		const client = createClient({
			transport: createTevmTransport(),
		})

		// Set up a funded account
		await tevmSetAccount(client, {
			address: testAddress,
			balance: parseEther('10'),
			nonce: 0n,
		})

		// Create a contract address (without deployment to simplify test)
		const contractAddress = '0x1111111111111111111111111111111111111111' as Address

		// Check initial contract balance
		const initialBalance = await getBalance(client, { address: contractAddress })
		expect(initialBalance).toBe(0n)

		// Send value using a basic transaction without any contract interaction
		const value = parseEther('1')

		// Use tevmCall with empty data and value
		await tevmCall(client, {
			to: contractAddress,
			data: '0x', // empty data for a simple value transfer
			from: testAddress,
			value,
			createTransaction: true,
		})

		// Mine to include the transaction
		await tevmMine(client, { blockCount: 1 })

		// Check updated contract balance
		const updatedBalance = await getBalance(client, { address: contractAddress })
		expect(updatedBalance).toBe(value)
	})

	it('should support gas limit specifications', async () => {
		// Create a client
		const client = createClient({
			transport: createTevmTransport(),
		})

		// Set up a funded account
		await tevmSetAccount(client, {
			address: testAddress,
			balance: parseEther('10'),
			nonce: 0n,
		})

		// Deploy the contract
		const deployResult = await tevmDeploy(client, {
			bytecode: SimpleContract.bytecode,
			abi: SimpleContract.abi,
			args: [0n],
			from: testAddress,
		})

		expect(deployResult.createdAddress).toBeDefined()
		const contractAddress = deployResult.createdAddress as Address

		// Mine a block to include the deployment
		await tevmMine(client, { blockCount: 1 })

		// Use a custom gas limit for the transaction
		const customGasLimit = 100000n
		const callData = encodeFunctionData({
			abi: SimpleContract.abi,
			functionName: 'set',
			args: [999n],
		})

		// Call with createTransaction to make a state change
		const result = await tevmCall(client, {
			to: contractAddress,
			data: callData,
			from: testAddress,
			gas: customGasLimit,
			createTransaction: true,
		})

		// Mine the block with the transaction
		await tevmMine(client, { blockCount: 1 })

		// Verify the result exists
		expect(result).toBeDefined()

		// Check the contract state was updated
		const contract = SimpleContract.withAddress(contractAddress)
		const readResult = await tevmContract(client, contract.read.get())
		expect(readResult.data).toBe(999n)
	})

	it('should handle consecutive state changes', async () => {
		// Create a client
		const client = createClient({
			transport: createTevmTransport(),
		})

		// Set up a funded account
		await tevmSetAccount(client, {
			address: testAddress,
			balance: parseEther('10'),
			nonce: 0n,
		})

		// Deploy the contract
		const deployResult = await tevmDeploy(client, {
			bytecode: SimpleContract.bytecode,
			abi: SimpleContract.abi,
			args: [0n],
			from: testAddress,
		})

		expect(deployResult.createdAddress).toBeDefined()
		const contractAddress = deployResult.createdAddress as Address

		// Mine a block to include the deployment
		await tevmMine(client, { blockCount: 1 })

		// Create a contract instance
		const contract = SimpleContract.withAddress(contractAddress)

		// Execute multiple state changes
		const values = [10n, 20n, 30n, 40n, 50n]
		for (const value of values) {
			// Encode the function call data
			const callData = encodeFunctionData({
				abi: SimpleContract.abi,
				functionName: 'set',
				args: [value],
			})

			// Call with createTransaction=true to update state
			await tevmCall(client, {
				to: contractAddress,
				data: callData,
				from: testAddress,
				createTransaction: true,
			})

			await tevmMine(client, { blockCount: 1 })

			// Verify the state change took effect
			const result = await tevmContract(client, contract.read.get())
			expect(result.data).toBe(value)
		}

		// Final value should be the last one set
		const finalResult = await tevmContract(client, contract.read.get())
		expect(finalResult.data).toBe(values[values.length - 1])
	})
})
