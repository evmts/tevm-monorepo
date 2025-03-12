// note: way more tests exist in the src/test folder
// This only tests this specific unit the src/test folder has more e2e tests and examples
import { optimism } from '@tevm/common'
import { transports } from '@tevm/test-utils'
import { describe, expect, it } from 'vitest'
import { createMemoryClient } from './createMemoryClient.js'
import { parseEther } from 'viem'

describe('createMemoryClient', () => {
	it('should create a MemoryClient with default configuration', () => {
		const client = createMemoryClient()
		expect(client).toBeDefined()
		// tevm actions
		expect(client.tevmReady).toBeDefined()
		expect(client.tevmCall).toBeDefined()
		expect(client.tevmContract).toBeDefined()
		expect(client.tevmDeploy).toBeDefined()
		expect(client.tevmMine).toBeDefined()
		expect(client.tevmLoadState).toBeDefined()
		expect(client.tevmDumpState).toBeDefined()
		expect(client.tevmSetAccount).toBeDefined()
		expect(client.tevmGetAccount).toBeDefined()
		expect(client.getBlockNumber).toBeDefined()

		// public actions
		expect(client.getBalance).toBeDefined()
		expect(client.getChainId).toBeDefined()
		expect(client.readContract).toBeDefined()
		expect(client.estimateGas).toBeDefined()

		// wallet actions
		expect(client.sendTransaction).toBeDefined()
		expect(client.writeContract).toBeDefined()

		// test actions
		expect(client.setCode).toBeDefined()
		expect(client.setBalance).toBeDefined()
		expect(client.mine).toBeDefined()
	})

	it('should create a MemoryClient with custom options', () => {
		const customOptions = {
			name: 'CustomMemoryClient',
			key: 'customMemoryClient',
		}
		const client = createMemoryClient(customOptions)
		expect(client).toBeDefined()
		expect(client.tevmReady).toBeDefined()
		expect(client.tevmCall).toBeDefined()
		expect(client.tevmContract).toBeDefined()
		expect(client.tevmDeploy).toBeDefined()
		expect(client.tevmMine).toBeDefined()
		expect(client.tevmLoadState).toBeDefined()
		expect(client.tevmDumpState).toBeDefined()
		expect(client.tevmSetAccount).toBeDefined()
		expect(client.tevmGetAccount).toBeDefined()
		expect(client.getBlockNumber).toBeDefined()
		expect(client.sendTransaction).toBeDefined()
		expect(client.setBalance).toBeDefined()
	})

	it('should create a MemoryClient that can fork from another network', async () => {
		const client = createMemoryClient({
			fork: {
				transport: transports.optimism,
			},
			common: optimism,
		})
		
		expect(client).toBeDefined()
		const ready = await client.tevmReady()
		expect(ready).toBe(true)
		
		// Check that we can interact with the forked network
		const blockNumber = await client.getBlockNumber()
		expect(blockNumber).toBeGreaterThan(0n)
	})

	it('should auto-mine transactions when miningMode is set to auto', async () => {
		const testAddress = '0x1234567890123456789012345678901234567890'
		const client = createMemoryClient({
			miningConfig: {
				type: 'auto',
			},
		})
		
		await client.tevmReady()
		
		// Set initial balance
		await client.setBalance({
			address: testAddress,
			value: parseEther('1.0'),
		})
		
		// In auto mining mode, the transaction should be mined automatically
		// without needing to call client.mine()
		await client.sendTransaction({
			account: testAddress,
			to: '0x0000000000000000000000000000000000000000',
			value: parseEther('0.1'),
		})
		
		// Check if the balance was updated (transaction mined)
		const balance = await client.getBalance({ address: testAddress })
		
		// Balance should be less than initial amount (1 ETH - 0.1 ETH - gas costs)
		expect(balance).toBeLessThan(parseEther('0.9'))
	})
})
