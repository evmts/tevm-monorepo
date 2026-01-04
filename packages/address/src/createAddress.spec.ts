import { InvalidAddressError } from '@tevm/errors'
import { EthjsAddress, hexToBytes, numberToBytes } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { Address } from './Address.js'
import { createAddress } from './createAddress.js'

describe('createAddress', () => {
	it('should create an address from an EthjsAddress instance', () => {
		const ethjsAddress = new EthjsAddress(new Uint8Array(20))
		const address = createAddress(ethjsAddress)
		expect(address).toBeInstanceOf(Address)
		expect(address.bytes).toEqual(ethjsAddress.bytes)
	})

	it('should create an address from a Uint8Array', () => {
		const bytes = new Uint8Array(20)
		const address = createAddress(bytes)
		expect(address).toBeInstanceOf(Address)
		expect(address.bytes).toEqual(bytes)
	})

	it('should create an address from a number', () => {
		const number = 12345
		const address = createAddress(number)
		expect(address).toBeInstanceOf(Address)
		expect(address.bytes).toEqual(numberToBytes(number, { size: 20 }))
	})

	it('should create an address from a bigint', () => {
		const bigInt = BigInt(12345)
		const address = createAddress(bigInt)
		expect(address).toBeInstanceOf(Address)
		expect(address.bytes).toEqual(numberToBytes(bigInt, { size: 20 }))
	})

	it('should create an address from a hex string', () => {
		const hexAddress = `0x${'a'.repeat(40)}` as const
		const address = createAddress(hexAddress)
		expect(address).toBeInstanceOf(Address)
		expect(address.bytes).toEqual(hexToBytes(hexAddress, { size: 20 }))
	})

	it('should create an address from an unprefixed hex string', () => {
		const hexAddress = 'a'.repeat(40)
		const address = createAddress(hexAddress)
		expect(address).toBeInstanceOf(Address)
		expect(address.bytes).toEqual(hexToBytes(`0x${hexAddress}`, { size: 20 }))
	})

	it('should throw InvalidAddressError for an invalid input type', () => {
		expect(() => createAddress(null as any)).toThrow(InvalidAddressError)
	})

	it('should throw InvalidAddressError for an invalid address input', () => {
		expect(() => createAddress('invalidAddress')).toThrow(InvalidAddressError)
	})
})
