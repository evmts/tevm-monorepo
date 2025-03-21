import { InvalidSaltError } from '@tevm/errors'
import { EthjsAddress, concatBytes, hexToBytes, keccak256 } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { Address } from './Address.js'
import { create2ContractAddress } from './create2ContractAddress.js'

describe('create2ContractAddress', () => {
	it('should create a valid contract address using CREATE2', () => {
		const from = new EthjsAddress(hexToBytes(`0x${'11'.repeat(20)}`))
		const salt = `0x${'00'.repeat(32)}` as const
		const code = `0x${'60'.repeat(10)}` as const
		const expectedAddress = keccak256(
			concatBytes(hexToBytes('0xff'), from.bytes, hexToBytes(salt), keccak256(code, 'bytes')),
			'bytes',
		).subarray(-20)

		const address = create2ContractAddress(from, salt, code)

		expect(address).toBeInstanceOf(Address)
		expect(address.bytes).toEqual(expectedAddress)
	})

	it('should throw InvalidSaltError if salt is not 32 bytes', () => {
		const from = new EthjsAddress(hexToBytes(`0x${'11'.repeat(20)}`))
		const invalidSalt = `0x${'00'.repeat(16)}` as const
		const code = `0x${'60'.repeat(10)}` as const

		expect(() => create2ContractAddress(from, invalidSalt, code)).toThrow(InvalidSaltError)
	})
})
