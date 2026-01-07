import { describe, expect, it } from 'vitest'
import { bytesToUnprefixedHex } from './bytesToUnprefixedHex.js'

describe('bytesToUnprefixedHex', () => {
	it('should convert bytes to hex without 0x prefix', () => {
		const bytes = new Uint8Array([0xde, 0xad, 0xbe, 0xef])
		expect(bytesToUnprefixedHex(bytes)).toBe('deadbeef')
	})

	it('should handle empty bytes', () => {
		const bytes = new Uint8Array([])
		expect(bytesToUnprefixedHex(bytes)).toBe('')
	})

	it('should handle single byte', () => {
		const bytes = new Uint8Array([0xff])
		expect(bytesToUnprefixedHex(bytes)).toBe('ff')
	})

	it('should handle bytes with leading zeros', () => {
		const bytes = new Uint8Array([0x00, 0x01, 0x02])
		expect(bytesToUnprefixedHex(bytes)).toBe('000102')
	})

	it('should handle bytes where individual byte < 16 (needs padding)', () => {
		const bytes = new Uint8Array([0x0a, 0x0b, 0x0c])
		expect(bytesToUnprefixedHex(bytes)).toBe('0a0b0c')
	})

	it('should handle mixed bytes', () => {
		const bytes = new Uint8Array([0x01, 0x23, 0x45, 0x67, 0x89, 0xab, 0xcd, 0xef])
		expect(bytesToUnprefixedHex(bytes)).toBe('0123456789abcdef')
	})

	it('should handle all zeros', () => {
		const bytes = new Uint8Array([0x00, 0x00, 0x00, 0x00])
		expect(bytesToUnprefixedHex(bytes)).toBe('00000000')
	})

	it('should handle all 0xff bytes', () => {
		const bytes = new Uint8Array([0xff, 0xff, 0xff, 0xff])
		expect(bytesToUnprefixedHex(bytes)).toBe('ffffffff')
	})
})
