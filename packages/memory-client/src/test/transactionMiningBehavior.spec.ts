import { ErrorContract } from '@tevm/contract'
import { encodeFunctionData, parseUnits } from '@tevm/utils'
import { assert, beforeEach, describe, expect, it } from 'vitest'
import { createMemoryClient } from '../createMemoryClient.js'
import type { MemoryClient } from '../MemoryClient.js'

let client: MemoryClient<any, any>

beforeEach(async () => {
	client = createMemoryClient()
	await client.tevmSetAccount({
		address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
		balance: parseUnits('100', 18),
	})
})

describe('Block Number Increment', () => {
	const testAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
	const recipientAddress = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'

	describe('addToBlockchain parameter', () => {
		it.each([
			{ param: true, shouldIncrement: true, shouldHaveTxHash: true },
			{ param: 'always', shouldIncrement: true, shouldHaveTxHash: true },
			{ param: 'on-success', shouldIncrement: true, shouldHaveTxHash: true },
			{ param: false, shouldIncrement: false, shouldHaveTxHash: false },
			{ param: 'never', shouldIncrement: false, shouldHaveTxHash: false },
		])('addToBlockchain: $param', async ({ param, shouldIncrement, shouldHaveTxHash }) => {
			const initialBlockNumber = await client.getBlockNumber({ cacheTime: 0 })

			const result = await client.tevmCall({
				from: testAddress,
				to: recipientAddress,
				value: parseUnits('0.1', 18),
				addToBlockchain: param as any,
				throwOnFail: false,
			})

			const finalBlockNumber = await client.getBlockNumber({ cacheTime: 0 })

			// Verify transaction success
			expect(result.errors).toBeUndefined()

			// Verify transaction hash presence
			if (shouldHaveTxHash) {
				expect(result.txHash).toBeDefined()
				expect(result.txHash).toMatch(/^0x[a-fA-F0-9]{64}$/)
			} else {
				expect(result.txHash).toBeUndefined()
			}

			// Verify block number increment
			if (shouldIncrement) {
				expect(finalBlockNumber).toBe(initialBlockNumber + 1n)
			} else {
				expect(finalBlockNumber).toBe(initialBlockNumber)
			}
		})
	})

	describe('addToMempool parameter', () => {
		it.each([
			{ param: true, shouldHaveTxHash: true },
			{ param: 'always', shouldHaveTxHash: true },
			{ param: 'on-success', shouldHaveTxHash: true },
			{ param: false, shouldHaveTxHash: false },
			{ param: 'never', shouldHaveTxHash: false },
		])('addToMempool: $param', async ({ param, shouldHaveTxHash }) => {
			const initialBlockNumber = await client.getBlockNumber({ cacheTime: 0 })

			const result = await client.tevmCall({
				from: testAddress,
				to: recipientAddress,
				value: parseUnits('0.1', 18),
				addToMempool: param as any,
				throwOnFail: false,
			})

			const afterCallBlockNumber = await client.getBlockNumber({ cacheTime: 0 })

			// Verify transaction success
			expect(result.errors).toBeUndefined()

			// Verify transaction hash presence
			if (shouldHaveTxHash) {
				expect(result.txHash).toBeDefined()
				expect(result.txHash).toMatch(/^0x[a-fA-F0-9]{64}$/)
			} else {
				expect(result.txHash).toBeUndefined()
			}

			// addToMempool should NOT increment block number immediately
			expect(afterCallBlockNumber).toBe(initialBlockNumber)

			// Mine the block to process mempool transactions
			if (shouldHaveTxHash) {
				await client.tevmMine()
				const finalBlockNumber = await client.getBlockNumber({ cacheTime: 0 })
				expect(finalBlockNumber).toBe(initialBlockNumber + 1n)
			}
		})
	})

	describe('no transaction parameters (default behavior)', () => {
		it('should not create transaction or increment block with no parameters', async () => {
			const initialBlockNumber = await client.getBlockNumber({ cacheTime: 0 })

			const result = await client.tevmCall({
				from: testAddress,
				to: recipientAddress,
				value: parseUnits('0.1', 18),
				throwOnFail: false,
			})

			const finalBlockNumber = await client.getBlockNumber({ cacheTime: 0 })

			// Verify transaction success (as simulation)
			expect(result.errors).toBeUndefined()
			// Should NOT have transaction hash
			expect(result.txHash).toBeUndefined()
			// Should NOT increment block number
			expect(finalBlockNumber).toBe(initialBlockNumber)
		})
	})

	describe('manual mining', () => {
		it('should increment block number with tevmMine', async () => {
			const initialBlockNumber = await client.getBlockNumber({ cacheTime: 0 })

			await client.tevmMine()

			const finalBlockNumber = await client.getBlockNumber({ cacheTime: 0 })
			expect(finalBlockNumber).toBe(initialBlockNumber + 1n)
		})

		it('should handle multiple manual mining calls', async () => {
			const initialBlockNumber = await client.getBlockNumber({ cacheTime: 0 })

			await client.tevmMine()
			await client.tevmMine()
			await client.tevmMine()

			const finalBlockNumber = await client.getBlockNumber({ cacheTime: 0 })
			expect(finalBlockNumber).toBe(initialBlockNumber + 3n)
		})
	})

	describe('mixed scenarios', () => {
		it('should handle addToMempool followed by mining', async () => {
			const initialBlockNumber = await client.getBlockNumber({ cacheTime: 0 })

			// Add transaction to mempool
			const result = await client.tevmCall({
				from: testAddress,
				to: recipientAddress,
				value: parseUnits('0.1', 18),
				addToMempool: true,
				throwOnFail: false,
			})

			// Verify transaction was added to mempool
			expect(result.errors).toBeUndefined()
			expect(result.txHash).toBeDefined()

			// Block should not increment yet
			const afterMempoolBlockNumber = await client.getBlockNumber({ cacheTime: 0 })
			expect(afterMempoolBlockNumber).toBe(initialBlockNumber)

			// Mine to process the transaction
			await client.tevmMine()

			const finalBlockNumber = await client.getBlockNumber({ cacheTime: 0 })
			expect(finalBlockNumber).toBe(initialBlockNumber + 1n)
		})

		it('should handle multiple transactions with addToBlockchain', async () => {
			const initialBlockNumber = await client.getBlockNumber({ cacheTime: 0 })

			// Execute 3 transactions with addToBlockchain
			for (let i = 0; i < 3; i++) {
				const result = await client.tevmCall({
					from: testAddress,
					to: recipientAddress,
					value: parseUnits('0.1', 18),
					addToBlockchain: true,
					throwOnFail: false,
				})

				expect(result.errors).toBeUndefined()
				expect(result.txHash).toBeDefined()

				const currentBlockNumber = await client.getBlockNumber({ cacheTime: 0 })
				expect(currentBlockNumber).toBe(initialBlockNumber + BigInt(i + 1))
			}
		})
	})

	describe('failing transactions comprehensive tests', () => {
		describe('addToBlockchain with failing transactions', () => {
			it.each([
				{
					param: true,
					shouldHaveTxHash: true,
					shouldIncrement: true,
					description: 'true - should create tx hash and increment block even on failure',
				},
				{
					param: 'always',
					shouldHaveTxHash: true,
					shouldIncrement: true,
					description: 'always - should create tx hash and increment block even on failure',
				},
				{
					param: 'on-success',
					shouldHaveTxHash: false,
					shouldIncrement: false,
					description: 'on-success - should NOT create tx hash or increment on failure',
				},
				{
					param: false,
					shouldHaveTxHash: false,
					shouldIncrement: false,
					description: 'false - should never create tx hash or increment',
				},
				{
					param: 'never',
					shouldHaveTxHash: false,
					shouldIncrement: false,
					description: 'never - should never create tx hash or increment',
				},
			])('addToBlockchain: $param - $description', async ({ param, shouldHaveTxHash, shouldIncrement }) => {
				// Deploy a reverting contract
				const { createdAddress } = await client.tevmDeploy({
					...ErrorContract.deploy(),
					addToBlockchain: true,
				})
				assert(createdAddress, 'createdAddress is undefined')

				const initialBlockNumber = await client.getBlockNumber({ cacheTime: 0 })

				const result = await client.tevmCall({
					to: createdAddress,
					data: encodeFunctionData(ErrorContract.write.revertWithStringError()),
					addToBlockchain: param as any,
					throwOnFail: false,
				})

				const finalBlockNumber = await client.getBlockNumber({ cacheTime: 0 })

				// Transaction should fail (execution reverted)
				expect(result.errors).toBeDefined()

				// Check transaction hash based on parameter
				if (shouldHaveTxHash) {
					expect(result.txHash).toBeDefined()
					expect(result.txHash).toMatch(/^0x[a-fA-F0-9]{64}$/)
				} else {
					expect(result.txHash).toBeUndefined()
				}

				// Check block increment based on parameter
				if (shouldIncrement) {
					expect(finalBlockNumber).toBe(initialBlockNumber + 1n)
				} else {
					expect(finalBlockNumber).toBe(initialBlockNumber)
				}
			})
		})

		describe('addToMempool with failing transactions', () => {
			it.each([
				{
					param: true,
					shouldHaveTxHash: true,
					shouldAddToMempool: true,
					description: 'true - should create tx hash and add to mempool even on failure',
				},
				{
					param: 'always',
					shouldHaveTxHash: true,
					shouldAddToMempool: true,
					description: 'always - should create tx hash and add to mempool even on failure',
				},
				{
					param: 'on-success',
					shouldHaveTxHash: false,
					shouldAddToMempool: false,
					description: 'on-success - should NOT create tx hash or add to mempool on failure',
				},
				{
					param: false,
					shouldHaveTxHash: false,
					shouldAddToMempool: false,
					description: 'false - should never create tx hash or add to mempool',
				},
				{
					param: 'never',
					shouldHaveTxHash: false,
					shouldAddToMempool: false,
					description: 'never - should never create tx hash or add to mempool',
				},
			])('addToMempool: $param - $description', async ({ param, shouldHaveTxHash, shouldAddToMempool }) => {
				// Deploy a reverting contract
				const { createdAddress } = await client.tevmDeploy({
					...ErrorContract.deploy(),
					addToBlockchain: true,
				})
				assert(createdAddress, 'createdAddress is undefined')

				const initialBlockNumber = await client.getBlockNumber({ cacheTime: 0 })

				const result = await client.tevmCall({
					to: createdAddress,
					data: encodeFunctionData(ErrorContract.write.revertWithStringError()),
					addToMempool: param as any,
					throwOnFail: false,
				})

				const afterCallBlockNumber = await client.getBlockNumber({ cacheTime: 0 })

				// Transaction should fail (execution reverted)
				expect(result.errors).toBeDefined()

				// Check transaction hash based on parameter
				if (shouldHaveTxHash) {
					expect(result.txHash).toBeDefined()
					expect(result.txHash).toMatch(/^0x[a-fA-F0-9]{64}$/)
				} else {
					expect(result.txHash).toBeUndefined()
				}

				// Block should not increment immediately with addToMempool
				expect(afterCallBlockNumber).toBe(initialBlockNumber)

				// If transaction was added to mempool, mining should include it
				if (shouldAddToMempool) {
					await client.tevmMine()
					const finalBlockNumber = await client.getBlockNumber({ cacheTime: 0 })
					// Block should increment after mining (even with failed tx in mempool)
					expect(finalBlockNumber).toBe(initialBlockNumber + 1n)
				}
			})
		})
	})
})
