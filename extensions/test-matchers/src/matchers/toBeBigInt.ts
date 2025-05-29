/**
 * Custom Vitest matcher to assert that a value is a BigInt
 * @param received - The value to test
 * @returns Object with pass boolean and message function
 */
export function toBeBigInt(received: unknown) {
	const pass = typeof received === 'bigint'

	return {
		pass,
		message: () => {
			if (pass) {
				return `Expected ${received} not to be a BigInt`
			}
			return `Expected ${received} to be a BigInt, but received ${typeof received}`
		},
	}
}
