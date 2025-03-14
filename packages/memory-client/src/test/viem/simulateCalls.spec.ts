import { SimpleContract } from '@tevm/test-utils'
import { parseEther } from 'viem'
import { beforeEach, describe, expect, it } from 'vitest'
import type { MemoryClient } from '../../MemoryClient.js'
import { createMemoryClient } from '../../createMemoryClient.js'

describe('simulateCalls', () => {
	let client: MemoryClient
	let contract: SimpleContract

	beforeEach(async () => {
		client = createMemoryClient()
		// Deploy a contract for testing
		contract = await SimpleContract.deploy(client)
		await client.mine({ blocks: 1 })
	})

	it('should simulate multiple calls correctly', async () => {
		const testAddress = '0x1234567890123456789012345678901234567890'
		const sender = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'

		// Set up account balance
		await client.setBalance({
			address: sender,
			value: parseEther('10'),
		})

		const { results } = await client.simulateCalls({
			account: sender,
			calls: [
				// Call to get value
				{
					to: contract.address,
					data: '0x6d4ce63c', // get()
				},
				// Call to set value
				{
					to: contract.address,
					data: '0x60fe47b10000000000000000000000000000000000000000000000000000000000000042', // set(66)
				},
				// Call to transfer ETH
				{
					to: testAddress,
					value: parseEther('1'),
				},
			],
		})

		expect(results.length).toBe(3)

		// First call (get)
		expect(results[0].status).toBe('success')
		expect(results[0].data).toBe('0x0000000000000000000000000000000000000000000000000000000000000000')

		// Second call (set)
		expect(results[1].status).toBe('success')

		// Third call (transfer)
		expect(results[2].status).toBe('success')
		expect(results[2].gasUsed).toBe(21000n)
	})

	it('should simulate calls with ABI and functionName', async () => {
		const { results } = await client.simulateCalls({
			calls: [
				{
					to: contract.address,
					abi: [
						{
							inputs: [],
							name: 'get',
							outputs: [{ type: 'uint256', name: '' }],
							stateMutability: 'view',
							type: 'function',
						},
					],
					functionName: 'get',
				},
				{
					to: contract.address,
					abi: [
						{
							inputs: [{ type: 'uint256', name: 'x' }],
							name: 'set',
							outputs: [],
							stateMutability: 'nonpayable',
							type: 'function',
						},
					],
					functionName: 'set',
					args: [123],
				},
			],
		})

		expect(results.length).toBe(2)
		expect(results[0].status).toBe('success')
		expect(results[0].result).toBe(0n)
		expect(results[1].status).toBe('success')
	})

	it('should return asset changes when traceAssetChanges is enabled', async () => {
		const testAddress = '0x1234567890123456789012345678901234567890'
		const sender = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'

		// Set up account balance
		await client.setBalance({
			address: sender,
			value: parseEther('10'),
		})

		const { results, assetChanges } = await client.simulateCalls({
			account: sender,
			traceAssetChanges: true,
			calls: [
				{
					to: testAddress,
					value: parseEther('1'),
				},
			],
		})

		expect(results.length).toBe(1)
		expect(results[0].status).toBe('success')

		expect(assetChanges).toBeDefined()
		expect(assetChanges?.length).toBeGreaterThan(0)
		expect(assetChanges?.[0].token.symbol).toBe('ETH')
		expect(assetChanges?.[0].value.diff).toBeLessThan(0n) // Negative (outflow)
	})

	it('should handle state overrides', async () => {
		const testAddress = '0x1234567890123456789012345678901234567890'

		const { results } = await client.simulateCalls({
			calls: [
				{
					to: testAddress,
					data: '0x6d4ce63c', // get()
				},
			],
			stateOverrides: [
				{
					address: testAddress,
					code: '0x608060405260043610601c5760003560e01c80636d4ce63c146021575b600080fd5b60276029565b005b60008054905090565b6000546034565b90565b6000819055505b50565b600080fd',
					balance: parseEther('2'),
				},
			],
		})

		expect(results[0].status).toBe('success')
	})

	it('should handle failures in calls', async () => {
		const { results } = await client.simulateCalls({
			calls: [
				{
					to: '0x0000000000000000000000000000000000000000',
					data: '0xdeadbeef', // Invalid data
				},
			],
		})

		expect(results[0].status).toBe('failure')
		expect(results[0].error).toBeDefined()
	})
})
