import { hexToBigInt } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { parseBlockTag } from './parseBlockTag.js'

describe('parseBlockTag', () => {
	it('should parse hex block numbers to bigint', () => {
		const blockTag = '0x10'
		const result = parseBlockTag(blockTag)
		expect(result).toBe(hexToBigInt(blockTag))
	})

	it('should return block hash as is', () => {
		const blockHash = `0x${'a'.repeat(64)}` as const
		const result = parseBlockTag(blockHash)
		expect(result).toBe(blockHash)
	})

	it('should return special block tags as is', () => {
		const tags = ['latest', 'earliest', 'pending'] as const
		tags.forEach((tag) => {
			const result = parseBlockTag(tag)
			expect(result).toBe(tag)
		})
	})

	it('should return block number as bigint for valid hex strings', () => {
		const blockTag = '0x1a'
		const result = parseBlockTag(blockTag)
		expect(result).toBe(26n)
	})

	it('should handle block tag as a number string correctly', () => {
		const blockTag = '0x10'
		const result = parseBlockTag(blockTag)
		expect(result).toBe(16n)
	})

	it('should return blockTag unchanged if it is a non-hex string', () => {
		const blockTag = 'pending'
		const result = parseBlockTag(blockTag)
		expect(result).toBe(blockTag)
	})

	it('should handle zero block tag correctly', () => {
		const blockTag = '0x0'
		const result = parseBlockTag(blockTag)
		expect(result).toBe(0n)
	})

	it('should handle large block numbers correctly', () => {
		const blockTag = '0xffffff'
		const result = parseBlockTag(blockTag)
		expect(result).toBe(16777215n)
	})
})
