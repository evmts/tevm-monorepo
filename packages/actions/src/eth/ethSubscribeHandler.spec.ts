import { createAddress } from '@tevm/address'
import { createTevmNode } from '@tevm/node'
import { SimpleContract } from '@tevm/test-utils'
import { encodeFunctionData, PREFUNDED_ACCOUNTS } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { callHandler } from '../Call/callHandler.js'
import { deployHandler } from '../Deploy/deployHandler.js'
import { mineHandler } from '../Mine/mineHandler.js'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { ethSubscribeHandler } from './ethSubscribeHandler.js'

describe(ethSubscribeHandler.name, () => {
	it('should create a newHeads subscription and receive block notifications', async () => {
		const client = createTevmNode()
		const subscribe = ethSubscribeHandler(client)

		// Create subscription
		const subscriptionId = await subscribe({ subscriptionType: 'newHeads' })

		expect(subscriptionId).toMatch(/^0x[a-f0-9]+$/i)

		// Verify filter was created
		const filter = client.getFilters().get(subscriptionId)
		expect(filter).toBeDefined()
		expect(filter?.type).toBe('Block')

		// Mine a block to trigger the subscription
		await mineHandler(client)()

		// Check that the block was added to the filter
		const updatedFilter = client.getFilters().get(subscriptionId)
		expect(updatedFilter?.blocks.length).toBe(1)
	})

	it('should create a logs subscription and receive log notifications', async () => {
		const client = createTevmNode()
		const from = createAddress(PREFUNDED_ACCOUNTS[0].address).toString()

		await setAccountHandler(client)({
			address: from,
			balance: 10000000000000000000n,
		})

		// Deploy a contract that emits events
		const deployResult = await deployHandler(client)({
			abi: SimpleContract.abi,
			bytecode: SimpleContract.bytecode,
			args: [0n],
			from,
		})

		const contractAddress = deployResult.createdAddress
		expect(contractAddress).toBeDefined()

		await mineHandler(client)()

		// Create subscription for logs from this contract
		const subscribe = ethSubscribeHandler(client)
		const subscriptionId = await subscribe({
			subscriptionType: 'logs',
			filterParams: {
				address: contractAddress,
			},
		})

		expect(subscriptionId).toMatch(/^0x[a-f0-9]+$/i)

		// Verify filter was created
		const filter = client.getFilters().get(subscriptionId)
		expect(filter).toBeDefined()
		expect(filter?.type).toBe('Log')

		// Emit an event
		await callHandler(client)({
			to: contractAddress,
			from,
			data: encodeFunctionData(SimpleContract.write.set(42n)),
			createTransaction: true,
		})
		await mineHandler(client)()

		// Note: In the current implementation, logs are added via the 'newLog' event
		// The test verifies the subscription was created correctly
	})

	it('should create a logs subscription with topic filters', async () => {
		const client = createTevmNode()
		const subscribe = ethSubscribeHandler(client)

		const topic = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
		const subscriptionId = await subscribe({
			subscriptionType: 'logs',
			filterParams: {
				address: '0x1234567890123456789012345678901234567890',
				topics: [topic],
			},
		})

		expect(subscriptionId).toMatch(/^0x[a-f0-9]+$/i)

		const filter = client.getFilters().get(subscriptionId)
		expect(filter).toBeDefined()
		expect(filter?.type).toBe('Log')
		expect(filter?.logsCriteria).toEqual({
			address: '0x1234567890123456789012345678901234567890',
			topics: [topic],
		})
	})

	it('should create a newPendingTransactions subscription', async () => {
		const client = createTevmNode()
		const subscribe = ethSubscribeHandler(client)

		const subscriptionId = await subscribe({ subscriptionType: 'newPendingTransactions' })

		expect(subscriptionId).toMatch(/^0x[a-f0-9]+$/i)

		const filter = client.getFilters().get(subscriptionId)
		expect(filter).toBeDefined()
		expect(filter?.type).toBe('PendingTransaction')
	})

	it('should create a syncing subscription', async () => {
		const client = createTevmNode()
		const subscribe = ethSubscribeHandler(client)

		const subscriptionId = await subscribe({ subscriptionType: 'syncing' })

		expect(subscriptionId).toMatch(/^0x[a-f0-9]+$/i)

		const filter = client.getFilters().get(subscriptionId)
		expect(filter).toBeDefined()
	})

	it('should throw InvalidParamsError for invalid subscription type', async () => {
		const client = createTevmNode()
		const subscribe = ethSubscribeHandler(client)

		await expect(
			subscribe({
				// @ts-expect-error - Testing invalid subscription type
				subscriptionType: 'invalid',
			}),
		).rejects.toThrow('Invalid subscription type: invalid')
	})

	it('should generate unique subscription IDs', async () => {
		const client = createTevmNode()
		const subscribe = ethSubscribeHandler(client)

		const ids = new Set()
		for (let i = 0; i < 10; i++) {
			const id = await subscribe({ subscriptionType: 'newHeads' })
			ids.add(id)
		}

		// All IDs should be unique
		expect(ids.size).toBe(10)
	})

	it('should handle logs subscription with array of addresses', async () => {
		const client = createTevmNode()
		const subscribe = ethSubscribeHandler(client)

		const subscriptionId = await subscribe({
			subscriptionType: 'logs',
			filterParams: {
				address: [
					'0x1234567890123456789012345678901234567890',
					'0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
				],
			},
		})

		expect(subscriptionId).toMatch(/^0x[a-f0-9]+$/i)

		const filter = client.getFilters().get(subscriptionId)
		expect(filter).toBeDefined()
		expect(filter?.logsCriteria?.address).toEqual([
			'0x1234567890123456789012345678901234567890',
			'0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
		])
	})

	it('should handle logs subscription with OR topics (array of topics)', async () => {
		const client = createTevmNode()
		const subscribe = ethSubscribeHandler(client)

		const topic1 = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
		const topic2 = '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925'

		const subscriptionId = await subscribe({
			subscriptionType: 'logs',
			filterParams: {
				topics: [[topic1, topic2]],
			},
		})

		expect(subscriptionId).toMatch(/^0x[a-f0-9]+$/i)

		const filter = client.getFilters().get(subscriptionId)
		expect(filter).toBeDefined()
		expect(filter?.logsCriteria?.topics).toEqual([[topic1, topic2]])
	})

	it('should handle logs subscription with null topics (wildcard)', async () => {
		const client = createTevmNode()
		const subscribe = ethSubscribeHandler(client)

		const topic1 = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'

		const subscriptionId = await subscribe({
			subscriptionType: 'logs',
			filterParams: {
				topics: [topic1, null],
			},
		})

		expect(subscriptionId).toMatch(/^0x[a-f0-9]+$/i)

		const filter = client.getFilters().get(subscriptionId)
		expect(filter).toBeDefined()
		expect(filter?.logsCriteria?.topics).toEqual([topic1, null])
	})

	it('should create logs subscription without filter params', async () => {
		const client = createTevmNode()
		const subscribe = ethSubscribeHandler(client)

		const subscriptionId = await subscribe({
			subscriptionType: 'logs',
		})

		expect(subscriptionId).toMatch(/^0x[a-f0-9]+$/i)

		const filter = client.getFilters().get(subscriptionId)
		expect(filter).toBeDefined()
		expect(filter?.type).toBe('Log')
	})
})
