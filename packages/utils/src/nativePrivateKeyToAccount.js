// Native privateKeyToAccount implementation using @tevm/voltaire
// This provides a viem-compatible account object using voltaire crypto primitives
// Use specific exports to avoid FFI dependencies from the main bundle

import { Secp256k1 } from '@tevm/voltaire/Secp256k1'
import { Keccak256 } from '@tevm/voltaire/Keccak256'
import { Hash } from '@tevm/voltaire/Hash'
import { hexToBytes, bytesToHex } from './viem.js'
import { privateKeyToAddress } from './privateKeyToAddress.js'

/**
 * @typedef {Object} NativePrivateKeyAccount
 * @property {import('./address-types.js').Address} address - The checksummed Ethereum address
 * @property {import('./hex-types.js').Hex} publicKey - The uncompressed public key (65 bytes with 0x04 prefix)
 * @property {'local'} type - Account type, always 'local' for private key accounts
 * @property {'privateKey'} source - Account source, always 'privateKey'
 * @property {(parameters: { hash: import('./hex-types.js').Hex }) => Promise<import('./hex-types.js').Hex>} sign - Sign a hash directly
 * @property {(parameters: { message: string | { raw: import('./hex-types.js').Hex | Uint8Array } }) => Promise<import('./hex-types.js').Hex>} signMessage - Sign a message with EIP-191 prefix
 * @property {(transaction: any) => Promise<any>} signTransaction - Sign a transaction (returns signed tx object)
 * @property {(parameters: { domain?: any, types: any, primaryType: string, message: any }) => Promise<import('./hex-types.js').Hex>} signTypedData - Sign typed data (EIP-712)
 */

/**
 * Sign a hash with a private key using voltaire's Secp256k1
 * @param {Uint8Array} hash - 32-byte hash to sign
 * @param {Uint8Array} privateKeyBytes - 32-byte private key
 * @returns {import('./hex-types.js').Hex} Signature as hex (65 bytes: r + s + v)
 */
function signHash(hash, privateKeyBytes) {
	// Use voltaire's Secp256k1.sign which properly computes recovery ID
	// and returns { r, s, v } with Ethereum-compatible v (27 or 28)
	const hashTyped = Hash.from(hash)
	const sig = Secp256k1.sign(hashTyped, privateKeyBytes)

	// Build 65-byte result: r + s + v
	const result = new Uint8Array(65)
	// sig.r and sig.s are Hash types (Uint8Array branded)
	result.set(new Uint8Array(sig.r), 0)
	result.set(new Uint8Array(sig.s), 32)
	result[64] = sig.v

	return /** @type {import('./hex-types.js').Hex} */ (bytesToHex(result))
}

/**
 * Creates a viem-compatible account object from a private key using native implementation.
 *
 * This is a native implementation that doesn't depend on viem for signing,
 * using @tevm/voltaire for secp256k1 signing and keccak256 hashing.
 *
 * @param {import('./hex-types.js').Hex} privateKey - The private key as a hex string (must be 32 bytes/64 hex chars + '0x' prefix)
 * @returns {NativePrivateKeyAccount} A viem-compatible account object
 * @throws {Error} If the private key is invalid
 * @example
 * ```javascript
 * import { nativePrivateKeyToAccount } from '@tevm/utils'
 *
 * const account = nativePrivateKeyToAccount('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80')
 * console.log(account.address) // '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
 *
 * // Sign a message
 * const signature = await account.signMessage({ message: 'Hello, Ethereum!' })
 * ```
 */
export function nativePrivateKeyToAccount(privateKey) {
	// Convert and validate private key
	const privateKeyBytes = hexToBytes(privateKey)
	if (privateKeyBytes.length !== 32) {
		throw new Error(`Private key must be 32 bytes, got ${privateKeyBytes.length} bytes`)
	}

	// Derive address using existing implementation
	const address = privateKeyToAddress(privateKey)

	// Derive public key (uncompressed, with 0x04 prefix) using voltaire
	// Secp256k1.derivePublicKey returns 64 bytes without prefix, so we add it back
	const publicKeyNoPrefix = Secp256k1.derivePublicKey(privateKeyBytes)
	const publicKeyPoint = new Uint8Array(65)
	publicKeyPoint[0] = 0x04
	publicKeyPoint.set(publicKeyNoPrefix, 1)
	const publicKey = /** @type {import('./hex-types.js').Hex} */ (bytesToHex(publicKeyPoint))

	/**
	 * Sign a hash directly
	 * @param {Object} parameters
	 * @param {import('./hex-types.js').Hex} parameters.hash - The hash to sign
	 * @returns {Promise<import('./hex-types.js').Hex>}
	 */
	async function sign({ hash }) {
		const hashBytes = hexToBytes(hash)
		if (hashBytes.length !== 32) {
			throw new Error(`Hash must be 32 bytes, got ${hashBytes.length} bytes`)
		}
		return signHash(hashBytes, privateKeyBytes)
	}

	/**
	 * Sign a message with EIP-191 prefix
	 * @param {Object} parameters
	 * @param {string | { raw: import('./hex-types.js').Hex | Uint8Array }} parameters.message - The message to sign
	 * @returns {Promise<import('./hex-types.js').Hex>}
	 */
	async function signMessage({ message }) {
		let msgBytes
		if (typeof message === 'string') {
			msgBytes = new TextEncoder().encode(message)
		} else if (message.raw) {
			msgBytes = typeof message.raw === 'string' ? hexToBytes(message.raw) : message.raw
		} else {
			throw new Error('Invalid message format')
		}

		// Create EIP-191 prefixed message hash using voltaire's Keccak256
		const prefix = new TextEncoder().encode(`\x19Ethereum Signed Message:\n${msgBytes.length}`)
		const combined = new Uint8Array(prefix.length + msgBytes.length)
		combined.set(prefix)
		combined.set(msgBytes, prefix.length)
		const messageHash = Keccak256.hash(combined)

		return signHash(messageHash, privateKeyBytes)
	}

	/**
	 * Sign a transaction
	 * @param {any} transaction - The transaction to sign
	 * @returns {Promise<any>}
	 */
	async function signTransaction(transaction) {
		// Transaction signing is complex and requires proper RLP encoding
		// For now, throw not implemented - users should use viem for tx signing
		throw new Error('signTransaction not yet implemented - use viem/accounts for transaction signing')
	}

	/**
	 * Sign typed data (EIP-712)
	 * @param {Object} parameters
	 * @param {any} [parameters.domain] - The domain
	 * @param {any} parameters.types - The types
	 * @param {string} parameters.primaryType - The primary type
	 * @param {any} parameters.message - The message to sign
	 * @returns {Promise<import('./hex-types.js').Hex>}
	 */
	async function signTypedData({ domain, types, primaryType, message }) {
		// EIP-712 signing requires proper domain separator and struct hashing
		// For now, throw not implemented - users should use viem for typed data signing
		throw new Error('signTypedData not yet implemented - use viem/accounts for typed data signing')
	}

	return {
		address,
		publicKey,
		type: /** @type {const} */ ('local'),
		source: /** @type {const} */ ('privateKey'),
		sign,
		signMessage,
		signTransaction,
		signTypedData,
	}
}
