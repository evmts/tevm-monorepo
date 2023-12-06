import {
	type AddressBook,
	isAddressBook,
	parseAddressBook,
} from './SAddressBook.js'
import { assertType, describe, expect, it } from 'vitest'

describe(isAddressBook.name, () => {
	it('types should work', () => {
		const addressBook: unknown = {
			contract1: {
				address: '0x4320a88a199120aD52Dd9742C7430847d3cB2CD4',
				blockCreated: 0,
			},
		}
		const passesValidation = isAddressBook(addressBook)
		expect(passesValidation).toBe(true)
		if (passesValidation) {
			assertType<AddressBook>(addressBook)
			assertType<typeof addressBook>({} as AddressBook)
		} else {
			assertType<unknown>(addressBook)
		}
	})

	it('should return true for valid address book', () => {
		const addressBook: unknown = {
			contract1: {
				address: '0x4320a88a199120aD52Dd9742C7430847d3cB2CD4',
				blockCreated: 0,
			},
		}
		const passesValidation = isAddressBook(addressBook)
		expect(passesValidation).toBe(true)
		if (passesValidation) {
			assertType<AddressBook>(addressBook)
			assertType<typeof addressBook>({} as AddressBook)
		} else {
			assertType<unknown>(addressBook)
		}
	})

	it('should return false for valid address book', () => {
		let addressBook: unknown = {
			contract1: '0x4227a88a199120aD52Dd9742C7430847d3cB2CD4',
		}
		let passesValidation = isAddressBook(addressBook)
		expect(passesValidation).toBe(false)
		addressBook = {
			contract1: {
				// invalid address
				address: '0x4',
				blockCreated: 0,
			},
		}
		passesValidation = isAddressBook(addressBook)
		expect(passesValidation).toBe(false)
		addressBook = {
			contract1: {
				unnecessaryField: 'foo',
				address: '0x4',
				blockCreated: 0,
			},
		}
		passesValidation = isAddressBook(addressBook)
		expect(passesValidation).toBe(false)
		addressBook = {
			contract1: {
				address: '0x4',
				// missing block created
			},
		}
		passesValidation = isAddressBook(addressBook)
		expect(passesValidation).toBe(false)
		addressBook = {
			contract1: {
				blockCreated: 5,
				// missing address
			},
		}
		passesValidation = isAddressBook(addressBook)
		expect(passesValidation).toBe(false)
	})
})

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
		} as const satisfies AddressBook
		const addressBook = parseAddressBook(expected) satisfies AddressBook
		expect(addressBook).toEqual(expected)
		assertType<typeof expected>(addressBook)
	})

	it('should work for an empty address book', () => {
		expect(parseAddressBook({})).toEqual({})
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
		} as const satisfies AddressBook
		const addressBook = parseAddressBook(expected) satisfies AddressBook
		expect(addressBook).toEqual(expected)
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
