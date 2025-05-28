import { EthjsAddress, keccak256, toType as originalToType, toBytes } from '@tevm/utils'

/**
 * Creates a zero-filled buffer of the specified length
 * @param {number} length - The length of the buffer
 * @returns {Uint8Array} A zero-filled Uint8Array
 */
export function zeros(length: number): Uint8Array {
	return new Uint8Array(length)
}

/**
 * Creates the zero address
 * @returns {EthjsAddress} The zero address
 */
export function createZeroAddress() {
	return new EthjsAddress(new Uint8Array(20))
}

/**
 * Creates an address from a public key
 * @param {Uint8Array} publicKey - The public key
 * @returns {EthjsAddress} The address
 */
export function createAddressFromPublicKey(publicKey: Uint8Array): EthjsAddress {
	// Create address from public key by taking the last 20 bytes of keccak256 hash
	const addressBytes = keccak256(publicKey, 'bytes').slice(-20)
	return new EthjsAddress(addressBytes)
}

/**
 * Wrapper for toType that handles string inputs properly
 * @param {any} input - The input value
 * @param {number} outputType - The output type
 * @returns {any} The converted value
 */
export function safeToType(input: any, outputType: number): any {
	if (input === null || input === undefined) {
		return undefined
	}

	// Handle string inputs by converting to bytes first
	if (typeof input === 'string' && outputType === 2) {
		const bytes = toBytes(input)
		return originalToType(bytes, outputType as any)
	}

	return originalToType(input, outputType as any)
}

/**
 * Gets the v value from a signature
 * @param {any} signature - The signature object
 * @returns {bigint} The v value
 */
export function getSignatureV(signature: any): bigint {
	// Handle both old format (v) and new format (recovery)
	if (signature.v !== undefined) {
		return BigInt(signature.v)
	}
	if (signature.recovery !== undefined) {
		return BigInt(signature.recovery) + 27n
	}
	throw new Error('Invalid signature format: missing v or recovery')
}
