import { optimism } from '@tevm/common'
import { SimpleContract } from '@tevm/contract'
import { transports } from '@tevm/test-utils'
import { type Hex, encodeFunctionData, parseEther } from 'viem'
import { createClient } from 'viem'
import { beforeEach, describe, expect, it } from 'vitest'
import type { MemoryClient } from '../../MemoryClient.js'
import { createMemoryClient } from '../../createMemoryClient.js'
import { createTevmTransport } from '../../createTevmTransport.js'
import { tevmDumpState } from '../../tevmDumpState.js'
import { tevmLoadState } from '../../tevmLoadState.js'
import { tevmSetAccount } from '../../tevmSetAccount.js'

let mc: MemoryClient
const testAddress = `0x${'69'.repeat(20)}` as const
const testAddress2 = `0x${'42'.repeat(20)}` as const

beforeEach(async () => {
	mc = createMemoryClient()
	await mc.tevmReady()
})

describe('loadState', () => {
	it('should load a previously dumped state', async () => {
		// Set an account with a specific balance and nonce
		await mc.tevmSetAccount({
			address: testAddress,
			balance: parseEther('1234'),
			nonce: 5n,
		})

		// Dump the state
		const dumpedState = await mc.tevmDumpState()

		// Create a new client
		const newClient = createMemoryClient()
		await newClient.tevmReady()

		// Load the dumped state into the new client
		const result = await newClient.tevmLoadState(dumpedState)

		// Verify load was successful
		expect(result).toBeDefined()

		// Verify the account information in the new client
		const accountInfo = await newClient.tevmGetAccount({ address: testAddress })
		expect(accountInfo).toBeDefined()
		expect(accountInfo.balance).toBe(parseEther('1234'))
		expect(accountInfo.nonce).toBe(5n)
	})

	it('should work with traditional client API', async () => {
		// Create a standard client
		const client = createClient({
			transport: createTevmTransport({
				fork: { transport: transports.optimism },
			}),
			chain: optimism,
		})

		// Set an account with a specific balance and nonce
		await tevmSetAccount(client, {
			address: testAddress,
			balance: parseEther('1234'),
			nonce: 5n,
		})

		// Dump the state
		const dumpedState = await tevmDumpState(client)

		// Create a new client
		const newClient = createClient({
			transport: createTevmTransport({}),
			chain: optimism,
		})

		// Load the dumped state into the new client
		const result = await tevmLoadState(newClient, dumpedState)

		// Verify load was successful
		expect(result).toBeDefined()
	})

	it('should load complex contract state with deployed code and storage', async () => {
		// Deploy a contract to the first client
		const deployResult = await mc.tevmDeploy({
			bytecode: SimpleContract.bytecode,
			abi: SimpleContract.abi,
			args: [123n],
		})

		if (!deployResult.createdAddress) {
			throw new Error('Contract deployment failed')
		}

		const contractAddress = deployResult.createdAddress
		const contract = SimpleContract.withAddress(contractAddress)

		// Set a value in the contract
		await contract.write.setValue([456n])
		await mc.tevmMine()

		// Verify the value is set
		const valueInOriginal = await contract.read.getValue()
		expect(valueInOriginal).toBe(456n)

		// Dump the state
		const dumpedState = await mc.tevmDumpState()

		// Create a new client
		const newClient = createMemoryClient()
		await newClient.tevmReady()

		// Load the dumped state into the new client
		await newClient.tevmLoadState(dumpedState)

		// Create a contract instance in the new client
		const contractInNewClient = SimpleContract.withAddress(contractAddress)

		// Read the value from the contract in the new client
		const valueInNewClient = await contractInNewClient.read.getValue()

		// Value should be the same as original
		expect(valueInNewClient).toBe(456n)

		// Make sure we can call the contract methods in the new client
		await contractInNewClient.write.setValue([789n])
		await newClient.tevmMine()

		const updatedValue = await contractInNewClient.read.getValue()
		expect(updatedValue).toBe(789n)
	})

	it('should load account storage correctly', async () => {
		// Set an account with custom storage
		const storageKey = '0x0000000000000000000000000000000000000000000000000000000000000001'
		const storageValue = '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'

		await mc.tevmSetAccount({
			address: testAddress,
			balance: parseEther('10'),
			storage: {
				[storageKey]: storageValue,
			},
		})

		// Dump the state
		const dumpedState = await mc.tevmDumpState()

		// Create a new client
		const newClient = createMemoryClient()
		await newClient.tevmReady()

		// Load the dumped state into the new client
		await newClient.tevmLoadState(dumpedState)

		// Get the storage value in the new client
		const loadedStorage = await newClient.getStorageAt({
			address: testAddress,
			slot: storageKey,
		})

		// Storage value should match
		expect(loadedStorage).toBe(storageValue)
	})

	it('should load multiple accounts correctly', async () => {
		// Set multiple accounts with different states
		await mc.tevmSetAccount({
			address: testAddress,
			balance: parseEther('10'),
			nonce: 5n,
		})

		await mc.tevmSetAccount({
			address: testAddress2,
			balance: parseEther('20'),
			nonce: 10n,
		})

		// Dump the state
		const dumpedState = await mc.tevmDumpState()

		// Create a new client
		const newClient = createMemoryClient()
		await newClient.tevmReady()

		// Load the dumped state into the new client
		await newClient.tevmLoadState(dumpedState)

		// Verify account 1
		const account1 = await newClient.tevmGetAccount({ address: testAddress })
		expect(account1.balance).toBe(parseEther('10'))
		expect(account1.nonce).toBe(5n)

		// Verify account 2
		const account2 = await newClient.tevmGetAccount({ address: testAddress2 })
		expect(account2.balance).toBe(parseEther('20'))
		expect(account2.nonce).toBe(10n)
	})

	it('should overwrite existing state when loading', async () => {
		// Set initial state in original client
		await mc.tevmSetAccount({
			address: testAddress,
			balance: parseEther('10'),
		})

		// Dump the state
		const dumpedState = await mc.tevmDumpState()

		// Create a new client with different initial state
		const newClient = createMemoryClient()
		await newClient.tevmReady()

		// Set different state for the same address in the new client
		await newClient.tevmSetAccount({
			address: testAddress,
			balance: parseEther('50'),
		})

		// Verify different state
		const initialAccount = await newClient.tevmGetAccount({ address: testAddress })
		expect(initialAccount.balance).toBe(parseEther('50'))

		// Load the dumped state into the new client
		await newClient.tevmLoadState(dumpedState)

		// Verify the state was overwritten
		const loadedAccount = await newClient.tevmGetAccount({ address: testAddress })
		expect(loadedAccount.balance).toBe(parseEther('10'))
	})

	it('should preserve blockchain data including block number when loading state', async () => {
		// Mine some blocks in the original client to advance block number
		await mc.mine({ blocks: 5 })
		const originalBlockNumber = await mc.getBlockNumber()
		expect(originalBlockNumber).toBeGreaterThan(0)

		// Dump the state
		const dumpedState = await mc.tevmDumpState()

		// Create a new client
		const newClient = createMemoryClient()
		await newClient.tevmReady()

		// Get initial block number
		const initialBlockNumber = await newClient.getBlockNumber()

		// Load the dumped state into the new client
		await newClient.tevmLoadState(dumpedState)

		// Block number should match original
		const loadedBlockNumber = await newClient.getBlockNumber()
		expect(loadedBlockNumber).toBe(originalBlockNumber)
	})

	it('should handle loading state into a forked client', async () => {
		// Set up our source client with custom state
		await mc.tevmSetAccount({
			address: testAddress,
			balance: parseEther('12345'),
			nonce: 7n,
		})

		// Dump the state
		const dumpedState = await mc.tevmDumpState()

		// Create a new client with a fork
		const forkedClient = createMemoryClient({
			fork: {
				transport: transports.optimism,
			},
		})
		await forkedClient.tevmReady()

		// Load the dumped state into the forked client
		await forkedClient.tevmLoadState(dumpedState)

		// Verify the account was loaded correctly
		const account = await forkedClient.tevmGetAccount({ address: testAddress })
		expect(account.balance).toBe(parseEther('12345'))
		expect(account.nonce).toBe(7n)

		// Verify fork functionality still works
		// We should be able to access accounts from the fork
		const vitalikAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
		const vitalikBalance = await forkedClient.getBalance({ address: vitalikAddress })

		// Balance should be non-zero if the fork is working
		expect(vitalikBalance).toBeGreaterThan(0n)
	})

	it('should allow tevm client forking another tevm client via loadState', async () => {
		// First client: Deploy a contract and set some state
		const deployResult = await mc.tevmDeploy({
			bytecode: SimpleContract.bytecode,
			abi: SimpleContract.abi,
			args: [999n],
		})

		if (!deployResult.createdAddress) {
			throw new Error('Contract deployment failed')
		}

		// Get contract and set some values
		const contractAddress = deployResult.createdAddress
		const contract = SimpleContract.withAddress(contractAddress)
		await contract.write.setValue([123456n])
		await mc.tevmMine()

		// Set some account state too
		await mc.tevmSetAccount({
			address: testAddress,
			balance: parseEther('777'),
			nonce: 42n,
		})

		// Dump the state
		const dumpedState = await mc.tevmDumpState()

		// Create a second client (that will "fork" the first via loadState)
		const client2 = createMemoryClient()
		await client2.tevmReady()

		// Load state from first client into second
		await client2.tevmLoadState(dumpedState)

		// Verify contract is accessible and has correct state
		const contractInClient2 = SimpleContract.withAddress(contractAddress)
		const value = await contractInClient2.read.getValue()
		expect(value).toBe(123456n)

		// Verify account state was transferred
		const account = await client2.tevmGetAccount({ address: testAddress })
		expect(account.balance).toBe(parseEther('777'))
		expect(account.nonce).toBe(42n)

		// Make changes in client 2
		await contractInClient2.write.setValue([8888n])
		await client2.tevmMine()

		// Verify changes in client 2
		const newValue = await contractInClient2.read.getValue()
		expect(newValue).toBe(8888n)

		// But client 1 should be unchanged
		const originalValue = await contract.read.getValue()
		expect(originalValue).toBe(123456n)

		// Essentially, client2 is now a "fork" of client1
	})
})
