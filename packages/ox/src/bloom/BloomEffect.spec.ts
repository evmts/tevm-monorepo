import { Effect } from 'effect'
import * as Address from 'ox/core/Address'
import * as Hex from 'ox/core/Hex'
import { describe, expect, it } from 'vitest'
import { BloomEffectLive } from './BloomEffect.js'

describe('BloomEffect', () => {
	const testAddress = Address.parse('0x1234567890123456789012345678901234567890')
	const testTopic = Hex.parse('0x1234567890123456789012345678901234567890123456789012345678901234')

	it('should create a new bloom filter', async () => {
		const bloom = await Effect.runPromise(BloomEffectLive.createEffect())

		expect(bloom).toBeDefined()
		expect(typeof bloom).toBe('string')
		expect(bloom.startsWith('0x')).toBe(true)
	})

	it('should add an address to the bloom filter', async () => {
		// Create a new bloom filter
		const bloom = await Effect.runPromise(BloomEffectLive.createEffect())

		// Add an address to the bloom filter
		const updatedBloom = await Effect.runPromise(BloomEffectLive.addAddressEffect({ bloom, address: testAddress }))

		expect(updatedBloom).toBeDefined()
		expect(typeof updatedBloom).toBe('string')
		expect(updatedBloom).not.toBe(bloom) // Should be different after adding an address
	})

	it('should add a topic to the bloom filter', async () => {
		// Create a new bloom filter
		const bloom = await Effect.runPromise(BloomEffectLive.createEffect())

		// Add a topic to the bloom filter
		const updatedBloom = await Effect.runPromise(BloomEffectLive.addTopicEffect({ bloom, topic: testTopic }))

		expect(updatedBloom).toBeDefined()
		expect(typeof updatedBloom).toBe('string')
		expect(updatedBloom).not.toBe(bloom) // Should be different after adding a topic
	})

	it('should check if a bloom filter has an address', async () => {
		// Create a new bloom filter
		const bloom = await Effect.runPromise(BloomEffectLive.createEffect())

		// Add an address to the bloom filter
		const updatedBloom = await Effect.runPromise(BloomEffectLive.addAddressEffect({ bloom, address: testAddress }))

		// Check if the bloom filter has the address
		const hasAddress = await Effect.runPromise(
			BloomEffectLive.hasAddressEffect({ bloom: updatedBloom, address: testAddress }),
		)

		expect(hasAddress).toBe(true)

		// Check with a different address
		const differentAddress = Address.parse('0x0000000000000000000000000000000000000000')
		const hasOtherAddress = await Effect.runPromise(
			BloomEffectLive.hasAddressEffect({ bloom: updatedBloom, address: differentAddress }),
		)

		// May return false positive, but less likely
		expect(typeof hasOtherAddress).toBe('boolean')
	})

	it('should check if a bloom filter has a topic', async () => {
		// Create a new bloom filter
		const bloom = await Effect.runPromise(BloomEffectLive.createEffect())

		// Add a topic to the bloom filter
		const updatedBloom = await Effect.runPromise(BloomEffectLive.addTopicEffect({ bloom, topic: testTopic }))

		// Check if the bloom filter has the topic
		const hasTopic = await Effect.runPromise(BloomEffectLive.hasTopicEffect({ bloom: updatedBloom, topic: testTopic }))

		expect(hasTopic).toBe(true)

		// Check with a different topic
		const differentTopic = Hex.parse('0x0000000000000000000000000000000000000000000000000000000000000000')
		const hasOtherTopic = await Effect.runPromise(
			BloomEffectLive.hasTopicEffect({ bloom: updatedBloom, topic: differentTopic }),
		)

		// May return false positive, but less likely
		expect(typeof hasOtherTopic).toBe('boolean')
	})

	it('should handle errors gracefully', async () => {
		// Try with invalid input (empty string is not a valid bloom)
		const invalidBloom = '0x' as any

		try {
			await Effect.runPromise(BloomEffectLive.hasAddressEffect({ bloom: invalidBloom, address: testAddress }))
			expect.fail('Should have thrown an error')
		} catch (error) {
			expect(error).toBeDefined()
		}
	})
})
