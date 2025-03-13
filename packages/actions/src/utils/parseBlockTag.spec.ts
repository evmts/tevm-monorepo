import { type BlockTag, type Hex, hexToBigInt } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { parseBlockTag } from './parseBlockTag.js'

describe('parseBlockTag', () => {
	it('should parse hex block numbers to bigint', () => {
		const blockTag = '0x10' as Hex
		const result = parseBlockTag(blockTag)
		expect(result).toBe(hexToBigInt(blockTag))
	})

	it('should return block hash as is', () => {
		const blockHash = `0x${'a'.repeat(64)}` as Hex
		const result = parseBlockTag(blockHash)
		expect(result).toBe(blockHash)
	})

	it('should return special block tags as is', () => {
		const tags = ['latest', 'earliest', 'pending', 'safe', 'finalized'] as BlockTag[]
		tags.forEach((tag) => {
			const result = parseBlockTag(tag)
			expect(result).toBe(tag)
		})
	})

	it('should return block number as bigint for valid hex strings', () => {
		const blockTag = '0x1a' as Hex
		const result = parseBlockTag(blockTag)
		expect(result).toBe(26n)
	})

	it('should handle block tag as a number string correctly', () => {
		const blockTag = '0x10' as Hex
		const result = parseBlockTag(blockTag)
		expect(result).toBe(16n)
	})

	it('should return blockTag unchanged if it is a non-hex string', () => {
		const blockTag = 'pending' as BlockTag
		const result = parseBlockTag(blockTag)
		expect(result).toBe(blockTag)
	})

	it('should handle zero as a block number', () => {
		const blockTag = '0x0' as Hex
		const result = parseBlockTag(blockTag)
		expect(result).toBe(0n)
	})

	it('should handle large block numbers correctly', () => {
		// Test with a very large hex number
		const largeBlockTag = '0xffffffffffffffffffffffffffffffff' as Hex
		const result = parseBlockTag(largeBlockTag)
		expect(result).toBe(hexToBigInt(largeBlockTag))
	})

	it('should handle edge cases with block hash-like values', () => {
		// A block hash that's slightly shorter than 64 chars (it's actually a number)
		const almostHash = `0x${'a'.repeat(63)}` as Hex
		const result = parseBlockTag(almostHash)
		expect(result).toBe(hexToBigInt(almostHash))

		// A block hash that's slightly longer than 64 chars
		// Based on the implementation, this would be treated as a number
		// since it's not exactly 64 characters long
		const slightlyLongerHash = `0x${'a'.repeat(65)}` as Hex
		const result2 = parseBlockTag(slightlyLongerHash)
		expect(result2).toBe(hexToBigInt(slightlyLongerHash))
	})

	it('should handle padded block numbers correctly', () => {
		// Block number with leading zeros
		const paddedBlockTag = '0x000000000000000000000000000000000000000000000000000000000000000a' as Hex
		const result = parseBlockTag(paddedBlockTag)

		// If the length exactly matches a block hash length, it should be treated as a hash
		// This is consistent with the implementation
		expect(result).toBe(paddedBlockTag)
	})
})
