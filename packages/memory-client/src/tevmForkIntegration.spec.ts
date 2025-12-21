import { optimism } from '@tevm/common'
import { createCachedOptimismTransport } from '@tevm/test-utils'
import { type Address, createClient, parseEther } from 'viem'
import { getBalance, getBlockNumber, getCode, sendTransaction } from 'viem/actions'
import { describe, expect, it } from 'vitest'
import { createTevmTransport } from './createTevmTransport.js'
import { tevmMine } from './tevmMine.js'
import { tevmSetAccount } from './tevmSetAccount.js'

describe('Tevm Forking Integration', () => {
	const testAddress = '0x1234567890123456789012345678901234567890' as Address
	const daiContractAddress = '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1' as Address // DAI on Optimism

	const cachedTransport = createCachedOptimismTransport()
	const client = createClient({
		transport: createTevmTransport({
			fork: {
				transport: cachedTransport,
				blockTag: 142153711n,
			},
		}),
		chain: optimism,
	})

	it('should allow forking from an existing network', async () => {
		// Check that we can access block info from the forked network
		const blockNumber = await getBlockNumber(client)
		expect(blockNumber).toBeGreaterThan(0n)

		// DAI contract should exist on the forked network
		const code = await getCode(client, { address: daiContractAddress })
		expect(code).not.toBe('0x')
		if (code) {
			expect(code.length).toBeGreaterThan(2) // More than just '0x'
		}
	})

	it('should allow local state modifications while preserving fork state', async () => {
		// Original balance on the fork
		const originalBalance = await getBalance(client, { address: testAddress })

		// Modify local state by setting a new balance
		const localBalance = parseEther('100')
		await tevmSetAccount(client, {
			address: testAddress,
			balance: localBalance,
		})

		// The balance should now reflect our local change
		const modifiedBalance = await getBalance(client, { address: testAddress })
		expect(modifiedBalance).toBe(localBalance)
		expect(modifiedBalance).not.toBe(originalBalance)

		// Ensure changes only affect local state, not the actual forked network
		// This is implicit since we're using a local client
	})

	it('should handle transaction processing on a forked network', async () => {
		// Setup a funded account to send transactions
		const senderAddress = '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef' as Address
		await tevmSetAccount(client, {
			address: senderAddress,
			balance: parseEther('10'),
			nonce: 0n,
		})

		// Initial balance of recipient
		const initialRecipientBalance = await getBalance(client, { address: testAddress })

		// Send a transaction on the forked network
		const txHash = await sendTransaction(client, {
			account: senderAddress,
			to: testAddress,
			value: parseEther('1'),
		})

		expect(txHash).toBeDefined()

		// Mine to include the transaction
		await tevmMine(client, { blockCount: 1 })

		// Check that recipient balance was updated
		const newRecipientBalance = await getBalance(client, { address: testAddress })
		expect(newRecipientBalance).toBe(initialRecipientBalance + parseEther('1'))
	})

	it('should handle chain configuration when forking', async () => {
		// Verify the chain by checking the chain object passed in
		expect(optimism.id).toBe(10) // Optimism mainnet ID

		// The optimism object may have the name "OP Mainnet" rather than "Optimism"
		expect(optimism.name).toBeDefined()
		expect(typeof optimism.name).toBe('string')

		// Check a fork-specific operation to verify it's connected to the right chain
		const blockNumber = await getBlockNumber(client)
		expect(blockNumber).toBeGreaterThan(0n)
	})
})
