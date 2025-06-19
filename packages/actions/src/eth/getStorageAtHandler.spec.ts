import { createTevmNode } from '@tevm/node'
import { describe, expect, it } from 'vitest'
import { mineHandler } from '../Mine/mineHandler.js'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { getStorageAtHandler } from './getStorageAtHandler.js'

const TEST_ADDRESS = `0x${'1'.repeat(40)}` as const
const TEST_POSITION = `0x${'2'.repeat(64)}` as const
const TEST_VALUE = `0x${'3'.repeat(64)}` as const

describe('getStorageAtHandler', () => {
	it('should get storage at a given position for latest block', async () => {
		const client = createTevmNode()

		// Set up an account with some storage
		await setAccountHandler(client)({
			address: TEST_ADDRESS,
			state: {
				[TEST_POSITION]: TEST_VALUE,
			},
		})

		const result = await getStorageAtHandler(client)({
			address: TEST_ADDRESS,
			position: TEST_POSITION,
			blockTag: 'latest',
		})

		expect(result).toBe(TEST_VALUE)
	})

	it('should handle pending block tag', async () => {
		const client = createTevmNode()

		// Set up an account with some storage
		await setAccountHandler(client)({
			address: TEST_ADDRESS,
			state: {
				[TEST_POSITION]: TEST_VALUE,
			},
		})

		const result = await getStorageAtHandler(client)({
			address: TEST_ADDRESS,
			position: TEST_POSITION,
			blockTag: 'pending',
		})

		expect(result).toBe(TEST_VALUE)
	})

	it('should handle specific block number', async () => {
		const client = createTevmNode()

		// Set up an account with some storage
		await setAccountHandler(client)({
			address: TEST_ADDRESS,
			state: {
				[TEST_POSITION]: TEST_VALUE,
			},
		})

		// Mine a block
		await mineHandler(client)({})

		const result = await getStorageAtHandler(client)({
			address: TEST_ADDRESS,
			position: TEST_POSITION,
			blockTag: '0x1', // Now block 1 should exist
		})

		expect(result).toBe(TEST_VALUE)
	})

	it('should return 0x00 for non-existent storage', async () => {
		const client = createTevmNode()

		const result = await getStorageAtHandler(client)({
			address: TEST_ADDRESS,
			position: TEST_POSITION,
			blockTag: 'latest',
		})

		expect(result).toEqualHex('0x00')
	})

	it('should handle errors from getContractStorage', async () => {
		const client = createTevmNode()
		const vm = await client.getVm()

		// Mock the stateManager to throw an error
		vm.stateManager.getStorage = async () => {
			throw new Error('Storage retrieval error')
		}

		await expect(
			getStorageAtHandler(client)({
				address: TEST_ADDRESS,
				position: TEST_POSITION,
				blockTag: 'latest',
			}),
		).rejects.toThrow('Storage retrieval error')
	})

	it('should handle errors from blockchain.getBlockByTag', async () => {
		const client = createTevmNode()
		const vm = await client.getVm()

		// Mock the blockchain to throw an error
		vm.blockchain.getBlockByTag = async () => {
			throw new Error('Block retrieval error')
		}

		await expect(
			getStorageAtHandler(client)({
				address: TEST_ADDRESS,
				position: TEST_POSITION,
				blockTag: '0x1',
			}),
		).rejects.toThrow('Block retrieval error')
	})
})
