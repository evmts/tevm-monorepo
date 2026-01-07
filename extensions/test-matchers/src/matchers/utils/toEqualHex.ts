import { type Hex, equalsBytes, hexToBytes, isHex, trim } from '@tevm/utils'

export type EqualHexOptions = {
	/**
	 * Whether to compare hex strings exactly as written or normalize them first.
	 * When false (default), leading zeros are trimmed before byte comparison (e.g., "0x00123" equals "0x123").
	 * When true, hex strings must match exactly including leading zeros.
	 * @default false
	 */
	exact?: boolean
}

/**
 * Custom Vitest matcher to assert that two hex strings are equal (after converting to bytes)
 * @param received - The first hex string to compare
 * @param expected - The second hex string to compare
 * @param opts - Options for comparison behavior
 * @returns Object with pass boolean, message function, and actual/expected for diff
 */
export function toEqualHex(received: unknown, expected: unknown, opts?: EqualHexOptions) {
	const isStringReceived = typeof received === 'string'
	const isStringExpected = typeof expected === 'string'

	// First validate both are valid hex strings
	const isHexReceived = isStringReceived && isHex(received, { strict: true })
	const isHexExpected = isStringExpected && isHex(expected, { strict: true })

	if (!isHexReceived || !isHexExpected) {
		return {
			pass: false,
			actual: received,
			expected: expected,
			message: () => {
				if (!isStringReceived) return `Expected ${received} to be a string, but got ${typeof received}`
				if (!isStringExpected) return `Expected ${expected} to be a string, but got ${typeof expected}`
				if (!isHexReceived) return `Expected ${received} to be a valid hex string`
				if (!isHexExpected) return `Expected ${expected} to be a valid hex string`
				return 'Expected hex strings to be equal'
			},
		}
	}

	let pass: boolean
	let normalizedReceived: Hex
	let normalizedExpected: Hex

	if (opts?.exact) {
		// For exact comparison, compare strings directly (case-insensitive)
		normalizedReceived = received.toLowerCase() as Hex
		normalizedExpected = expected.toLowerCase() as Hex
		pass = normalizedReceived === normalizedExpected
	} else {
		// For normalized comparison, trim leading zeros and compare bytes
		normalizedReceived = trim(received) as Hex
		normalizedExpected = trim(expected) as Hex
		try {
			const receivedBytes = hexToBytes(normalizedReceived)
			const expectedBytes = hexToBytes(normalizedExpected)
			pass = equalsBytes(receivedBytes, expectedBytes)
		} catch {
			pass = false
		}
	}

	return {
		pass,
		actual: normalizedReceived,
		expected: normalizedExpected,
		message: () => {
			if (pass) return 'Expected hex strings not to be equal'
			return `Expected hex strings to be equal${opts?.exact ? ' (exact match)' : ' (normalized comparison)'}`
		},
	}
}
