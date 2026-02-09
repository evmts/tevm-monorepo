import { ErrorContract } from '@tevm/contract'
import { encodeFunctionData, parseUnits } from 'viem'
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
			{ param: true, shouldHaveTxHash: true, shouldIncrement: false },
			{ param: 'always', shouldHaveTxHash: true, shouldIncrement: false },
			{ param: 'on-success', shouldHaveTxHash: true, shouldIncrement: false },
			{ param: false, shouldHaveTxHash: false, shouldIncrement: false },
			{ param: 'never', shouldHaveTxHash: false, shouldIncrement: false },
		])('addToMempool: $param', async ({ param, shouldHaveTxHash, shouldIncrement }) => {
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

			// addToMempool queues txs and requires explicit mining
			if (shouldIncrement) {
				expect(afterCallBlockNumber).toBe(initialBlockNumber + 1n)
			} else {
				expect(afterCallBlockNumber).toBe(initialBlockNumber)
			}
		})
	})

	describe('no transaction parameters (default behavior)', () => {
		it('should execute as read-only by default', async () => {
			const initialBlockNumber = await client.getBlockNumber({ cacheTime: 0 })

			const result = await client.tevmCall({
				from: testAddress,
				to: recipientAddress,
				value: parseUnits('0.1', 18),
				throwOnFail: false,
			})

			const finalBlockNumber = await client.getBlockNumber({ cacheTime: 0 })

			// Verify transaction success
			expect(result.errors).toBeUndefined()
			expect(result.txHash).toBeUndefined()
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

			// Verify transaction was added
			expect(result.errors).toBeUndefined()
			expect(result.txHash).toBeDefined()

			// addToMempool does not auto-mine
			const afterMempoolBlockNumber = await client.getBlockNumber({ cacheTime: 0 })
			expect(afterMempoolBlockNumber).toBe(initialBlockNumber)

			// Mining includes the queued tx
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
					shouldHaveTxHash: true,
					shouldIncrement: true,
					description: 'on-success - creates tx hash and increments block (true is alias for always)',
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
					shouldAutoMine: false,
					description: 'true - should create tx hash and require manual mining even on failure',
				},
				{
					param: 'always',
					shouldHaveTxHash: true,
					shouldAutoMine: false,
					description: 'always - should create tx hash and require manual mining even on failure',
				},
				{
					param: 'on-success',
					shouldHaveTxHash: false,
					shouldAutoMine: false,
					description: 'on-success - should not create tx hash for failed transactions',
				},
				{
					param: false,
					shouldHaveTxHash: false,
					shouldAutoMine: false,
					description: 'false - should never create tx hash or mine',
				},
				{
					param: 'never',
					shouldHaveTxHash: false,
					shouldAutoMine: false,
					description: 'never - should never create tx hash or mine',
				},
			])('addToMempool: $param - $description', async ({ param, shouldHaveTxHash, shouldAutoMine }) => {
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

				// addToMempool does not auto-mine
				if (shouldAutoMine) {
					expect(afterCallBlockNumber).toBe(initialBlockNumber + 1n)
				} else {
					expect(afterCallBlockNumber).toBe(initialBlockNumber)
				}
			})
		})
	})
})
