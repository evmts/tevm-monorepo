/**
 * Custom Vitest matcher to assert that a value is a BigInt
 * @param received - The value to test
 * @returns Object with pass boolean, message function, and actual/expected for diff
 */
export function toBeBigInt(received: unknown) {
	const pass = typeof received === 'bigint'

	return {
		pass,
		actual: received,
		expected: pass ? 'not a bigint' : 'bigint',
		message: () => {
			if (pass) return `Expected ${received} not to be a BigInt`
			return `Expected ${received} to be a BigInt`
		},
	}
}
