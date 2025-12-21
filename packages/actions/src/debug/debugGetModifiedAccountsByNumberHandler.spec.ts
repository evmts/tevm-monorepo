import { SimpleContract } from '@tevm/contract'
import { createTevmNode, type TevmNode } from '@tevm/node'
import { type Address, PREFUNDED_ACCOUNTS } from '@tevm/utils'
import { assert, beforeEach, describe, expect, it } from 'vitest'
import { contractHandler } from '../Contract/contractHandler.js'
import { deployHandler } from '../Deploy/deployHandler.js'
import { mineHandler } from '../Mine/mineHandler.js'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { debugGetModifiedAccountsByNumberHandler } from './debugGetModifiedAccountsByNumberHandler.js'

describe('debugGetModifiedAccountsByNumberHandler', () => {
	let client: TevmNode
	let contractAddress: Address

	beforeEach(async () => {
		client = createTevmNode()

		// Deploy contract in block 1
		const { createdAddress } = await deployHandler(client)({
			...SimpleContract.deploy(420n),
			from: PREFUNDED_ACCOUNTS[0].address,
			addToBlockchain: true,
		})
		assert(createdAddress, 'createdAddress is undefined')
		contractAddress = createdAddress

		// Execute a contract call in block 2
		await contractHandler(client)({
			...SimpleContract.write.set(999n),
			to: contractAddress,
			from: PREFUNDED_ACCOUNTS[0].address,
			addToBlockchain: true,
		})

		// Mine an empty block 3
		await mineHandler(client)()
	})

	it('should return modified accounts between two block numbers', async () => {
		const handler = debugGetModifiedAccountsByNumberHandler(client)
		const result = await handler({
			startBlockNumber: 0n,
			endBlockNumber: 1n,
		})

		expect(Array.isArray(result)).toBe(true)
		expect(result.length).toBeGreaterThan(0)

		// Should include the deployed contract address
		expect(result).toContain(contractAddress)

		// All addresses should be valid hex strings
		for (const address of result) {
			expect(typeof address).toBe('string')
			expect(address).toMatch(/^0x[0-9a-f]{40}$/i)
		}
	})

	it('should detect newly created contract accounts', async () => {
		const handler = debugGetModifiedAccountsByNumberHandler(client)
		const result = await handler({
			startBlockNumber: 0n,
			endBlockNumber: 1n,
		})

		// Contract was created between block 0 and block 1
		expect(result).toContain(contractAddress)
	})

	it('should detect modified accounts when state changes', async () => {
		const handler = debugGetModifiedAccountsByNumberHandler(client)
		const result = await handler({
			startBlockNumber: 1n,
			endBlockNumber: 2n,
		})

		expect(Array.isArray(result)).toBe(true)
		// Contract storage was modified, so it should be in the list
		expect(result).toContain(contractAddress)
	})

	it('should handle consecutive empty blocks', async () => {
		// Mine two empty blocks
		await mineHandler(client)()
		await mineHandler(client)()

		const handler = debugGetModifiedAccountsByNumberHandler(client)
		const result = await handler({
			startBlockNumber: 3n,
			endBlockNumber: 4n,
		})

		expect(Array.isArray(result)).toBe(true)
		// Empty blocks have minimal or no modifications
	})

	it('should handle endBlockNumber not provided (defaults to startBlockNumber + 1)', async () => {
		const handler = debugGetModifiedAccountsByNumberHandler(client)
		const result = await handler({
			startBlockNumber: 0n,
		})

		expect(Array.isArray(result)).toBe(true)
		// Should compare block 0 with block 1
		expect(result.length).toBeGreaterThan(0)
	})

	it('should work with number type block numbers', async () => {
		const handler = debugGetModifiedAccountsByNumberHandler(client)
		const result = await handler({
			startBlockNumber: 0,
			endBlockNumber: 1,
		})

		expect(Array.isArray(result)).toBe(true)
		expect(result.length).toBeGreaterThan(0)
	})

	it('should work with hex string block numbers', async () => {
		const handler = debugGetModifiedAccountsByNumberHandler(client)
		const result = await handler({
			startBlockNumber: '0x0',
			endBlockNumber: '0x1',
		})

		expect(Array.isArray(result)).toBe(true)
		expect(result.length).toBeGreaterThan(0)
	})

	it('should throw error when endBlockNumber <= startBlockNumber', async () => {
		const handler = debugGetModifiedAccountsByNumberHandler(client)

		await expect(async () => {
			await handler({
				startBlockNumber: 1n,
				endBlockNumber: 1n,
			})
		}).rejects.toThrow('End block number must be greater than start block number')

		await expect(async () => {
			await handler({
				startBlockNumber: 2n,
				endBlockNumber: 1n,
			})
		}).rejects.toThrow('End block number must be greater than start block number')
	})

	it('should detect balance changes', async () => {
		// Create a new account with balance
		const testAddress = '0x1234567890123456789012345678901234567890'
		await setAccountHandler(client)({
			address: testAddress,
			balance: 1000n,
		})
		await mineHandler(client)()

		const blockBefore = 3n

		// Modify balance
		await setAccountHandler(client)({
			address: testAddress,
			balance: 2000n,
		})
		await mineHandler(client)()

		const blockAfter = 4n

		const handler = debugGetModifiedAccountsByNumberHandler(client)
		const result = await handler({
			startBlockNumber: blockBefore,
			endBlockNumber: blockAfter,
		})

		expect(result).toContain(testAddress)
	})

	it('should detect nonce changes', async () => {
		// Transaction execution changes nonce
		const handler = debugGetModifiedAccountsByNumberHandler(client)
		const result = await handler({
			startBlockNumber: 1n,
			endBlockNumber: 2n,
		})

		// The from address should be modified due to nonce change
		expect(result).toContain(PREFUNDED_ACCOUNTS[0].address)
	})

	it('should detect storage changes', async () => {
		const handler = debugGetModifiedAccountsByNumberHandler(client)
		const result = await handler({
			startBlockNumber: 1n,
			endBlockNumber: 2n,
		})

		// Contract had storage modified by the set() call
		expect(result).toContain(contractAddress)
	})

	it('should handle multiple modified accounts', async () => {
		// Create multiple accounts
		const addr1 = '0x1111111111111111111111111111111111111111'
		const addr2 = '0x2222222222222222222222222222222222222222'
		const addr3 = '0x3333333333333333333333333333333333333333'

		await setAccountHandler(client)({
			address: addr1,
			balance: 1n,
		})
		await setAccountHandler(client)({
			address: addr2,
			balance: 2n,
		})
		await setAccountHandler(client)({
			address: addr3,
			balance: 3n,
		})
		await mineHandler(client)()

		const blockBefore = 3n

		// Modify all accounts
		await setAccountHandler(client)({
			address: addr1,
			balance: 10n,
		})
		await setAccountHandler(client)({
			address: addr2,
			balance: 20n,
		})
		await setAccountHandler(client)({
			address: addr3,
			balance: 30n,
		})
		await mineHandler(client)()

		const blockAfter = 4n

		const handler = debugGetModifiedAccountsByNumberHandler(client)
		const result = await handler({
			startBlockNumber: blockBefore,
			endBlockNumber: blockAfter,
		})

		expect(result).toContain(addr1)
		expect(result).toContain(addr2)
		expect(result).toContain(addr3)
	})

	it('should return unique addresses only', async () => {
		const handler = debugGetModifiedAccountsByNumberHandler(client)
		const result = await handler({
			startBlockNumber: 0n,
			endBlockNumber: 2n,
		})

		// Check for duplicates
		const uniqueAddresses = new Set(result)
		expect(uniqueAddresses.size).toBe(result.length)
	})

	it('should detect code changes', async () => {
		// Deploy a contract (creates account with code)
		const handler = debugGetModifiedAccountsByNumberHandler(client)
		const result = await handler({
			startBlockNumber: 0n,
			endBlockNumber: 1n,
		})

		// New contract was deployed, so it's a code change
		expect(result).toContain(contractAddress)
	})

	it('should work across multiple blocks', async () => {
		const handler = debugGetModifiedAccountsByNumberHandler(client)
		const result = await handler({
			startBlockNumber: 0n,
			endBlockNumber: 3n,
		})

		expect(Array.isArray(result)).toBe(true)
		// Should include contract and transaction sender
		expect(result.length).toBeGreaterThan(0)
	})

	it('should handle consecutive blocks with transactions', async () => {
		// Execute transactions in consecutive blocks
		await contractHandler(client)({
			...SimpleContract.write.set(111n),
			to: contractAddress,
			from: PREFUNDED_ACCOUNTS[0].address,
			addToBlockchain: true,
		})

		await contractHandler(client)({
			...SimpleContract.write.set(222n),
			to: contractAddress,
			from: PREFUNDED_ACCOUNTS[0].address,
			addToBlockchain: true,
		})

		const handler = debugGetModifiedAccountsByNumberHandler(client)
		const result = await handler({
			startBlockNumber: 3n,
			endBlockNumber: 5n,
		})

		expect(Array.isArray(result)).toBe(true)
		expect(result).toContain(contractAddress)
		expect(result).toContain(PREFUNDED_ACCOUNTS[0].address)
	})

	it('should handle Uint8Array block numbers', async () => {
		const handler = debugGetModifiedAccountsByNumberHandler(client)

		// Convert numbers to Uint8Array (though this is a bit artificial)
		const startBytes = Uint8Array.from([0])
		const endBytes = Uint8Array.from([1])

		const result = await handler({
			startBlockNumber: startBytes,
			endBlockNumber: endBytes,
		})

		expect(Array.isArray(result)).toBe(true)
		expect(result.length).toBeGreaterThan(0)
	})

	it('should compare adjacent blocks correctly', async () => {
		const handler = debugGetModifiedAccountsByNumberHandler(client)

		// Compare block 1 to 2
		const result1to2 = await handler({
			startBlockNumber: 1n,
			endBlockNumber: 2n,
		})

		// Compare block 2 to 3 (empty block)
		const result2to3 = await handler({
			startBlockNumber: 2n,
			endBlockNumber: 3n,
		})

		// First comparison should have modifications
		expect(result1to2.length).toBeGreaterThan(0)

		// Second comparison may have minimal modifications
		expect(Array.isArray(result2to3)).toBe(true)
	})

	it('should handle genesis block comparisons', async () => {
		const handler = debugGetModifiedAccountsByNumberHandler(client)
		const result = await handler({
			startBlockNumber: 0n,
			endBlockNumber: 1n,
		})

		expect(Array.isArray(result)).toBe(true)
		// Should detect new accounts created in block 1
		expect(result.length).toBeGreaterThan(0)
	})
})
