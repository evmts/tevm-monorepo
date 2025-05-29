import { type IsAddressOptions, isAddress } from 'viem'

/**
 * Custom Vitest matcher to assert that a value is a valid Ethereum address
 * @param received - The value to test
 * @param opts - Options for address validation (strict checksum by default)
 * @returns Object with pass boolean and message function
 */
export function toBeAddress(received: string, opts?: IsAddressOptions) {
	const pass = isAddress(received, opts)

	return {
		pass,
		message: () => {
			if (pass) {
				return `Expected "${received}" not to be a valid Ethereum address`
			}
			// Default is strict: true, so mention checksum unless explicitly strict: false
			return `Expected "${received}" to be a valid Ethereum address${opts?.strict !== false ? ' (checksummed)' : ''}, but received ${typeof received === 'string' ? 'invalid format' : typeof received}`
		},
	}
}
