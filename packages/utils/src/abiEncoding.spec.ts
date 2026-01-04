import { describe, it, expect } from 'vitest'
import { encodeAbiParameters, decodeAbiParameters } from './abiEncoding.js'

describe('abiEncoding', () => {
	describe('encodeAbiParameters', () => {
		it('should encode a single uint256', () => {
			const encoded = encodeAbiParameters([{ type: 'uint256' }], [100n])
			expect(encoded).toBe('0x0000000000000000000000000000000000000000000000000000000000000064')
		})

		it('should encode a single string', () => {
			const encoded = encodeAbiParameters([{ type: 'string' }], ['Hello'])
			expect(encoded).toBe(
				'0x' +
				'0000000000000000000000000000000000000000000000000000000000000020' + // offset to string data
				'0000000000000000000000000000000000000000000000000000000000000005' + // string length
				'48656c6c6f000000000000000000000000000000000000000000000000000000'   // "Hello" padded to 32 bytes
			)
		})

		it('should encode an address', () => {
			const encoded = encodeAbiParameters(
				[{ type: 'address' }],
				['0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0']
			)
			expect(encoded).toBe('0x000000000000000000000000742d35cc6634c0532925a3b844bc9e7595f0beb0')
		})

		it('should encode multiple parameters', () => {
			const encoded = encodeAbiParameters(
				[
					{ type: 'address', name: 'to' },
					{ type: 'uint256', name: 'amount' }
				],
				['0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0', 100n]
			)
			expect(encoded).toBe(
				'0x' +
				'000000000000000000000000742d35cc6634c0532925a3b844bc9e7595f0beb0' + // address
				'0000000000000000000000000000000000000000000000000000000000000064'   // uint256
			)
		})

		it('should encode a boolean', () => {
			const encodedTrue = encodeAbiParameters([{ type: 'bool' }], [true])
			expect(encodedTrue).toBe('0x0000000000000000000000000000000000000000000000000000000000000001')

			const encodedFalse = encodeAbiParameters([{ type: 'bool' }], [false])
			expect(encodedFalse).toBe('0x0000000000000000000000000000000000000000000000000000000000000000')
		})

		it('should encode bytes32', () => {
			const encoded = encodeAbiParameters(
				[{ type: 'bytes32' }],
				['0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef']
			)
			expect(encoded).toBe('0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef')
		})

		it('should encode an array of uint256', () => {
			const encoded = encodeAbiParameters([{ type: 'uint256[]' }], [[1n, 2n, 3n]])
			expect(encoded).toBe(
				'0x' +
				'0000000000000000000000000000000000000000000000000000000000000020' + // offset to array
				'0000000000000000000000000000000000000000000000000000000000000003' + // array length
				'0000000000000000000000000000000000000000000000000000000000000001' + // 1
				'0000000000000000000000000000000000000000000000000000000000000002' + // 2
				'0000000000000000000000000000000000000000000000000000000000000003'   // 3
			)
		})
	})

	describe('decodeAbiParameters', () => {
		it('should decode a single uint256', () => {
			const decoded = decodeAbiParameters(
				[{ type: 'uint256' }],
				'0x0000000000000000000000000000000000000000000000000000000000000064'
			)
			expect(decoded).toEqual([100n])
		})

		it('should decode a single string', () => {
			const decoded = decodeAbiParameters(
				[{ type: 'string' }],
				'0x' +
				'0000000000000000000000000000000000000000000000000000000000000020' +
				'0000000000000000000000000000000000000000000000000000000000000005' +
				'48656c6c6f000000000000000000000000000000000000000000000000000000'
			)
			expect(decoded).toEqual(['Hello'])
		})

		it('should decode an address', () => {
			const decoded = decodeAbiParameters(
				[{ type: 'address' }],
				'0x000000000000000000000000742d35cc6634c0532925a3b844bc9e7595f0beb0'
			)
			expect(decoded).toEqual(['0x742d35cc6634c0532925a3b844bc9e7595f0beb0'])
		})

		it('should decode multiple parameters', () => {
			const decoded = decodeAbiParameters(
				[
					{ type: 'address', name: 'to' },
					{ type: 'uint256', name: 'amount' }
				],
				'0x' +
				'000000000000000000000000742d35cc6634c0532925a3b844bc9e7595f0beb0' +
				'0000000000000000000000000000000000000000000000000000000000000064'
			)
			expect(decoded).toEqual(['0x742d35cc6634c0532925a3b844bc9e7595f0beb0', 100n])
		})

		it('should decode a boolean', () => {
			const decodedTrue = decodeAbiParameters(
				[{ type: 'bool' }],
				'0x0000000000000000000000000000000000000000000000000000000000000001'
			)
			expect(decodedTrue).toEqual([true])

			const decodedFalse = decodeAbiParameters(
				[{ type: 'bool' }],
				'0x0000000000000000000000000000000000000000000000000000000000000000'
			)
			expect(decodedFalse).toEqual([false])
		})

		it('should decode an array of uint256', () => {
			const decoded = decodeAbiParameters(
				[{ type: 'uint256[]' }],
				'0x' +
				'0000000000000000000000000000000000000000000000000000000000000020' +
				'0000000000000000000000000000000000000000000000000000000000000003' +
				'0000000000000000000000000000000000000000000000000000000000000001' +
				'0000000000000000000000000000000000000000000000000000000000000002' +
				'0000000000000000000000000000000000000000000000000000000000000003'
			)
			expect(decoded).toEqual([[1n, 2n, 3n]])
		})
	})

	describe('roundtrip', () => {
		it('should encode and decode uint256', () => {
			const original = [12345678901234567890n]
			const encoded = encodeAbiParameters([{ type: 'uint256' }], original)
			const decoded = decodeAbiParameters([{ type: 'uint256' }], encoded)
			expect(decoded).toEqual(original)
		})

		it('should encode and decode string', () => {
			const original = ['Hello, World!']
			const encoded = encodeAbiParameters([{ type: 'string' }], original)
			const decoded = decodeAbiParameters([{ type: 'string' }], encoded)
			expect(decoded).toEqual(original)
		})

		it('should encode and decode complex types', () => {
			const params = [
				{ type: 'address', name: 'from' },
				{ type: 'address', name: 'to' },
				{ type: 'uint256', name: 'amount' },
				{ type: 'string', name: 'memo' }
			] as const
			const original = [
				'0x1234567890123456789012345678901234567890',
				'0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
				1000000000000000000n,
				'Test transfer'
			]
			const encoded = encodeAbiParameters(params, original as any)
			const decoded = decodeAbiParameters(params, encoded)
			expect(decoded).toEqual([
				'0x1234567890123456789012345678901234567890',
				'0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
				1000000000000000000n,
				'Test transfer'
			])
		})
	})
})
