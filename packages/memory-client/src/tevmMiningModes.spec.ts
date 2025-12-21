import { SimpleContract } from '@tevm/contract'
import { type Address, parseEther } from 'viem'
import { beforeEach, describe, expect, it } from 'vitest'
import { createMemoryClient } from './createMemoryClient.js'
import type { MemoryClient } from './MemoryClient.js'

describe('Tevm Mining Modes', () => {
	const testAddress = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' as Address
	let client: MemoryClient

	describe('auto mining mode', () => {
		beforeEach(async () => {
			client = createMemoryClient({
				miningConfig: {
					type: 'auto',
				},
			})
			await client.tevmReady()

			await client.tevmSetAccount({
				address: testAddress,
				balance: parseEther('10'),
			})
		})

		it('should mine transactions automatically', async () => {
			const initialBlockNumber = await client.getBlockNumber()

			const recipient = '0x1111111111111111111111111111111111111111' as Address
			await client.tevmCall({
				from: testAddress,
				to: recipient,
				value: parseEther('1'),
				addToBlockchain: true,
			})

			const blockNumberAfterTx = await client.getBlockNumber()
			expect(blockNumberAfterTx).toBeGreaterThan(initialBlockNumber)
		})

		it('should mine contract deployments automatically', async () => {
			const initialBlockNumber = await client.getBlockNumber()

			const deployResult = await client.tevmDeploy({
				bytecode: SimpleContract.bytecode,
				abi: SimpleContract.abi,
				args: [42n],
				from: testAddress,
				addToBlockchain: true,
			})

			expect(deployResult.createdAddress).toBeDefined()

			const blockNumberAfterDeploy = await client.getBlockNumber()
			expect(blockNumberAfterDeploy).toBeGreaterThan(initialBlockNumber)
		})
	})

	describe('manual mining mode', () => {
		beforeEach(async () => {
			client = createMemoryClient({
				miningConfig: {
					type: 'manual',
				},
			})
			await client.tevmReady()

			await client.tevmSetAccount({
				address: testAddress,
				balance: parseEther('10'),
			})
		})

		it('should not mine transactions automatically', async () => {
			const initialBlockNumber = await client.getBlockNumber()

			const recipient = '0x1111111111111111111111111111111111111111' as Address
			await client.tevmCall({
				from: testAddress,
				to: recipient,
				value: parseEther('1'),
				addToMempool: true,
			})

			const blockNumberBeforeMining = await client.getBlockNumber()
			expect(blockNumberBeforeMining).toBe(initialBlockNumber)

			await client.tevmMine({ blockCount: 1 })

			const blockNumberAfterMining = await client.getBlockNumber()
			expect(blockNumberAfterMining).toBeGreaterThan(initialBlockNumber)
		})

		it('should not mine contract deployments automatically', async () => {
			const initialBlockNumber = await client.getBlockNumber()

			const deployResult = await client.tevmDeploy({
				bytecode: SimpleContract.bytecode,
				abi: SimpleContract.abi,
				args: [42n],
				from: testAddress,
				addToMempool: true,
			})

			expect(deployResult.createdAddress).toBeDefined()

			const blockNumberBeforeMining = await client.getBlockNumber()
			expect(blockNumberBeforeMining).toBe(initialBlockNumber)

			await client.tevmMine({ blockCount: 1 })

			const blockNumberAfterMining = await client.getBlockNumber()
			expect(blockNumberAfterMining).toBeGreaterThan(initialBlockNumber)
		})

		it('should batch multiple transactions in a single block', async () => {
			const initialBlockNumber = await client.getBlockNumber()

			const recipients = [
				'0x1111111111111111111111111111111111111111',
				'0x2222222222222222222222222222222222222222',
				'0x3333333333333333333333333333333333333333',
			].map((addr) => addr as Address)

			for (const recipient of recipients) {
				await client.tevmCall({
					from: testAddress,
					to: recipient,
					value: parseEther('1'),
					addToMempool: true,
				})
			}

			const blockNumberBeforeMining = await client.getBlockNumber()
			expect(blockNumberBeforeMining).toBe(initialBlockNumber)

			await client.tevmMine({ blockCount: 1 })

			const blockNumberAfterMining = await client.getBlockNumber()
			expect(blockNumberAfterMining).toBe(initialBlockNumber + 1n)

			for (const recipient of recipients) {
				const balance = await client.getBalance({ address: recipient })
				expect(balance).toBe(parseEther('1'))
			}
		})
	})
})
