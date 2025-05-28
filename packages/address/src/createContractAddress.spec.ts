import { InvalidAddressError } from '@tevm/errors'
import { createAddressFromString, keccak256, toRlp } from '@tevm/utils'
import { numberToBytes } from 'viem'
import { describe, expect, it } from 'vitest'
import { Address } from './Address.js'
import { createContractAddress } from './createContractAddress.js'

describe('createContractAddress', () => {
	it('should create a valid contract address with nonce 0', () => {
		const from = createAddressFromString(`0x${'11'.repeat(20)}`)
		const nonce = 0n
		const expectedAddress = keccak256(toRlp([from.bytes, Uint8Array.from([])]), 'bytes').subarray(-20)

		const address = createContractAddress(from, nonce)

		expect(address).toBeInstanceOf(Address)
		expect(address.bytes).toEqual(expectedAddress)
	})

	it('should create a valid contract address with a non-zero nonce', () => {
		const from = createAddressFromString(`0x${'22'.repeat(20)}`)
		const nonce = 1n
		const expectedAddress = keccak256(toRlp([from.bytes, numberToBytes(nonce)]), 'bytes').subarray(-20)

		const address = createContractAddress(from, nonce)

		expect(address).toBeInstanceOf(Address)
		expect(address.bytes).toEqual(expectedAddress)
	})

	it('should throw InvalidAddressError for an invalid from address', () => {
		const invalidFrom = { what: 'is this input?' }
		const nonce = 1n

		expect(() => createContractAddress(invalidFrom as any, nonce)).toThrow(InvalidAddressError)
	})
})
