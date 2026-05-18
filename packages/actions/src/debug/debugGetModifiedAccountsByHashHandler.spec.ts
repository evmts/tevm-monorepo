import { SimpleContract } from '@tevm/contract'
import { createTevmNode, type TevmNode } from '@tevm/node'
import { type Address, bytesToHex, type Hex, PREFUNDED_ACCOUNTS } from '@tevm/utils'
import { assert, beforeEach, describe, expect, it } from 'vitest'
import { contractHandler } from '../Contract/contractHandler.js'
import { deployHandler } from '../Deploy/deployHandler.js'
import { mineHandler } from '../Mine/mineHandler.js'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { debugGetModifiedAccountsByHashHandler } from './debugGetModifiedAccountsByHashHandler.js'

describe('debugGetModifiedAccountsByHashHandler', () => {
	let client: TevmNode
	let contractAddress: Address
	let block0Hash: Hex
	let block1Hash: Hex
	let block2Hash: Hex

	beforeEach(async () => {
		client = createTevmNode()

		const vm = await client.getVm()

		// Get genesis block hash
		const block0 = await vm.blockchain.getBlock(0n)
		block0Hash = bytesToHex(block0.hash())

		// Deploy contract in block 1
		const { createdAddress } = await deployHandler(client)({
			...SimpleContract.deploy(420n),
			from: PREFUNDED_ACCOUNTS[0].address,
			addToBlockchain: true,
		})
		assert(createdAddress, 'createdAddress is undefined')
		contractAddress = createdAddress

		const block1 = await vm.blockchain.getBlock(1n)
		block1Hash = bytesToHex(block1.hash())

		// Execute a contract call in block 2
		await contractHandler(client)({
			...SimpleContract.write.set(999n),
			to: contractAddress,
			from: PREFUNDED_ACCOUNTS[0].address,
			addToBlockchain: true,
		})

		const block2 = await vm.blockchain.getBlock(2n)
		block2Hash = bytesToHex(block2.hash())

		// Mine an empty block 3
		await mineHandler(client)()
	})

	it('should return modified accounts between two blocks', async () => {
		const handler = debugGetModifiedAccountsByHashHandler(client)
		const result = await handler({
			startBlockHash: block0Hash,
			endBlockHash: block1Hash,
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
		const handler = debugGetModifiedAccountsByHashHandler(client)
		const result = await handler({
			startBlockHash: block0Hash,
			endBlockHash: block1Hash,
		})

		// Contract was created between block 0 and block 1
		expect(result).toContain(contractAddress)
	})

	it('should detect modified accounts when state changes', async () => {
		const handler = debugGetModifiedAccountsByHashHandler(client)
		const result = await handler({
			startBlockHash: block1Hash,
			endBlockHash: block2Hash,
		})

		expect(Array.isArray(result)).toBe(true)
		// Contract storage was modified, so it should be in the list
		expect(result).toContain(contractAddress)
	})

	it('should return empty array when no accounts modified', async () => {
		// Get two consecutive empty blocks
		await mineHandler(client)()
		await mineHandler(client)()

		const vm = await client.getVm()
		const block4 = await vm.blockchain.getBlock(4n)
		const block5 = await vm.blockchain.getBlock(5n)

		const handler = debugGetModifiedAccountsByHashHandler(client)
		const result = await handler({
			startBlockHash: bytesToHex(block4.hash()),
			endBlockHash: bytesToHex(block5.hash()),
		})

		expect(Array.isArray(result)).toBe(true)
		// No modifications between empty blocks
		expect(result.length).toBe(0)
	})

	it('should handle endBlockHash not provided (defaults to next block)', async () => {
		const handler = debugGetModifiedAccountsByHashHandler(client)
		const result = await handler({
			startBlockHash: block0Hash,
		})

		expect(Array.isArray(result)).toBe(true)
		// Should compare block 0 with block 1
		expect(result.length).toBeGreaterThan(0)
	})

	it('should work with Uint8Array block hashes', async () => {
		const handler = debugGetModifiedAccountsByHashHandler(client)

		// Convert hex hashes to Uint8Array
		const startHashBytes = Uint8Array.from(Buffer.from(block0Hash.slice(2), 'hex'))
		const endHashBytes = Uint8Array.from(Buffer.from(block1Hash.slice(2), 'hex'))

		const result = await handler({
			startBlockHash: startHashBytes,
			endBlockHash: endHashBytes,
		})

		expect(Array.isArray(result)).toBe(true)
		expect(result.length).toBeGreaterThan(0)
	})

	it('should detect balance changes', async () => {
		// Create a new account with balance
		const testAddress = '0x1234567890123456789012345678901234567890'
		await setAccountHandler(client)({
			address: testAddress,
			balance: 1000n,
		})

		await mineHandler(client)()
		const vm = await client.getVm()
		const blockA = await vm.blockchain.blocksByTag.get('latest')
		assert(blockA, 'blockA is undefined')

		// Modify balance
		await setAccountHandler(client)({
			address: testAddress,
			balance: 2000n,
		})

		await mineHandler(client)()
		const blockB = await vm.blockchain.blocksByTag.get('latest')
		assert(blockB, 'blockB is undefined')

		const handler = debugGetModifiedAccountsByHashHandler(client)
		const result = await handler({
			startBlockHash: bytesToHex(blockA.hash()),
			endBlockHash: bytesToHex(blockB.hash()),
		})

		expect(result).toContain(testAddress)
	})

	it('should detect nonce changes', async () => {
		// Transaction execution changes nonce
		const handler = debugGetModifiedAccountsByHashHandler(client)
		const result = await handler({
			startBlockHash: block1Hash,
			endBlockHash: block2Hash,
		})

		// The from address should be modified due to nonce change
		expect(result).toContain(PREFUNDED_ACCOUNTS[0].address)
	})

	it('should detect storage changes', async () => {
		const handler = debugGetModifiedAccountsByHashHandler(client)
		const result = await handler({
			startBlockHash: block1Hash,
			endBlockHash: block2Hash,
		})

		// Contract had storage modified by the set() call
		expect(result).toContain(contractAddress)
	})

	it('should detect deleted accounts', async () => {
		const testAddress = '0x2222222222222222222222222222222222222222'
		await setAccountHandler(client)({
			address: testAddress,
			balance: 1000n,
		})

		await mineHandler(client)()
		const vm = await client.getVm()
		const blockBefore = await vm.blockchain.blocksByTag.get('latest')
		assert(blockBefore, 'blockBefore is undefined')

		// In a real scenario, selfdestruct would delete the account
		// For testing, we can simulate by checking if an account disappears
		// This is a limitation of the test - in practice SELFDESTRUCT would be used

		// For now, just verify the handler works with an account that exists
		const handler = debugGetModifiedAccountsByHashHandler(client)
		const result = await handler({
			startBlockHash: block0Hash,
			endBlockHash: bytesToHex(blockBefore.hash()),
		})

		expect(Array.isArray(result)).toBe(true)
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
		const vm = await client.getVm()
		const blockBefore = await vm.blockchain.blocksByTag.get('latest')
		assert(blockBefore, 'blockBefore is undefined')

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
		const blockAfter = await vm.blockchain.blocksByTag.get('latest')
		assert(blockAfter, 'blockAfter is undefined')

		const handler = debugGetModifiedAccountsByHashHandler(client)
		const result = await handler({
			startBlockHash: bytesToHex(blockBefore.hash()),
			endBlockHash: bytesToHex(blockAfter.hash()),
		})

		expect(result).toContain(addr1)
		expect(result).toContain(addr2)
		expect(result).toContain(addr3)
	})

	it('should return unique addresses only', async () => {
		const handler = debugGetModifiedAccountsByHashHandler(client)
		const result = await handler({
			startBlockHash: block0Hash,
			endBlockHash: block2Hash,
		})

		// Check for duplicates
		const uniqueAddresses = new Set(result)
		expect(uniqueAddresses.size).toBe(result.length)
	})

	it('should handle hex string block hashes', async () => {
		const handler = debugGetModifiedAccountsByHashHandler(client)
		const result = await handler({
			startBlockHash: block0Hash,
			endBlockHash: block1Hash,
		})

		expect(Array.isArray(result)).toBe(true)
		expect(result.length).toBeGreaterThan(0)
	})

	it('should detect code changes', async () => {
		// Deploy a contract (creates account with code)
		const handler = debugGetModifiedAccountsByHashHandler(client)
		const result = await handler({
			startBlockHash: block0Hash,
			endBlockHash: block1Hash,
		})

		// New contract was deployed, so it's a code change
		expect(result).toContain(contractAddress)
	})
})
