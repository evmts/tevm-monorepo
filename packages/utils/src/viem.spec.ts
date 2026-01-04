import { describe, expect, it } from 'vitest'
import {
	boolToHex,
	bytesToHex,
	formatAbi,
	formatEther,
	getAddress,
	hexToBigInt,
	hexToBytes,
	hexToNumber,
	isAddress,
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
})
