import type { BlockTag, Hex, RpcBlockIdentifier } from 'viem'
import { describe, expect, it } from 'vitest'
import { normalizeBlockTag } from './normalizeBlockTag.js'

describe('normalizeBlockTag', () => {
	it('should normalize hex block numbers to lowercase', () => {
		const blockTag = '0xABCDEF123456' as Hex
		const result = normalizeBlockTag(blockTag)
		expect(result).toBe('0xabcdef123456')
	})

	it('should normalize string block tags to lowercase', () => {
		const blockTag = 'LATEST' as BlockTag
		const result = normalizeBlockTag(blockTag)
		expect(result).toBe('latest')
	})

	it('should handle standard block tags', () => {
		expect(normalizeBlockTag('latest')).toBe('latest')
		expect(normalizeBlockTag('pending')).toBe('pending')
		expect(normalizeBlockTag('earliest')).toBe('earliest')
		expect(normalizeBlockTag('finalized')).toBe('finalized')
		expect(normalizeBlockTag('safe')).toBe('safe')
	})

	it('should handle mixed case standard block tags', () => {
		expect(normalizeBlockTag('LATEST' as BlockTag)).toBe('latest')
		expect(normalizeBlockTag('Pending' as BlockTag)).toBe('pending')
		expect(normalizeBlockTag('EARLIEST' as BlockTag)).toBe('earliest')
		expect(normalizeBlockTag('Finalized' as BlockTag)).toBe('finalized')
		expect(normalizeBlockTag('SAFE' as BlockTag)).toBe('safe')
	})

	it('should handle hex block numbers', () => {
		expect(normalizeBlockTag('0x123')).toBe('0x123')
		expect(normalizeBlockTag('0xABC')).toBe('0xabc')
		expect(normalizeBlockTag('0x0')).toBe('0x0')
		expect(normalizeBlockTag('0x1')).toBe('0x1')
	})

	it('should handle RpcBlockIdentifier with blockHash', () => {
		const blockIdentifier: RpcBlockIdentifier = {
			blockHash: '0xB3B20624F8F0F86EB50DD04688409E5CEA4BD02D700BF6E79E9384D47D6A5A35',
		}
		const result = normalizeBlockTag(blockIdentifier)
		expect(result).toBe('0xb3b20624f8f0f86eb50dd04688409e5cea4bd02d700bf6e79e9384d47d6a5a35')
	})

	it('should handle RpcBlockIdentifier with blockNumber', () => {
		const blockIdentifier: RpcBlockIdentifier = {
			blockNumber: '0xABCDEF',
		}
		const result = normalizeBlockTag(blockIdentifier)
		expect(result).toBe('0xabcdef')
	})

	it('should handle RpcBlockIdentifier with both blockHash and blockNumber (prioritizes blockHash)', () => {
		const blockIdentifier: RpcBlockIdentifier = {
			blockHash: '0xB3B20624F8F0F86EB50DD04688409E5CEA4BD02D700BF6E79E9384D47D6A5A35',
			blockNumber: '0xABCDEF',
		}
		const result = normalizeBlockTag(blockIdentifier)
		// Should return blockHash since it's checked first
		expect(result).toBe('0xb3b20624f8f0f86eb50dd04688409e5cea4bd02d700bf6e79e9384d47d6a5a35')
	})

	it('should handle RpcBlockIdentifier with undefined blockHash but defined blockNumber', () => {
		const blockIdentifier: RpcBlockIdentifier = {
			blockHash: undefined,
			blockNumber: '0xABCDEF',
		}
		const result = normalizeBlockTag(blockIdentifier)
		expect(result).toBe('0xabcdef')
	})

	it('should handle empty hex string', () => {
		const blockTag = '0x' as Hex
		const result = normalizeBlockTag(blockTag)
		expect(result).toBe('0x')
	})

	it('should handle long hex block numbers', () => {
		const blockTag = '0x123456789ABCDEF' as Hex
		const result = normalizeBlockTag(blockTag)
		expect(result).toBe('0x123456789abcdef')
	})

	it('should throw error for undefined input', () => {
		expect(() => normalizeBlockTag(undefined)).toThrow('Invalid block tag')
	})

	it('should throw error for null input', () => {
		expect(() => normalizeBlockTag(null as any)).toThrow()
	})

	it('should throw error for number input', () => {
		expect(() => normalizeBlockTag(123 as any)).toThrow('Invalid block tag')
	})

	it('should throw error for boolean input', () => {
		expect(() => normalizeBlockTag(true as any)).toThrow('Invalid block tag')
	})

	it('should throw error for empty object', () => {
		expect(() => normalizeBlockTag({} as RpcBlockIdentifier)).toThrow('Invalid block tag')
	})

	it('should throw error for object with only undefined values', () => {
		const blockIdentifier: RpcBlockIdentifier = {
			blockHash: undefined,
			// @ts-expect-error - blockNumber is required
			blockNumber: undefined,
		}
		expect(() => normalizeBlockTag(blockIdentifier)).toThrow('Invalid block tag')
	})

	it('should handle mixed case in hex addresses', () => {
		const blockIdentifier: RpcBlockIdentifier = {
			blockHash: '0xAbCdEf123456789012345678901234567890AbCdEf123456789012345678901234',
		}
		const result = normalizeBlockTag(blockIdentifier)
		expect(result).toBe('0xabcdef123456789012345678901234567890abcdef123456789012345678901234')
	})

	it('should handle single character hex', () => {
		expect(normalizeBlockTag('0xa')).toBe('0xa')
		expect(normalizeBlockTag('0xF')).toBe('0xf')
	})

	it('should handle numeric hex values', () => {
		expect(normalizeBlockTag('0x123456')).toBe('0x123456')
		expect(normalizeBlockTag('0x000000')).toBe('0x000000')
	})
})
