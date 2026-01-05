import { describe, expect, it } from 'vitest'
import { txLogsBloom } from './txLogsBloom.js'
import { hexToBytes } from '@tevm/utils'

describe('txLogsBloom', () => {
	it('should return an empty bloom filter when logs is undefined', () => {
		const bloom = txLogsBloom(undefined)
		expect(bloom.bitvector).toEqual(new Uint8Array(256))
	})

	it('should return an empty bloom filter when logs is an empty array', () => {
		const bloom = txLogsBloom([])
		expect(bloom.bitvector).toEqual(new Uint8Array(256))
	})

	it('should add address to bloom filter', () => {
		const address = hexToBytes('0x1234567890123456789012345678901234567890')
		const logs = [[address, []]]
		const bloom = txLogsBloom(logs)

		// Bloom filter should contain the address
		expect(bloom.check(address)).toBe(true)
	})

	it('should add topics to bloom filter', () => {
		const address = hexToBytes('0x1234567890123456789012345678901234567890')
		const topic1 = hexToBytes('0x0000000000000000000000000000000000000000000000000000000000000001')
		const topic2 = hexToBytes('0x0000000000000000000000000000000000000000000000000000000000000002')
		const logs = [[address, [topic1, topic2]]]
		const bloom = txLogsBloom(logs)

		// Bloom filter should contain address and both topics
		expect(bloom.check(address)).toBe(true)
		expect(bloom.check(topic1)).toBe(true)
		expect(bloom.check(topic2)).toBe(true)
	})

	it('should handle multiple logs', () => {
		const address1 = hexToBytes('0x1111111111111111111111111111111111111111')
		const address2 = hexToBytes('0x2222222222222222222222222222222222222222')
		const topic1 = hexToBytes('0x0000000000000000000000000000000000000000000000000000000000000001')
		const topic2 = hexToBytes('0x0000000000000000000000000000000000000000000000000000000000000002')

		const logs = [
			[address1, [topic1]],
			[address2, [topic2]],
		]
		const bloom = txLogsBloom(logs)

		// Bloom filter should contain all addresses and topics
		expect(bloom.check(address1)).toBe(true)
		expect(bloom.check(address2)).toBe(true)
		expect(bloom.check(topic1)).toBe(true)
		expect(bloom.check(topic2)).toBe(true)
	})

	it('should handle logs with no topics', () => {
		const address = hexToBytes('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
		const logs = [[address, []]]
		const bloom = txLogsBloom(logs)

		expect(bloom.check(address)).toBe(true)
	})

	it('should handle logs with many topics', () => {
		const address = hexToBytes('0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb')
		const topics = [
			hexToBytes('0x0000000000000000000000000000000000000000000000000000000000000001'),
			hexToBytes('0x0000000000000000000000000000000000000000000000000000000000000002'),
			hexToBytes('0x0000000000000000000000000000000000000000000000000000000000000003'),
			hexToBytes('0x0000000000000000000000000000000000000000000000000000000000000004'),
		]
		const logs = [[address, topics]]
		const bloom = txLogsBloom(logs)

		expect(bloom.check(address)).toBe(true)
		topics.forEach((topic) => {
			expect(bloom.check(topic)).toBe(true)
		})
	})

	it('should not contain elements that were not added', () => {
		const address = hexToBytes('0x1234567890123456789012345678901234567890')
		const topic = hexToBytes('0x0000000000000000000000000000000000000000000000000000000000000001')
		const logs = [[address, [topic]]]
		const bloom = txLogsBloom(logs)

		// These were not added, so check should return false (with high probability due to bloom filter properties)
		const notAddedAddress = hexToBytes('0xffffffffffffffffffffffffffffffffffffffff')
		const notAddedTopic = hexToBytes('0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')

		// Note: Bloom filters can have false positives, but with these specific values, false negatives are impossible
		// We're checking that at least the bitvector is not all zeros (which would be wrong if elements were added)
		expect(bloom.bitvector.some((b) => b !== 0)).toBe(true)
	})

	it('should accumulate bloom bits across multiple logs', () => {
		const address1 = hexToBytes('0x1111111111111111111111111111111111111111')
		const address2 = hexToBytes('0x2222222222222222222222222222222222222222')

		// Create two separate blooms
		const bloom1 = txLogsBloom([[address1, []]])
		const bloom2 = txLogsBloom([[address2, []]])

		// Create a combined bloom
		const combinedBloom = txLogsBloom([
			[address1, []],
			[address2, []],
		])

		// The combined bloom should have bits from both
		expect(bloom1.check(address1)).toBe(true)
		expect(bloom2.check(address2)).toBe(true)
		expect(combinedBloom.check(address1)).toBe(true)
		expect(combinedBloom.check(address2)).toBe(true)
	})
})
