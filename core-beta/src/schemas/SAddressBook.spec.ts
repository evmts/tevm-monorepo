import { type AddressBook, parseAddressBook } from './SAddressBook'
import { assertType, describe, expect, it } from 'vitest'

describe(parseAddressBook.name, () => {
	it('should return an address book', () => {
		const expected = {
			contract1: {
				address: '0x4320a88a199120aD52Dd9742C7430847d3cB2CD4',
				blockCreated: 0,
			},
			contract2: {
				address: '0x4227a88a199120aD52Dd9742C7430847d3cB2CD4',
				blockCreated: 500,
			},
		} as const satisfies AddressBook<string>
		const addressBook = parseAddressBook(expected) satisfies AddressBook<string>
		expect(addressBook).toBeDefined()
		assertType<typeof expected>(addressBook)
	})

	it('should allow duplicate addresses', () => {
		const expected = {
			contract1: {
				address: '0x4320a88a199120aD52Dd9742C7430847d3cB2CD4',
				blockCreated: 0,
			},
			contract2: {
				address: '0x4320a88a199120aD52Dd9742C7430847d3cB2CD4',
				blockCreated: 0,
			},
		} as const satisfies AddressBook<string>
		const addressBook = parseAddressBook(expected) satisfies AddressBook<string>
		expect(addressBook).toBeDefined()
		assertType<typeof expected>(addressBook)
	})

	it('should throw if block created is < 0', () => {
		expect(() =>
			parseAddressBook({
				contract1: {
					address: '0x4320a88a199120aD52Dd9742C7430847d3cB2CD4',
					blockCreated: -1,
				},
				contract2: {
					address: '0x4227a88a199120aD52Dd9742C7430847d3cB2CD4',
					blockCreated: 500,
				},
			}),
		).toThrowErrorMatchingSnapshot()
	})

	it('should throw if extra properties are included', () => {
		expect(() =>
			parseAddressBook({
				contract1: {
					address: '0x4320a88a199120aD52Dd9742C7430847d3cB2CD4',
					blockCreated: 0,
					extraProp: 'foo',
				},
			}),
		).toThrowErrorMatchingSnapshot()
	})

	it('should throw if invalid address', () => {
		expect(() =>
			parseAddressBook({
				contract1: {
					address: '0x4',
					blockCreated: 0,
				},
			}),
		).toThrowErrorMatchingSnapshot()
	})

	it('should throw if block is not an integer', () => {
		expect(() =>
			parseAddressBook({
				contract1: {
					address: '0x4',
					blockCreated: 0.5,
				},
			}),
		).toThrowErrorMatchingSnapshot()
	})
})
