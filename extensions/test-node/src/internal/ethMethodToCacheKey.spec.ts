import type { EIP1193Parameters, EIP1474Methods } from 'viem'
import { assert, describe, expect, it } from 'vitest'
import { ethMethodToCacheKey } from './ethMethodToCacheKey.js'

type Request<TMethod extends EIP1474Methods[number]['Method']> = Extract<
	EIP1193Parameters<EIP1474Methods>,
	{ method: TMethod }
> & { jsonrpc: string }

describe('ethMethodToCacheKey', () => {
	it('should generate cache key for eth_getBlockByNumber', () => {
		const request = {
			jsonrpc: '2.0' as const,
			method: 'eth_getBlockByNumber' as const,
			params: ['0x123', true],
		} as const satisfies Request<'eth_getBlockByNumber'>

		const cacheKeyFn = ethMethodToCacheKey('eth_getBlockByNumber')
		assert(cacheKeyFn, 'cache key function should be defined')

		const result = cacheKeyFn(request)
		expect(result).toBe('["2.0","eth_getBlockByNumber","0x123",true]')
	})

	it('should normalize block number to lowercase', () => {
		const request = {
			jsonrpc: '2.0' as const,
			method: 'eth_getBlockByNumber' as const,
			params: ['0xABC', false],
		} as const satisfies Request<'eth_getBlockByNumber'>

		const cacheKeyFn = ethMethodToCacheKey('eth_getBlockByNumber')
		assert(cacheKeyFn, 'cache key function should be defined')
		const result = cacheKeyFn(request)
		expect(result).toBe('["2.0","eth_getBlockByNumber","0xabc",false]')
	})
})
