import { EthjsAddress, getAddress, hexToBytes } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { Address } from './Address.js'
import { createAddress } from './createAddress.js'

describe('Address', () => {
	it('should create an address from 0 string', () => {
		const address = createAddress(0)
		expect(address).toBeInstanceOf(Address)
		expect(address).toBeInstanceOf(EthjsAddress)
		expect(address.toString()).toMatchSnapshot()
		expect(address.bytes).toMatchSnapshot()
		expect(address.equals(address)).toBe(true)
		expect(address.equals(createAddress(25))).toBe(false)
		expect(address.isPrecompileOrSystemAddress()).toBe(true)
		expect(address.isZero()).toBe(true)
	})

	it('should create an address from non zero', () => {
		const address = createAddress(98765)
		expect(address).toBeInstanceOf(Address)
		expect(address).toBeInstanceOf(EthjsAddress)
		expect(address).toBeInstanceOf(EthjsAddress)
		expect(address.toString()).toMatchSnapshot()
		expect(address.bytes).toMatchSnapshot()
		expect(address.equals(address)).toBe(true)
		expect(address.isPrecompileOrSystemAddress()).toBe(false)
		expect(address.isZero()).toBe(false)
	})

	it('should return checksummed address as a string', () => {
		const hexAddress = `0x${'a'.repeat(40)}` as const
		const address = new Address(hexToBytes(hexAddress))
		expect(address.toString()).not.toBe(hexAddress)
		expect(address.toString()).toBe(getAddress(hexAddress))
	})
})
