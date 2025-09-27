import { createMemoryClient, http } from 'tevm'
import { optimism } from 'tevm/common'
import { describe, expect, it } from 'vitest'

describe('Getting Started Guide', () => {
	it('should create a memory client and fork from Optimism', async () => {
		// Create a client that forks from Optimism mainnet
		const client = createMemoryClient({
			fork: {
				transport: http('https://mainnet.optimism.io')({}),
				blockTag: 'latest',
			},
			common: optimism,
		})

		// Verify client is created successfully
		expect(client).toBeDefined()
		expect(client.getBlock).toBeDefined()

		// Read block data using viem's public actions
		const block = await client.getBlock({ blockTag: 'latest' })

		// Verify block data
		expect(block).toBeDefined()
		expect(block.number).toBeDefined()
		expect(block.hash).toMatch(/^0x[a-fA-F0-9]{64}$/)
	})

	it('should demonstrate key features', async () => {
		const client = createMemoryClient({
			fork: {
				transport: http('https://mainnet.optimism.io')({}),
				blockTag: 'latest',
			},
			common: optimism,
		})

		// Test forking functionality
		const block = await client.getBlock({ blockTag: 'latest' })
		expect(block).toBeDefined()

		// Test state manipulation
		const testAddress = '0x1234567890123456789012345678901234567890'
		await client.tevmSetAccount({
			address: testAddress,
			balance: 1000000000000000000n, // 1 ETH
		})

		// Verify account state
		const account = await client.tevmGetAccount({ address: testAddress })
		expect(account).toBeDefined()
		expect(account.balance).toBe(1000000000000000000n)

		// Test JSON-RPC compatibility
		const chainId = await client.getChainId()
		expect(chainId).toBe(10) // Optimism chain ID
	})
})
