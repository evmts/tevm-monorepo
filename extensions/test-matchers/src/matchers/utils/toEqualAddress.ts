import { getAddress, isAddress, isAddressEqual } from 'viem'

/**
 * Custom Vitest matcher to assert that two addresses are equal
 * @param received - The first address to compare
 * @param expected - The second address to compare
 * @returns Object with pass boolean, message function, and actual/expected for diff
 */
export function toEqualAddress(received: unknown, expected: unknown) {
	const isStringReceived = typeof received === 'string'
	const isStringExpected = typeof expected === 'string'
	const isAddressReceived = isStringReceived && isAddress(received, { strict: false })
	const isAddressExpected = isStringExpected && isAddress(expected, { strict: false })

	let pass = false
	let normalizedReceived: string | undefined
	let normalizedExpected: string | undefined

	if (isAddressReceived && isAddressExpected) {
		try {
			normalizedReceived = getAddress(received)
			normalizedExpected = getAddress(expected)
			pass = isAddressEqual(received, expected)
		} catch {
			pass = false
		}
	}

	return {
		pass,
		actual: normalizedReceived ?? received,
		expected: normalizedExpected ?? expected,
		message: () => {
			if (pass) return 'Expected addresses not to be equal'
			if (!isStringReceived) return `Expected ${received} to be a string, but got ${typeof received}`
			if (!isStringExpected) return `Expected ${expected} to be a string, but got ${typeof expected}`
			if (!isAddressReceived) return `Expected ${received} to be a valid address`
			if (!isAddressExpected) return `Expected ${expected} to be a valid address`
			return 'Expected addresses to be equal'
		},
	}
}
