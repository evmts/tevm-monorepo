import { assert, describe, expect, it } from 'vitest'
import { ethMethodToCacheKey } from './ethMethodToCacheKey.js'

describe('ethMethodToCacheKey', () => {
	it('should generate cache key for eth_getBlockByNumber', () => {
		const request = {
			jsonrpc: '2.0' as const,
			method: 'eth_getBlockByNumber' as const,
			params: ['0x123', true] as const,
			id: 1
		}

		const cacheKeyFn = ethMethodToCacheKey['eth_getBlockByNumber']
		assert(cacheKeyFn, 'cache key function should be defined')

		const result = cacheKeyFn(request)
		expect(result).toBe('["2.0","eth_getBlockByNumber","0x123",true]')
	})

	it('should normalize block number to lowercase', () => {
		const request = {
			jsonrpc: '2.0' as const,
			method: 'eth_getBlockByNumber' as const,
			params: ['0xABC', false] as const,
			id: 2
		}

		const cacheKeyFn = ethMethodToCacheKey['eth_getBlockByNumber']
		assert(cacheKeyFn, 'cache key function should be defined')
		const result = cacheKeyFn(request)
		expect(result).toBe('["2.0","eth_getBlockByNumber","0xabc",false]')
	})

	it('should only have eth_getBlockByNumber method defined', () => {
		const methods = Object.keys(ethMethodToCacheKey)
		expect(methods).toEqual(['eth_getBlockByNumber'])
	})
})