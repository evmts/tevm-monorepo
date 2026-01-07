// Native privateKeyToAccount implementation using @tevm/voltaire
// This provides a viem-compatible account object using voltaire crypto primitives
// Use specific exports to avoid FFI dependencies from the main bundle

import { Secp256k1, PrivateKey } from '@tevm/voltaire/Secp256k1'
import { Keccak256 } from '@tevm/voltaire/Keccak256'
import { Hash } from '@tevm/voltaire/Hash'
import { EIP712 } from '@tevm/voltaire/EIP712'
import { Address as VoltaireAddress } from '@tevm/voltaire/Address'
import { hexToBytes, bytesToHex, serializeTransaction, keccak256 } from './viem.js'
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
 * @param {Uint8Array} privateKeyTyped - 32-byte private key (as voltaire typed key)
 * @returns {import('./hex-types.js').Hex} Signature as hex (65 bytes: r + s + v)
 */
function signHash(hash, privateKeyTyped) {
	// Use voltaire's Secp256k1.sign which properly computes recovery ID
	// and returns { r, s, v } with Ethereum-compatible v (27 or 28)
	const hashTyped = Hash.from(hash)
	// @ts-ignore - privateKeyTyped is already a PrivateKeyType from PrivateKey.fromBytes
	const sig = Secp256k1.sign(hashTyped, privateKeyTyped)

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

	// Convert to voltaire's typed PrivateKey for proper type safety
	const privateKeyTyped = PrivateKey.fromBytes(privateKeyBytes)

	// Derive address using existing implementation
	const address = privateKeyToAddress(privateKey)

	// Derive public key (uncompressed, with 0x04 prefix) using voltaire
	// Secp256k1.derivePublicKey returns 64 bytes without prefix, so we add it back
	const publicKeyNoPrefix = Secp256k1.derivePublicKey(privateKeyTyped)
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
		return signHash(hashBytes, privateKeyTyped)
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

		return signHash(messageHash, privateKeyTyped)
	}

	/**
	 * Compute the signing hash for a transaction.
	 * Uses native keccak256 and our RLP encoding.
	 * @param {any} tx - Transaction in viem format
	 * @returns {Uint8Array} The 32-byte signing hash
	 */
	function getSigningHash(tx) {
		// Get the unsigned serialized transaction for signing
		// For EIP-1559/2930, we serialize without signature
		// For Legacy with chainId, we use EIP-155 format
		const unsignedSerialized = serializeTransaction(tx)
		return hexToBytes(keccak256(unsignedSerialized))
	}

	/**
	 * Sign a transaction and return the RLP-encoded signed transaction.
	 * Uses native serializeTransaction to avoid voltaire RLP encoding issues.
	 * @param {any} transaction - viem-style transaction request
	 * @returns {Promise<import('./hex-types.js').Hex>} RLP-encoded signed transaction
	 */
	async function signTransaction(transaction) {
		// Determine transaction type
		const type = transaction.type ??
			(transaction.maxFeePerGas !== undefined ? 'eip1559' :
			 transaction.accessList !== undefined ? 'eip2930' : 'legacy')

		// Normalize transaction fields
		const tx = {
			...transaction,
			type,
			chainId: transaction.chainId ?? 1,
			nonce: transaction.nonce ?? 0n,
			gas: transaction.gas ?? transaction.gasLimit ?? 21000n,
			value: transaction.value ?? 0n,
			data: transaction.data ?? '0x',
		}

		// Get signing hash
		const signingHash = getSigningHash(tx)

		// Sign the hash using voltaire
		const hashTyped = Hash.from(signingHash)
		// @ts-ignore - privateKeyTyped is typed correctly
		const sig = Secp256k1.sign(hashTyped, privateKeyTyped)

		// Create signature object for serialization
		// yParity is 0 or 1 for EIP-1559/2930
		// v is computed for legacy transactions
		const signature = {
			r: BigInt(bytesToHex(new Uint8Array(sig.r))),
			s: BigInt(bytesToHex(new Uint8Array(sig.s))),
			yParity: sig.v - 27, // Convert 27/28 to 0/1
			v: BigInt(sig.v), // For legacy
		}

		// For legacy transactions, compute EIP-155 v value
		if (type === 'legacy' && tx.chainId !== undefined) {
			signature.v = BigInt(tx.chainId) * 2n + 35n + BigInt(sig.v - 27)
		}

		// Serialize the signed transaction using our native implementation
		return serializeTransaction(tx, signature)
	}

	/**
	 * Recursively convert message values based on type definitions.
	 * Converts address strings to voltaire AddressType, numbers to bigints where needed.
	 * @param {any} value - The value to convert
	 * @param {string} type - The EIP-712 type
	 * @param {Record<string, Array<{name: string, type: string}>>} types - Type definitions
	 * @returns {any} The converted value
	 */
	function convertMessageValue(value, type, types) {
		// Handle arrays
		if (type.endsWith('[]')) {
			const baseType = type.slice(0, -2)
			return /** @type {any[]} */ (value).map(v => convertMessageValue(v, baseType, types))
		}

		// Handle fixed-size arrays like bytes32[2]
		const arrayMatch = type.match(/^(.+)\[(\d+)\]$/)
		if (arrayMatch) {
			const baseType = /** @type {string} */ (arrayMatch[1])
			return /** @type {any[]} */ (value).map(v => convertMessageValue(v, baseType, types))
		}

		// Handle address type - convert hex string to voltaire AddressType
		if (type === 'address') {
			if (typeof value === 'string') {
				return VoltaireAddress.from(value)
			}
			return value
		}

		// Handle bytes type - convert hex string to Uint8Array
		if (type === 'bytes' || type.match(/^bytes\d+$/)) {
			if (typeof value === 'string') {
				return hexToBytes(/** @type {import('./hex-types.js').Hex} */ (value))
			}
			return value
		}

		// Handle uint/int types - ensure they're bigints
		if (type.match(/^u?int\d*$/)) {
			if (typeof value === 'number') {
				return BigInt(value)
			}
			return value
		}

		// Handle custom struct types
		if (types[type]) {
			const typeProps = types[type]
			const converted = /** @type {Record<string, any>} */ ({})
			for (const prop of typeProps) {
				if (value[prop.name] !== undefined) {
					converted[prop.name] = convertMessageValue(value[prop.name], prop.type, types)
				}
			}
			return converted
		}

		// Return value as-is for other types (string, bool, etc.)
		return value
	}

	/**
	 * Sign typed data (EIP-712)
	 * @param {Object} parameters - Typed data parameters
	 * @param {any} [parameters.domain] - The domain separator data
	 * @param {any} parameters.types - The type definitions
	 * @param {string} parameters.primaryType - The primary type to sign
	 * @param {any} parameters.message - The message data to sign
	 * @returns {Promise<import('./hex-types.js').Hex>}
	 */
	async function signTypedData(parameters) {
		const { domain, types, primaryType, message } = parameters

		// Convert viem-style typed data to voltaire format
		// Viem's chainId might be number, voltaire expects bigint
		const voltaireDomain = domain ? {
			name: domain.name,
			version: domain.version,
			chainId: domain.chainId !== undefined ? BigInt(domain.chainId) : undefined,
			verifyingContract: domain.verifyingContract ?
				VoltaireAddress.from(domain.verifyingContract) : undefined,
			salt: domain.salt ? hexToBytes(domain.salt) : undefined,
		} : {}

		// Filter out the EIP712Domain type since voltaire handles it internally
		const filteredTypes = /** @type {Record<string, Array<{name: string, type: string}>>} */ ({})
		for (const [typeName, typeProperties] of Object.entries(types)) {
			if (typeName !== 'EIP712Domain') {
				filteredTypes[typeName] = /** @type {Array<{name: string, type: string}>} */ (typeProperties)
			}
		}

		// Convert message values to voltaire-compatible types
		const convertedMessage = convertMessageValue(message, primaryType, filteredTypes)

		// Build voltaire typed data structure
		const typedData = {
			domain: voltaireDomain,
			types: filteredTypes,
			primaryType,
			message: convertedMessage,
		}

		// Sign using voltaire's EIP712 implementation
		const signature = EIP712.signTypedData(typedData, privateKeyBytes)

		// Build 65-byte result: r + s + v
		const result = new Uint8Array(65)
		result.set(new Uint8Array(signature.r), 0)
		result.set(new Uint8Array(signature.s), 32)
		result[64] = signature.v

		return /** @type {import('./hex-types.js').Hex} */ (bytesToHex(result))
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
