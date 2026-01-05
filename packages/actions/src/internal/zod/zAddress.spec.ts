import type { Address } from '@tevm/utils'
import { describe, expect, test } from 'vitest'
import type { z } from 'zod'
import { zAddress } from './zAddress.js'

describe('zAddress', () => {
	test('should validate a valid address', () => {
		const address = `0x${'69'.repeat(20)}` as const satisfies z.infer<typeof zAddress> satisfies Address
		expect(zAddress.parse(address)).toEqual(address)
	})

	test('should validate a checksummed address', () => {
		// This is a properly checksummed address
		const address = '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed' as const
		expect(zAddress.parse(address)).toEqual(address)
	})

	test('should reject an address with invalid length', () => {
		const tooShort = `0x${'69'.repeat(19)}` as const
		const tooLong = `0x${'69'.repeat(21)}` as const

		expect(() => zAddress.parse(tooShort)).toThrow()
		expect(() => zAddress.parse(tooLong)).toThrow()
	})

	test('should reject an address without 0x prefix', () => {
		const addressWithoutPrefix = `${'69'.repeat(20)}` as const
		expect(() => zAddress.parse(addressWithoutPrefix)).toThrow()
	})
})
