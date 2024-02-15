import { callHandlerOpts } from './callHandlerOpts.js'
import { EthjsAddress } from '@tevm/utils'
import { hexToBytes } from '@tevm/utils'
import { describe, expect, it } from 'bun:test'

describe('callHandlerOpts', () => {
	it('should handle empty params', () => {
		const result = callHandlerOpts({})
		expect(result).toEqual({})
	})

	it('should parse caller address correctly', () => {
		const params = { caller: `0x${'4'.repeat(40)}` } as const
		const result = callHandlerOpts(params)
		expect(result.caller).toEqual(EthjsAddress.fromString(params.caller))
	})

	it('should set both origin and caller to from address if provided', () => {
		const params = { from: `0x${'4'.repeat(40)}` } as const
		const result = callHandlerOpts(params)
		expect(result.caller).toEqual(EthjsAddress.fromString(params.from))
		expect(result.origin).toEqual(EthjsAddress.fromString(params.from))
	})

	it('origin and caller take presidence over from', () => {
		const params = {
			from: `0x${'4'.repeat(40)}`,
			origin: `0x${'5'.repeat(40)}`,
			caller: `0x${'6'.repeat(40)}`,
		} as const
		const result = callHandlerOpts(params)
		expect(result.caller).toEqual(EthjsAddress.fromString(params.caller))
		expect(result.origin).toEqual(EthjsAddress.fromString(params.origin))
	})

	it('origin and caller take presidence over from', () => {
		const params = {
			from: `0x${'4'.repeat(40)}`,
			origin: `0x${'5'.repeat(40)}`,
			caller: `0x${'6'.repeat(40)}`,
		} as const
		const result = callHandlerOpts(params)
		expect(result.caller).toEqual(EthjsAddress.fromString(params.caller))
		expect(result.origin).toEqual(EthjsAddress.fromString(params.origin))
	})

	it('origin and caller take presidence over from', () => {
		const params = {
			from: `0x${'4'.repeat(40)}`,
			origin: `0x${'5'.repeat(40)}`,
			caller: `0x${'6'.repeat(40)}`,
		} as const
		const result = callHandlerOpts(params)
		expect(result.caller).toEqual(EthjsAddress.fromString(params.caller))
		expect(result.origin).toEqual(EthjsAddress.fromString(params.origin))
	})

	it('should parse transaction to address', () => {
		const to = `0x${'3'.repeat(40)}` as const
		const result = callHandlerOpts({
			to,
		})
		expect(result.to).toEqual(EthjsAddress.fromString(to))
	})

	it('should parse data to bytes', () => {
		const data = `0x${'3'.repeat(40)}` as const
		const result = callHandlerOpts({
			data,
		})
		expect(result.data).toEqual(hexToBytes(data))
	})

	it('should parse salt to bytes', () => {
		const salt = `0x${'3'.repeat(40)}` as const
		const result = callHandlerOpts({
			salt,
		})
		expect(result.salt).toEqual(hexToBytes(salt))
	})

	it('should handle depth', () => {
		const depth = 5
		const result = callHandlerOpts({
			depth,
		})
		expect(result.depth).toEqual(depth)
	})

	it('should parse blob versioned hashes to buffers', () => {
		const versionedHash = `0x${'3'.repeat(40)}` as const
		const result = callHandlerOpts({
			blobVersionedHashes: [versionedHash],
		})
		expect(result.blobVersionedHashes?.[0]).toEqual(hexToBytes(versionedHash))
	})

	it('should handle selfdestruct', () => {
		const selfdestruct = new Set([
			EthjsAddress.zero().toString() as `0x${string}`,
		])
		const result = callHandlerOpts({
			selfdestruct,
		})
		expect(result.selfdestruct).toEqual(selfdestruct)
	})

	it('should handle skipBalance', () => {
		const skipBalance = true
		const result = callHandlerOpts({
			skipBalance,
		})
		expect(result.skipBalance).toEqual(skipBalance)
	})

	it('should handle gasRefund', () => {
		const gasRefund = 100n
		const result = callHandlerOpts({
			gasRefund,
		})
		expect(result.gasRefund).toEqual(gasRefund)
	})

	it('should handle gasPrice', () => {
		const gasPrice = 100n
		const result = callHandlerOpts({
			gasPrice,
		})
		expect(result).toEqual({ gasPrice })
	})

	it('should handle value', () => {
		const value = 100n
		const result = callHandlerOpts({
			value,
		})
		expect(result.value).toEqual(value)
	})

	it('should handle origin', () => {
		const origin = EthjsAddress.zero().toString() as `0x${string}`
		const result = callHandlerOpts({
			origin,
		})
		expect(result.origin).toEqual(EthjsAddress.zero())
	})

	it('should handle gasLimit', () => {
		const gas = 100n
		const result = callHandlerOpts({
			gas,
		})
		expect(result).toEqual({ gasLimit: gas })
	})
})
