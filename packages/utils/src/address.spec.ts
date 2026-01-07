import { describe, it, expect } from 'vitest'
import { Address, createZeroAddress, createAddressFromBigInt, createAddressFromString } from './address.js'

describe('Address', () => {
	describe('constructor', () => {
		it('should create an Address from 20 bytes', () => {
			const bytes = new Uint8Array(20).fill(1)
			const address = new Address(bytes)
			expect(address.bytes).toEqual(bytes)
		})

		it('should throw if bytes is not 20 bytes', () => {
			expect(() => new Address(new Uint8Array(19))).toThrow('Invalid address length')
			expect(() => new Address(new Uint8Array(21))).toThrow('Invalid address length')
		})
	})

	describe('equals', () => {
		it('should return true for equal addresses', () => {
			const bytes = new Uint8Array(20).fill(1)
			const address1 = new Address(bytes)
			const address2 = new Address(bytes)
			expect(address1.equals(address2)).toBe(true)
		})

		it('should return false for different addresses', () => {
			const bytes1 = new Uint8Array(20).fill(1)
			const bytes2 = new Uint8Array(20).fill(2)
			const address1 = new Address(bytes1)
			const address2 = new Address(bytes2)
			expect(address1.equals(address2)).toBe(false)
		})
	})

	describe('isZero', () => {
		it('should return true for zero address', () => {
			const address = new Address(new Uint8Array(20))
			expect(address.isZero()).toBe(true)
		})

		it('should return false for non-zero address', () => {
			const bytes = new Uint8Array(20)
			bytes[0] = 1
			const address = new Address(bytes)
			expect(address.isZero()).toBe(false)
		})
	})

	describe('isPrecompileOrSystemAddress', () => {
		it('should return true for precompile addresses', () => {
			const bytes = new Uint8Array(20)
			bytes[19] = 1 // Precompile 1 (ecrecover)
			const address = new Address(bytes)
			expect(address.isPrecompileOrSystemAddress()).toBe(true)
		})

		it('should return true for system addresses in range 0x0 to 0xffff', () => {
			const bytes = new Uint8Array(20)
			bytes[18] = 0xff
			bytes[19] = 0xff
			const address = new Address(bytes)
			expect(address.isPrecompileOrSystemAddress()).toBe(true)
		})

		it('should return false for regular addresses', () => {
			const bytes = new Uint8Array(20)
			bytes[17] = 1
			const address = new Address(bytes)
			expect(address.isPrecompileOrSystemAddress()).toBe(false)
		})
	})

	describe('toString', () => {
		it('should return hex representation', () => {
			const bytes = new Uint8Array(20)
			bytes[0] = 0x12
			bytes[1] = 0x34
			const address = new Address(bytes)
			expect(address.toString()).toBe('0x1234000000000000000000000000000000000000')
		})
	})

	describe('toBytes', () => {
		it('should return a copy of the bytes', () => {
			const bytes = new Uint8Array(20).fill(1)
			const address = new Address(bytes)
			const result = address.toBytes()
			expect(result).toEqual(bytes)
			// Verify it's a copy
			result[0] = 2
			expect(address.bytes[0]).toBe(1)
		})
	})
})

describe('createZeroAddress', () => {
	it('should create zero address', () => {
		const address = createZeroAddress()
		expect(address.isZero()).toBe(true)
		expect(address.toString()).toBe('0x0000000000000000000000000000000000000000')
	})
})

describe('createAddressFromBigInt', () => {
	it('should create address from bigint', () => {
		const value = BigInt('0x1234567890123456789012345678901234567890')
		const address = createAddressFromBigInt(value)
		expect(address.toString()).toBe('0x1234567890123456789012345678901234567890')
	})

	it('should pad short addresses', () => {
		const value = BigInt('0x1234')
		const address = createAddressFromBigInt(value)
		expect(address.toString()).toBe('0x0000000000000000000000000000000000001234')
	})

	it('should throw for too large value', () => {
		const value = BigInt('0x123456789012345678901234567890123456789012')
		expect(() => createAddressFromBigInt(value)).toThrow('Invalid address, too long')
	})
})

describe('createAddressFromString', () => {
	it('should create address from valid hex string', () => {
		const hex = '0x1234567890123456789012345678901234567890'
		const address = createAddressFromString(hex)
		expect(address.toString()).toBe(hex)
	})

	it('should handle lowercase hex', () => {
		const hex = '0xabcdef0123456789abcdef0123456789abcdef01'
		const address = createAddressFromString(hex)
		expect(address.toString()).toBe(hex)
	})

	it('should handle uppercase hex', () => {
		const hex = '0xABCDEF0123456789ABCDEF0123456789ABCDEF01'
		const address = createAddressFromString(hex)
		expect(address.toString()).toBe('0xabcdef0123456789abcdef0123456789abcdef01')
	})

	it('should handle mixed case hex', () => {
		const hex = '0xAbCdEf0123456789AbCdEf0123456789AbCdEf01'
		const address = createAddressFromString(hex)
		expect(address.toString()).toBe('0xabcdef0123456789abcdef0123456789abcdef01')
	})

	it('should throw for invalid hex string - no 0x prefix', () => {
		expect(() => createAddressFromString('1234567890123456789012345678901234567890')).toThrow('Invalid address')
	})

	it('should throw for invalid hex string - too short', () => {
		expect(() => createAddressFromString('0x1234')).toThrow('Invalid address')
	})

	it('should throw for invalid hex string - too long', () => {
		expect(() => createAddressFromString('0x123456789012345678901234567890123456789012')).toThrow('Invalid address')
	})

	it('should throw for invalid hex characters', () => {
		expect(() => createAddressFromString('0x123456789012345678901234567890123456789g')).toThrow('Invalid address')
	})
})

describe('Address compatibility with ethereumjs', () => {
	it('should work like @ethereumjs/util Address', () => {
		// Test address that was used in ethereumjs docs
		const hex = '0x0000000000000000000000000000000000000001'
		const address = createAddressFromString(hex)

		// Should be a precompile
		expect(address.isPrecompileOrSystemAddress()).toBe(true)

		// Should not be zero
		expect(address.isZero()).toBe(false)

		// toString should return hex
		expect(address.toString()).toBe(hex)

		// toBytes should return Uint8Array
		const bytes = address.toBytes()
		expect(bytes).toBeInstanceOf(Uint8Array)
		expect(bytes.length).toBe(20)
	})
})
