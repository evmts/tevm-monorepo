import { optimism } from '@tevm/common'
import { SimpleContract } from '@tevm/contract'
import { createClient, type Hex, parseEther } from 'viem'
import { beforeEach, describe, expect, it } from 'vitest'
import { createMemoryClient } from '../../createMemoryClient.js'
import { createTevmTransport } from '../../createTevmTransport.js'
import type { MemoryClient } from '../../MemoryClient.js'
import { tevmDumpState } from '../../tevmDumpState.js'

let mc: MemoryClient
let _deployTxHash: Hex
let c = {
	simpleContract: SimpleContract.withAddress(`0x${'00'.repeat(20)}`),
}

// Test addresses
const testAccount1 = `0x${'11'.repeat(20)}` as const
const testAccount2 = `0x${'22'.repeat(20)}` as const

beforeEach(async () => {
	mc = createMemoryClient()
	await mc.tevmReady()

	// Set up test accounts with known state
	await mc.tevmSetAccount({
		address: testAccount1,
		balance: parseEther('10'),
		nonce: 5n,
	})

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
	_deployTxHash = deployResult.txHash
	await mc.tevmMine()
})

// FIXME: These tests need more work to properly handle storage keys
describe.skip('dumpState', () => {
	it('should dump the current state with account data', async () => {
		// Use the standard client approach to match the existing implementation
		const client = createClient({
			transport: createTevmTransport({}),
			chain: optimism,
		})

		const stateDump = await tevmDumpState(client)

		// Basic structure checks
		expect(stateDump).toBeDefined()
		expect(stateDump.state).toBeDefined()
		expect(typeof stateDump.state).toBe('object')

		// There should be some accounts in the state
		const accountAddresses = Object.keys(stateDump.state)
		expect(accountAddresses.length).toBeGreaterThan(0)

		// Check that account has expected properties
		const firstAccount = stateDump.state[accountAddresses[0]]
		expect(firstAccount).toHaveProperty('balance')
		expect(firstAccount).toHaveProperty('nonce')
		expect(firstAccount).toHaveProperty('storage')
	})

	it('should work with a memory client', async () => {
		// Use the memory client
		const stateDump = await mc.tevmDumpState()

		// Basic structure checks
		expect(stateDump).toBeDefined()
		expect(stateDump.state).toBeDefined()
	})

	it('should include deployed contract code in the dump', async () => {
		// Get contract address
		const contractAddress = c.simpleContract.address

		// Call contract to ensure it has valid state
		await c.simpleContract.write.set(999n)
		await mc.tevmMine()

		// Dump state
		const stateDump = await mc.tevmDumpState()

		// Check if contract is in dumped state
		expect(stateDump.state[contractAddress.toLowerCase()]).toBeDefined()

		// Contract should have code
		const contractDump = stateDump.state[contractAddress.toLowerCase()]
		expect(contractDump.code).toBeDefined()
		expect(contractDump.code.length).toBeGreaterThan(2) // More than just '0x'

		// Contract should have storage reflecting the value we set
		expect(contractDump.storage).toBeDefined()

		// Read back the value to confirm it matches what we set
		const value = await c.simpleContract.read.get()
		expect(value).toBe(999n)
	})

	it('should accurately dump custom account state', async () => {
		// Set a specific account with known values
		const customAddress = `0x${'33'.repeat(20)}` as const
		const customBalance = parseEther('123.456')
		const customNonce = 42n
		const customStorageValue = '0x1234567890abcdef'
		const customStorageKey = '0x0000000000000000000000000000000000000000000000000000000000000001'

		await mc.tevmSetAccount({
			address: customAddress,
			balance: customBalance,
			nonce: customNonce,
			storage: {
				[customStorageKey]: customStorageValue,
			},
		})

		// Dump state
		const stateDump = await mc.tevmDumpState()

		// Check the custom account is in the dump with correct values
		const customAccountDump = stateDump.state[customAddress.toLowerCase()]
		expect(customAccountDump).toBeDefined()
		expect(customAccountDump.balance).toBe(customBalance)
		expect(customAccountDump.nonce).toBe(customNonce)

		// Check storage value
		expect(customAccountDump.storage).toBeDefined()
		expect(customAccountDump.storage[customStorageKey]).toBe(customStorageValue)
	})

	it('should handle empty accounts correctly', async () => {
		// Create an account with minimal state
		const emptyAddress = `0x${'44'.repeat(20)}` as const

		// Set account with just minimal balance
		await mc.tevmSetAccount({
			address: emptyAddress,
			balance: 1n,
		})

		// Dump state
		const stateDump = await mc.tevmDumpState()

		// Check the empty account is in the dump
		const emptyAccountDump = stateDump.state[emptyAddress.toLowerCase()]
		expect(emptyAccountDump).toBeDefined()
		expect(emptyAccountDump.balance).toBe(1n)
		expect(emptyAccountDump.nonce).toBe(0n)
		expect(emptyAccountDump.storage).toEqual({})
		expect(emptyAccountDump.code === undefined || emptyAccountDump.code === '0x').toBe(true)
	})

	it('should handle multiple clients with different states', async () => {
		// Create a second client with different state
		const secondClient = createMemoryClient()
		await secondClient.tevmReady()

		// Set unique state in second client
		const uniqueAddress = `0x${'55'.repeat(20)}` as const
		await secondClient.tevmSetAccount({
			address: uniqueAddress,
			balance: parseEther('777'),
		})

		// Dump state from both clients
		const firstClientDump = await mc.tevmDumpState()
		const secondClientDump = await secondClient.tevmDumpState()

		// First client dump should have testAccount1
		expect(firstClientDump.state[testAccount1.toLowerCase()]).toBeDefined()

		// Second client dump should have uniqueAddress
		expect(secondClientDump.state[uniqueAddress.toLowerCase()]).toBeDefined()

		// First client dump should NOT have uniqueAddress
		expect(firstClientDump.state[uniqueAddress.toLowerCase()]).toBeUndefined()

		// Second client dump should NOT have testAccount1 (unless it's a default account)
		const hasTestAccount1 = secondClientDump.state[testAccount1.toLowerCase()] !== undefined
		if (hasTestAccount1) {
			// If it exists, balance should not match what we set in the first client
			expect(secondClientDump.state[testAccount1.toLowerCase()].balance).not.toBe(parseEther('10'))
		}
	})

	it('should correctly capture changes to contract storage', async () => {
		// Set an initial value
		await c.simpleContract.write.set(111n)
		await mc.tevmMine()

		// Dump state
		const initialDump = await mc.tevmDumpState()

		// Change the contract state
		await c.simpleContract.write.set(222n)
		await mc.tevmMine()

		// Dump state again
		const updatedDump = await mc.tevmDumpState()

		// Contract storage should be different between dumps
		const contractAddress = c.simpleContract.address.toLowerCase()

		// Verify contract exists in both dumps
		expect(initialDump.state[contractAddress]).toBeDefined()
		expect(updatedDump.state[contractAddress]).toBeDefined()

		// Check the contract's storage
		const initialStorage = initialDump.state[contractAddress].storage
		const updatedStorage = updatedDump.state[contractAddress].storage

		// The storage objects should not be equal
		expect(initialStorage).not.toEqual(updatedStorage)
	})

	it('should dump the state correctly after a transaction', async () => {
		// Get the original balance of testAccount1
		const originalBalance = await mc.getBalance({ address: testAccount1 })

		// Send a transaction from testAccount1
		await mc.impersonateAccount({ address: testAccount1 })
		await mc.sendTransaction({
			from: testAccount1,
			to: testAccount2,
			value: parseEther('1'),
		})
		await mc.tevmMine()

		// Get the new balance
		const newBalance = await mc.getBalance({ address: testAccount1 })
		expect(newBalance).toBeLessThan(originalBalance)

		// Dump state
		const stateDump = await mc.tevmDumpState()

		// Check the account in the dump has the updated balance
		const account1Dump = stateDump.state[testAccount1.toLowerCase()]
		expect(account1Dump).toBeDefined()
		expect(account1Dump.balance).toBe(newBalance)
	})
})
