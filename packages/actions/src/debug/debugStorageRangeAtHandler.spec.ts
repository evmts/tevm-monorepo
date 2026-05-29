import { SimpleContract } from '@tevm/contract'
import { createTevmNode, type TevmNode } from '@tevm/node'
import { type Address, hexToBigInt, PREFUNDED_ACCOUNTS } from '@tevm/utils'
import { assert, beforeEach, describe, expect, it } from 'vitest'
import { contractHandler } from '../Contract/contractHandler.js'
import { deployHandler } from '../Deploy/deployHandler.js'
import { mineHandler } from '../Mine/mineHandler.js'
import { debugStorageRangeAtHandler } from './debugStorageRangeAtHandler.js'

describe('debugStorageRangeAtHandler', () => {
	let client: TevmNode
	let contractAddress: Address

	beforeEach(async () => {
		client = createTevmNode()

		const { createdAddress } = await deployHandler(client)({
			...SimpleContract.deploy(420n),
			from: PREFUNDED_ACCOUNTS[0].address,
			addToBlockchain: true,
		})
		assert(createdAddress, 'createdAddress is undefined')
		contractAddress = createdAddress

		// Set the value in storage
		await contractHandler(client)({
			...SimpleContract.write.set(999n),
			to: contractAddress,
			from: PREFUNDED_ACCOUNTS[0].address,
			addToBlockchain: true,
		})

		await mineHandler(client)()
	})

	it.skip('should return storage range for a contract at latest block', async () => {
		const handler = debugStorageRangeAtHandler(client)
		const result = await handler({
			blockTag: 'latest',
			txIndex: 0,
			address: contractAddress,
			startKey: '0x0',
			maxResult: 100,
		})

		expect(result).toHaveProperty('storage')
		expect(result).toHaveProperty('nextKey')
		expect(typeof result.storage).toBe('object')
	})

	it.skip('should return storage entries with correct format', async () => {
		const handler = debugStorageRangeAtHandler(client)
		const result = await handler({
			blockTag: 'latest',
			txIndex: 0,
			address: contractAddress,
			startKey: '0x0',
			maxResult: 100,
		})

		// Storage should be an object
		expect(typeof result.storage).toBe('object')
		// Storage may or may not have entries depending on contract state
		if (Object.keys(result.storage).length > 0) {
			const firstKey = Object.keys(result.storage)[0]
			const storageEntry = result.storage[firstKey]
			expect(storageEntry).toHaveProperty('key')
			expect(storageEntry).toHaveProperty('value')
			expect(typeof storageEntry.key).toBe('string')
			expect(typeof storageEntry.value).toBe('string')
		}
	})

	it.skip('should handle maxResult parameter', async () => {
		const handler = debugStorageRangeAtHandler(client)
		const result = await handler({
			blockTag: 'latest',
			txIndex: 0,
			address: contractAddress,
			startKey: '0x0',
			maxResult: 1,
		})

		// Should respect maxResult
		expect(result).toHaveProperty('storage')
		expect(result).toHaveProperty('nextKey')
	})

	it.skip('should handle pagination', async () => {
		const handler = debugStorageRangeAtHandler(client)
		const result = await handler({
			blockTag: 'latest',
			txIndex: 0,
			address: contractAddress,
			startKey: '0x0',
			maxResult: 10,
		})

		// Should have storage and nextKey properties
		expect(result).toHaveProperty('storage')
		expect(result).toHaveProperty('nextKey')
	})

	// Note: block 1 is the deploy block (its only tx, index 0, deploys the contract).
	// Per geth semantics, txIndex 0 means "state BEFORE tx[0]", i.e. before the contract
	// is deployed, so there is no storage at block 1 / txIndex 0. Block 2 is the set(999)
	// block; txIndex 0 there means after the deploy (value 420) and before the set runs.
	it('should work with different block numbers', async () => {
		const handler = debugStorageRangeAtHandler(client)

		// Block 2, txIndex 0 => state after deploy, before set(999) => contract has storage.
		const block2Result = await handler({
			blockTag: 2n,
			txIndex: 0,
			address: contractAddress,
			startKey: '0x0',
			maxResult: 100,
		})
		expect(block2Result).toHaveProperty('storage')
		expect(Object.keys(block2Result.storage).length).toBeGreaterThan(0)
	})

	it('should work with hex block number', async () => {
		const handler = debugStorageRangeAtHandler(client)
		const result = await handler({
			blockTag: '0x2',
			txIndex: 0,
			address: contractAddress,
			startKey: '0x0',
			maxResult: 100,
		})

		expect(result).toHaveProperty('storage')
		expect(result).toHaveProperty('nextKey')
	})

	it('should work with numeric block number', async () => {
		const handler = debugStorageRangeAtHandler(client)
		const result = await handler({
			blockTag: 2,
			txIndex: 0,
			address: contractAddress,
			startKey: '0x0',
			maxResult: 100,
		})

		expect(result).toHaveProperty('storage')
		expect(result).toHaveProperty('nextKey')
	})

	it('should return storage as of BEFORE the transaction at txIndex (geth StateAtTransaction semantics)', async () => {
		// Place TWO transactions into a single block that both mutate the contract's storage slot 0.
		// tx[0] sets the value to 111, tx[1] sets the value to 222.
		await contractHandler(client)({
			...SimpleContract.write.set(111n),
			to: contractAddress,
			from: PREFUNDED_ACCOUNTS[0].address,
			addToMempool: true,
		})
		await contractHandler(client)({
			...SimpleContract.write.set(222n),
			to: contractAddress,
			from: PREFUNDED_ACCOUNTS[1].address,
			addToMempool: true,
		})
		await mineHandler(client)()

		const latestBlock = await (await client.getVm()).blockchain.getCanonicalHeadBlock()
		expect(latestBlock.transactions.length).toBe(2)

		const handler = debugStorageRangeAtHandler(client)

		// SimpleContract stores its single value in slot 0. Keys returned by dumpStorageRange
		// are unprefixed hex, so normalize both key and value via hexToBigInt.
		const readSlot0 = (storage: Record<string, { key: string | null; value: string }>): bigint | undefined => {
			const entry = Object.values(storage).find(
				(e) => e.key != null && hexToBigInt(`0x${e.key.replace(/^0x/, '')}` as `0x${string}`) === 0n,
			)
			return entry ? hexToBigInt(entry.value as `0x${string}`) : undefined
		}

		// txIndex 0 => state BEFORE tx[0] runs => value is the previous block's value (999), NOT 111.
		const atTx0 = await handler({
			blockTag: latestBlock.header.number,
			txIndex: 0,
			address: contractAddress,
			startKey: '0x0',
			maxResult: 100,
		})
		expect(readSlot0(atTx0.storage)).toBe(999n)

		// txIndex 1 => state BEFORE tx[1] runs => after tx[0] => value is 111, NOT 222.
		const atTx1 = await handler({
			blockTag: latestBlock.header.number,
			txIndex: 1,
			address: contractAddress,
			startKey: '0x0',
			maxResult: 100,
		})
		expect(readSlot0(atTx1.storage)).toBe(111n)
	})

	it.skip('should handle different startKey values', async () => {
		const handler = debugStorageRangeAtHandler(client)

		// Start from different key
		const result = await handler({
			blockTag: 'latest',
			txIndex: 0,
			address: contractAddress,
			startKey: '0x0000000000000000000000000000000000000000000000000000000000000001',
			maxResult: 100,
		})

		expect(result).toHaveProperty('storage')
		expect(result).toHaveProperty('nextKey')
	})
})
