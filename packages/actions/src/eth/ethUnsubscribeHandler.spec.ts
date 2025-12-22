import { createAddress } from '@tevm/address'
import { createTevmNode } from '@tevm/node'
import { SimpleContract } from '@tevm/test-utils'
import { encodeFunctionData, type Hex, PREFUNDED_ACCOUNTS } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { callHandler } from '../Call/callHandler.js'
import { deployHandler } from '../Deploy/deployHandler.js'
import { mineHandler } from '../Mine/mineHandler.js'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { ethSubscribeHandler } from './ethSubscribeHandler.js'
import { ethUnsubscribeHandler } from './ethUnsubscribeHandler.js'

describe('ethUnsubscribeHandler', () => {
	it('should successfully unsubscribe from a newHeads subscription', async () => {
		const client = createTevmNode()
		const subscribe = ethSubscribeHandler(client)
		const unsubscribe = ethUnsubscribeHandler(client)

		// Create subscription
		const subscriptionId = await subscribe({ subscriptionType: 'newHeads' })
		expect(subscriptionId).toBeDefined()

		// Verify filter exists
		const filterBefore = client.getFilters().get(subscriptionId)
		expect(filterBefore).toBeDefined()

		// Unsubscribe
		const result = await unsubscribe({ subscriptionId })

		expect(result).toBe(true)

		// Verify filter is removed
		const filterAfter = client.getFilters().get(subscriptionId)
		expect(filterAfter).toBeUndefined()
	})

	it('should return false when unsubscribing from non-existent subscription', async () => {
		const client = createTevmNode()
		const unsubscribe = ethUnsubscribeHandler(client)

		const result = await unsubscribe({ subscriptionId: '0xnonexistent' })

		expect(result).toBe(false)
	})

	it('should remove event listener when unsubscribing from newHeads', async () => {
		const client = createTevmNode()
		const subscribe = ethSubscribeHandler(client)
		const unsubscribe = ethUnsubscribeHandler(client)

		const subscriptionId = await subscribe({ subscriptionType: 'newHeads' })

		// Mine a block before unsubscribe
		await mineHandler(client)()
		const filterBeforeUnsubscribe = client.getFilters().get(subscriptionId)
		const blockCountBefore = filterBeforeUnsubscribe?.blocks.length ?? 0
		expect(blockCountBefore).toBe(1)

		// Unsubscribe
		const result = await unsubscribe({ subscriptionId })
		expect(result).toBe(true)

		// Mine another block - it should not be added to the now-removed filter
		await mineHandler(client)()

		// Filter should be completely removed
		const filterAfter = client.getFilters().get(subscriptionId)
		expect(filterAfter).toBeUndefined()
	})

	it('should remove event listener when unsubscribing from logs subscription', async () => {
		const client = createTevmNode()
		const from = createAddress(PREFUNDED_ACCOUNTS[0].address).toString()

		await setAccountHandler(client)({
			address: from,
			balance: 10000000000000000000n,
		})

		// Deploy a contract
		const deployResult = await deployHandler(client)({
			abi: SimpleContract.abi,
			bytecode: SimpleContract.bytecode,
			args: [0n],
			from,
		})

		const contractAddress = deployResult.createdAddress!
		expect(contractAddress).toBeDefined()

		await mineHandler(client)()

		const subscribe = ethSubscribeHandler(client)
		const unsubscribe = ethUnsubscribeHandler(client)

		// Create logs subscription
		const subscriptionId = await subscribe({
			subscriptionType: 'logs',
			filterParams: {
				address: contractAddress,
			},
		})

		// Verify subscription exists
		const filterBefore = client.getFilters().get(subscriptionId)
		expect(filterBefore).toBeDefined()
		expect(filterBefore?.type).toBe('Log')

		// Unsubscribe
		const result = await unsubscribe({ subscriptionId })
		expect(result).toBe(true)

		// Verify filter is removed
		const filterAfter = client.getFilters().get(subscriptionId)
		expect(filterAfter).toBeUndefined()
	})

	it('should remove event listener when unsubscribing from newPendingTransactions', async () => {
		const client = createTevmNode()
		const subscribe = ethSubscribeHandler(client)
		const unsubscribe = ethUnsubscribeHandler(client)

		const subscriptionId = await subscribe({ subscriptionType: 'newPendingTransactions' })

		// Verify subscription exists
		const filterBefore = client.getFilters().get(subscriptionId)
		expect(filterBefore).toBeDefined()
		expect(filterBefore?.type).toBe('PendingTransaction')

		// Unsubscribe
		const result = await unsubscribe({ subscriptionId })
		expect(result).toBe(true)

		// Verify filter is removed
		const filterAfter = client.getFilters().get(subscriptionId)
		expect(filterAfter).toBeUndefined()
	})

	it('should handle multiple subscriptions and unsubscribe only the specified one', async () => {
		const client = createTevmNode()
		const subscribe = ethSubscribeHandler(client)
		const unsubscribe = ethUnsubscribeHandler(client)

		// Create multiple subscriptions
		const sub1 = await subscribe({ subscriptionType: 'newHeads' })
		const sub2 = await subscribe({ subscriptionType: 'newPendingTransactions' })
		const sub3 = await subscribe({ subscriptionType: 'logs' })

		// Verify all exist
		expect(client.getFilters().get(sub1)).toBeDefined()
		expect(client.getFilters().get(sub2)).toBeDefined()
		expect(client.getFilters().get(sub3)).toBeDefined()

		// Unsubscribe from one
		const result = await unsubscribe({ subscriptionId: sub2 })
		expect(result).toBe(true)

		// Verify only sub2 is removed
		expect(client.getFilters().get(sub1)).toBeDefined()
		expect(client.getFilters().get(sub2)).toBeUndefined()
		expect(client.getFilters().get(sub3)).toBeDefined()
	})

	it('should handle unsubscribing the same subscription twice', async () => {
		const client = createTevmNode()
		const subscribe = ethSubscribeHandler(client)
		const unsubscribe = ethUnsubscribeHandler(client)

		const subscriptionId = await subscribe({ subscriptionType: 'newHeads' })

		// First unsubscribe should succeed
		const result1 = await unsubscribe({ subscriptionId })
		expect(result1).toBe(true)

		// Second unsubscribe should return false (subscription not found)
		const result2 = await unsubscribe({ subscriptionId })
		expect(result2).toBe(false)
	})

	it('should remove listener for logs subscription with specific address filter', async () => {
		const client = createTevmNode()
		const subscribe = ethSubscribeHandler(client)
		const unsubscribe = ethUnsubscribeHandler(client)

		const testAddress = '0x1234567890123456789012345678901234567890'

		const subscriptionId = await subscribe({
			subscriptionType: 'logs',
			filterParams: {
				address: testAddress,
			},
		})

		const filter = client.getFilters().get(subscriptionId)
		expect(filter).toBeDefined()
		expect(filter?.logsCriteria?.address).toBe(testAddress)

		const result = await unsubscribe({ subscriptionId })
		expect(result).toBe(true)

		expect(client.getFilters().get(subscriptionId)).toBeUndefined()
	})

	it('should remove listener for logs subscription with topics filter', async () => {
		const client = createTevmNode()
		const subscribe = ethSubscribeHandler(client)
		const unsubscribe = ethUnsubscribeHandler(client)

		const topic = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'

		const subscriptionId = await subscribe({
			subscriptionType: 'logs',
			filterParams: {
				topics: [topic],
			},
		})

		const filter = client.getFilters().get(subscriptionId)
		expect(filter).toBeDefined()
		expect(filter?.logsCriteria?.topics).toEqual([topic])

		const result = await unsubscribe({ subscriptionId })
		expect(result).toBe(true)

		expect(client.getFilters().get(subscriptionId)).toBeUndefined()
	})

	it('should handle unsubscribing from syncing subscription', async () => {
		const client = createTevmNode()
		const subscribe = ethSubscribeHandler(client)
		const unsubscribe = ethUnsubscribeHandler(client)

		const subscriptionId = await subscribe({ subscriptionType: 'syncing' })

		const filter = client.getFilters().get(subscriptionId)
		expect(filter).toBeDefined()

		const result = await unsubscribe({ subscriptionId })
		expect(result).toBe(true)

		expect(client.getFilters().get(subscriptionId)).toBeUndefined()
	})

	it('should handle rapid subscribe and unsubscribe operations', async () => {
		const client = createTevmNode()
		const subscribe = ethSubscribeHandler(client)
		const unsubscribe = ethUnsubscribeHandler(client)

		const subscriptions: Hex[] = []

		// Create multiple subscriptions rapidly
		for (let i = 0; i < 10; i++) {
			const sub = await subscribe({ subscriptionType: 'newHeads' })
			subscriptions.push(sub)
		}

		// Verify all were created
		for (const sub of subscriptions) {
			expect(client.getFilters().get(sub)).toBeDefined()
		}

		// Unsubscribe from all
		for (const sub of subscriptions) {
			const result = await unsubscribe({ subscriptionId: sub })
			expect(result).toBe(true)
		}

		// Verify all were removed
		for (const sub of subscriptions) {
			expect(client.getFilters().get(sub)).toBeUndefined()
		}
	})

	it('should properly clean up listener when subscription has received data', async () => {
		const client = createTevmNode()
		const subscribe = ethSubscribeHandler(client)
		const unsubscribe = ethUnsubscribeHandler(client)

		const subscriptionId = await subscribe({ subscriptionType: 'newHeads' })

		// Generate some blocks to populate the subscription
		await mineHandler(client)()
		await mineHandler(client)()
		await mineHandler(client)()

		const filter = client.getFilters().get(subscriptionId)
		expect(filter?.blocks.length).toBeGreaterThan(0)

		// Unsubscribe should still work correctly
		const result = await unsubscribe({ subscriptionId })
		expect(result).toBe(true)

		expect(client.getFilters().get(subscriptionId)).toBeUndefined()
	})

	it('should handle logs subscription with contract interaction before unsubscribe', async () => {
		const client = createTevmNode()
		const from = createAddress(PREFUNDED_ACCOUNTS[0].address).toString()

		await setAccountHandler(client)({
			address: from,
			balance: 10000000000000000000n,
		})

		// Deploy contract
		const deployResult = await deployHandler(client)({
			abi: SimpleContract.abi,
			bytecode: SimpleContract.bytecode,
			args: [0n],
			from,
		})

		const contractAddress = deployResult.createdAddress!
		await mineHandler(client)()

		const subscribe = ethSubscribeHandler(client)
		const unsubscribe = ethUnsubscribeHandler(client)

		const subscriptionId = await subscribe({
			subscriptionType: 'logs',
			filterParams: {
				address: contractAddress,
			},
		})

		// Trigger an event
		await callHandler(client)({
			to: contractAddress,
			from,
			data: encodeFunctionData(SimpleContract.write.set(42n)),
			createTransaction: true,
		})
		await mineHandler(client)()

		// Unsubscribe
		const result = await unsubscribe({ subscriptionId })
		expect(result).toBe(true)

		// Trigger another event after unsubscribe - should not affect anything
		await callHandler(client)({
			to: contractAddress,
			from,
			data: encodeFunctionData(SimpleContract.write.set(100n)),
			createTransaction: true,
		})
		await mineHandler(client)()

		// Filter should be gone
		expect(client.getFilters().get(subscriptionId)).toBeUndefined()
	})

	it('should handle empty subscription ID gracefully', async () => {
		const client = createTevmNode()
		const unsubscribe = ethUnsubscribeHandler(client)

		const result = await unsubscribe({ subscriptionId: '' as Hex })
		expect(result).toBe(false)
	})

	it('should handle malformed subscription ID', async () => {
		const client = createTevmNode()
		const unsubscribe = ethUnsubscribeHandler(client)

		const result = await unsubscribe({ subscriptionId: 'not-a-valid-id' as Hex })
		expect(result).toBe(false)
	})
})
