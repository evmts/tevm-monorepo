import type { EIP1193Parameters, EIP1474Methods } from 'viem'
import { describe, expect, it } from 'vitest'
import { isCachedJsonRpcMethod } from './isCachedJsonRpcMethod.js'

type Request<TMethod extends EIP1474Methods[number]['Method']> = Extract<
	EIP1193Parameters<EIP1474Methods>,
	{ method: TMethod }
>

describe('isCachedJsonRpcMethod', () => {
	it('should not cache eth_blockNumber', () => {
		const request = { method: 'eth_blockNumber' } as const satisfies Request<'eth_blockNumber'>
		expect(isCachedJsonRpcMethod(request)).toBe(false)
	})

	it('should cache eth_getBlockByNumber with hex block number', () => {
		const request = {
			method: 'eth_getBlockByNumber',
			params: ['0x123', true],
		} as const satisfies Request<'eth_getBlockByNumber'>
		expect(isCachedJsonRpcMethod(request)).toBe(true)
	})

	it('should not cache eth_getBlockByNumber with dynamic block tag', () => {
		const request = {
			method: 'eth_getBlockByNumber',
			params: ['latest', true],
		} as const satisfies Request<'eth_getBlockByNumber'>
		expect(isCachedJsonRpcMethod(request)).toBe(false)

		const request3 = {
			method: 'eth_getBlockByNumber',
			params: ['pending', true],
		} as const satisfies Request<'eth_getBlockByNumber'>
		expect(isCachedJsonRpcMethod(request3)).toBe(false)
	})

	it('should not cache unknown methods by default', () => {
		const request2 = { method: 'custom_method', params: [] }
		expect(isCachedJsonRpcMethod(request2 as unknown as Request<EIP1474Methods[number]['Method']>)).toBe(false)
	})

	it('should handle various hex formats', () => {
		const validHex = {
			method: 'eth_getBlockByNumber',
			params: ['0xabc', true],
		} as const satisfies Request<'eth_getBlockByNumber'>
		expect(isCachedJsonRpcMethod(validHex)).toBe(true)

		const upperHex = {
			method: 'eth_getBlockByNumber',
			params: ['0xABC', true],
		} as const satisfies Request<'eth_getBlockByNumber'>
		expect(isCachedJsonRpcMethod(upperHex)).toBe(true)

		const shortHex = {
			method: 'eth_getBlockByNumber',
			params: ['0x1', false],
		} as const satisfies Request<'eth_getBlockByNumber'>
		expect(isCachedJsonRpcMethod(shortHex)).toBe(true)
	})
})
