import { SimpleContract } from '@tevm/contract'
import { type Address, type Client, createClient, parseEther } from 'viem'
import { getBalance } from 'viem/actions'
import { describe, expect, it } from 'vitest'
import type { TevmTransport } from './TevmTransport.js'
import { createTevmTransport } from './createTevmTransport.js'
import { tevmContract } from './tevmContract.js'
import { tevmDeploy } from './tevmDeploy.js'
import { tevmMine } from './tevmMine.js'
import { tevmSetAccount } from './tevmSetAccount.js'

describe('Tevm Contract Integration', () => {
	const testAddress = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' as Address

	it('should deploy and interact with a contract using tevmContract', async () => {
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
			account: testAddress,
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

		// Update the value with tevmContract and write mode
		const newValue = 99n
		const writeResult = await tevmContract(client, contract.write.set([newValue]), {
			account: testAddress,
		})

		expect(writeResult.transactionHash).toBeDefined()

		// Mine a block to include the transaction
		await tevmMine(client, { blockCount: 1 })

		// Read the updated value
		const updatedResult = await tevmContract(client, contract.read.get())
		expect(updatedResult.data).toBe(newValue)
	})

	it('should handle value transfers to contracts', async () => {
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
			account: testAddress,
		})

		expect(deployResult.createdAddress).toBeDefined()
		const contractAddress = deployResult.createdAddress as Address

		// Mine a block to include the deployment
		await tevmMine(client, { blockCount: 1 })

		// Create a contract instance
		const contract = SimpleContract.withAddress(contractAddress)

		// Check initial contract balance
		const initialBalance = await getBalance(client, { address: contractAddress })
		expect(initialBalance).toBe(0n)

		// Send value to the contract using tevmContract
		const value = parseEther('1')
		await tevmContract(client, contract.write.set([123n]), {
			account: testAddress,
			value,
		})

		// Mine a block to include the transaction
		await tevmMine(client, { blockCount: 1 })

		// Check updated contract balance
		const updatedBalance = await getBalance(client, { address: contractAddress })
		expect(updatedBalance).toBe(value)
	})

	it('should handle gas settings in contract calls', async () => {
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
			account: testAddress,
		})

		expect(deployResult.createdAddress).toBeDefined()
		const contractAddress = deployResult.createdAddress as Address

		// Mine a block to include the deployment
		await tevmMine(client, { blockCount: 1 })

		// Create a contract instance
		const contract = SimpleContract.withAddress(contractAddress)

		// Use a custom gas limit for the transaction
		const customGasLimit = 100000n
		const result = await tevmContract(client, contract.write.set([999n]), {
			account: testAddress,
			gas: customGasLimit,
		})

		expect(result.transactionHash).toBeDefined()

		// Gas used should be less than our limit
		expect(result.gasUsed).toBeLessThan(customGasLimit)
		expect(result.gasUsed).toBeGreaterThan(0n)
	})

	it('should handle consecutive state-changing operations', async () => {
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
			account: testAddress,
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
			await tevmContract(client, contract.write.set([value]), {
				account: testAddress,
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