import { type IsAddressOptions, isAddress } from 'viem'

/**
 * Custom Vitest matcher to assert that a value is a valid Ethereum address
 * @param received - The value to test
 * @param opts - Options for address validation (strict checksum by default)
 * @returns Object with pass boolean, message function, and actual/expected for diff
 */
export function toBeAddress(received: unknown, opts?: IsAddressOptions) {
	const pass = typeof received === 'string' && isAddress(received, opts)

	return {
		pass,
		actual: received,
		message: () => {
			if (pass)
				return `Expected ${received} not to be ${opts?.strict !== false ? 'a valid Ethereum address (checksummed)' : 'a valid Ethereum address'}`
			// Default is strict: true, so mention checksum unless explicitly strict: false
			return `Expected ${received} to be a ${opts?.strict !== false ? 'valid Ethereum address (checksummed)' : 'valid Ethereum address'}`
		},
	}
}
