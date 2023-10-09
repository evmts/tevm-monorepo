import { StandardBlockExplorer } from './blockExplorers'
import { InvalidAddressError, InvalidHexStringError } from '@evmts/schemas'
import { optimism } from 'viem/chains'
import { describe, expect, expectTypeOf, it } from 'vitest'

const optimismExplorer = new StandardBlockExplorer(
	optimism.name,
	optimism.blockExplorers.default.url,
	optimism.id,
)

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
				new InvalidHexStringError({ value: txHash as any }),
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
				new InvalidHexStringError({ value: blockHash as any }),
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
	})
})
