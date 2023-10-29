import { StandardBlockExplorer } from './blockExplorer.js'
import {
	InvalidAddressError,
	InvalidBytesError,
	InvalidUrlError,
} from '@evmts/schemas'
import { optimism } from 'viem/chains'
import { describe, expect, expectTypeOf, it } from 'vitest'

const optimismExplorer = new StandardBlockExplorer({
	name: optimism.name,
	url: optimism.blockExplorers.default.url,
	chainId: optimism.id,
})
const invalidUrlExplorer = new StandardBlockExplorer({
	name: optimism.name,
	url: 'invalid url',
	chainId: optimism.id,
})

describe('blockExplorers', () => {
	it('should have a chainId property', () => {
		expect(optimismExplorer.chainId).toBe(10)
		expectTypeOf(optimismExplorer.chainId).toBeNumber()
	})
	it('should have a name property', () => {
		expect(optimismExplorer.name).toBe(optimism.name)
		expectTypeOf(optimismExplorer.name).toBeString()
	})
	it('should have a url property', () => {
		expect(optimismExplorer.url).toBe('https://explorer.optimism.io')
		expectTypeOf(optimismExplorer.url).toBeString()
	})

	describe('getTxUrl', () => {
		it('should return the tx url', () => {
			const txHash =
				'0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
			const res = optimismExplorer.getTxUrl(txHash)
			expect(res).toMatchInlineSnapshot(
				'"https://explorer.optimism.io/tx/0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"',
			)
			expectTypeOf(res).toBeString()
		})
		it('should throw an error if the txId is not a hex string', () => {
			const txHash = 'not a hex string'
			expect(() => optimismExplorer.getTxUrl(txHash as any)).toThrow(
				new InvalidBytesError({ value: txHash as any }),
			)
		})
		it('should throw an error if the url is not a valid url', () => {
			const txHash = '0x1234567890abcdef1234567890abcdef12345678'
			expect(() => invalidUrlExplorer.getTxUrl(txHash as any)).toThrow(
				new InvalidUrlError({ url: invalidUrlExplorer.url }),
			)
		})
	})

	describe('getBlockUrl', () => {
		it('should return the block url', () => {
			const blockHash =
				'0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
			const res = optimismExplorer.getBlockUrl(blockHash)
			expect(res).toMatchInlineSnapshot(
				'"https://explorer.optimism.io/block/0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"',
			)
			expectTypeOf(res).toBeString()
		})
		it('should throw an error if the blockId is not a hex string', () => {
			const blockHash = 'not a hex string'
			expect(() => optimismExplorer.getBlockUrl(blockHash as any)).toThrow(
				new InvalidBytesError({ value: blockHash as any }),
			)
		})
		it('should throw an error if the url is not a valid url', () => {
			const blockHash = '0x1234567890abcdef1234567890abcdef12345678'
			expect(() => invalidUrlExplorer.getBlockUrl(blockHash)).toThrow(
				new InvalidUrlError({ url: invalidUrlExplorer.url }),
			)
		})
	})

	describe('getAddressUrl', () => {
		it('should return the address url', () => {
			const address = '0x1234567890abcdef1234567890abcdef12345678'
			const res = optimismExplorer.getAddressUrl(address)
			expect(res).toMatchInlineSnapshot(
				'"https://explorer.optimism.io/address/0x1234567890abcdef1234567890abcdef12345678"',
			)
			expectTypeOf(res).toBeString()
		})
		it('should throw an error if the address is not a valid address', () => {
			const address = 'not a valid address'
			expect(() => optimismExplorer.getAddressUrl(address as any)).toThrow(
				new InvalidAddressError({ address: address as any }),
			)
		})
		it('should throw an error if the url is not a valid url', () => {
			const address = '0x1234567890abcdef1234567890abcdef12345678'
			expect(() => invalidUrlExplorer.getAddressUrl(address)).toThrow(
				new InvalidUrlError({ url: invalidUrlExplorer.url }),
			)
		})
	})
})
