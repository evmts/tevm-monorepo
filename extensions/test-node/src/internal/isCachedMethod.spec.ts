import type { EIP1193Parameters, EIP1474Methods } from 'viem'
import { describe, expect, it } from 'vitest'
import { isCachedMethod } from './isCachedMethod.js'

type Request<TMethod extends EIP1474Methods[number]['Method']> = Extract<
	EIP1193Parameters<EIP1474Methods>,
	{ method: TMethod }
>

describe('isCachedMethod', () => {
	it('should not cache eth_blockNumber', () => {
		const request = { method: 'eth_blockNumber' } as const satisfies Request<'eth_blockNumber'>
		expect(isCachedMethod(request)).toBe(false)
	})

	it('should cache eth_getBlockByNumber with hex block number', () => {
		const request = {
			method: 'eth_getBlockByNumber',
			params: ['0x123', true],
		} as const satisfies Request<'eth_getBlockByNumber'>
		expect(isCachedMethod(request)).toBe(true)
	})

	it('should not cache eth_getBlockByNumber with block tag', () => {
		const request = {
			method: 'eth_getBlockByNumber',
			params: ['latest', true],
		} as const satisfies Request<'eth_getBlockByNumber'>
		expect(isCachedMethod(request)).toBe(false)

		const request2 = {
			method: 'eth_getBlockByNumber',
			params: ['earliest', false],
		} as const satisfies Request<'eth_getBlockByNumber'>
		expect(isCachedMethod(request2)).toBe(false)

		const request3 = {
			method: 'eth_getBlockByNumber',
			params: ['pending', true],
		} as const satisfies Request<'eth_getBlockByNumber'>
		expect(isCachedMethod(request3)).toBe(false)
	})

	it('should not cache unknown methods by default', () => {
		const request2 = { method: 'custom_method', params: [] }
		expect(isCachedMethod(request2 as unknown as Request<EIP1474Methods[number]['Method']>)).toBe(false)
	})

	it('should handle non-array params', () => {
		const request = { method: 'eth_getBlockByNumber', params: 'invalid' }
		expect(isCachedMethod(request as unknown as Request<'eth_getBlockByNumber'>)).toBe(false)

		const request2 = { method: 'eth_getBalance', params: { address: '0x123' } }
		expect(isCachedMethod(request2 as unknown as Request<'eth_getBalance'>)).toBe(false)
	})

	it('should handle various hex formats', () => {
		const validHex = {
			method: 'eth_getBlockByNumber',
			params: ['0xabc', true],
		} as const satisfies Request<'eth_getBlockByNumber'>
		expect(isCachedMethod(validHex)).toBe(true)

		const upperHex = {
			method: 'eth_getBlockByNumber',
			params: ['0xABC', true],
		} as const satisfies Request<'eth_getBlockByNumber'>
		expect(isCachedMethod(upperHex)).toBe(true)

		const shortHex = {
			method: 'eth_getBlockByNumber',
			params: ['0x1', false],
		} as const satisfies Request<'eth_getBlockByNumber'>
		expect(isCachedMethod(shortHex)).toBe(true)
	})
})
