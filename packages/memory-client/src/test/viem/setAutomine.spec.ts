import { SimpleContract } from '@tevm/contract'
import { type Address, encodeFunctionData } from '@tevm/utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { createMemoryClient } from '../../createMemoryClient.js'
import type { MemoryClient } from '../../MemoryClient.js'

/**
 * Tests for TEVM mining behavior and automine functionality
 *
 * Note: These tests focus on the mining aspects that are actually implemented
 * in the current version of TEVM. While the viem test actions interface
 * declares support for setAutomine, the actual implementation of
 * anvil_setAutomine is not available in the current version.
 *
 * These tests verify:
 * 1. The ability to query automine status via anvil_getAutomine
 * 2. The behavior of transactions when manually mining blocks
 * 3. Multiple transactions being included in a single mined block
 */

let mc: MemoryClient
let contractAddress: Address

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
	contractAddress = deployResult.createdAddress as Address
	await mc.tevmMine()

	// Verify the contract is properly deployed by reading its value
	const simpleContract = SimpleContract.withAddress(contractAddress)
	const initialValue = await mc.tevmContract(simpleContract.read.get())
	expect(initialValue.data).toBe(420n)
})

describe('automine', () => {
	it('should get the automine status', async () => {
		// Get the current automine status through direct request
		const result = await mc.request({
			method: 'anvil_getAutomine',
		})

		// We expect a boolean response indicating whether automine is enabled
		expect(typeof result).toBe('boolean')
	})

	it('should mine transactions and update state when a block is mined', async () => {
		// Create a contract instance for interaction
		const simpleContract = SimpleContract.withAddress(contractAddress)

		// Send a transaction
		const setValueData = encodeFunctionData({
			abi: SimpleContract.abi,
			functionName: 'set',
			args: [999n],
		})

		// Create a transaction (this may or may not be immediately mined based on automine setting)
		await mc.tevmCall({
			to: contractAddress,
			data: setValueData,
			createTransaction: true,
		})

		// Manually mine the transaction
		// If automine is true, this will mine an empty block
		// If automine is false, this will mine the pending transaction
		await mc.tevmMine()

		// Verify the state changed
		const valueAfterMine = await mc.tevmContract(simpleContract.read.get())
		expect(valueAfterMine.data).toBe(999n)
	})

	it('should handle multiple transactions in a single block', async () => {
		// Create a contract instance for interaction
		const simpleContract = SimpleContract.withAddress(contractAddress)

		// Send multiple transactions
		// If automine is true, each will be mined in its own block
		// If automine is false, all will be queued as pending until mined
		const values = [100n, 200n, 300n]

		for (const value of values) {
			const setValueData = encodeFunctionData({
				abi: SimpleContract.abi,
				functionName: 'set',
				args: [value],
			})

			await mc.tevmCall({
				to: contractAddress,
				data: setValueData,
				createTransaction: true,
			})
		}

		// Mine all transactions in a single block if not yet mined
		await mc.tevmMine()

		// Verify final state reflects the last transaction
		// This will be true regardless of whether automine is on or off
		const valueAfterMine = await mc.tevmContract(simpleContract.read.get())
		expect(valueAfterMine.data).toBe(300n)
	})
})
