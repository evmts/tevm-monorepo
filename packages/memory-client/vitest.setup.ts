import { isAddress, isHex } from 'viem'
import { expect } from 'vitest'

const normalizeHex = (value: string): string => value.toLowerCase()
const normalizeAddress = (value: string): string => value.toLowerCase()

expect.extend({
	toBeAddress(received: unknown) {
		const pass = typeof received === 'string' && isAddress(received)
		return {
			pass,
			message: () =>
				pass
					? `expected ${String(received)} not to be a valid address`
					: `expected ${String(received)} to be a valid address`,
		}
	},
	toBeHex(received: unknown) {
		const pass = typeof received === 'string' && isHex(received)
		return {
			pass,
			message: () =>
				pass
					? `expected ${String(received)} not to be a valid hex string`
					: `expected ${String(received)} to be a valid hex string`,
		}
	},
	toEqualAddress(received: unknown, expected: unknown) {
		const pass =
			typeof received === 'string' &&
			typeof expected === 'string' &&
			isAddress(received) &&
			isAddress(expected) &&
			normalizeAddress(received) === normalizeAddress(expected)
		return {
			pass,
			message: () =>
				pass
					? `expected ${String(received)} not to equal address ${String(expected)}`
					: `expected ${String(received)} to equal address ${String(expected)}`,
		}
	},
	toEqualHex(received: unknown, expected: unknown) {
		const pass =
			typeof received === 'string' &&
			typeof expected === 'string' &&
			isHex(received) &&
			isHex(expected) &&
			normalizeHex(received) === normalizeHex(expected)
		return {
			pass,
			message: () =>
				pass
					? `expected ${String(received)} not to equal hex ${String(expected)}`
					: `expected ${String(received)} to equal hex ${String(expected)}`,
		}
	},
})

export {}
