import { SimpleContract } from '@tevm/contract'
import { type Address, parseEther } from 'viem'
import { describe, expect, it } from 'vitest'
import { createMemoryClient } from './createMemoryClient.js'

// @ts-expect-error -- Ignoring TS errors in test file

// FIXME: These tests need more work to properly simulate mining modes
describe.skip('Tevm Mining Modes', () => {
	const testAddress = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' as Address

	it('should mine blocks automatically in auto mode', async () => {
		// Create a client with auto mining mode (default)
		const client = createMemoryClient({
			mining: {
				mode: 'auto',
			},
		})
		await client.tevmReady()

		// Set up a funded account
		await client.tevmSetAccount({
			address: testAddress,
			balance: parseEther('10'),
			nonce: 0n,
		})

		// Get initial block number
		const initialBlockNumber = await client.getBlockNumber()

		// Deploy a contract - this should automatically mine a block
		const deployResult = await client.tevmDeploy({
			bytecode: SimpleContract.bytecode,
			abi: SimpleContract.abi,
			args: [42n],
			from: testAddress,
		})

		expect(deployResult.createdAddress).toBeDefined()
		const contractAddress = deployResult.createdAddress as Address

		// Block number should have increased without explicit mining
		const blockNumberAfterDeploy = await client.getBlockNumber()
		expect(blockNumberAfterDeploy).toBeGreaterThan(initialBlockNumber)

		// Contract instance
		const contract = SimpleContract.withAddress(contractAddress)

		// Send a transaction to update the contract state
		await client.tevmContract({
			...contract.write.set(99n),
			from: testAddress,
		})

		// Block number should increase again without explicit mining
		const finalBlockNumber = await client.getBlockNumber()
		expect(finalBlockNumber).toBeGreaterThan(blockNumberAfterDeploy)
	})

	it('should require manual mining in manual mode', async () => {
		// Create a client with manual mining mode
		const client = createMemoryClient({
			mining: {
				mode: 'manual',
			},
		})
		await client.tevmReady()

		// Set up a funded account
		await client.tevmSetAccount({
			address: testAddress,
			balance: parseEther('10'),
			nonce: 0n,
		})

		// Get initial block number
		const initialBlockNumber = await client.getBlockNumber()

		// Deploy a contract - this should NOT automatically mine a block
		const deployResult = await client.tevmDeploy({
			bytecode: SimpleContract.bytecode,
			abi: SimpleContract.abi,
			args: [42n],
			from: testAddress,
		})

		expect(deployResult.createdAddress).toBeDefined()
		const contractAddress = deployResult.createdAddress as Address

		// Block number should NOT have increased without explicit mining
		const blockNumberBeforeMining = await client.getBlockNumber()
		expect(blockNumberBeforeMining).toBe(initialBlockNumber)

		// Manually mine a block
		await client.tevmMine({ blockCount: 1 })

		// Block number should now increase
		const blockNumberAfterMining = await client.getBlockNumber()
		expect(blockNumberAfterMining).toBeGreaterThan(initialBlockNumber)

		// Contract instance
		const contract = SimpleContract.withAddress(contractAddress)

		// Send a transaction to update the contract state
		await client.tevmContract({
			...contract.write.set(99n),
			from: testAddress,
		})

		// Block number should NOT increase automatically
		const blockNumberAfterTx = await client.getBlockNumber()
		expect(blockNumberAfterTx).toBe(blockNumberAfterMining)

		// Mine another block manually
		await client.tevmMine({ blockCount: 1 })

		// Block number should now increase again
		const finalBlockNumber = await client.getBlockNumber()
		expect(finalBlockNumber).toBeGreaterThan(blockNumberAfterTx)
	})

	it('should handle multiple transactions in single blocks', async () => {
		// Create a client with manual mining mode
		const client = createMemoryClient({
			mining: {
				mode: 'manual',
			},
		})
		await client.tevmReady()

		// Set up a funded account
		await client.tevmSetAccount({
			address: testAddress,
			balance: parseEther('100'),
			nonce: 0n,
		})

		// Get initial nonce
		const initialNonce = await client.getTransactionCount({ address: testAddress })
		expect(initialNonce).toBe(0n)

		// Send multiple transactions without mining
		const recipients = [
			'0x1111111111111111111111111111111111111111',
			'0x2222222222222222222222222222222222222222',
			'0x3333333333333333333333333333333333333333',
			'0x4444444444444444444444444444444444444444',
			'0x5555555555555555555555555555555555555555',
		].map((addr) => addr as Address)

		// Impersonate the account
		await client.impersonateAccount({ address: testAddress })

		// Send transactions in sequence
		for (const recipient of recipients) {
			await client.sendTransaction({
				from: testAddress,
				to: recipient,
				value: parseEther('1'),
			})
		}

		// Nonce should have increased for each transaction
		const nonceAfterTxs = await client.getTransactionCount({ address: testAddress })
		expect(nonceAfterTxs).toBe(BigInt(recipients.length))

		// Block number should NOT have increased (manual mining)
		const blockNumberBeforeMining = await client.getBlockNumber()
		expect(blockNumberBeforeMining).toBe(0n) // Initial block

		// Mine a single block to include all transactions
		await client.tevmMine({ blockCount: 1 })

		// Block number should increase by 1
		const blockNumberAfterMining = await client.getBlockNumber()
		expect(blockNumberAfterMining).toBe(1n)
	})

	it('should respect set mining interval', async () => {
		// Mining interval in seconds
		const miningInterval = 10

		// Create a client with interval mining mode
		const client = createMemoryClient({
			mining: {
				mode: 'interval',
				interval: miningInterval,
			},
		})
		await client.tevmReady()

		// Mine two blocks
		await client.tevmMine({ blockCount: 2 })

		// Get the last block timestamp
		const vm = await client.transport.tevm.getVm()
		const latestBlock = await vm.blockchain.getLatestBlock()
		const firstBlockTime = Number(latestBlock.header.timestamp)

		// Mine one more block
		await client.tevmMine({ blockCount: 1 })

		// Get the new latest block timestamp
		const newLatestBlock = await vm.blockchain.getLatestBlock()
		const secondBlockTime = Number(newLatestBlock.header.timestamp)

		// The difference should be at least the mining interval
		const timeDiff = secondBlockTime - firstBlockTime
		expect(timeDiff).toBeGreaterThanOrEqual(miningInterval)
	})
})
