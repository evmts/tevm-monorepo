import { describe, expect, it } from 'vitest'
import {
	bytesToUnprefixedHex,
	bytesToUtf8,
	concatBytes,
	EthjsAccount,
	EthjsAddress,
	equalsBytes,
	randomBytes,
	setLengthLeft,
	TypeOutput,
	toType,
} from './ethereumjs.js'

describe('ethereumjs re-exports', () => {
	it('should properly export EthjsAddress', () => {
		const address = new EthjsAddress(new Uint8Array(Buffer.from('1234567890123456789012345678901234567890', 'hex')))
		expect(address).toBeDefined()
		expect(address.bytes).toBeInstanceOf(Uint8Array)
	})

	it('should properly export EthjsAccount', () => {
		const account = new EthjsAccount()
		expect(account).toBeDefined()
		expect(account.nonce).toBeDefined()
		expect(account.balance).toBeDefined()
	})

	it('should properly export bytesToUnprefixedHex', () => {
		const bytes = new Uint8Array([0x12, 0x34])
		const hex = bytesToUnprefixedHex(bytes)
		expect(hex).toBe('1234')
	})

	it('should properly export equalsBytes', () => {
		const bytes1 = new Uint8Array([1, 2, 3])
		const bytes2 = new Uint8Array([1, 2, 3])
		const bytes3 = new Uint8Array([1, 2, 4])

		expect(equalsBytes(bytes1, bytes2)).toBe(true)
		expect(equalsBytes(bytes1, bytes3)).toBe(false)
	})

	it('should properly export concatBytes', () => {
		const bytes1 = new Uint8Array([1, 2])
		const bytes2 = new Uint8Array([3, 4])

		const result = concatBytes(bytes1, bytes2)
		expect(result).toEqual(new Uint8Array([1, 2, 3, 4]))
	})

	it('should properly export setLengthLeft', () => {
		const bytes = new Uint8Array([1, 2])
		const padded = setLengthLeft(bytes, 4)

		expect(padded).toEqual(new Uint8Array([0, 0, 1, 2]))
	})

	it('should properly export toType', () => {
		const bytes = new Uint8Array([1, 2])
		const hexString = toType(bytes, TypeOutput.PrefixedHexString)

		expect(typeof hexString).toBe('string')
		expect(hexString).toBe('0x0102')
	})

	it('should properly export bytesToUtf8', () => {
		const bytes = new Uint8Array([72, 101, 108, 108, 111]) // "Hello" in ASCII/UTF-8
		const str = bytesToUtf8(bytes)

		expect(str).toBe('Hello')
	})

	// zeros was removed in @ethereumjs/util v10
	it.skip('should properly export zeros', () => {
		// const zeroBytes = zeros(3)
		// expect(zeroBytes).toEqual(new Uint8Array([0, 0, 0]))
	})

	it('should properly export randomBytes', () => {
		const random = randomBytes(16)

		expect(random).toBeInstanceOf(Uint8Array)
		expect(random.length).toBe(16)
	})
})
