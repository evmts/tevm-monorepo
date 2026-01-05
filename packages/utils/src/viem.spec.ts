import { describe, expect, it } from 'vitest'
import {
	boolToBytes,
	boolToHex,
	bytesToBigInt,
	bytesToBigint,
	bytesToBool,
	bytesToHex,
	bytesToNumber,
	concatHex,
	encodePacked,
	formatAbi,
	formatEther,
	formatGwei,
	formatLog,
	fromBytes,
	fromHex,
	getAddress,
	hexToBigInt,
	hexToBool,
	hexToBytes,
	hexToNumber,
	hexToString,
	isAddress,
	isBytes,
	isHex,
	keccak256,
	numberToHex,
	parseAbi,
	parseEther,
	parseGwei,
	serializeTransaction,
	stringToHex,
	toBytes,
	toEventSelector,
	toFunctionSelector,
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
			// @ts-expect-error - testing invalid input
			expect(() => hexToBytes('invalid')).toThrow()
			expect(() => hexToBytes('0xgg' as `0x${string}`)).toThrow()
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

	describe('stringToHex', () => {
		it('should convert basic ASCII strings', () => {
			expect(stringToHex('hello')).toBe('0x68656c6c6f')
			expect(stringToHex('Hello')).toBe('0x48656c6c6f')
			expect(stringToHex('123')).toBe('0x313233')
		})

		it('should convert empty string to 0x', () => {
			expect(stringToHex('')).toBe('0x')
		})

		it('should handle single characters', () => {
			expect(stringToHex('a')).toBe('0x61')
			expect(stringToHex('Z')).toBe('0x5a')
			expect(stringToHex('0')).toBe('0x30')
		})

		it('should handle Unicode/UTF-8 characters', () => {
			// Euro sign (€) is 3 bytes in UTF-8: 0xe2 0x82 0xac
			expect(stringToHex('€')).toBe('0xe282ac')
			// Japanese character (日) is 3 bytes in UTF-8
			expect(stringToHex('日')).toBe('0xe697a5')
			// Emoji (😀) is 4 bytes in UTF-8
			expect(stringToHex('😀')).toBe('0xf09f9880')
		})

		it('should pad to specified size', () => {
			// 'hello' is 5 bytes, pad to 8 bytes with null bytes
			expect(stringToHex('hello', { size: 8 })).toBe('0x68656c6c6f000000')
			// 'hi' is 2 bytes, pad to 4 bytes
			expect(stringToHex('hi', { size: 4 })).toBe('0x68690000')
			// empty string padded to 4 bytes
			expect(stringToHex('', { size: 4 })).toBe('0x00000000')
		})

		it('should throw when string exceeds specified size', () => {
			expect(() => stringToHex('hello', { size: 3 })).toThrow('exceeds 3 byte size')
			expect(() => stringToHex('hello world', { size: 5 })).toThrow('exceeds 5 byte size')
		})
	})

	describe('hexToString', () => {
		it('should convert basic hex to ASCII strings', () => {
			expect(hexToString('0x68656c6c6f')).toBe('hello')
			expect(hexToString('0x48656c6c6f')).toBe('Hello')
			expect(hexToString('0x313233')).toBe('123')
		})

		it('should convert empty hex to empty string', () => {
			expect(hexToString('0x')).toBe('')
		})

		it('should handle single character hex', () => {
			expect(hexToString('0x61')).toBe('a')
			expect(hexToString('0x5a')).toBe('Z')
			expect(hexToString('0x30')).toBe('0')
		})

		it('should handle Unicode/UTF-8 characters', () => {
			// Euro sign (€) is 3 bytes in UTF-8
			expect(hexToString('0xe282ac')).toBe('€')
			// Japanese character (日) is 3 bytes in UTF-8
			expect(hexToString('0xe697a5')).toBe('日')
			// Emoji (😀) is 4 bytes in UTF-8
			expect(hexToString('0xf09f9880')).toBe('😀')
			// Check mark (✓) is 3 bytes in UTF-8
			expect(hexToString('0xe29c93')).toBe('✓')
			// Smiling face emoji (😊) is 4 bytes in UTF-8
			expect(hexToString('0xf09f988a')).toBe('😊')
		})

		it('should handle longer strings', () => {
			expect(hexToString('0x48656c6c6f2c20576f726c6421')).toBe('Hello, World!')
		})

		it('should handle null bytes', () => {
			// Null byte
			expect(hexToString('0x00')).toBe('\0')
			// String with embedded null
			expect(hexToString('0x3100')).toBe('1\0')
			// Null followed by '1' (0x31)
			expect(hexToString('0x0031')).toBe('\x001')
		})

		it('should be inverse of stringToHex', () => {
			const testStrings = ['hello', '', 'Hello, World!', '€', '日本語', '😀🎉', '123', 'a']
			for (const str of testStrings) {
				expect(hexToString(stringToHex(str))).toBe(str)
			}
		})

		it('should throw on invalid hex', () => {
			expect(() => hexToString('invalid' as `0x${string}`)).toThrow()
			expect(() => hexToString('hello' as `0x${string}`)).toThrow()
		})
	})

	describe('bytesToNumber', () => {
		it('should convert basic bytes to number', () => {
			expect(bytesToNumber(new Uint8Array([1, 164]))).toBe(420)
			expect(bytesToNumber(new Uint8Array([255]))).toBe(255)
			expect(bytesToNumber(new Uint8Array([1, 0]))).toBe(256)
		})

		it('should handle empty bytes as zero', () => {
			expect(bytesToNumber(new Uint8Array([]))).toBe(0)
		})

		it('should handle single byte values', () => {
			expect(bytesToNumber(new Uint8Array([0]))).toBe(0)
			expect(bytesToNumber(new Uint8Array([1]))).toBe(1)
			expect(bytesToNumber(new Uint8Array([127]))).toBe(127)
			expect(bytesToNumber(new Uint8Array([128]))).toBe(128)
			expect(bytesToNumber(new Uint8Array([255]))).toBe(255)
		})

		it('should handle multi-byte values', () => {
			expect(bytesToNumber(new Uint8Array([0, 1]))).toBe(1)
			expect(bytesToNumber(new Uint8Array([0xff, 0xff]))).toBe(65535)
			expect(bytesToNumber(new Uint8Array([1, 0, 0]))).toBe(65536)
		})

		it('should handle signed integers (two\'s complement)', () => {
			// 0xff as signed 8-bit is -1
			expect(bytesToNumber(new Uint8Array([0xff]), { signed: true })).toBe(-1)
			// 0x80 as signed 8-bit is -128
			expect(bytesToNumber(new Uint8Array([0x80]), { signed: true })).toBe(-128)
			// 0x7f as signed 8-bit is 127 (positive)
			expect(bytesToNumber(new Uint8Array([0x7f]), { signed: true })).toBe(127)
			// 0xffff as signed 16-bit is -1
			expect(bytesToNumber(new Uint8Array([0xff, 0xff]), { signed: true })).toBe(-1)
		})

		it('should throw on values exceeding safe integer range', () => {
			// 9007199254740993 (MAX_SAFE_INTEGER + 1) = 0x20000000000001
			const largeBytes = new Uint8Array([0x20, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01])
			expect(() => bytesToNumber(largeBytes)).toThrow('outside safe integer range')
		})

		it('should be inverse of numberToHex + hexToBytes', () => {
			const testValues = [0, 1, 255, 256, 65535, 1000000]
			for (const value of testValues) {
				const hex = numberToHex(value)
				const bytes = hexToBytes(hex)
				expect(bytesToNumber(bytes)).toBe(value)
			}
		})
	})

	describe('bytesToBigInt', () => {
		it('should convert basic bytes to BigInt', () => {
			expect(bytesToBigInt(new Uint8Array([1, 164]))).toBe(420n)
			expect(bytesToBigInt(new Uint8Array([255]))).toBe(255n)
			expect(bytesToBigInt(new Uint8Array([1, 0]))).toBe(256n)
		})

		it('should handle empty bytes as zero', () => {
			expect(bytesToBigInt(new Uint8Array([]))).toBe(0n)
		})

		it('should handle single byte values', () => {
			expect(bytesToBigInt(new Uint8Array([0]))).toBe(0n)
			expect(bytesToBigInt(new Uint8Array([1]))).toBe(1n)
			expect(bytesToBigInt(new Uint8Array([127]))).toBe(127n)
			expect(bytesToBigInt(new Uint8Array([128]))).toBe(128n)
			expect(bytesToBigInt(new Uint8Array([255]))).toBe(255n)
		})

		it('should handle multi-byte values', () => {
			expect(bytesToBigInt(new Uint8Array([0, 1]))).toBe(1n)
			expect(bytesToBigInt(new Uint8Array([0xff, 0xff]))).toBe(65535n)
			expect(bytesToBigInt(new Uint8Array([1, 0, 0]))).toBe(65536n)
		})

		it('should handle large values that exceed safe integer range', () => {
			// 9007199254740993 (MAX_SAFE_INTEGER + 1) = 0x20000000000001
			const largeBytes = new Uint8Array([0x20, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01])
			expect(bytesToBigInt(largeBytes)).toBe(9007199254740993n)

			// Very large value: 0xffffffffffffffff = 18446744073709551615
			const maxUint64 = new Uint8Array([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff])
			expect(bytesToBigInt(maxUint64)).toBe(18446744073709551615n)
		})

		it('should handle signed integers (two\'s complement)', () => {
			// 0xff as signed 8-bit is -1
			expect(bytesToBigInt(new Uint8Array([0xff]), { signed: true })).toBe(-1n)
			// 0x80 as signed 8-bit is -128
			expect(bytesToBigInt(new Uint8Array([0x80]), { signed: true })).toBe(-128n)
			// 0x7f as signed 8-bit is 127 (positive)
			expect(bytesToBigInt(new Uint8Array([0x7f]), { signed: true })).toBe(127n)
			// 0xffff as signed 16-bit is -1
			expect(bytesToBigInt(new Uint8Array([0xff, 0xff]), { signed: true })).toBe(-1n)
		})

		it('should be inverse of hexToBigInt + hexToBytes for bigints', () => {
			const testValues = [0n, 1n, 255n, 256n, 65535n, 1000000000000000000n]
			for (const value of testValues) {
				const hex = `0x${value.toString(16)}` as `0x${string}`
				const bytes = hexToBytes(hex)
				expect(bytesToBigInt(bytes)).toBe(value)
			}
		})

		it('should have bytesToBigint alias that works identically', () => {
			// Test that the alias points to the same function
			expect(bytesToBigint).toBe(bytesToBigInt)

			// Test it works the same way
			expect(bytesToBigint(new Uint8Array([1, 164]))).toBe(420n)
			expect(bytesToBigint(new Uint8Array([0xff]), { signed: true })).toBe(-1n)
		})
	})

	describe('isAddress', () => {
		it('should return true for valid lowercase addresses', () => {
			expect(isAddress('0x1234567890123456789012345678901234567890')).toBe(true)
			expect(isAddress('0xd8da6bf26964af9d7eed9e03e53415d37aa96045')).toBe(true)
			expect(isAddress('0x0000000000000000000000000000000000000000')).toBe(true)
			expect(isAddress('0xffffffffffffffffffffffffffffffffffffffff')).toBe(true)
		})

		it('should return true for valid uppercase addresses', () => {
			expect(isAddress('0xD8DA6BF26964AF9D7EED9E03E53415D37AA96045')).toBe(true)
			expect(isAddress('0xABCDEF1234567890ABCDEF1234567890ABCDEF12')).toBe(true)
		})

		it('should return true for valid checksummed (mixed case) addresses', () => {
			expect(isAddress('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')).toBe(true)
			expect(isAddress('0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed')).toBe(true)
		})

		it('should return false for addresses that are too short', () => {
			expect(isAddress('0x123456789012345678901234567890123456789')).toBe(false) // 39 chars
			expect(isAddress('0x1234')).toBe(false)
			expect(isAddress('0x')).toBe(false)
		})

		it('should return false for addresses that are too long', () => {
			expect(isAddress('0x12345678901234567890123456789012345678901')).toBe(false) // 41 chars
			expect(isAddress('0x1234567890123456789012345678901234567890123456')).toBe(false)
		})

		it('should return false for strings without 0x prefix', () => {
			expect(isAddress('1234567890123456789012345678901234567890')).toBe(false)
			expect(isAddress('d8da6bf26964af9d7eed9e03e53415d37aa96045')).toBe(false)
		})

		it('should return false for strings with invalid hex characters', () => {
			expect(isAddress('0xg234567890123456789012345678901234567890')).toBe(false)
			expect(isAddress('0x123456789012345678901234567890123456789z')).toBe(false)
			expect(isAddress('0x!234567890123456789012345678901234567890')).toBe(false)
		})

		it('should return false for non-string values', () => {
			expect(isAddress(123)).toBe(false)
			expect(isAddress(null)).toBe(false)
			expect(isAddress(undefined)).toBe(false)
			expect(isAddress({})).toBe(false)
			expect(isAddress([])).toBe(false)
			expect(isAddress(true)).toBe(false)
		})

		it('should return false for empty or falsy values', () => {
			expect(isAddress('')).toBe(false)
			expect(isAddress(0)).toBe(false)
			expect(isAddress(false)).toBe(false)
		})
	})

	describe('formatEther', () => {
		it('should format 1 ETH correctly', () => {
			expect(formatEther(1000000000000000000n)).toBe('1')
		})

		it('should format decimal values correctly', () => {
			expect(formatEther(1500000000000000000n)).toBe('1.5')
			expect(formatEther(100000000000000000n)).toBe('0.1')
			expect(formatEther(10000000000000000n)).toBe('0.01')
		})

		it('should format zero correctly', () => {
			expect(formatEther(0n)).toBe('0')
		})

		it('should format 1 wei correctly', () => {
			expect(formatEther(1n)).toBe('0.000000000000000001')
		})

		it('should format large values correctly', () => {
			expect(formatEther(123456789012345678901234567890n)).toBe('123456789012.34567890123456789')
		})

		it('should handle number input', () => {
			expect(formatEther(1000000000000000000)).toBe('1')
		})

		it('should handle negative values', () => {
			expect(formatEther(-1000000000000000000n)).toBe('-1')
			expect(formatEther(-1500000000000000000n)).toBe('-1.5')
		})

		it('should trim trailing zeros', () => {
			expect(formatEther(1000000000000000000n)).toBe('1')
			expect(formatEther(1100000000000000000n)).toBe('1.1')
			expect(formatEther(1010000000000000000n)).toBe('1.01')
		})
	})

	describe('parseEther', () => {
		it('should parse 1 ETH correctly', () => {
			expect(parseEther('1')).toBe(1000000000000000000n)
		})

		it('should parse decimal values correctly', () => {
			expect(parseEther('0.1')).toBe(100000000000000000n)
			expect(parseEther('0.01')).toBe(10000000000000000n)
			expect(parseEther('1.5')).toBe(1500000000000000000n)
		})

		it('should parse zero correctly', () => {
			expect(parseEther('0')).toBe(0n)
		})

		it('should parse smallest wei value correctly', () => {
			expect(parseEther('0.000000000000000001')).toBe(1n)
		})

		it('should parse large values correctly', () => {
			expect(parseEther('1234567890.123456789')).toBe(1234567890123456789000000000n)
		})

		it('should handle negative values', () => {
			expect(parseEther('-1')).toBe(-1000000000000000000n)
			expect(parseEther('-0.5')).toBe(-500000000000000000n)
		})

		it('should truncate excess decimals (more than 18)', () => {
			// 19 decimal places should truncate to 18
			expect(parseEther('0.1234567890123456789')).toBe(123456789012345678n)
		})

		it('should throw on invalid ether value with multiple decimal points', () => {
			expect(() => parseEther('1.2.3')).toThrow('Invalid ether value')
		})

		it('should be inverse of formatEther', () => {
			const testValues = ['1', '0.1', '0.01', '123.456', '0.000000000000000001']
			for (const value of testValues) {
				expect(formatEther(parseEther(value))).toBe(value)
			}
		})

		it('should handle edge case with no integer part (.5 format)', () => {
			// While unusual, this tests the `parts[0] || '0'` branch
			expect(parseEther('.5')).toBe(500000000000000000n)
			expect(parseEther('.01')).toBe(10000000000000000n)
		})
	})

	describe('formatGwei', () => {
		it('should format 1 gwei correctly', () => {
			expect(formatGwei(1000000000n)).toBe('1')
		})

		it('should format decimal values correctly', () => {
			expect(formatGwei(1500000000n)).toBe('1.5')
			expect(formatGwei(100000000n)).toBe('0.1')
			expect(formatGwei(10000000n)).toBe('0.01')
		})

		it('should format zero correctly', () => {
			expect(formatGwei(0n)).toBe('0')
		})

		it('should format 1 wei correctly', () => {
			expect(formatGwei(1n)).toBe('0.000000001')
		})

		it('should format large values correctly', () => {
			expect(formatGwei(123456789012345678901n)).toBe('123456789012.345678901')
		})

		it('should handle number input', () => {
			expect(formatGwei(1000000000)).toBe('1')
		})

		it('should handle negative values', () => {
			expect(formatGwei(-1000000000n)).toBe('-1')
			expect(formatGwei(-1500000000n)).toBe('-1.5')
		})

		it('should trim trailing zeros', () => {
			expect(formatGwei(1000000000n)).toBe('1')
			expect(formatGwei(1100000000n)).toBe('1.1')
			expect(formatGwei(1010000000n)).toBe('1.01')
		})
	})

	describe('parseGwei', () => {
		it('should parse 1 gwei correctly', () => {
			expect(parseGwei('1')).toBe(1000000000n)
		})

		it('should parse decimal values correctly', () => {
			expect(parseGwei('0.1')).toBe(100000000n)
			expect(parseGwei('0.01')).toBe(10000000n)
			expect(parseGwei('1.5')).toBe(1500000000n)
		})

		it('should parse zero correctly', () => {
			expect(parseGwei('0')).toBe(0n)
		})

		it('should parse smallest wei value correctly', () => {
			expect(parseGwei('0.000000001')).toBe(1n)
		})

		it('should parse large values correctly', () => {
			expect(parseGwei('1234567890.123456789')).toBe(1234567890123456789n)
		})

		it('should handle negative values', () => {
			expect(parseGwei('-1')).toBe(-1000000000n)
			expect(parseGwei('-0.5')).toBe(-500000000n)
		})

		it('should truncate excess decimals (more than 9)', () => {
			// 10 decimal places should truncate to 9
			expect(parseGwei('0.1234567899')).toBe(123456789n)
		})

		it('should throw on invalid gwei value with multiple decimal points', () => {
			expect(() => parseGwei('1.2.3')).toThrow('Invalid gwei value')
		})

		it('should be inverse of formatGwei', () => {
			const testValues = ['1', '0.1', '0.01', '123.456', '0.000000001']
			for (const value of testValues) {
				expect(formatGwei(parseGwei(value))).toBe(value)
			}
		})

		it('should handle edge case with no integer part (.5 format)', () => {
			// While unusual, this tests the `parts[0] || '0'` branch
			expect(parseGwei('.5')).toBe(500000000n)
			expect(parseGwei('.01')).toBe(10000000n)
		})
	})

	describe('getAddress', () => {
		it('should checksum a lowercase address', () => {
			// Vitalik's address in lowercase
			const result = getAddress('0xd8da6bf26964af9d7eed9e03e53415d37aa96045')
			expect(result).toBe('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')
		})

		it('should checksum an uppercase address', () => {
			const result = getAddress('0xD8DA6BF26964AF9D7EED9E03E53415D37AA96045')
			expect(result).toBe('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')
		})

		it('should return same result for already checksummed address', () => {
			const checksummed = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
			expect(getAddress(checksummed)).toBe(checksummed)
		})

		it('should checksum the zero address', () => {
			const result = getAddress('0x0000000000000000000000000000000000000000')
			// Zero address stays all lowercase (no letters to uppercase)
			expect(result).toBe('0x0000000000000000000000000000000000000000')
		})

		it('should checksum all-F address', () => {
			const result = getAddress('0xffffffffffffffffffffffffffffffffffffffff')
			// Known checksum for all-F address
			expect(result).toBe('0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF')
		})

		it('should checksum another known address', () => {
			// Another well-known address (ERC20 interface ID example)
			const result = getAddress('0x5aaeb6053f3e94c9b9a09f33669435e7ef1beaed')
			expect(result).toBe('0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed')
		})

		it('should throw on invalid address (too short)', () => {
			expect(() => getAddress('0x1234')).toThrow('Invalid address')
		})

		it('should throw on invalid address (too long)', () => {
			expect(() => getAddress('0x12345678901234567890123456789012345678901')).toThrow('Invalid address')
		})

		it('should throw on invalid address (no 0x prefix)', () => {
			expect(() => getAddress('d8da6bf26964af9d7eed9e03e53415d37aa96045')).toThrow('Invalid address')
		})

		it('should throw on invalid address (invalid characters)', () => {
			expect(() => getAddress('0xd8da6bf26964af9d7eed9e03e53415d37aa9604g')).toThrow('Invalid address')
		})

		it('should produce consistent results', () => {
			const address = '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'
			const result1 = getAddress(address)
			const result2 = getAddress(address)
			expect(result1).toBe(result2)
		})
	})

	describe('keccak256', () => {
		it('should hash bytes correctly', () => {
			const hash = keccak256(new Uint8Array([1, 2, 3]))
			expect(hash).toMatch(/^0x[0-9a-f]{64}$/)
			// Known keccak256([1,2,3]) hash
			expect(hash).toBe('0xf1885eda54b7a053318cd41e2093220dab15d65381b1157a3633a83bfd5c9239')
		})

		it('should hash hex string correctly', () => {
			const hash = keccak256('0x010203')
			// Should be same as hashing bytes [1, 2, 3]
			expect(hash).toBe('0xf1885eda54b7a053318cd41e2093220dab15d65381b1157a3633a83bfd5c9239')
		})

		it('should hash empty bytes', () => {
			const hash = keccak256(new Uint8Array([]))
			// Known keccak256 of empty input
			expect(hash).toBe('0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470')
		})

		it('should hash empty hex string', () => {
			const hash = keccak256('0x')
			expect(hash).toBe('0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470')
		})

		it('should return bytes when to="bytes"', () => {
			const hash = keccak256(new Uint8Array([1, 2, 3]), 'bytes')
			expect(hash).toBeInstanceOf(Uint8Array)
			expect(hash.length).toBe(32)
		})

		it('should hash "hello" correctly', () => {
			// "hello" as hex is 0x68656c6c6f
			const hash = keccak256('0x68656c6c6f')
			// Known keccak256 of "hello"
			expect(hash).toBe('0x1c8aff950685c2ed4bc3174f3472287b56d9517b9c948127319a09a7a36deac8')
		})

		it('should produce consistent results for same input', () => {
			const input = new Uint8Array([0xde, 0xad, 0xbe, 0xef])
			const hash1 = keccak256(input)
			const hash2 = keccak256(input)
			expect(hash1).toBe(hash2)
		})

		it('should produce different results for different inputs', () => {
			const hash1 = keccak256(new Uint8Array([1]))
			const hash2 = keccak256(new Uint8Array([2]))
			expect(hash1).not.toBe(hash2)
		})
	})

	describe('toHex (polymorphic)', () => {
		it('should convert Uint8Array to hex', () => {
			expect(toHex(new Uint8Array([1, 164]))).toBe('0x01a4')
			expect(toHex(new Uint8Array([]))).toBe('0x')
			expect(toHex(new Uint8Array([0, 0, 1]))).toBe('0x000001')
		})

		it('should convert Uint8Array with size padding', () => {
			expect(toHex(new Uint8Array([1, 164]), { size: 4 })).toBe('0x000001a4')
			expect(toHex(new Uint8Array([255]), { size: 2 })).toBe('0x00ff')
		})

		it('should throw when Uint8Array exceeds size', () => {
			expect(() => toHex(new Uint8Array([1, 2, 3]), { size: 2 })).toThrow('exceeds')
		})

		it('should convert boolean to hex', () => {
			expect(toHex(true)).toBe('0x1')
			expect(toHex(false)).toBe('0x0')
			expect(toHex(true, { size: 32 })).toBe(
				'0x0000000000000000000000000000000000000000000000000000000000000001',
			)
		})

		it('should convert number to hex', () => {
			expect(toHex(420)).toBe('0x1a4')
			expect(toHex(255)).toBe('0xff')
			expect(toHex(0)).toBe('0x0')
		})

		it('should convert bigint to hex', () => {
			expect(toHex(420n)).toBe('0x1a4')
			expect(toHex(1000000000000000000n)).toBe('0xde0b6b3a7640000')
		})

		it('should convert number/bigint with size padding', () => {
			expect(toHex(420n, { size: 4 })).toBe('0x000001a4')
			expect(toHex(255, { size: 2 })).toBe('0x00ff')
		})

		it('should convert string to hex (UTF-8)', () => {
			expect(toHex('hello')).toBe('0x68656c6c6f')
			expect(toHex('')).toBe('0x')
			expect(toHex('abc')).toBe('0x616263')
		})

		it('should convert string with size padding', () => {
			expect(toHex('hello', { size: 8 })).toBe('0x68656c6c6f000000')
		})

		it('should throw on unsupported type', () => {
			// @ts-expect-error - testing invalid input
			expect(() => toHex(null)).toThrow('Cannot convert')
			// @ts-expect-error - testing invalid input
			expect(() => toHex(undefined)).toThrow('Cannot convert')
		})
	})

	describe('fromHex (polymorphic)', () => {
		it('should convert hex to bytes', () => {
			const result = fromHex('0x01a4', 'bytes')
			expect(result).toBeInstanceOf(Uint8Array)
			expect(result).toEqual(new Uint8Array([1, 164]))
		})

		it('should convert hex to number', () => {
			expect(fromHex('0x1a4', 'number')).toBe(420)
			expect(fromHex('0xff', 'number')).toBe(255)
			expect(fromHex('0x0', 'number')).toBe(0)
		})

		it('should convert hex to bigint', () => {
			expect(fromHex('0x1a4', 'bigint')).toBe(420n)
			expect(fromHex('0xde0b6b3a7640000', 'bigint')).toBe(1000000000000000000n)
		})

		it('should convert hex to boolean', () => {
			expect(fromHex('0x1', 'boolean')).toBe(true)
			expect(fromHex('0x0', 'boolean')).toBe(false)
			expect(fromHex('0x01', 'boolean')).toBe(true)
			expect(fromHex('0x00', 'boolean')).toBe(false)
		})

		it('should convert hex to string (UTF-8)', () => {
			expect(fromHex('0x68656c6c6f', 'string')).toBe('hello')
			expect(fromHex('0x', 'string')).toBe('')
		})

		it('should accept options object', () => {
			expect(fromHex('0xff', { to: 'number' })).toBe(255)
			expect(fromHex('0x1a4', { to: 'bigint' })).toBe(420n)
		})

		it('should handle signed option', () => {
			// Signed number conversion
			expect(fromHex('0xff', { to: 'number', signed: true } as any)).toBe(-1)
			expect(fromHex('0xfe', { to: 'bigint', signed: true } as any)).toBe(-2n)
		})

		it('should throw on unknown conversion target', () => {
			// @ts-expect-error - testing invalid input
			expect(() => fromHex('0xff', 'invalid')).toThrow('Unknown conversion target')
		})
	})

	describe('toBytes (polymorphic)', () => {
		it('should convert boolean to bytes', () => {
			expect(toBytes(true)).toEqual(new Uint8Array([1]))
			expect(toBytes(false)).toEqual(new Uint8Array([0]))
		})

		it('should convert boolean with size padding', () => {
			expect(toBytes(true, { size: 4 })).toEqual(new Uint8Array([0, 0, 0, 1]))
			expect(toBytes(false, { size: 4 })).toEqual(new Uint8Array([0, 0, 0, 0]))
		})

		it('should convert number to bytes', () => {
			expect(toBytes(420)).toEqual(new Uint8Array([1, 164]))
			expect(toBytes(255)).toEqual(new Uint8Array([255]))
			expect(toBytes(0)).toEqual(new Uint8Array([0]))
		})

		it('should convert bigint to bytes', () => {
			expect(toBytes(420n)).toEqual(new Uint8Array([1, 164]))
			expect(toBytes(0n)).toEqual(new Uint8Array([0]))
		})

		it('should convert number/bigint with size padding', () => {
			expect(toBytes(420n, { size: 4 })).toEqual(new Uint8Array([0, 0, 1, 164]))
			expect(toBytes(1, { size: 32 })).toEqual(
				new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]),
			)
		})

		it('should convert hex string to bytes', () => {
			expect(toBytes('0x01a4')).toEqual(new Uint8Array([1, 164]))
			expect(toBytes('0x')).toEqual(new Uint8Array([]))
			expect(toBytes('0xff')).toEqual(new Uint8Array([255]))
		})

		it('should convert hex string with size padding', () => {
			expect(toBytes('0xff', { size: 4 })).toEqual(new Uint8Array([0, 0, 0, 255]))
		})

		it('should throw when hex exceeds size', () => {
			expect(() => toBytes('0x010203', { size: 2 })).toThrow('exceeds')
		})

		it('should convert regular string to bytes (UTF-8)', () => {
			expect(toBytes('hello')).toEqual(new Uint8Array([104, 101, 108, 108, 111]))
			expect(toBytes('abc')).toEqual(new Uint8Array([97, 98, 99]))
		})

		it('should convert string with size padding (right-padded)', () => {
			expect(toBytes('hi', { size: 4 })).toEqual(new Uint8Array([104, 105, 0, 0]))
		})

		it('should throw when string exceeds size', () => {
			expect(() => toBytes('hello', { size: 3 })).toThrow('exceeds')
		})

		it('should throw on unsupported type', () => {
			// @ts-expect-error - testing invalid input
			expect(() => toBytes(null)).toThrow('Cannot convert')
		})
	})

	describe('fromBytes (polymorphic)', () => {
		it('should convert bytes to hex', () => {
			expect(fromBytes(new Uint8Array([1, 164]), 'hex')).toBe('0x01a4')
			expect(fromBytes(new Uint8Array([]), 'hex')).toBe('0x')
		})

		it('should convert bytes to number', () => {
			expect(fromBytes(new Uint8Array([1, 164]), 'number')).toBe(420)
			expect(fromBytes(new Uint8Array([255]), 'number')).toBe(255)
		})

		it('should convert bytes to bigint', () => {
			expect(fromBytes(new Uint8Array([1, 164]), 'bigint')).toBe(420n)
		})

		it('should convert bytes to boolean', () => {
			expect(fromBytes(new Uint8Array([1]), 'boolean')).toBe(true)
			expect(fromBytes(new Uint8Array([0]), 'boolean')).toBe(false)
			expect(fromBytes(new Uint8Array([0, 0, 0, 1]), 'boolean')).toBe(true)
			expect(fromBytes(new Uint8Array([0, 0, 0, 0]), 'boolean')).toBe(false)
		})

		it('should convert bytes to string (UTF-8)', () => {
			expect(fromBytes(new Uint8Array([104, 101, 108, 108, 111]), 'string')).toBe('hello')
			expect(fromBytes(new Uint8Array([]), 'string')).toBe('')
		})

		it('should accept options object', () => {
			expect(fromBytes(new Uint8Array([1, 164]), { to: 'number' })).toBe(420)
			expect(fromBytes(new Uint8Array([1, 164]), { to: 'hex' })).toBe('0x01a4')
		})

		it('should throw on unknown conversion target', () => {
			// @ts-expect-error - testing invalid input
			expect(() => fromBytes(new Uint8Array([1]), 'invalid')).toThrow('Unknown conversion target')
		})
	})

	describe('polymorphic functions roundtrip', () => {
		it('toHex/fromHex roundtrip for bytes', () => {
			const original = new Uint8Array([1, 2, 3, 4, 5])
			const hex = toHex(original)
			const result = fromHex(hex, 'bytes')
			expect(result).toEqual(original)
		})

		it('toHex/fromHex roundtrip for number', () => {
			const original = 12345
			const hex = toHex(original)
			const result = fromHex(hex, 'number')
			expect(result).toBe(original)
		})

		it('toHex/fromHex roundtrip for bigint', () => {
			const original = 12345678901234567890n
			const hex = toHex(original)
			const result = fromHex(hex, 'bigint')
			expect(result).toBe(original)
		})

		it('toHex/fromHex roundtrip for boolean', () => {
			expect(fromHex(toHex(true), 'boolean')).toBe(true)
			expect(fromHex(toHex(false), 'boolean')).toBe(false)
		})

		it('toHex/fromHex roundtrip for string', () => {
			const original = 'hello world'
			const hex = toHex(original)
			const result = fromHex(hex, 'string')
			expect(result).toBe(original)
		})

		it('toBytes/fromBytes roundtrip for hex', () => {
			const original = '0xdeadbeef'
			const bytes = toBytes(original)
			const result = fromBytes(bytes, 'hex')
			expect(result).toBe(original)
		})

		it('toBytes/fromBytes roundtrip for number', () => {
			const original = 420
			const bytes = toBytes(original)
			const result = fromBytes(bytes, 'number')
			expect(result).toBe(original)
		})

		it('toBytes/fromBytes roundtrip for string', () => {
			const original = 'test string'
			const bytes = toBytes(original)
			const result = fromBytes(bytes, 'string')
			expect(result).toBe(original)
		})
	})

	describe('formatLog', () => {
		it('should format a complete RPC log', () => {
			const rpcLog = {
				address: '0x1234567890123456789012345678901234567890',
				blockHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
				blockNumber: '0x1a4',
				data: '0x1234',
				logIndex: '0x5',
				transactionHash: '0x9876543210987654321098765432109876543210987654321098765432109876',
				transactionIndex: '0x2',
				topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'],
				removed: false,
			}

			const log = formatLog(rpcLog)

			expect(log.address).toBe('0x1234567890123456789012345678901234567890')
			expect(log.blockHash).toBe('0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890')
			expect(log.blockNumber).toBe(420n)
			expect(log.data).toBe('0x1234')
			expect(log.logIndex).toBe(5)
			expect(log.transactionHash).toBe('0x9876543210987654321098765432109876543210987654321098765432109876')
			expect(log.transactionIndex).toBe(2)
			expect(log.topics).toEqual(['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'])
			expect(log.removed).toBe(false)
		})

		it('should handle null/undefined values for pending logs', () => {
			const rpcLog = {
				address: '0x1234567890123456789012345678901234567890',
				// No blockHash, blockNumber, logIndex, transactionHash, transactionIndex
				data: '0x',
				topics: [],
			}

			const log = formatLog(rpcLog)

			expect(log.address).toBe('0x1234567890123456789012345678901234567890')
			expect(log.blockHash).toBe(null)
			expect(log.blockNumber).toBe(null)
			expect(log.logIndex).toBe(null)
			expect(log.transactionHash).toBe(null)
			expect(log.transactionIndex).toBe(null)
		})

		it('should include args and eventName when eventName is provided', () => {
			const rpcLog = {
				address: '0x1234567890123456789012345678901234567890',
				blockHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
				blockNumber: '0x1',
				logIndex: '0x0',
				transactionHash: '0x9876543210987654321098765432109876543210987654321098765432109876',
				transactionIndex: '0x0',
				topics: [],
			}

			const args = { from: '0x1111111111111111111111111111111111111111', to: '0x2222222222222222222222222222222222222222', value: 1000n }
			const log = formatLog(rpcLog, { args, eventName: 'Transfer' })

			expect(log.eventName).toBe('Transfer')
			expect(log.args).toEqual(args)
		})

		it('should NOT include args when eventName is not provided', () => {
			const rpcLog = {
				address: '0x1234567890123456789012345678901234567890',
				blockHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
				blockNumber: '0x1',
				logIndex: '0x0',
				transactionHash: '0x9876543210987654321098765432109876543210987654321098765432109876',
				transactionIndex: '0x0',
				topics: [],
			}

			const args = { some: 'data' }
			const log = formatLog(rpcLog, { args })

			// Without eventName, args should NOT be included
			expect(log.eventName).toBeUndefined()
			expect(log.args).toBeUndefined()
		})

		it('should handle hex string zero values correctly', () => {
			const rpcLog = {
				address: '0x0000000000000000000000000000000000000000',
				blockHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
				blockNumber: '0x0',
				logIndex: '0x0',
				transactionHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
				transactionIndex: '0x0',
				topics: [],
			}

			const log = formatLog(rpcLog)

			// Zero values are still truthy strings, so they should be converted (not null)
			expect(log.blockHash).toBe('0x0000000000000000000000000000000000000000000000000000000000000000')
			expect(log.blockNumber).toBe(0n)
			expect(log.logIndex).toBe(0)
			expect(log.transactionHash).toBe('0x0000000000000000000000000000000000000000000000000000000000000000')
			expect(log.transactionIndex).toBe(0)
		})

		it('should preserve all original properties via spread', () => {
			const rpcLog = {
				address: '0x1234567890123456789012345678901234567890',
				blockHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
				blockNumber: '0x1',
				logIndex: '0x0',
				transactionHash: '0x9876543210987654321098765432109876543210987654321098765432109876',
				transactionIndex: '0x0',
				topics: ['0xabc123'],
				data: '0xdeadbeef',
				removed: true,
			}

			const log = formatLog(rpcLog)

			expect(log.topics).toEqual(['0xabc123'])
			expect(log.data).toBe('0xdeadbeef')
			expect(log.removed).toBe(true)
		})
	})

	describe('toFunctionSelector', () => {
		it('should compute function selector for simple signature', () => {
			// transfer(address,uint256) selector is 0xa9059cbb
			expect(toFunctionSelector('transfer(address,uint256)')).toBe('0xa9059cbb')
		})

		it('should compute Error(string) selector', () => {
			// Error(string) selector is 0x08c379a0
			expect(toFunctionSelector('Error(string)')).toBe('0x08c379a0')
		})

		it('should compute Panic(uint256) selector', () => {
			// Panic(uint256) selector is 0x4e487b71
			expect(toFunctionSelector('Panic(uint256)')).toBe('0x4e487b71')
		})

		it('should handle "function " prefix', () => {
			// Should strip "function " prefix before hashing
			expect(toFunctionSelector('function transfer(address,uint256)')).toBe('0xa9059cbb')
			expect(toFunctionSelector('function approve(address,uint256)')).toBe(toFunctionSelector('approve(address,uint256)'))
		})

		it('should handle whitespace in signature', () => {
			// Whitespace should be removed
			expect(toFunctionSelector('transfer (address, uint256)')).toBe(toFunctionSelector('transfer(address,uint256)'))
		})

		it('should return 4 bytes (10 hex chars including 0x)', () => {
			const selector = toFunctionSelector('anyFunction()')
			expect(selector.length).toBe(10)
			expect(selector.startsWith('0x')).toBe(true)
		})

		it('should compute approve(address,uint256) selector', () => {
			// approve(address,uint256) selector is 0x095ea7b3
			expect(toFunctionSelector('approve(address,uint256)')).toBe('0x095ea7b3')
		})
	})

	describe('concatHex', () => {
		it('should concatenate multiple hex strings', () => {
			expect(concatHex(['0x12', '0x34', '0x56'])).toBe('0x123456')
			expect(concatHex(['0xdead', '0xbeef'])).toBe('0xdeadbeef')
		})

		it('should handle empty array', () => {
			expect(concatHex([])).toBe('0x')
		})

		it('should handle single hex string', () => {
			expect(concatHex(['0x1234'])).toBe('0x1234')
		})

		it('should handle empty hex strings', () => {
			expect(concatHex(['0x'])).toBe('0x')
			expect(concatHex(['0x', '0x'])).toBe('0x')
			expect(concatHex(['0x12', '0x', '0x34'])).toBe('0x1234')
		})

		it('should handle longer hex strings', () => {
			expect(concatHex(['0xdeadbeef', '0xcafebabe', '0x12345678'])).toBe('0xdeadbeefcafebabe12345678')
		})

		it('should preserve leading zeros', () => {
			expect(concatHex(['0x00', '0x01'])).toBe('0x0001')
			expect(concatHex(['0x0000', '0xff'])).toBe('0x0000ff')
		})
	})

	describe('toEventSelector', () => {
		it('should compute event selector for Transfer', () => {
			// Transfer(address,address,uint256) selector
			expect(toEventSelector('Transfer(address,address,uint256)')).toBe(
				'0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
			)
		})

		it('should compute event selector for Approval', () => {
			// Approval(address,address,uint256) selector
			expect(toEventSelector('Approval(address,address,uint256)')).toBe(
				'0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
			)
		})

		it('should handle "event " prefix', () => {
			// Should strip "event " prefix before hashing
			expect(toEventSelector('event Transfer(address,address,uint256)')).toBe(
				toEventSelector('Transfer(address,address,uint256)'),
			)
		})

		it('should return 32 bytes (66 hex chars including 0x)', () => {
			const selector = toEventSelector('AnyEvent()')
			expect(selector.length).toBe(66)
			expect(selector.startsWith('0x')).toBe(true)
		})

		it('should handle whitespace in signature', () => {
			// Whitespace should be removed
			expect(toEventSelector('Transfer (address, address, uint256)')).toBe(
				toEventSelector('Transfer(address,address,uint256)'),
			)
		})
	})

	describe('encodePacked', () => {
		it('should encode uint8 values', () => {
			expect(encodePacked(['uint8'], [42n])).toBe('0x2a')
			expect(encodePacked(['uint8'], [0n])).toBe('0x00')
			expect(encodePacked(['uint8'], [255n])).toBe('0xff')
		})

		it('should encode uint16 values', () => {
			expect(encodePacked(['uint16'], [0x1234n])).toBe('0x1234')
		})

		it('should encode uint32 values', () => {
			expect(encodePacked(['uint32'], [0x12345678n])).toBe('0x12345678')
		})

		it('should encode uint256 values', () => {
			const result = encodePacked(['uint256'], [100n])
			// uint256 is 32 bytes = 64 hex chars + '0x' prefix
			expect(result.length).toBe(66)
			expect(result).toBe('0x0000000000000000000000000000000000000000000000000000000000000064')
		})

		it('should encode int8 positive values', () => {
			expect(encodePacked(['int8'], [42n])).toBe('0x2a')
		})

		it('should encode int8 negative values', () => {
			expect(encodePacked(['int8'], [-1n])).toBe('0xff')
			expect(encodePacked(['int8'], [-128n])).toBe('0x80')
		})

		it('should encode int16 negative values', () => {
			expect(encodePacked(['int16'], [-1n])).toBe('0xffff')
		})

		it('should encode address values', () => {
			const addr = '0x742d35cc6634c0532925a3b844bc9e7595f251e3'
			const result = encodePacked(['address'], [addr])
			// address is 20 bytes
			expect(result.length).toBe(42)
			expect(result).toBe(addr.toLowerCase())
		})

		it('should encode bool values', () => {
			expect(encodePacked(['bool'], [true])).toBe('0x01')
			expect(encodePacked(['bool'], [false])).toBe('0x00')
		})

		it('should encode string values', () => {
			expect(encodePacked(['string'], ['hello'])).toBe('0x68656c6c6f')
			expect(encodePacked(['string'], [''])).toBe('0x')
		})

		it('should encode bytes values', () => {
			expect(encodePacked(['bytes'], ['0x123456'])).toBe('0x123456')
			expect(encodePacked(['bytes'], ['0x'])).toBe('0x')
		})

		it('should encode fixed bytes values', () => {
			expect(encodePacked(['bytes1'], ['0x42'])).toBe('0x42')
			expect(encodePacked(['bytes4'], ['0x12345678'])).toBe('0x12345678')
		})

		it('should encode multiple types', () => {
			const addr = '0x742d35cc6634c0532925a3b844bc9e7595f251e3'
			const result = encodePacked(['address', 'uint256'], [addr, 100n])
			// 20 bytes address + 32 bytes uint256 = 52 bytes = 104 hex chars
			expect(result.length).toBe(106)
			expect(result.startsWith(addr.toLowerCase())).toBe(true)
		})

		it('should encode dynamic arrays', () => {
			const result = encodePacked(['uint8[]'], [[0x12n, 0x34n, 0x56n]])
			expect(result).toBe('0x123456')
		})

		it('should encode fixed arrays', () => {
			const result = encodePacked(['uint256[3]'], [[1n, 2n, 3n]])
			// 3 * 32 bytes = 96 bytes = 192 hex chars
			expect(result.length).toBe(194)
		})

		it('should throw on type/value count mismatch', () => {
			expect(() => encodePacked(['uint256', 'address'], [42n])).toThrow('Type/value count mismatch')
		})

		it('should throw on invalid fixed bytes length', () => {
			expect(() => encodePacked(['bytes4'], ['0x12'])).toThrow('Invalid bytes4 length')
		})

		it('should throw on invalid fixed array length', () => {
			expect(() => encodePacked(['uint256[3]'], [[1n, 2n]])).toThrow('Invalid uint256[3] length')
		})

		it('should handle empty types/values', () => {
			expect(encodePacked([], [])).toBe('0x')
		})

		it('should handle address arrays', () => {
			const addr1 = '0x742d35cc6634c0532925a3b844bc9e7595f251e3'
			const addr2 = '0x1234567890123456789012345678901234567890'
			const result = encodePacked(['address[]'], [[addr1, addr2]])
			// 2 * 20 bytes = 40 bytes = 80 hex chars
			expect(result.length).toBe(82)
		})

		it('should work with mixed types for signature verification', () => {
			// Common use case: creating message hash for signature verification
			const addr = '0x742d35cc6634c0532925a3b844bc9e7595f251e3'
			const nonce = 1n
			const result = encodePacked(['address', 'uint256'], [addr, nonce])
			expect(result.startsWith('0x')).toBe(true)
			expect(result.length).toBe(106) // 20 + 32 bytes = 52 bytes = 104 hex chars + 0x
		})

		it('should throw on unsupported type', () => {
			expect(() => encodePacked(['tuple'], [[1n]])).toThrow('Unsupported packed type: tuple')
		})

		it('should handle bytes as Uint8Array', () => {
			const bytes = new Uint8Array([0x12, 0x34, 0x56])
			const result = encodePacked(['bytes'], [bytes])
			expect(result).toBe('0x123456')
		})

		it('should handle fixed bytes as Uint8Array', () => {
			const bytes = new Uint8Array([0x12, 0x34, 0x56, 0x78])
			const result = encodePacked(['bytes4'], [bytes])
			expect(result).toBe('0x12345678')
		})
	})

	describe('serializeTransaction', () => {
		describe('EIP-1559 transactions', () => {
			it('should serialize a basic EIP-1559 transaction', () => {
				const result = serializeTransaction({
					type: 'eip1559',
					chainId: 1,
					nonce: 0,
					maxPriorityFeePerGas: 1000000000n,
					maxFeePerGas: 2000000000n,
					gas: 21000n,
					to: '0x742d35cc6634c0532925a3b844bc9e7595f251e3',
					value: 1000000000000000000n,
					data: '0x',
				})
				// Should start with 0x02 (type 2 = EIP-1559)
				expect(result.startsWith('0x02')).toBe(true)
			})

			it('should serialize EIP-1559 with access list', () => {
				const result = serializeTransaction({
					type: 'eip1559',
					chainId: 1,
					nonce: 0,
					maxPriorityFeePerGas: 1000000000n,
					maxFeePerGas: 2000000000n,
					gas: 21000n,
					to: '0x742d35cc6634c0532925a3b844bc9e7595f251e3',
					value: 0n,
					data: '0x',
					accessList: [
						{
							address: '0x1234567890123456789012345678901234567890',
							storageKeys: ['0x0000000000000000000000000000000000000000000000000000000000000001'],
						},
					],
				})
				expect(result.startsWith('0x02')).toBe(true)
				// Verify it's longer than without access list
				expect(result.length).toBeGreaterThan(100)
			})

			it('should serialize EIP-1559 with no data', () => {
				const result = serializeTransaction({
					type: 'eip1559',
					chainId: 10, // Optimism
					data: '0x',
				})
				expect(result.startsWith('0x02')).toBe(true)
			})

			it('should serialize EIP-1559 with only chainId and data (common OP stack usage)', () => {
				// This is how getL1FeeInformationOpStack uses it
				const result = serializeTransaction({
					chainId: 10,
					data: '0x1234567890',
					type: 'eip1559',
				})
				expect(result.startsWith('0x02')).toBe(true)
				// Should contain the data
				expect(result.includes('1234567890')).toBe(true)
			})
		})

		describe('EIP-2930 transactions', () => {
			it('should serialize a basic EIP-2930 transaction', () => {
				const result = serializeTransaction({
					type: 'eip2930',
					chainId: 1,
					nonce: 0,
					gasPrice: 20000000000n,
					gas: 21000n,
					to: '0x742d35cc6634c0532925a3b844bc9e7595f251e3',
					value: 1000000000000000000n,
					data: '0x',
				})
				// Should start with 0x01 (type 1 = EIP-2930)
				expect(result.startsWith('0x01')).toBe(true)
			})

			it('should serialize EIP-2930 with access list', () => {
				const result = serializeTransaction({
					type: 'eip2930',
					chainId: 1,
					nonce: 0,
					gasPrice: 20000000000n,
					gas: 21000n,
					to: '0x742d35cc6634c0532925a3b844bc9e7595f251e3',
					value: 0n,
					accessList: [
						{
							address: '0x1234567890123456789012345678901234567890',
							storageKeys: [],
						},
					],
				})
				expect(result.startsWith('0x01')).toBe(true)
			})
		})

		describe('Legacy transactions', () => {
			it('should serialize a basic legacy transaction with chainId', () => {
				const result = serializeTransaction({
					chainId: 1,
					nonce: 0,
					gasPrice: 20000000000n,
					gas: 21000n,
					to: '0x742d35cc6634c0532925a3b844bc9e7595f251e3',
					value: 1000000000000000000n,
				})
				// Legacy transactions don't have a type prefix
				expect(result.startsWith('0xf8') || result.startsWith('0xe')).toBe(true)
			})

			it('should serialize a legacy transaction without chainId', () => {
				const result = serializeTransaction({
					nonce: 0,
					gasPrice: 20000000000n,
					gas: 21000n,
					to: '0x742d35cc6634c0532925a3b844bc9e7595f251e3',
					value: 1000000000000000000n,
				})
				expect(result.startsWith('0xe') || result.startsWith('0xf')).toBe(true)
			})

			it('should serialize a contract deployment (no to address)', () => {
				const result = serializeTransaction({
					chainId: 1,
					nonce: 0,
					gasPrice: 20000000000n,
					gas: 100000n,
					data: '0x6080604052',
				})
				// Legacy transactions without type prefix start with RLP list marker
				// 0xc0-0xf7 for short lists, 0xf8-0xff for long lists
				const firstByte = parseInt(result.slice(2, 4), 16)
				expect(firstByte >= 0xc0).toBe(true)
			})
		})

		describe('with signatures', () => {
			it('should serialize signed EIP-1559 transaction', () => {
				const result = serializeTransaction(
					{
						type: 'eip1559',
						chainId: 1,
						nonce: 0,
						maxPriorityFeePerGas: 1000000000n,
						maxFeePerGas: 2000000000n,
						gas: 21000n,
						to: '0x742d35cc6634c0532925a3b844bc9e7595f251e3',
						value: 1000000000000000000n,
					},
					{
						r: 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdefn,
						s: 0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321n,
						yParity: 0,
					},
				)
				expect(result.startsWith('0x02')).toBe(true)
				// Signed transaction should be longer
				expect(result.length).toBeGreaterThan(150)
			})

			it('should serialize signed legacy transaction', () => {
				const result = serializeTransaction(
					{
						chainId: 1,
						nonce: 0,
						gasPrice: 20000000000n,
						gas: 21000n,
						to: '0x742d35cc6634c0532925a3b844bc9e7595f251e3',
						value: 1000000000000000000n,
					},
					{
						r: 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdefn,
						s: 0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321n,
						v: 37n, // chainId 1 with EIP-155: v = chainId * 2 + 35 + yParity
					},
				)
				expect(result.startsWith('0xf8') || result.startsWith('0xf9')).toBe(true)
			})

			it('should serialize signed legacy transaction with yParity (no v)', () => {
				const result = serializeTransaction(
					{
						chainId: 1,
						nonce: 0,
						gasPrice: 20000000000n,
						gas: 21000n,
						to: '0x742d35cc6634c0532925a3b844bc9e7595f251e3',
						value: 1000000000000000000n,
					},
					{
						r: 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdefn,
						s: 0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321n,
						yParity: 0, // Use yParity instead of v
					},
				)
				expect(result.startsWith('0xf8') || result.startsWith('0xf9')).toBe(true)
			})

			it('should serialize signed legacy transaction without chainId using yParity', () => {
				const result = serializeTransaction(
					{
						nonce: 0,
						gasPrice: 20000000000n,
						gas: 21000n,
						to: '0x742d35cc6634c0532925a3b844bc9e7595f251e3',
						value: 1000000000000000000n,
					},
					{
						r: 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdefn,
						s: 0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321n,
						yParity: 1, // yParity with no chainId -> v = 27 + yParity = 28
					},
				)
				expect(result.startsWith('0xf8') || result.startsWith('0xf9')).toBe(true)
			})

			it('should serialize signed EIP-2930 transaction with v (fallback to v % 2)', () => {
				const result = serializeTransaction(
					{
						type: 'eip2930',
						chainId: 1,
						nonce: 0,
						gasPrice: 20000000000n,
						gas: 21000n,
						to: '0x742d35cc6634c0532925a3b844bc9e7595f251e3',
						value: 1000000000000000000n,
						accessList: [],
					},
					{
						r: 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdefn,
						s: 0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321n,
						v: 28n, // Use v instead of yParity - will compute yParity as v % 2 = 0
					},
				)
				expect(result.startsWith('0x01')).toBe(true)
			})
		})

		describe('edge cases', () => {
			it('should handle zero values', () => {
				const result = serializeTransaction({
					type: 'eip1559',
					chainId: 1,
					nonce: 0,
					maxPriorityFeePerGas: 0n,
					maxFeePerGas: 0n,
					gas: 0n,
					value: 0n,
				})
				expect(result.startsWith('0x02')).toBe(true)
			})

			it('should handle large values', () => {
				const result = serializeTransaction({
					type: 'eip1559',
					chainId: 1,
					nonce: 999999,
					maxPriorityFeePerGas: 999999999999999999n,
					maxFeePerGas: 999999999999999999n,
					gas: 30000000n,
					value: 115792089237316195423570985008687907853269984665640564039457584007913129639935n, // max uint256
				})
				expect(result.startsWith('0x02')).toBe(true)
			})

			it('should handle undefined optional fields', () => {
				const result = serializeTransaction({
					type: 'eip1559',
					chainId: 1,
				})
				expect(result.startsWith('0x02')).toBe(true)
			})

			it('should handle odd-length hex data', () => {
				// Test with odd-length hex data (3 nibbles = 1.5 bytes, which needs padding)
				const result = serializeTransaction({
					type: 'eip1559',
					chainId: 1,
					nonce: 0,
					maxPriorityFeePerGas: 1000000000n,
					maxFeePerGas: 2000000000n,
					gas: 21000n,
					to: '0x742d35cc6634c0532925a3b844bc9e7595f251e3',
					value: 0n,
					data: '0x123', // Odd-length hex - 3 nibbles, needs to be padded to 0x0123
				})
				expect(result.startsWith('0x02')).toBe(true)
				// The serialized result should contain the padded data
				expect(result.length).toBeGreaterThan(50)
			})
		})
	})
})
