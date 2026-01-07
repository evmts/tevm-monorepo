// Import from voltaire directly to avoid pulling in native-only crypto modules
import { Address } from '@tevm/voltaire/Address'
import { Hex } from '@tevm/voltaire/Hex'

/**
 * Get the address for a private key.
 * Native implementation using @tevm/voltaire that matches viem's privateKeyToAddress API.
 *
 * @param {import('./hex-types.js').Hex} privateKey - The private key as a hex string (must be 32 bytes/64 hex chars + '0x' prefix)
 * @returns {import('./address-types.js').Address} The checksummed Ethereum address
 * @throws {Error} If the private key is invalid
 * @example
 * ```javascript
 * import { privateKeyToAddress } from '@tevm/utils'
 *
 * const address = privateKeyToAddress('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80')
 * // '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
 * ```
 */
export function privateKeyToAddress(privateKey) {
	// Convert hex string to bytes using voltaire Hex.toBytes
	const privateKeyBytes = Hex.toBytes(privateKey)

	// Validate private key length (32 bytes)
	if (privateKeyBytes.length !== 32) {
		throw new Error(`Private key must be 32 bytes, got ${privateKeyBytes.length} bytes`)
	}

	// Use voltaire's Address.fromPrivateKey to derive the address
	const addressType = Address.fromPrivateKey(privateKeyBytes)

	// Return the checksummed address as a hex string
	return /** @type {import('./address-types.js').Address} */ (Address.toChecksummed(addressType))
}
