import { isAddress, isAddressEqual } from 'viem'

/**
 * Custom Vitest matcher to assert that two addresses are equal
 * @param received - The first address to compare
 * @param expected - The second address to compare
 * @returns Object with pass boolean and message function
 */
export function toEqualAddress(received: string, expected: string) {
	const isAddressReceived = isAddress(received, { strict: false })
	const isAddressExpected = isAddress(expected, { strict: false })
	const pass = isAddressReceived && isAddressExpected && isAddressEqual(received, expected)

	return {
		pass,
		message: () => {
			if (pass) {
				return `Expected "${received}" not to equal address "${expected}"`
			}
			if (!isAddressReceived) return `Expected "${received}" to be a valid address`
			if (!isAddressExpected) return `Expected "${expected}" to be a valid address`
			return `Expected "${received}" to equal address "${expected}"`
		},
	}
}
