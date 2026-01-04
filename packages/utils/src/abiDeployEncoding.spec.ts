import { describe, expect, it } from 'vitest'
import { encodeDeployData } from './abiDeployEncoding.js'
import type { Abi, Hex } from 'viem'

describe('encodeDeployData', () => {
	const bytecode: Hex = '0x608060405234801561001057600080fd5b50'

	describe('without constructor args', () => {
		it('should return bytecode unchanged when no args provided', () => {
			const result = encodeDeployData({
				abi: [],
				bytecode,
			})
			expect(result).toBe(bytecode)
		})

		it('should return bytecode unchanged when args is empty array', () => {
			const result = encodeDeployData({
				abi: [],
				bytecode,
				args: [],
			})
			expect(result).toBe(bytecode)
		})
	})

	describe('with constructor args', () => {
		it('should encode deploy data with uint256 constructor arg', () => {
			const abi: Abi = [
				{
					type: 'constructor',
					inputs: [{ type: 'uint256', name: 'value' }],
					stateMutability: 'nonpayable',
				},
			]
			const result = encodeDeployData({
				abi,
				bytecode,
				args: [100n],
			})
			// bytecode + encoded uint256(100)
			expect(result).toBe(
				bytecode +
					'0000000000000000000000000000000000000000000000000000000000000064',
			)
		})

		it('should encode deploy data with address constructor arg', () => {
			const abi: Abi = [
				{
					type: 'constructor',
					inputs: [{ type: 'address', name: 'owner' }],
					stateMutability: 'nonpayable',
				},
			]
			const result = encodeDeployData({
				abi,
				bytecode,
				args: ['0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0'],
			})
			// bytecode + encoded address (padded to 32 bytes)
			expect(result).toBe(
				bytecode +
					'000000000000000000000000742d35cc6634c0532925a3b844bc9e7595f0beb0',
			)
		})

		it('should encode deploy data with string constructor arg', () => {
			const abi: Abi = [
				{
					type: 'constructor',
					inputs: [{ type: 'string', name: 'name' }],
					stateMutability: 'nonpayable',
				},
			]
			const result = encodeDeployData({
				abi,
				bytecode,
				args: ['Test'],
			})
			// String encoding: offset (32) + length (4) + data ("Test" = 0x54657374)
			expect(result).toBe(
				bytecode +
					'0000000000000000000000000000000000000000000000000000000000000020' + // offset
					'0000000000000000000000000000000000000000000000000000000000000004' + // length
					'5465737400000000000000000000000000000000000000000000000000000000', // "Test" padded
			)
		})

		it('should encode deploy data with multiple constructor args', () => {
			const abi: Abi = [
				{
					type: 'constructor',
					inputs: [
						{ type: 'string', name: 'name' },
						{ type: 'uint256', name: 'value' },
					],
					stateMutability: 'nonpayable',
				},
			]
			const result = encodeDeployData({
				abi,
				bytecode,
				args: ['Test', 100n],
			})
			// First 32 bytes: offset to string (64 = 0x40)
			// Next 32 bytes: uint256 value (100 = 0x64)
			// Then string: length (4) + data ("Test")
			expect(result).toBe(
				bytecode +
					'0000000000000000000000000000000000000000000000000000000000000040' + // offset to string
					'0000000000000000000000000000000000000000000000000000000000000064' + // uint256(100)
					'0000000000000000000000000000000000000000000000000000000000000004' + // string length
					'5465737400000000000000000000000000000000000000000000000000000000', // "Test" padded
			)
		})
	})

	describe('error handling', () => {
		it('should throw when constructor not found in ABI but args provided', () => {
			const abi: Abi = [
				{
					type: 'function',
					name: 'transfer',
					inputs: [{ type: 'address', name: 'to' }],
					outputs: [],
					stateMutability: 'nonpayable',
				},
			]
			expect(() =>
				encodeDeployData({
					abi,
					bytecode,
					args: [100n],
				}),
			).toThrow('No constructor found in ABI')
		})
	})
})
