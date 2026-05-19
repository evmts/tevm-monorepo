import { expect } from 'vitest'
import { getAddress, hexToBytes, isAddress, isAddressEqual, isHex, trim } from 'viem'

const equalsBytes = (a: Uint8Array, b: Uint8Array) => a.length === b.length && a.every((byte, index) => byte === b[index])

expect.extend({
	toBeAddress(received, opts) {
		const pass = typeof received === 'string' && isAddress(received, opts as Parameters<typeof isAddress>[1])

		return {
			pass,
			actual: received,
			message: () => (pass ? `Expected ${received} not to be an address` : `Expected ${received} to be an address`),
		}
	},
	toBeHex(received, opts) {
		const options = opts as Parameters<typeof isHex>[1] | undefined
		const isStringReceived = typeof received === 'string'
		const isValidHex = isStringReceived && isHex(received, options)
		const receivedSize = isStringReceived ? (received.length - 2) / 2 : 0
		const isValidSize = options?.size === undefined || receivedSize === options.size
		const pass = isValidHex && isValidSize

		return {
			pass,
			actual: received,
			message: () => (pass ? `Expected ${received} not to be hex` : `Expected ${received} to be hex`),
		}
	},
	toEqualAddress(received, expected) {
		const canCompare =
			typeof received === 'string' &&
			typeof expected === 'string' &&
			isAddress(received, { strict: false }) &&
			isAddress(expected, { strict: false })
		const pass = canCompare && isAddressEqual(received, expected)

		return {
			pass,
			actual: canCompare ? getAddress(received) : received,
			expected: canCompare ? getAddress(expected) : expected,
			message: () => (pass ? 'Expected addresses not to be equal' : 'Expected addresses to be equal'),
		}
	},
	toEqualHex(received, expected, opts) {
		if (typeof received !== 'string' || typeof expected !== 'string') {
			return {
				pass: false,
				actual: received,
				expected,
				message: () => 'Expected both values to be hex strings',
			}
		}

		if (!isHex(received, { strict: true }) || !isHex(expected, { strict: true })) {
			return {
				pass: false,
				actual: received,
				expected,
				message: () => 'Expected both values to be valid hex strings',
			}
		}

		const options = opts as { exact?: boolean } | undefined
		const normalizedReceived = options?.exact ? received.toLowerCase() : trim(received)
		const normalizedExpected = options?.exact ? expected.toLowerCase() : trim(expected)
		const pass = options?.exact
			? normalizedReceived === normalizedExpected
			: equalsBytes(hexToBytes(normalizedReceived), hexToBytes(normalizedExpected))

		return {
			pass,
			actual: normalizedReceived,
			expected: normalizedExpected,
			message: () => (pass ? 'Expected hex strings not to be equal' : 'Expected hex strings to be equal'),
		}
	},
})
