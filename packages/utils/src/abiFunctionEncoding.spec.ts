import { describe, expect, it } from 'vitest'
import {
	encodeFunctionData,
	decodeFunctionData,
	decodeFunctionResult,
	encodeFunctionResult,
} from './abiFunctionEncoding.js'

describe('abiFunctionEncoding', () => {
	const transferAbi = [
		{
			type: 'function' as const,
			name: 'transfer',
			inputs: [
				{ type: 'address', name: 'to' },
				{ type: 'uint256', name: 'amount' },
			],
			outputs: [{ type: 'bool' }],
			stateMutability: 'nonpayable' as const,
		},
	] as const

	const balanceOfAbi = [
		{
			type: 'function' as const,
			name: 'balanceOf',
			inputs: [{ type: 'address', name: 'account' }],
			outputs: [{ type: 'uint256' }],
			stateMutability: 'view' as const,
		},
	] as const

	const multiOutputAbi = [
		{
			type: 'function' as const,
			name: 'getValues',
			inputs: [],
			outputs: [
				{ type: 'uint256', name: 'a' },
				{ type: 'bool', name: 'b' },
			],
			stateMutability: 'view' as const,
		},
	] as const

	describe('encodeFunctionData', () => {
		it('should encode transfer function call', () => {
			const data = encodeFunctionData({
				abi: transferAbi,
				functionName: 'transfer',
				args: ['0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0', 100n],
			})
			expect(data).toBe(
				'0xa9059cbb000000000000000000000000742d35cc6634c0532925a3b844bc9e7595f0beb00000000000000000000000000000000000000000000000000000000000000064',
			)
		})

		it('should encode balanceOf function call', () => {
			const data = encodeFunctionData({
				abi: balanceOfAbi,
				functionName: 'balanceOf',
				args: ['0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0'],
			})
			expect(data).toBe('0x70a08231000000000000000000000000742d35cc6634c0532925a3b844bc9e7595f0beb0')
		})

		it('should encode function with no args', () => {
			const noArgsAbi = [
				{
					type: 'function' as const,
					name: 'getValue',
					inputs: [],
					outputs: [{ type: 'uint256' }],
					stateMutability: 'view' as const,
				},
			] as const

			const data = encodeFunctionData({
				abi: noArgsAbi,
				functionName: 'getValue',
			})
			// Just selector, no params
			expect(data.length).toBe(10) // 0x + 8 hex chars
		})
	})

	describe('decodeFunctionData', () => {
		it('should decode transfer function call', () => {
			const { functionName, args } = decodeFunctionData({
				abi: transferAbi,
				data: '0xa9059cbb000000000000000000000000742d35cc6634c0532925a3b844bc9e7595f0beb00000000000000000000000000000000000000000000000000000000000000064',
			})
			expect(functionName).toBe('transfer')
			expect(args).toHaveLength(2)
			// Address should be checksummed
			expect((args[0] as string).toLowerCase()).toBe('0x742d35cc6634c0532925a3b844bc9e7595f0beb0')
			expect(args[1]).toBe(100n)
		})

		it('should decode balanceOf function call', () => {
			const { functionName, args } = decodeFunctionData({
				abi: balanceOfAbi,
				data: '0x70a08231000000000000000000000000742d35cc6634c0532925a3b844bc9e7595f0beb0',
			})
			expect(functionName).toBe('balanceOf')
			expect(args).toHaveLength(1)
			expect((args[0] as string).toLowerCase()).toBe('0x742d35cc6634c0532925a3b844bc9e7595f0beb0')
		})
	})

	describe('decodeFunctionResult', () => {
		it('should decode single uint256 result', () => {
			const result = decodeFunctionResult({
				abi: balanceOfAbi,
				functionName: 'balanceOf',
				data: '0x0000000000000000000000000000000000000000000000000000000000000064',
			})
			expect(result).toBe(100n)
		})

		it('should decode bool result', () => {
			const result = decodeFunctionResult({
				abi: transferAbi,
				functionName: 'transfer',
				data: '0x0000000000000000000000000000000000000000000000000000000000000001',
			})
			expect(result).toBe(true)
		})

		it('should decode multiple outputs', () => {
			const result = decodeFunctionResult({
				abi: multiOutputAbi,
				functionName: 'getValues',
				data: '0x00000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000001',
			})
			expect(result).toEqual([100n, true])
		})
	})

	describe('encodeFunctionResult', () => {
		it('should return 0x for void functions (no outputs)', () => {
			const voidFunctionAbi = [
				{
					type: 'function' as const,
					name: 'doSomething',
					inputs: [],
					outputs: [],
					stateMutability: 'nonpayable' as const,
				},
			] as const

			const data = encodeFunctionResult({
				abi: voidFunctionAbi,
				functionName: 'doSomething',
				result: undefined as any,
			})
			expect(data).toBe('0x')
		})

		it('should return 0x for functions with undefined outputs', () => {
			const noOutputsAbi = [
				{
					type: 'function' as const,
					name: 'noOutputs',
					inputs: [],
					stateMutability: 'nonpayable' as const,
				},
			] as const

			const data = encodeFunctionResult({
				abi: noOutputsAbi,
				functionName: 'noOutputs',
				result: undefined as any,
			})
			expect(data).toBe('0x')
		})

		it('should encode single uint256 result', () => {
			const data = encodeFunctionResult({
				abi: balanceOfAbi,
				functionName: 'balanceOf',
				result: 100n,
			})
			expect(data).toBe('0x0000000000000000000000000000000000000000000000000000000000000064')
		})

		it('should encode bool result', () => {
			const data = encodeFunctionResult({
				abi: transferAbi,
				functionName: 'transfer',
				result: true,
			})
			expect(data).toBe('0x0000000000000000000000000000000000000000000000000000000000000001')
		})

		it('should encode multiple outputs', () => {
			const data = encodeFunctionResult({
				abi: multiOutputAbi,
				functionName: 'getValues',
				result: [100n, true],
			})
			expect(data).toBe(
				'0x00000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000001',
			)
		})
	})

	describe('roundtrip encoding/decoding', () => {
		it('should roundtrip function data', () => {
			const originalArgs = ['0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0', 100n] as const
			const encoded = encodeFunctionData({
				abi: transferAbi,
				functionName: 'transfer',
				args: originalArgs,
			})
			const { functionName, args } = decodeFunctionData({
				abi: transferAbi,
				data: encoded,
			})
			expect(functionName).toBe('transfer')
			expect((args[0] as string).toLowerCase()).toBe(originalArgs[0].toLowerCase())
			expect(args[1]).toBe(originalArgs[1])
		})

		it('should roundtrip function result', () => {
			const originalResult = 100n
			const encoded = encodeFunctionResult({
				abi: balanceOfAbi,
				functionName: 'balanceOf',
				result: originalResult,
			})
			const decoded = decodeFunctionResult({
				abi: balanceOfAbi,
				functionName: 'balanceOf',
				data: encoded,
			})
			expect(decoded).toBe(originalResult)
		})
	})

	describe('error handling', () => {
		it('should throw for unknown function in decodeFunctionResult', () => {
			expect(() =>
				decodeFunctionResult({
					abi: balanceOfAbi,
					functionName: 'unknownFunction' as any,
					data: '0x0000000000000000000000000000000000000000000000000000000000000064',
				}),
			).toThrow('Function "unknownFunction" not found in ABI')
		})

		it('should throw for unknown function in encodeFunctionResult', () => {
			expect(() =>
				encodeFunctionResult({
					abi: balanceOfAbi,
					functionName: 'unknownFunction' as any,
					result: 100n,
				}),
			).toThrow('Function "unknownFunction" not found in ABI')
		})
	})
})
