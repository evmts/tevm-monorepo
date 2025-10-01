import { ecrecover } from './ethereumjs.js'
import { getAddress, keccak256, toBytes, toHex } from './viem.js'

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
	// Import viem's signMessage function directly
	const { signMessage: viemSignMessage } = await import('viem/accounts')
	const signature = await viemSignMessage({ privateKey, message })

	// Convert viem signature format to our format
	// The last byte in viem signature is already the v value (27/28)
	const v = Number.parseInt(signature.slice(130, 132), 16)
	const yParity = /** @type {0 | 1} */ (v - 27) // Convert v to yParity (0/1)

	return {
		r: BigInt(signature.slice(0, 66)), // First 32 bytes as hex
		s: BigInt(`0x${signature.slice(66, 130)}`), // Next 32 bytes as hex
		v, // Already 27/28
		yParity,
	}
}
