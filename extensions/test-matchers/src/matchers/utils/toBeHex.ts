import { isHex } from 'viem'

export type IsHexOptions = {
	/**
	 * Whether to check for strict hex format or only for 0x prefix
	 * @default true
	 */
	strict?: boolean
	/**
	 * Optional expected size in bytes
	 */
	size?: number
}

/**
 * Custom Vitest matcher to assert that a value is valid hex
 * @param received - The value to test
 * @param opts - Optional options for hex validation
 * @returns Object with pass boolean, message function, and actual/expected for diff
 */
export function toBeHex(received: unknown, opts?: IsHexOptions) {
	const isStringReceived = typeof received === 'string'
	const isValidHex = isStringReceived && isHex(received, opts)
	const receivedSize = isStringReceived ? (received.length - 2) / 2 : 0
	const isValidSize = opts?.size === undefined || receivedSize === opts.size
	const pass = isValidHex && isValidSize

	const expectedDescription = pass
		? 'not a valid hex string'
		: `a valid hex string${opts?.size ? ` with size ${opts.size} bytes` : ''}`
	return {
		pass,
		actual: received,
		message: () => {
			if (pass) return `Expected ${received} not to be ${expectedDescription}`
			if (!isStringReceived) return `Expected ${typeof received} to be a hex string`
			if (!received.startsWith('0x')) return `Expected ${received} to start with "0x"`
			if (!isValidHex) return `Expected ${received} to contain only hex characters (0-9, a-f, A-F) after "0x"`
			if (!isValidSize) return `Expected ${received} to have ${opts?.size} bytes, but got ${receivedSize} bytes`
			return `Expected ${received} to be ${expectedDescription}`
		},
	}
}
