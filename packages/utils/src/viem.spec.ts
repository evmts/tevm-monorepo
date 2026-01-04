import { describe, expect, it } from 'vitest'
import {
	boolToBytes,
	boolToHex,
	bytesToBool,
	bytesToHex,
	formatAbi,
	formatEther,
	getAddress,
	hexToBigInt,
	hexToBool,
	hexToBytes,
	hexToNumber,
	isAddress,
	isBytes,
	isHex,
	keccak256,
	numberToHex,
	parseAbi,
	parseEther,
	stringToHex,
	toBytes,
	toHex,
} from './viem.js'

describe('viem re-exports', () => {
	it('should properly export parseAbi and formatAbi', () => {
		const abi = parseAbi(['function transfer(address to, uint256 amount) returns (bool)'])
		expect(abi).toBeInstanceOf(Array)
		expect(abi[0].type).toBe('function')
		expect(abi[0].name).toBe('transfer')

		// Just test formatAbi exists and is a function
		expect(typeof formatAbi).toBe('function')
	})

	it('should properly export byte conversion utilities', () => {
		const bytes = new Uint8Array([0x12, 0x34])
		const hex = bytesToHex(bytes)
		expect(hex).toBe('0x1234')

		const convertedBytes = hexToBytes(hex)
		expect(convertedBytes).toEqual(bytes)
	})

	it('should properly export hex conversion utilities', () => {
		expect(hexToBigInt('0x1234')).toBe(4660n)
		expect(hexToNumber('0xff')).toBe(255)
		expect(numberToHex(255)).toBe('0xff')
		expect(boolToHex(true)).toBe('0x1')
		expect(stringToHex('hello')).toBe('0x68656c6c6f')
	})

	it('should properly export toBytes and toHex', () => {
		expect(toBytes('hello')).toEqual(new Uint8Array([104, 101, 108, 108, 111]))
		expect(toHex(255)).toBe('0xff')
	})

	it('should properly export keccak256', () => {
		const hash = keccak256(new Uint8Array([1, 2, 3]))
		expect(hash).toMatch(/^0x[0-9a-f]{64}$/)
	})

	it('should properly export address utilities', () => {
		const address = '0x1234567890123456789012345678901234567890'
		expect(isAddress(address)).toBe(true)

		const checksummedAddress = getAddress(address)
		expect(isAddress(checksummedAddress)).toBe(true)
	})

	it('should properly export isHex utility', () => {
		expect(isHex('0x1234')).toBe(true)
		expect(isHex('hello')).toBe(false)
	})

	it('should properly export ether conversion utilities', () => {
		const wei = parseEther('1.0')
		expect(wei).toBe(1000000000000000000n)

		const ether = formatEther(wei)
		expect(ether).toBe('1')
	})
})

describe('native implementations (migrated from viem)', () => {
	describe('bytesToHex', () => {
		it('should convert empty bytes to 0x', () => {
			expect(bytesToHex(new Uint8Array([]))).toBe('0x')
		})

		it('should convert single byte', () => {
			expect(bytesToHex(new Uint8Array([0]))).toBe('0x00')
			expect(bytesToHex(new Uint8Array([255]))).toBe('0xff')
		})
	})

	describe('hexToBytes', () => {
		it('should convert empty hex to empty array', () => {
			expect(hexToBytes('0x')).toEqual(new Uint8Array([]))
		})

		it('should handle odd-length hex', () => {
			expect(hexToBytes('0xf')).toEqual(new Uint8Array([0x0f]))
		})

		it('should throw on invalid hex', () => {
			expect(() => hexToBytes('invalid')).toThrow()
			expect(() => hexToBytes('0xgg')).toThrow()
		})
	})

	describe('hexToBigInt', () => {
		it('should handle empty hex', () => {
			expect(hexToBigInt('0x')).toBe(0n)
			expect(hexToBigInt('0x0')).toBe(0n)
		})

		it('should handle signed integers', () => {
			// 0xff as signed 8-bit is -1
			expect(hexToBigInt('0xff', { signed: true })).toBe(-1n)
			// 0x80 as signed 8-bit is -128
			expect(hexToBigInt('0x80', { signed: true })).toBe(-128n)
			// 0x7f as signed 8-bit is 127 (positive)
			expect(hexToBigInt('0x7f', { signed: true })).toBe(127n)
		})

		it('should throw on invalid hex', () => {
			expect(() => hexToBigInt('invalid' as `0x${string}`)).toThrow()
		})
	})

	describe('hexToNumber', () => {
		it('should handle zero', () => {
			expect(hexToNumber('0x0')).toBe(0)
		})

		it('should handle signed integers', () => {
			expect(hexToNumber('0xff', { signed: true })).toBe(-1)
		})

		it('should throw on unsafe integers', () => {
			// MAX_SAFE_INTEGER + 1 = 9007199254740992 = 0x20000000000000
			expect(() => hexToNumber('0x20000000000000')).toThrow('outside safe integer range')
		})
	})

	describe('numberToHex', () => {
		it('should convert basic numbers', () => {
			expect(numberToHex(0)).toBe('0x0')
			expect(numberToHex(255)).toBe('0xff')
			expect(numberToHex(256)).toBe('0x100')
			expect(numberToHex(4660)).toBe('0x1234')
		})

		it('should convert bigints', () => {
			expect(numberToHex(255n)).toBe('0xff')
			expect(numberToHex(1000000000000000000n)).toBe('0xde0b6b3a7640000')
		})

		it('should pad to specified size', () => {
			expect(numberToHex(255, { size: 1 })).toBe('0xff')
			expect(numberToHex(255, { size: 2 })).toBe('0x00ff')
			expect(numberToHex(1, { size: 4 })).toBe('0x00000001')
			expect(numberToHex(0, { size: 32 })).toBe('0x' + '0'.repeat(64))
		})

		it('should throw when value exceeds size', () => {
			expect(() => numberToHex(256, { size: 1 })).toThrow('exceeds 1 byte size')
			expect(() => numberToHex(65536, { size: 2 })).toThrow('exceeds 2 byte size')
		})

		it('should throw on negative unsigned', () => {
			expect(() => numberToHex(-1)).toThrow('Negative value')
		})

		it('should handle signed encoding', () => {
			// -1 as signed 1-byte = 0xff
			expect(numberToHex(-1, { signed: true, size: 1 })).toBe('0xff')
			// -128 as signed 1-byte = 0x80
			expect(numberToHex(-128, { signed: true, size: 1 })).toBe('0x80')
			// 127 as signed 1-byte = 0x7f
			expect(numberToHex(127, { signed: true, size: 1 })).toBe('0x7f')
			// -1 as signed 2-byte = 0xffff
			expect(numberToHex(-1, { signed: true, size: 2 })).toBe('0xffff')
		})

		it('should throw when signed value out of range', () => {
			// 128 is out of range for signed 1-byte (max 127)
			expect(() => numberToHex(128, { signed: true, size: 1 })).toThrow('out of range')
			// -129 is out of range for signed 1-byte (min -128)
			expect(() => numberToHex(-129, { signed: true, size: 1 })).toThrow('out of range')
		})

		it('should require size for signed encoding', () => {
			expect(() => numberToHex(-1, { signed: true })).toThrow('Size is required')
		})
	})

	describe('boolToHex', () => {
		it('should convert true to 0x1', () => {
			expect(boolToHex(true)).toBe('0x1')
		})

		it('should convert false to 0x0', () => {
			expect(boolToHex(false)).toBe('0x0')
		})

		it('should pad to specified size', () => {
			expect(boolToHex(true, { size: 1 })).toBe('0x01')
			expect(boolToHex(true, { size: 4 })).toBe('0x00000001')
			expect(boolToHex(true, { size: 32 })).toBe('0x' + '0'.repeat(63) + '1')
			expect(boolToHex(false, { size: 4 })).toBe('0x00000000')
		})
	})

	describe('hexToBool', () => {
		it('should convert 0x1 to true', () => {
			expect(hexToBool('0x1')).toBe(true)
		})

		it('should convert 0x0 to false', () => {
			expect(hexToBool('0x0')).toBe(false)
		})

		it('should handle padded hex', () => {
			expect(hexToBool('0x01')).toBe(true)
			expect(hexToBool('0x00')).toBe(false)
			expect(hexToBool('0x0000000000000000000000000000000000000000000000000000000000000001')).toBe(true)
			expect(hexToBool('0x0000000000000000000000000000000000000000000000000000000000000000')).toBe(false)
		})

		it('should throw on invalid hex', () => {
			expect(() => hexToBool('invalid' as `0x${string}`)).toThrow()
		})
	})

	describe('boolToBytes', () => {
		it('should convert true to Uint8Array([1])', () => {
			expect(boolToBytes(true)).toEqual(new Uint8Array([1]))
		})

		it('should convert false to Uint8Array([0])', () => {
			expect(boolToBytes(false)).toEqual(new Uint8Array([0]))
		})

		it('should pad to specified size', () => {
			expect(boolToBytes(true, { size: 1 })).toEqual(new Uint8Array([1]))
			expect(boolToBytes(true, { size: 4 })).toEqual(new Uint8Array([0, 0, 0, 1]))
			expect(boolToBytes(false, { size: 4 })).toEqual(new Uint8Array([0, 0, 0, 0]))
		})
	})

	describe('bytesToBool', () => {
		it('should convert Uint8Array([1]) to true', () => {
			expect(bytesToBool(new Uint8Array([1]))).toBe(true)
		})

		it('should convert Uint8Array([0]) to false', () => {
			expect(bytesToBool(new Uint8Array([0]))).toBe(false)
		})

		it('should handle padded bytes', () => {
			expect(bytesToBool(new Uint8Array([0, 0, 0, 1]))).toBe(true)
			expect(bytesToBool(new Uint8Array([0, 0, 0, 0]))).toBe(false)
			expect(bytesToBool(new Uint8Array([0, 1, 0, 0]))).toBe(true)
		})

		it('should handle empty array as false', () => {
			expect(bytesToBool(new Uint8Array([]))).toBe(false)
		})
	})

	describe('isHex', () => {
		it('should return true for valid hex strings', () => {
			expect(isHex('0x')).toBe(true)
			expect(isHex('0x0')).toBe(true)
			expect(isHex('0x1234')).toBe(true)
			expect(isHex('0xabcdef')).toBe(true)
			expect(isHex('0xABCDEF')).toBe(true)
			expect(isHex('0x1234567890abcdef')).toBe(true)
		})

		it('should return false for invalid hex strings', () => {
			expect(isHex('0xgg')).toBe(false)
			expect(isHex('0xzz')).toBe(false)
			expect(isHex('0x123g')).toBe(false)
		})

		it('should return false for strings without 0x prefix', () => {
			expect(isHex('1234')).toBe(false)
			expect(isHex('hello')).toBe(false)
			expect(isHex('abcdef')).toBe(false)
		})

		it('should return false for non-string values', () => {
			expect(isHex(123)).toBe(false)
			expect(isHex(null)).toBe(false)
			expect(isHex(undefined)).toBe(false)
			expect(isHex({})).toBe(false)
			expect(isHex([])).toBe(false)
			expect(isHex(true)).toBe(false)
		})

		it('should handle strict mode (default: true)', () => {
			// With strict: true (default), validates hex characters
			expect(isHex('0xgg', { strict: true })).toBe(false)
			expect(isHex('0x1234', { strict: true })).toBe(true)
		})

		it('should handle non-strict mode', () => {
			// With strict: false, only checks for 0x prefix
			expect(isHex('0xgg', { strict: false })).toBe(true)
			expect(isHex('0x1234', { strict: false })).toBe(true)
			expect(isHex('hello', { strict: false })).toBe(false)
		})
	})

	describe('isBytes', () => {
		it('should return true for valid Uint8Array', () => {
			expect(isBytes(new Uint8Array([]))).toBe(true)
			expect(isBytes(new Uint8Array([0]))).toBe(true)
			expect(isBytes(new Uint8Array([1, 2, 3]))).toBe(true)
			expect(isBytes(new Uint8Array([255, 128, 0]))).toBe(true)
		})

		it('should return false for regular arrays', () => {
			expect(isBytes([1, 2, 3])).toBe(false)
			expect(isBytes([])).toBe(false)
			expect(isBytes([255])).toBe(false)
		})

		it('should return false for other typed arrays', () => {
			expect(isBytes(new Uint16Array([1, 2]))).toBe(false)
			expect(isBytes(new Uint32Array([1]))).toBe(false)
			expect(isBytes(new Int8Array([1]))).toBe(false)
			expect(isBytes(new Float32Array([1.0]))).toBe(false)
		})

		it('should return false for falsy values', () => {
			expect(isBytes(null)).toBe(false)
			expect(isBytes(undefined)).toBe(false)
			expect(isBytes(0)).toBe(false)
			expect(isBytes('')).toBe(false)
			expect(isBytes(false)).toBe(false)
		})

		it('should return false for non-object values', () => {
			expect(isBytes('0x1234')).toBe(false)
			expect(isBytes(123)).toBe(false)
			expect(isBytes(true)).toBe(false)
			expect(isBytes(Symbol('test'))).toBe(false)
		})

		it('should return false for objects without BYTES_PER_ELEMENT', () => {
			expect(isBytes({})).toBe(false)
			expect(isBytes({ length: 3 })).toBe(false)
			expect(isBytes({ 0: 1, 1: 2, length: 2 })).toBe(false)
		})
	})
})
