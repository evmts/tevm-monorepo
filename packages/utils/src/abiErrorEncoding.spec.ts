import { describe, expect, it } from 'vitest'
import { decodeErrorResult, encodeErrorResult } from './abiErrorEncoding.js'

describe('abiErrorEncoding', () => {
	const testAbi = [
		{
			type: 'error' as const,
			name: 'InsufficientBalance',
			inputs: [
				{ type: 'uint256' as const, name: 'balance' },
				{ type: 'uint256' as const, name: 'required' },
			],
		},
		{
			type: 'error' as const,
			name: 'Unauthorized',
			inputs: [{ type: 'address' as const, name: 'caller' }],
		},
		{
			type: 'error' as const,
			name: 'EmptyError',
			inputs: [],
		},
		{
			type: 'error' as const,
			name: 'InvalidData',
			inputs: [{ type: 'bytes32' as const, name: 'dataHash' }],
		},
		{
			type: 'error' as const,
			name: 'InvalidBytes',
			inputs: [{ type: 'bytes' as const, name: 'data' }],
		},
	] as const

	describe('encodeErrorResult', () => {
		it('should encode error with uint256 arguments', () => {
			const data = encodeErrorResult({
				abi: testAbi,
				errorName: 'InsufficientBalance',
				args: [100n, 200n],
			})

			expect(data).toMatch(/^0x/)
			// Selector + 2 * 32 bytes = 4 + 64 = 68 bytes = 136 hex chars + 0x = 138
			expect(data.length).toBe(138)
		})

		it('should encode error with address argument', () => {
			const data = encodeErrorResult({
				abi: testAbi,
				errorName: 'Unauthorized',
				args: ['0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0'],
			})

			expect(data).toMatch(/^0x/)
			// Selector + 1 * 32 bytes = 4 + 32 = 36 bytes = 72 hex chars + 0x = 74
			expect(data.length).toBe(74)
		})

		it('should encode error with no arguments', () => {
			const data = encodeErrorResult({
				abi: testAbi,
				errorName: 'EmptyError',
				args: [],
			})

			expect(data).toMatch(/^0x/)
			// Just the selector = 4 bytes = 8 hex chars + 0x = 10
			expect(data.length).toBe(10)
		})

		it('should throw for unknown error name', () => {
			expect(() =>
				encodeErrorResult({
					abi: testAbi,
					errorName: 'NonExistentError',
					args: [],
				}),
			).toThrow('Error "NonExistentError" not found in ABI')
		})
	})

	describe('decodeErrorResult', () => {
		it('should decode error with uint256 arguments', () => {
			// First encode, then decode
			const encoded = encodeErrorResult({
				abi: testAbi,
				errorName: 'InsufficientBalance',
				args: [100n, 200n],
			})

			const decoded = decodeErrorResult({
				abi: testAbi,
				data: encoded,
			})

			expect(decoded.errorName).toBe('InsufficientBalance')
			expect(decoded.args).toEqual([100n, 200n])
		})

		it('should decode error with address argument', () => {
			const address = '0x742d35cc6634c0532925a3b844bc9e7595f0beb0'
			const encoded = encodeErrorResult({
				abi: testAbi,
				errorName: 'Unauthorized',
				args: [address],
			})

			const decoded = decodeErrorResult({
				abi: testAbi,
				data: encoded,
			})

			expect(decoded.errorName).toBe('Unauthorized')
			expect(decoded.args[0]).toBe(address)
		})

		it('should decode error with no arguments', () => {
			const encoded = encodeErrorResult({
				abi: testAbi,
				errorName: 'EmptyError',
				args: [],
			})

			const decoded = decodeErrorResult({
				abi: testAbi,
				data: encoded,
			})

			expect(decoded.errorName).toBe('EmptyError')
			expect(decoded.args).toEqual([])
		})

		it('should throw for data too short', () => {
			expect(() =>
				decodeErrorResult({
					abi: testAbi,
					data: '0x1234',
				}),
			).toThrow('Data too short for error selector')
		})

		it('should throw for unknown selector', () => {
			expect(() =>
				decodeErrorResult({
					abi: testAbi,
					data: '0x12345678', // Random selector that doesn't match any error
				}),
			).toThrow(/No matching error found for selector/)
		})

		it('should throw when ABI has no errors', () => {
			expect(() =>
				decodeErrorResult({
					abi: [{ type: 'function' as const, name: 'test', inputs: [], outputs: [], stateMutability: 'view' as const }],
					data: '0x12345678',
				}),
			).toThrow('No errors found in ABI')
		})
	})

	describe('roundtrip encode/decode', () => {
		it('should roundtrip encode and decode InsufficientBalance', () => {
			const originalArgs = [1000n, 5000n] as const
			const encoded = encodeErrorResult({
				abi: testAbi,
				errorName: 'InsufficientBalance',
				args: originalArgs,
			})

			const decoded = decodeErrorResult({
				abi: testAbi,
				data: encoded,
			})

			expect(decoded.errorName).toBe('InsufficientBalance')
			expect(decoded.args).toEqual([...originalArgs])
		})

		it('should roundtrip encode and decode Unauthorized', () => {
			const address = '0x1234567890123456789012345678901234567890'
			const encoded = encodeErrorResult({
				abi: testAbi,
				errorName: 'Unauthorized',
				args: [address],
			})

			const decoded = decodeErrorResult({
				abi: testAbi,
				data: encoded,
			})

			expect(decoded.errorName).toBe('Unauthorized')
			expect(decoded.args[0]).toBe(address)
		})

		it('should roundtrip encode and decode InvalidData (bytes32)', () => {
			const dataHash = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
			const encoded = encodeErrorResult({
				abi: testAbi,
				errorName: 'InvalidData',
				args: [dataHash],
			})

			const decoded = decodeErrorResult({
				abi: testAbi,
				data: encoded,
			})

			expect(decoded.errorName).toBe('InvalidData')
			expect((decoded.args[0] as string).toLowerCase()).toBe(dataHash.toLowerCase())
		})

		it('should roundtrip encode and decode InvalidBytes (dynamic bytes)', () => {
			const bytesData = '0xdeadbeef'
			const encoded = encodeErrorResult({
				abi: testAbi,
				errorName: 'InvalidBytes',
				args: [bytesData],
			})

			const decoded = decodeErrorResult({
				abi: testAbi,
				data: encoded,
			})

			expect(decoded.errorName).toBe('InvalidBytes')
			expect((decoded.args[0] as string).toLowerCase()).toBe(bytesData.toLowerCase())
		})
	})
})
