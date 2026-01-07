import { optimism } from '@tevm/common'
import { SimpleContract } from '@tevm/contract'
import { parseEther } from '@tevm/utils'
import { createClient } from './createClient.js'
import { describe, expect, it } from 'vitest'
import { createTevmTransport } from './createTevmTransport.js'
import { tevmViemActions } from './tevmViemActions.js'

describe('tevmViemActions', () => {
	it('should extend the client with TEVM actions', () => {
		const client = createClient({
			transport: createTevmTransport(),
			chain: optimism,
		}).extend(tevmViemActions())

		expect(client.tevmReady).toBeDefined()
		expect(client.tevmCall).toBeDefined()
		expect(client.tevmContract).toBeDefined()
		expect(client.tevmDeploy).toBeDefined()
		expect(client.tevmMine).toBeDefined()
		expect(client.tevmLoadState).toBeDefined()
		expect(client.tevmDumpState).toBeDefined()
		expect(client.tevmSetAccount).toBeDefined()
		expect(client.tevmGetAccount).toBeDefined()
	})

	it('should successfully call tevmSetAccount and tevmGetAccount through the extended client', async () => {
		const client = createClient({
			transport: createTevmTransport(),
			chain: optimism,
		}).extend(tevmViemActions())

		// Wait for client to be ready
		await client.tevmReady()

		const testAddress = '0x1234567890123456789012345678901234567890'
		const balance = parseEther('10')

		// Set account with balance
		await client.tevmSetAccount({
			address: testAddress,
			balance,
		})

		// Get account and verify balance
		const account = await client.tevmGetAccount({
			address: testAddress,
		})

		expect(account.address).toBe(testAddress)
		expect(account.balance).toBe(balance)
	})

	it('should correctly implement tevmDumpState and tevmLoadState', async () => {
		// Create client
		const client = createClient({
			transport: createTevmTransport(),
			chain: optimism,
		}).extend(tevmViemActions())

		await client.tevmReady()

		// Set an account state
		const testAddress = '0x1234567890123456789012345678901234567890'
		await client.tevmSetAccount({
			address: testAddress,
			balance: parseEther('123'),
			nonce: 42n,
		})

		// Dump the state
		const stateDump = await client.tevmDumpState()

		// Create second client
		const client2 = createClient({
			transport: createTevmTransport(),
			chain: optimism,
		}).extend(tevmViemActions())

		await client2.tevmReady()

		// Load the state into the second client
		await client2.tevmLoadState(stateDump)

		// Verify the state was transferred correctly
		const account = await client2.tevmGetAccount({
			address: testAddress,
		})

		expect(account.balance).toBe(parseEther('123'))
		expect(account.nonce).toBe(42n)
	})

	it('should correctly implement tevmDeploy and tevmContract functionality', async () => {
		const client = createClient({
			transport: createTevmTransport(),
			chain: optimism,
		}).extend(tevmViemActions())

		await client.tevmReady()

		// Deploy a contract
		const deployResult = await client.tevmDeploy({
			bytecode: SimpleContract.bytecode,
			abi: SimpleContract.abi,
			args: [42n],
		})

		expect(deployResult.createdAddress).toBeDefined()

		// Mine to include the deployment
		await client.tevmMine()

		// Use the contract
		if (!deployResult.createdAddress) {
			throw new Error('No contract address created')
		}
		const contract = SimpleContract.withAddress(deployResult.createdAddress)
		const result = await client.tevmContract(contract.read.get())

		// Verify the contract works and returned the constructor value
		expect(result.data).toBe(42n)
	})

	it('should correctly implement tevmCall functionality', async () => {
		const client = createClient({
			transport: createTevmTransport(),
			chain: optimism,
		}).extend(tevmViemActions())

		await client.tevmReady()

		// Set up test contract
		const contractAddress = '0xc0ffee254729296a45a3885639AC7E10F9d54979'
		await client.tevmSetAccount({
			address: contractAddress,
			deployedBytecode: SimpleContract.deployedBytecode,
		})

		// Mine to include the contract setup
		await client.tevmMine()

		// Make a low-level call to the contract
		// Function signature for SimpleContract's get() function
		const result = await client.tevmCall({
			to: contractAddress,
			data: '0x6d4ce63c', // Function signature for get()
		})

		// Verify we can call the contract
		expect(result).toBeDefined()
		expect(result.rawData).toBeDefined()
	})
})
