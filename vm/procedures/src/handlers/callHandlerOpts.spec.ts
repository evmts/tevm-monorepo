import { callHandlerOpts } from './callHandlerOpts.js'
import { Address as EthjsAddress } from '@ethereumjs/util'
import { describe, expect, it } from 'bun:test'
import { hexToBytes } from 'viem'

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

	it('should handle block parameters', () => {
		const block = {
			coinbase: `0x${'0'.repeat(40)}` as const,
			number: 420n,
			difficulty: 1n,
			gasLimit: 10000n,
			timestamp: 1625097600n,
			baseFeePerGas: 100n,
			blobGasPrice: 200n,
		} as const satisfies import('@tevm/api').Block
		const result = callHandlerOpts({
			block,
		})
		expect(result.block?.header.coinbase.toString()).toBe(block.coinbase)
		expect(result.block?.header.number).toBe(block.number)
		expect(result.block?.header.difficulty).toBe(block.difficulty)
		expect(result.block?.header.gasLimit).toBe(block.gasLimit)
		expect(result.block?.header.timestamp).toBe(block.timestamp)
		expect(result.block?.header.baseFeePerGas).toBe(block.baseFeePerGas)
		expect(result.block?.header.getBlobGasPrice()).toBe(block.blobGasPrice)
	})

	it('should handle default block parameters', () => {
		expect(callHandlerOpts({}).block).toBeUndefined()
		const result = callHandlerOpts({
			block: {},
		})
		expect(result.block?.header.coinbase).toEqual(EthjsAddress.zero())
		expect(result.block?.header.cliqueSigner()).toEqual(EthjsAddress.zero())
		expect(result.block?.header.number).toBe(0n)
		expect(result.block?.header.difficulty).toBe(0n)
		expect(result.block?.header.gasLimit).toBe(0n)
		expect(result.block?.header.timestamp).toBe(0n)
		expect(result.block?.header.baseFeePerGas).toBe(undefined as any)
		expect(result.block?.header.getBlobGasPrice()).toBe(undefined as any)
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
		expect(result.gasPrice).toEqual(gasPrice)
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
		const gasLimit = 100n
		const result = callHandlerOpts({
			gasLimit,
		})
		expect(result.gasLimit).toEqual(gasLimit)
	})
})
