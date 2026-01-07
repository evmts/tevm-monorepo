import { ecrecover } from './ecrecover.js'
import { getAddress, keccak256, toBytes, toHex } from './viem.js'
import { EIP712 } from '@tevm/voltaire/EIP712'
import { Address as VoltaireAddress } from '@tevm/voltaire/Address'
import { Hash as VoltaireHash } from '@tevm/voltaire/Hash'

/**
 * @typedef {Object} Signature
 * @property {bigint} r - The r value of the signature
 * @property {bigint} s - The s value of the signature
 * @property {number} [v] - The recovery id (27 or 28)
 * @property {0 | 1} [yParity] - The y parity (0 or 1)
 */

/**
 * Recovers the public key from a signature
 * @param {Object} params - The parameters
 * @param {import('./abitype.js').Hex} params.hash - The message hash
 * @param {Signature} params.signature - The signature
 * @returns {import('./abitype.js').Hex} The uncompressed public key (65 bytes)
 * @throws {Error} If the signature is invalid
 * @example
 * ```js
 * import { recoverPublicKey } from '@tevm/utils'
 *
 * const publicKey = recoverPublicKey({
 *   hash: '0x82ff40c0a986c6a5cfad4ddf4c3aa6996f1a7837f9c398e17e5de5cbd5a12b28',
 *   signature: {
 *     r: 0x99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9n,
 *     s: 0x129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66n,
 *     v: 27
 *   }
 * })
 * ```
 */
export function recoverPublicKey({ hash, signature }) {
	const v =
		signature.yParity !== undefined
			? signature.yParity
			: signature.v !== undefined
				? signature.v - 27
				: (() => {
						throw new Error('Either v or yParity must be provided in signature')
					})()

	// Convert bigint values to proper byte arrays for ecrecover
	const rBytes = new Uint8Array(32)
	const sBytes = new Uint8Array(32)

	// Convert bigint to bytes (big endian)
	const rBigInt = typeof signature.r === 'string' ? BigInt(signature.r) : signature.r
	const sBigInt = typeof signature.s === 'string' ? BigInt(signature.s) : signature.s

	for (let i = 0; i < 32; i++) {
		rBytes[31 - i] = Number((rBigInt >> BigInt(8 * i)) & 0xffn)
		sBytes[31 - i] = Number((sBigInt >> BigInt(8 * i)) & 0xffn)
	}

	const publicKey = ecrecover(toBytes(hash), BigInt(v), rBytes, sBytes)

	/* v8 ignore next 3 */
	if (!publicKey) {
		throw new Error('Failed to recover public key')
	}

	// ecrecover returns a 64-byte public key, we need to add the 0x04 prefix for uncompressed format
	return `0x04${toHex(publicKey).slice(2)}`
}

/**
 * Recovers the address from a signature
 * @param {Object} params - The parameters
 * @param {import('./abitype.js').Hex} params.hash - The message hash
 * @param {Signature} params.signature - The signature
 * @returns {import('./abitype.js').Address} The recovered address
 * @throws {Error} If the signature is invalid
 * @example
 * ```js
 * import { recoverAddress } from '@tevm/utils'
 *
 * const address = recoverAddress({
 *   hash: '0x82ff40c0a986c6a5cfad4ddf4c3aa6996f1a7837f9c398e17e5de5cbd5a12b28',
 *   signature: {
 *     r: 0x99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9n,
 *     s: 0x129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66n,
 *     v: 27
 *   }
 * })
 * ```
 */
export function recoverAddress({ hash, signature }) {
	const publicKey = recoverPublicKey({ hash, signature })
	// Remove 0x04 prefix from uncompressed public key
	const publicKeyBytes = toBytes(publicKey).slice(1)
	const addressHash = keccak256(publicKeyBytes)
	// Take last 20 bytes of hash
	return getAddress(`0x${addressHash.slice(-40)}`)
}

/**
 * Hashes a message according to EIP-191
 * @param {string} message - The message to hash
 * @returns {import('./abitype.js').Hex} The message hash
 * @example
 * ```js
 * import { hashMessage } from '@tevm/utils'
 *
 * const hash = hashMessage('Hello world')
 * // 0x8144a6fa26be252b86456491fbcd43c1de7e022241845ffea1c3df066f7cfede
 * ```
 */
export function hashMessage(message) {
	const prefix = `\x19Ethereum Signed Message:\n${message.length}`
	return keccak256(toBytes(prefix + message))
}

/**
 * Recovers the address from a signed message
 * @param {Object} params - The parameters
 * @param {string} params.message - The original message
 * @param {Signature} params.signature - The signature
 * @returns {import('./abitype.js').Address} The recovered address
 * @throws {Error} If the signature is invalid
 * @example
 * ```js
 * import { recoverMessageAddress } from '@tevm/utils'
 *
 * const address = recoverMessageAddress({
 *   message: 'Hello world',
 *   signature: {
 *     r: 0x...,
 *     s: 0x...,
 *     v: 27
 *   }
 * })
 * ```
 */
export function recoverMessageAddress({ message, signature }) {
	const hash = hashMessage(message)
	return recoverAddress({ hash, signature })
}

/**
 * Verifies a message signature
 * @param {Object} params - The parameters
 * @param {import('./abitype.js').Address} params.address - The expected signer address
 * @param {string} params.message - The original message
 * @param {Signature} params.signature - The signature
 * @returns {boolean} Whether the signature is valid
 * @example
 * ```js
 * import { verifyMessage } from '@tevm/utils'
 *
 * const isValid = verifyMessage({
 *   address: '0xa6fb229e9b0a4e4ef52ea6991adcfc59207c7711',
 *   message: 'Hello world',
 *   signature: {
 *     r: 0x...,
 *     s: 0x...,
 *     v: 27
 *   }
 * })
 * ```
 */
export function verifyMessage({ address, message, signature }) {
	try {
		const recoveredAddress = recoverMessageAddress({ message, signature })
		return recoveredAddress.toLowerCase() === address.toLowerCase()
	} catch {
		return false
	}
}

/**
 * Signs a message with a private key
 * Uses native implementation with @tevm/voltaire instead of viem
 * @param {Object} params - The parameters
 * @param {import('./abitype.js').Hex} params.privateKey - The private key
 * @param {string} params.message - The message to sign
 * @returns {Promise<Signature>} The signature
 * @example
 * ```js
 * import { signMessage } from '@tevm/utils'
 *
 * const signature = await signMessage({
 *   privateKey: '0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1',
 *   message: 'Hello world'
 * })
 * ```
 */
export async function signMessage({ privateKey, message }) {
	// Use native implementation via nativePrivateKeyToAccount
	const { nativePrivateKeyToAccount } = await import('./nativePrivateKeyToAccount.js')
	const account = nativePrivateKeyToAccount(privateKey)
	const signature = await account.signMessage({ message })

	// Convert signature format (65 bytes: r + s + v)
	// signature is a hex string like '0x' + r (64 chars) + s (64 chars) + v (2 chars)
	const v = Number.parseInt(signature.slice(130, 132), 16)
	const yParity = /** @type {0 | 1} */ (v - 27) // Convert v to yParity (0/1)

	return {
		r: BigInt(signature.slice(0, 66)), // First 32 bytes as hex
		s: BigInt(`0x${signature.slice(66, 130)}`), // Next 32 bytes as hex
		v, // Already 27/28
		yParity,
	}
}

// ===========================================
// EIP-712 Typed Data Functions (using voltaire)
// ===========================================

/**
 * Convert message values to voltaire-compatible types recursively
 * @param {any} value - The value to convert
 * @param {string} type - The EIP-712 type
 * @param {Record<string, Array<{name: string, type: string}>>} types - Type definitions
 * @returns {any} The converted value
 */
function convertMessageValue(value, type, types) {
	// Handle arrays
	if (type.endsWith('[]')) {
		const baseType = type.slice(0, -2)
		return /** @type {any[]} */ (value).map((v) => convertMessageValue(v, baseType, types))
	}

	// Handle fixed-size arrays like bytes32[2]
	const arrayMatch = type.match(/^(.+)\[(\d+)\]$/)
	if (arrayMatch) {
		const baseType = /** @type {string} */ (arrayMatch[1])
		return /** @type {any[]} */ (value).map((v) => convertMessageValue(v, baseType, types))
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
			return toBytes(/** @type {import('./abitype.js').Hex} */ (value))
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
 * @typedef {Object} TypedDataDomain
 * @property {string} [name] - The user-friendly name of the signing domain
 * @property {string} [version] - The current major version of the signing domain
 * @property {bigint | number} [chainId] - The chain ID
 * @property {import('./abitype.js').Address} [verifyingContract] - The address of the contract that will verify the signature
 * @property {import('./abitype.js').Hex} [salt] - A disambiguating salt for the protocol
 */

/**
 * @typedef {Object} TypedDataParameter
 * @property {string} name - The name of the parameter
 * @property {string} type - The type of the parameter
 */

/**
 * @typedef {{ [typeName: string]: readonly TypedDataParameter[] }} TypedDataTypes
 */

/**
 * @typedef {Object} TypedData
 * @property {TypedDataDomain} domain - The domain separator
 * @property {{ [key: string]: TypedDataParameter[] }} types - The type definitions
 * @property {string} primaryType - The primary type being signed
 * @property {{ [key: string]: any }} message - The message to sign
 */

/**
 * Hash typed data according to EIP-712 specification
 * Uses native implementation with @tevm/voltaire
 * @param {TypedData} typedData - The typed data to hash
 * @returns {import('./abitype.js').Hex} The hash of the typed data
 * @example
 * ```js
 * import { hashTypedData } from '@tevm/utils'
 *
 * const hash = hashTypedData({
 *   domain: {
 *     name: 'MyApp',
 *     version: '1',
 *     chainId: 1n,
 *     verifyingContract: '0x...'
 *   },
 *   types: {
 *     Person: [
 *       { name: 'name', type: 'string' },
 *       { name: 'wallet', type: 'address' }
 *     ]
 *   },
 *   primaryType: 'Person',
 *   message: { name: 'Alice', wallet: '0x...' }
 * })
 * ```
 */
export function hashTypedData(typedData) {
	// Convert domain to voltaire-compatible format
	// Only include properties that are defined to avoid exactOptionalPropertyTypes issues
	/** @type {import('@tevm/voltaire/EIP712').Domain} */
	const voltaireDomain = {}
	if (typedData.domain.name !== undefined) voltaireDomain.name = typedData.domain.name
	if (typedData.domain.version !== undefined) voltaireDomain.version = typedData.domain.version
	if (typedData.domain.chainId !== undefined) voltaireDomain.chainId = BigInt(typedData.domain.chainId)
	if (typedData.domain.verifyingContract !== undefined) voltaireDomain.verifyingContract = VoltaireAddress.from(typedData.domain.verifyingContract)
	if (typedData.domain.salt !== undefined) voltaireDomain.salt = VoltaireHash.from(toBytes(typedData.domain.salt))

	// Filter out the EIP712Domain type since voltaire handles it internally
	const filteredTypes = /** @type {Record<string, Array<{name: string, type: string}>>} */ ({})
	for (const [typeName, typeProperties] of Object.entries(typedData.types)) {
		if (typeName !== 'EIP712Domain') {
			filteredTypes[typeName] = /** @type {Array<{name: string, type: string}>} */ (typeProperties)
		}
	}

	// Convert message values to voltaire-compatible types
	const convertedMessage = convertMessageValue(typedData.message, typedData.primaryType, filteredTypes)

	/** @type {Parameters<typeof EIP712.hashTypedData>[0]} */
	const voltaireTypedData = {
		domain: voltaireDomain,
		types: filteredTypes,
		primaryType: typedData.primaryType,
		message: convertedMessage,
	}

	const hashBytes = EIP712.hashTypedData(voltaireTypedData)
	return toHex(hashBytes)
}

/**
 * Sign typed data according to EIP-712 specification
 * Uses native implementation with @tevm/voltaire
 * @param {Object} params - The parameters
 * @param {import('./abitype.js').Hex} params.privateKey - The private key
 * @param {TypedData} params.typedData - The typed data to sign
 * @returns {Signature} The signature
 * @example
 * ```js
 * import { signTypedData } from '@tevm/utils'
 *
 * const signature = signTypedData({
 *   privateKey: '0x...',
 *   typedData: {
 *     domain: { name: 'MyApp', version: '1', chainId: 1n },
 *     types: { Person: [{ name: 'name', type: 'string' }] },
 *     primaryType: 'Person',
 *     message: { name: 'Alice' }
 *   }
 * })
 * ```
 */
export function signTypedData({ privateKey, typedData }) {
	// Convert domain to voltaire-compatible format
	// Only include properties that are defined to avoid exactOptionalPropertyTypes issues
	/** @type {import('@tevm/voltaire/EIP712').Domain} */
	const voltaireDomain = {}
	if (typedData.domain.name !== undefined) voltaireDomain.name = typedData.domain.name
	if (typedData.domain.version !== undefined) voltaireDomain.version = typedData.domain.version
	if (typedData.domain.chainId !== undefined) voltaireDomain.chainId = BigInt(typedData.domain.chainId)
	if (typedData.domain.verifyingContract !== undefined) voltaireDomain.verifyingContract = VoltaireAddress.from(typedData.domain.verifyingContract)
	if (typedData.domain.salt !== undefined) voltaireDomain.salt = VoltaireHash.from(toBytes(typedData.domain.salt))

	// Filter out the EIP712Domain type since voltaire handles it internally
	const filteredTypes = /** @type {Record<string, Array<{name: string, type: string}>>} */ ({})
	for (const [typeName, typeProperties] of Object.entries(typedData.types)) {
		if (typeName !== 'EIP712Domain') {
			filteredTypes[typeName] = /** @type {Array<{name: string, type: string}>} */ (typeProperties)
		}
	}

	// Convert message values to voltaire-compatible types
	const convertedMessage = convertMessageValue(typedData.message, typedData.primaryType, filteredTypes)

	/** @type {Parameters<typeof EIP712.signTypedData>[0]} */
	const voltaireTypedData = {
		domain: voltaireDomain,
		types: filteredTypes,
		primaryType: typedData.primaryType,
		message: convertedMessage,
	}

	// Convert private key to bytes
	const privateKeyBytes = toBytes(privateKey)
	const sig = EIP712.signTypedData(voltaireTypedData, privateKeyBytes)

	// Convert to our signature format
	const r = BigInt(toHex(sig.r))
	const s = BigInt(toHex(sig.s))
	const v = sig.v
	const yParity = /** @type {0 | 1} */ (v - 27)

	return { r, s, v, yParity }
}

/**
 * Verify typed data signature according to EIP-712 specification
 * Uses native implementation with @tevm/voltaire
 * @param {Object} params - The parameters
 * @param {import('./abitype.js').Address} params.address - The expected signer address
 * @param {TypedData} params.typedData - The typed data that was signed
 * @param {Signature} params.signature - The signature to verify
 * @returns {boolean} Whether the signature is valid
 * @example
 * ```js
 * import { verifyTypedData } from '@tevm/utils'
 *
 * const isValid = verifyTypedData({
 *   address: '0x...',
 *   typedData: {
 *     domain: { name: 'MyApp', version: '1', chainId: 1n },
 *     types: { Person: [{ name: 'name', type: 'string' }] },
 *     primaryType: 'Person',
 *     message: { name: 'Alice' }
 *   },
 *   signature: { r: 0x..., s: 0x..., v: 27 }
 * })
 * ```
 */
export function verifyTypedData({ address, typedData, signature }) {
	try {
		// Hash the typed data
		const hash = hashTypedData(typedData)

		// Recover the address from the signature using our existing recoverAddress
		const recoveredAddress = recoverAddress({ hash, signature })

		return recoveredAddress.toLowerCase() === address.toLowerCase()
	} catch {
		return false
	}
}
