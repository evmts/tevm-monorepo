import { describe, expect, it } from 'vitest'
import { bytesToUtf8 } from './bytesToUtf8.js'

describe('bytesToUtf8', () => {
	it('should convert bytes to UTF-8 string', () => {
		const bytes = new Uint8Array([72, 101, 108, 108, 111])
		expect(bytesToUtf8(bytes)).toBe('Hello')
	})

	it('should handle empty bytes', () => {
		const bytes = new Uint8Array([])
		expect(bytesToUtf8(bytes)).toBe('')
	})

	it('should handle ASCII characters', () => {
		const bytes = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x20, 0x57, 0x6f, 0x72, 0x6c, 0x64])
		expect(bytesToUtf8(bytes)).toBe('Hello World')
	})

	it('should handle numbers and special characters', () => {
		const bytes = new Uint8Array([0x31, 0x32, 0x33, 0x21])
		expect(bytesToUtf8(bytes)).toBe('123!')
	})

	it('should handle multi-byte UTF-8 characters', () => {
		// '€' is encoded as 0xE2 0x82 0xAC in UTF-8
		const bytes = new Uint8Array([0xe2, 0x82, 0xac])
		expect(bytesToUtf8(bytes)).toBe('€')
	})

	it('should handle emoji (4-byte UTF-8)', () => {
		// '😀' is encoded as 0xF0 0x9F 0x98 0x80 in UTF-8
		const bytes = new Uint8Array([0xf0, 0x9f, 0x98, 0x80])
		expect(bytesToUtf8(bytes)).toBe('😀')
	})

	it('should handle mixed ASCII and multi-byte characters', () => {
		// 'Hi 😀' - ASCII + emoji
		const bytes = new Uint8Array([0x48, 0x69, 0x20, 0xf0, 0x9f, 0x98, 0x80])
		expect(bytesToUtf8(bytes)).toBe('Hi 😀')
	})

	it('should handle Chinese characters', () => {
		// '你好' in UTF-8
		const bytes = new Uint8Array([0xe4, 0xbd, 0xa0, 0xe5, 0xa5, 0xbd])
		expect(bytesToUtf8(bytes)).toBe('你好')
	})
})
