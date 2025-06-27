import { describe, expect, it } from 'vitest'
import { isCachedMethod } from './isCachedMethod.js'

describe('isCachedMethod', () => {
	it('should not cache eth_blockNumber', () => {
		const request = { method: 'eth_blockNumber', params: [] }
		expect(isCachedMethod(request)).toBe(false)
	})

	it('should cache eth_getBlockByNumber with hex block number', () => {
		const request = { method: 'eth_getBlockByNumber', params: ['0x123', true] }
		expect(isCachedMethod(request)).toBe(true)
	})

	it('should not cache eth_getBlockByNumber with block tag', () => {
		const request = { method: 'eth_getBlockByNumber', params: ['latest', true] }
		expect(isCachedMethod(request)).toBe(false)

		const request2 = { method: 'eth_getBlockByNumber', params: ['earliest', false] }
		expect(isCachedMethod(request2)).toBe(false)

		const request3 = { method: 'eth_getBlockByNumber', params: ['pending', true] }
		expect(isCachedMethod(request3)).toBe(false)
	})

	it('should not cache eth_getBlockByNumber with missing params', () => {
		const request = { method: 'eth_getBlockByNumber', params: [] }
		expect(isCachedMethod(request)).toBe(false)

		const request2 = { method: 'eth_getBlockByNumber', params: undefined }
		expect(isCachedMethod(request2)).toBe(false)
	})

	it('should cache unknown methods by default', () => {
		const request = { method: 'eth_getBalance', params: ['0x123', 'latest'] }
		expect(isCachedMethod(request)).toBe(true)

		const request2 = { method: 'custom_method', params: [] }
		expect(isCachedMethod(request2)).toBe(true)
	})

	it('should handle non-array params', () => {
		const request = { method: 'eth_getBlockByNumber', params: 'invalid' }
		expect(isCachedMethod(request)).toBe(false)

		const request2 = { method: 'eth_getBalance', params: { address: '0x123' } }
		expect(isCachedMethod(request2)).toBe(false)
	})

	it('should handle various hex formats', () => {
		const validHex = { method: 'eth_getBlockByNumber', params: ['0xabc', true] }
		expect(isCachedMethod(validHex)).toBe(true)

		const upperHex = { method: 'eth_getBlockByNumber', params: ['0xABC', true] }
		expect(isCachedMethod(upperHex)).toBe(true)

		const shortHex = { method: 'eth_getBlockByNumber', params: ['0x1', false] }
		expect(isCachedMethod(shortHex)).toBe(true)
	})
})