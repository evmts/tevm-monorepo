import { describe, it, expect } from 'vitest'
import { numberToHex, valuesArrayToHeaderData, getDifficulty, getNumBlobs, fakeExponential } from './helpers.js'
import type { BlockHeaderBytes, HeaderData } from './types.js'

describe('helpers', () => {
	describe('numberToHex', () => {
		it('should return undefined for undefined input', () => {
			expect(numberToHex(undefined)).toBe(undefined)
		})

		it('should return hex string as-is if already hex', () => {
			expect(numberToHex('0x123')).toBe('0x123')
			expect(numberToHex('0xabc')).toBe('0xabc')
			expect(numberToHex('0x0')).toBe('0x0')
		})

		it('should convert decimal string to hex', () => {
			expect(numberToHex('10')).toBe('0xa')
			expect(numberToHex('255')).toBe('0xff')
			expect(numberToHex('0')).toBe('0x0')
			expect(numberToHex('16')).toBe('0x10')
		})

		it('should convert large decimal strings to hex', () => {
			expect(numberToHex('1000000')).toBe('0xf4240')
		})

		it('should throw for non-numeric non-hex strings', () => {
			expect(() => numberToHex('abc')).toThrow('Cannot convert string to hex string')
			expect(() => numberToHex('12.34')).toThrow('Cannot convert string to hex string')
			expect(() => numberToHex('hello')).toThrow('Cannot convert string to hex string')
			expect(() => numberToHex('-10')).toThrow('Cannot convert string to hex string')
		})
	})

	describe('valuesArrayToHeaderData', () => {
		it('should convert a minimal valid header (15 values)', () => {
			const values: BlockHeaderBytes = [
				new Uint8Array(32), // parentHash
				new Uint8Array(32), // uncleHash
				new Uint8Array(20), // coinbase
				new Uint8Array(32), // stateRoot
				new Uint8Array(32), // transactionsTrie
				new Uint8Array(32), // receiptTrie
				new Uint8Array(256), // logsBloom
				new Uint8Array([0x01]), // difficulty
				new Uint8Array([0x01]), // number
				new Uint8Array([0x01]), // gasLimit
				new Uint8Array([0x01]), // gasUsed
				new Uint8Array([0x01]), // timestamp
				new Uint8Array([0x00]), // extraData
				new Uint8Array(32), // mixHash
				new Uint8Array(8), // nonce
			]

			const result = valuesArrayToHeaderData(values)
			expect(result).toBeDefined()
			expect(result.parentHash).toBeInstanceOf(Uint8Array)
			expect(result.uncleHash).toBeInstanceOf(Uint8Array)
			expect(result.coinbase).toBeInstanceOf(Uint8Array)
			expect(result.stateRoot).toBeInstanceOf(Uint8Array)
			expect(result.transactionsTrie).toBeInstanceOf(Uint8Array)
			expect(result.receiptTrie).toBeInstanceOf(Uint8Array)
			expect(result.logsBloom).toBeInstanceOf(Uint8Array)
			expect(result.difficulty).toBeInstanceOf(Uint8Array)
			expect(result.number).toBeInstanceOf(Uint8Array)
			expect(result.gasLimit).toBeInstanceOf(Uint8Array)
			expect(result.gasUsed).toBeInstanceOf(Uint8Array)
			expect(result.timestamp).toBeInstanceOf(Uint8Array)
			expect(result.extraData).toBeInstanceOf(Uint8Array)
			expect(result.mixHash).toBeInstanceOf(Uint8Array)
			expect(result.nonce).toBeInstanceOf(Uint8Array)
		})

		it('should convert a full header with all EIP fields (21 values)', () => {
			const values: BlockHeaderBytes = [
				new Uint8Array(32), // parentHash
				new Uint8Array(32), // uncleHash
				new Uint8Array(20), // coinbase
				new Uint8Array(32), // stateRoot
				new Uint8Array(32), // transactionsTrie
				new Uint8Array(32), // receiptTrie
				new Uint8Array(256), // logsBloom
				new Uint8Array([0x01]), // difficulty
				new Uint8Array([0x01]), // number
				new Uint8Array([0x01]), // gasLimit
				new Uint8Array([0x01]), // gasUsed
				new Uint8Array([0x01]), // timestamp
				new Uint8Array([0x00]), // extraData
				new Uint8Array(32), // mixHash
				new Uint8Array(8), // nonce
				new Uint8Array([0x01]), // baseFeePerGas (EIP-1559)
				new Uint8Array(32), // withdrawalsRoot (EIP-4895)
				new Uint8Array([0x01]), // blobGasUsed (EIP-4844)
				new Uint8Array([0x01]), // excessBlobGas (EIP-4844)
				new Uint8Array(32), // parentBeaconBlockRoot (EIP-4788)
				new Uint8Array(32), // requestsRoot (EIP-7685)
			]

			const result = valuesArrayToHeaderData(values)
			expect(result).toBeDefined()
			expect(result.baseFeePerGas).toBeInstanceOf(Uint8Array)
			expect(result.withdrawalsRoot).toBeInstanceOf(Uint8Array)
			expect(result.blobGasUsed).toBeInstanceOf(Uint8Array)
			expect(result.excessBlobGas).toBeInstanceOf(Uint8Array)
			expect(result.parentBeaconBlockRoot).toBeInstanceOf(Uint8Array)
			expect(result.requestsRoot).toBeInstanceOf(Uint8Array)
		})

		it('should throw for too many values (> 21)', () => {
			const values = new Array(22).fill(new Uint8Array(32)) as BlockHeaderBytes
			expect(() => valuesArrayToHeaderData(values)).toThrow('invalid header. More values than expected')
		})

		it('should throw for too few values (< 15)', () => {
			const values = new Array(14).fill(new Uint8Array(32)) as BlockHeaderBytes
			expect(() => valuesArrayToHeaderData(values)).toThrow('invalid header. Less values than expected')
		})

		it('should handle undefined values in array', () => {
			const values: BlockHeaderBytes = [
				new Uint8Array(32), // parentHash
				undefined as unknown as Uint8Array, // uncleHash - undefined
				new Uint8Array(20), // coinbase
				new Uint8Array(32), // stateRoot
				new Uint8Array(32), // transactionsTrie
				new Uint8Array(32), // receiptTrie
				new Uint8Array(256), // logsBloom
				new Uint8Array([0x01]), // difficulty
				new Uint8Array([0x01]), // number
				new Uint8Array([0x01]), // gasLimit
				new Uint8Array([0x01]), // gasUsed
				new Uint8Array([0x01]), // timestamp
				new Uint8Array([0x00]), // extraData
				new Uint8Array(32), // mixHash
				new Uint8Array(8), // nonce
			]

			const result = valuesArrayToHeaderData(values)
			expect(result.parentHash).toBeDefined()
			expect(result.uncleHash).toBeUndefined()
			expect(result.coinbase).toBeDefined()
		})
	})

	describe('getDifficulty', () => {
		it('should return bigint for bigint difficulty', () => {
			const headerData: HeaderData = {
				difficulty: 1000n,
			}
			expect(getDifficulty(headerData)).toBe(1000n)
		})

		it('should return bigint for number difficulty', () => {
			const headerData: HeaderData = {
				difficulty: 1000,
			}
			expect(getDifficulty(headerData)).toBe(1000n)
		})

		it('should return bigint for hex string difficulty', () => {
			const headerData: HeaderData = {
				difficulty: '0x3e8', // 1000 in hex
			}
			expect(getDifficulty(headerData)).toBe(1000n)
		})

		it('should return bigint for Uint8Array difficulty', () => {
			const headerData: HeaderData = {
				difficulty: new Uint8Array([0x03, 0xe8]), // 1000 in bytes
			}
			expect(getDifficulty(headerData)).toBe(1000n)
		})

		it('should return null when difficulty is undefined', () => {
			const headerData: HeaderData = {}
			expect(getDifficulty(headerData)).toBe(null)
		})

		it('should handle zero difficulty', () => {
			const headerData: HeaderData = {
				difficulty: 0n,
			}
			expect(getDifficulty(headerData)).toBe(0n)
		})

		it('should handle large difficulty values', () => {
			const largeDifficulty = 1234567890123456789012345678901234567890n
			const headerData: HeaderData = {
				difficulty: largeDifficulty,
			}
			expect(getDifficulty(headerData)).toBe(largeDifficulty)
		})
	})

	describe('getNumBlobs', () => {
		it('should return 0 for empty transaction array', () => {
			expect(getNumBlobs([])).toBe(0)
		})

		it('should return 0 for non-blob transactions', () => {
			// Mock non-blob transactions (they don't have blobVersionedHashes)
			const mockTx = { type: 2 }
			expect(getNumBlobs([mockTx as any])).toBe(0)
		})

		// Note: Testing with actual BlobEIP4844Transaction would require more setup
		// as it needs proper blob transaction construction. The function correctly
		// checks instanceof BlobEIP4844Transaction, so non-blob txs return 0.
	})

	describe('fakeExponential', () => {
		it('should calculate 1 * e^0 approximately', () => {
			// e^0 = 1, so factor * e^0 = factor
			const result = fakeExponential(1n, 0n, 1n)
			expect(result).toBe(1n)
		})

		it('should calculate e^1 approximation with factor 1000', () => {
			// e ≈ 2.718, so 1000 * e ≈ 2718
			// The Taylor series should give approximately this
			const result = fakeExponential(1000n, 1n, 1n)
			// Should be approximately 2718 (e * 1000)
			expect(result).toBeGreaterThan(2700n)
			expect(result).toBeLessThan(2800n)
		})

		it('should handle the formula used in EIP-4844 blob gas pricing', () => {
			// The formula is: MIN_BLOB_BASE_FEE * e^(excess_blob_gas / BLOB_BASE_FEE_UPDATE_FRACTION)
			// MIN_BLOB_BASE_FEE = 1 wei
			// BLOB_BASE_FEE_UPDATE_FRACTION = 3338477
			const minBlobBaseFee = 1n
			const blobBaseFeeUpdateFraction = 3338477n

			// With 0 excess blob gas, should return minBlobBaseFee (e^0 = 1)
			const result = fakeExponential(minBlobBaseFee, 0n, blobBaseFeeUpdateFraction)
			expect(result).toBe(1n)
		})

		it('should return larger values for larger numerators', () => {
			const result1 = fakeExponential(1000n, 1n, 10n)
			const result2 = fakeExponential(1000n, 2n, 10n)
			const result3 = fakeExponential(1000n, 3n, 10n)

			// e^0.1 < e^0.2 < e^0.3
			expect(result2).toBeGreaterThan(result1)
			expect(result3).toBeGreaterThan(result2)
		})

		it('should scale linearly with factor', () => {
			const result1 = fakeExponential(100n, 1n, 10n)
			const result2 = fakeExponential(200n, 1n, 10n)

			// result2 should be approximately 2 * result1
			expect(result2).toBeGreaterThanOrEqual(result1 * 2n - 1n)
			expect(result2).toBeLessThanOrEqual(result1 * 2n + 1n)
		})

		it('should handle very small exponentials', () => {
			// With very large denominator, e^(1/denominator) ≈ 1
			const result = fakeExponential(1000n, 1n, 1000000n)
			// Should be very close to 1000 (factor * e^0 ≈ factor * 1)
			expect(result).toBeGreaterThanOrEqual(1000n)
			expect(result).toBeLessThan(1002n)
		})
	})
})
