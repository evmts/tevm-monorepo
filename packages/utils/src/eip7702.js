// @ts-nocheck - Using @ts-nocheck because voltaire types are not available yet
/**
 * @module eip7702
 * Native EIP-7702 (Set Code for EOAs) authorization utilities for tevm.
 * Replaces @ethereumjs/util EIP-7702 functions.
 *
 * EIP-7702 allows EOAs to delegate code execution to smart contracts by signing
 * authorization tuples that can be included in special transactions.
 *
 * @see https://eips.ethereum.org/EIPS/eip-7702
 */

import { hash as keccak256 } from '@tevm/voltaire/Keccak256'
import { secp256k1 } from '@noble/curves/secp256k1.js'
import { ecrecover } from './ecrecover.js'
import { Address } from './address.js'
import { concatBytes } from './concatBytes.js'
import { setLengthLeft } from './setLengthLeft.js'
import { toRlp } from './viem.js'
import { bytesToHex, hexToBytes, bytesToBigInt } from './viem.js'

/**
 * The magic byte used for EIP-7702 authorization signing.
 * This is prepended to the RLP-encoded authorization data before signing.
 * @type {Uint8Array}
 */
export const EOA_CODE_7702_AUTHORITY_SIGNING_MAGIC = hexToBytes('0x05')

/**
 * @typedef {Object} EOACode7702AuthorizationJSON
 * @property {import('./hex-types.js').Hex} chainId - The chain ID as hex
 * @property {import('./hex-types.js').Hex} address - The contract address to delegate to
 * @property {import('./hex-types.js').Hex} nonce - The authorization nonce as hex
 * @property {import('./hex-types.js').Hex} yParity - The signature y-parity as hex
 * @property {import('./hex-types.js').Hex} r - The signature r value as hex
 * @property {import('./hex-types.js').Hex} s - The signature s value as hex
 */

/**
 * @typedef {Object} UnsignedEOACode7702AuthorizationJSON
 * @property {import('./hex-types.js').Hex} chainId - The chain ID as hex
 * @property {import('./hex-types.js').Hex} address - The contract address to delegate to
 * @property {import('./hex-types.js').Hex} nonce - The authorization nonce as hex
 */

/**
 * @typedef {[Uint8Array, Uint8Array, Uint8Array, Uint8Array, Uint8Array, Uint8Array]} EOACode7702AuthorizationListBytesItem
 * A signed authorization tuple: [chainId, address, nonce, yParity, r, s]
 */

/**
 * @typedef {[Uint8Array, Uint8Array, Uint8Array]} UnsignedEOACode7702AuthorizationListBytesItem
 * An unsigned authorization tuple: [chainId, address, nonce]
 */

/**
 * Removes leading zero bytes from a Uint8Array.
 * @param {Uint8Array} bytes - The bytes to unpad
 * @returns {Uint8Array} The unpadded bytes
 */
function unpadBytes(bytes) {
	let i = 0
	while (i < bytes.length - 1 && bytes[i] === 0) {
		i++
	}
	return i === 0 ? bytes : bytes.subarray(i)
}

/**
 * Convert bigint to unpadded bytes (minimal encoding).
 * @param {bigint} value - The bigint to convert
 * @returns {Uint8Array} The bytes
 */
function bigIntToUnpaddedBytes(value) {
	if (value === 0n) return new Uint8Array(0)
	let hex = value.toString(16)
	if (hex.length % 2) hex = '0' + hex
	const bytes = new Uint8Array(hex.length / 2)
	for (let i = 0; i < bytes.length; i++) {
		bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
	}
	return bytes
}

/**
 * Converts an authorization list bytes tuple to JSON format.
 *
 * @param {EOACode7702AuthorizationListBytesItem} authorizationList - The bytes tuple [chainId, address, nonce, yParity, r, s]
 * @returns {EOACode7702AuthorizationJSON} The authorization in JSON format
 * @example
 * ```javascript
 * import { eoaCode7702AuthorizationListBytesItemToJSON } from '@tevm/utils'
 *
 * const bytesAuth = [chainIdBytes, addressBytes, nonceBytes, yParityBytes, rBytes, sBytes]
 * const jsonAuth = eoaCode7702AuthorizationListBytesItemToJSON(bytesAuth)
 * console.log(jsonAuth.address) // '0x...'
 * ```
 */
export function eoaCode7702AuthorizationListBytesItemToJSON(authorizationList) {
	const [chainId, address, nonce, yParity, r, s] = authorizationList
	return {
		chainId: bytesToHex(chainId),
		address: bytesToHex(address),
		nonce: bytesToHex(nonce),
		yParity: bytesToHex(yParity),
		r: bytesToHex(r),
		s: bytesToHex(s),
	}
}

/**
 * Converts an authorization list from JSON to bytes format.
 *
 * @param {EOACode7702AuthorizationJSON} authorizationList - The JSON authorization object
 * @returns {EOACode7702AuthorizationListBytesItem} The authorization as bytes tuple [chainId, address, nonce, yParity, r, s]
 * @throws {Error} If any required field is missing
 * @example
 * ```javascript
 * import { eoaCode7702AuthorizationListJSONItemToBytes } from '@tevm/utils'
 *
 * const jsonAuth = {
 *   chainId: '0x1',
 *   address: '0x1234567890123456789012345678901234567890',
 *   nonce: '0x0',
 *   yParity: '0x0',
 *   r: '0x...',
 *   s: '0x...'
 * }
 * const bytesAuth = eoaCode7702AuthorizationListJSONItemToBytes(jsonAuth)
 * ```
 */
export function eoaCode7702AuthorizationListJSONItemToBytes(authorizationList) {
	const requiredFields = ['chainId', 'address', 'nonce', 'yParity', 'r', 's']
	// Validate all required fields are present
	for (const field of requiredFields) {
		if (authorizationList[field] === undefined) {
			throw new Error(`EIP-7702 authorization list invalid: ${field} is not defined`)
		}
	}
	return [
		hexToBytes(authorizationList.chainId),
		hexToBytes(authorizationList.address),
		hexToBytes(authorizationList.nonce),
		hexToBytes(authorizationList.yParity),
		hexToBytes(authorizationList.r),
		hexToBytes(authorizationList.s),
	]
}

/**
 * Converts unsigned authorization JSON to bytes format.
 * @param {UnsignedEOACode7702AuthorizationJSON} input - The unsigned authorization JSON
 * @returns {UnsignedEOACode7702AuthorizationListBytesItem} The authorization as bytes tuple [chainId, address, nonce]
 */
function unsignedAuthorizationListToBytes(input) {
	const { chainId: chainIdHex, address: addressHex, nonce: nonceHex } = input
	const chainId = hexToBytes(chainIdHex)
	const address = setLengthLeft(hexToBytes(addressHex), 20)
	const nonce = hexToBytes(nonceHex)
	return [chainId, address, nonce]
}

/**
 * Returns the bytes (magic + RLP-encoded) to sign for EIP-7702 authorization.
 *
 * @param {UnsignedEOACode7702AuthorizationListBytesItem | UnsignedEOACode7702AuthorizationJSON} input - Either the bytes tuple [chainId, address, nonce] or the JSON object
 * @returns {Uint8Array} The message to sign (0x05 || RLP([chainId, address, nonce]))
 * @throws {Error} If the address length is not 20 bytes
 * @example
 * ```javascript
 * import { eoaCode7702AuthorizationMessageToSign } from '@tevm/utils'
 *
 * // Using JSON format
 * const message = eoaCode7702AuthorizationMessageToSign({
 *   chainId: '0x1',
 *   address: '0x1234567890123456789012345678901234567890',
 *   nonce: '0x0'
 * })
 *
 * // Using bytes format
 * const messageFromBytes = eoaCode7702AuthorizationMessageToSign([chainIdBytes, addressBytes, nonceBytes])
 * ```
 */
export function eoaCode7702AuthorizationMessageToSign(input) {
	if (Array.isArray(input)) {
		// The address is validated, the chainId and nonce will be `unpadBytes` such that these are valid
		const [chainId, address, nonce] = input
		if (address.length !== 20) {
			throw new Error('Cannot sign authority: address length should be 20 bytes')
		}
		return concatBytes(EOA_CODE_7702_AUTHORITY_SIGNING_MAGIC, toRlp([unpadBytes(chainId), address, unpadBytes(nonce)], 'bytes'))
	}
	else {
		const [chainId, address, nonce] = unsignedAuthorizationListToBytes(input)
		return concatBytes(EOA_CODE_7702_AUTHORITY_SIGNING_MAGIC, toRlp([chainId, address, nonce], 'bytes'))
	}
}

/**
 * Returns the keccak256 hash of the RLP-encoded message to sign.
 *
 * @param {UnsignedEOACode7702AuthorizationListBytesItem | UnsignedEOACode7702AuthorizationJSON} input - Either the bytes tuple or JSON object
 * @returns {Uint8Array} The 32-byte hash to sign
 * @example
 * ```javascript
 * import { eoaCode7702AuthorizationHashedMessageToSign } from '@tevm/utils'
 *
 * const hash = eoaCode7702AuthorizationHashedMessageToSign({
 *   chainId: '0x1',
 *   address: '0x1234567890123456789012345678901234567890',
 *   nonce: '0x0'
 * })
 * // hash is 32 bytes, ready for signing
 * ```
 */
export function eoaCode7702AuthorizationHashedMessageToSign(input) {
	return keccak256(eoaCode7702AuthorizationMessageToSign(input))
}

/**
 * @callback EcSignFunction
 * @param {Uint8Array} msgHash - The message hash to sign
 * @param {Uint8Array} privateKey - The private key
 * @returns {Uint8Array | { recovery: number, r: bigint, s: bigint }} The signature (64 bytes or object with recovery)
 */

/**
 * Signs an authorization list item and returns it in bytes format.
 * To get the JSON format, use `eoaCode7702AuthorizationListBytesItemToJSON` on the result.
 *
 * @param {UnsignedEOACode7702AuthorizationListBytesItem | UnsignedEOACode7702AuthorizationJSON} input - Either the bytes tuple [chainId, address, nonce] or JSON object
 * @param {Uint8Array} privateKey - The 32-byte private key to sign with
 * @param {EcSignFunction} [ecSign] - Optional custom signing function (defaults to secp256k1.sign)
 * @returns {EOACode7702AuthorizationListBytesItem} The signed authorization as bytes tuple [chainId, address, nonce, yParity, r, s]
 * @example
 * ```javascript
 * import { eoaCode7702SignAuthorization, eoaCode7702AuthorizationListBytesItemToJSON } from '@tevm/utils'
 *
 * const privateKey = new Uint8Array(32) // Your 32-byte private key
 * const signed = eoaCode7702SignAuthorization({
 *   chainId: '0x1',
 *   address: '0x1234567890123456789012345678901234567890',
 *   nonce: '0x0'
 * }, privateKey)
 *
 * // Convert to JSON if needed
 * const signedJSON = eoaCode7702AuthorizationListBytesItemToJSON(signed)
 * ```
 */
export function eoaCode7702SignAuthorization(input, privateKey, ecSign) {
	const msgHash = eoaCode7702AuthorizationHashedMessageToSign(input)
	const [chainId, address, nonce] = Array.isArray(input)
		? input
		: unsignedAuthorizationListToBytes(input)

	// Get expected public key from private key (compressed, 33 bytes)
	const expectedPubKey = secp256k1.getPublicKey(privateKey, true)
	const expectedPubKeyHex = bytesToHex(expectedPubKey).slice(2)

	// Sign the message
	const secp256k1Sign = ecSign ?? secp256k1.sign
	const signedResult = secp256k1Sign(msgHash, privateKey)

	// Handle both old-style object result and new-style Uint8Array result
	if (signedResult instanceof Uint8Array) {
		// noble-curves v2: check if it's 64-byte (compact) or 65-byte (recovered)
		if (signedResult.length === 65) {
			// Already has recovery byte at position 0
			const recoveryValue = signedResult[0]
			const sigObj = secp256k1.Signature.fromBytes(signedResult.slice(1))
			return [
				chainId,
				address,
				nonce,
				bigIntToUnpaddedBytes(BigInt(recoveryValue)),
				bigIntToUnpaddedBytes(sigObj.r),
				bigIntToUnpaddedBytes(sigObj.s),
			]
		}

		// 64-byte compact signature - need to find recovery value
		const sigObj = secp256k1.Signature.fromBytes(signedResult)

		// For noble-curves v2, we need to sign with { format: 'recovered' } to get recovery
		// But since we already have a 64-byte sig, try both recovery values
		// Use secp256k1.recoverPublicKey(sig65, msgHash) for noble-curves generated signatures
		let recoveryValue = 0
		for (let rec = 0; rec <= 1; rec++) {
			try {
				// Build 65-byte signature with recovery byte at start
				const sig65 = new Uint8Array(65)
				sig65[0] = rec
				sig65.set(signedResult, 1)
				const recoveredCompressed = secp256k1.recoverPublicKey(sig65, msgHash)
				const recoveredHex = bytesToHex(recoveredCompressed).slice(2)
				if (recoveredHex === expectedPubKeyHex) {
					recoveryValue = rec
					break
				}
			} catch {
				// Try next recovery value
			}
		}

		return [
			chainId,
			address,
			nonce,
			bigIntToUnpaddedBytes(BigInt(recoveryValue)),
			bigIntToUnpaddedBytes(sigObj.r),
			bigIntToUnpaddedBytes(sigObj.s),
		]
	} else {
		// Old-style object with { recovery, r, s }
		return [
			chainId,
			address,
			nonce,
			bigIntToUnpaddedBytes(BigInt(signedResult.recovery)),
			bigIntToUnpaddedBytes(signedResult.r),
			bigIntToUnpaddedBytes(signedResult.s),
		]
	}
}

/**
 * Converts a public key to an Ethereum address.
 * @param {Uint8Array} pubKey - The 64-byte uncompressed public key (without 0x04 prefix)
 * @returns {Uint8Array} The 20-byte address
 */
function publicToAddress(pubKey) {
	if (pubKey.length !== 64) {
		throw new Error('Expected pubKey to be of length 64')
	}
	// Only take the lower 160bits of the hash
	return keccak256(pubKey).subarray(-20)
}

/**
 * Recovers the authority (signer) address from a signed EIP-7702 authorization.
 *
 * @param {EOACode7702AuthorizationListBytesItem | EOACode7702AuthorizationJSON} input - The signed authorization (either bytes or JSON format)
 * @returns {Address} The recovered authority Address
 * @example
 * ```javascript
 * import { eoaCode7702RecoverAuthority } from '@tevm/utils'
 *
 * const signedAuth = {
 *   chainId: '0x1',
 *   address: '0x1234567890123456789012345678901234567890',
 *   nonce: '0x0',
 *   yParity: '0x0',
 *   r: '0x...',
 *   s: '0x...'
 * }
 * const authority = eoaCode7702RecoverAuthority(signedAuth)
 * console.log(authority.toString()) // '0x...' - the address that signed this authorization
 * ```
 */
export function eoaCode7702RecoverAuthority(input) {
	const inputBytes = Array.isArray(input)
		? input
		: eoaCode7702AuthorizationListJSONItemToBytes(input)
	const [chainId, address, nonce, yParity, r, s] = inputBytes
	const msgHash = eoaCode7702AuthorizationHashedMessageToSign([chainId, address, nonce])

	// Build 65-byte signature for secp256k1.recoverPublicKey
	// This is needed because signatures from noble-curves sign() require this format
	const recoveryByte = yParity.length === 0 ? 0 : yParity[0]
	const sig65 = new Uint8Array(65)
	sig65[0] = recoveryByte
	sig65.set(setLengthLeft(r, 32), 1)
	sig65.set(setLengthLeft(s, 32), 33)

	const recoveredCompressed = secp256k1.recoverPublicKey(sig65, msgHash)
	const point = secp256k1.Point.fromBytes(recoveredCompressed)
	const pubKey = point.toBytes(false).slice(1) // Uncompressed without 0x04 prefix

	return new Address(publicToAddress(pubKey))
}

/**
 * Type guard to check if an authorization list is in bytes format (array of tuples).
 *
 * @param {EOACode7702AuthorizationListBytesItem[] | EOACode7702AuthorizationJSON[]} input - The authorization list to check
 * @returns {input is EOACode7702AuthorizationListBytesItem[]} True if the input is in bytes format
 * @example
 * ```javascript
 * import { isEOACode7702AuthorizationListBytes } from '@tevm/utils'
 *
 * if (isEOACode7702AuthorizationListBytes(authList)) {
 *   // authList is array of bytes tuples
 * } else {
 *   // authList is array of JSON objects
 * }
 * ```
 */
export function isEOACode7702AuthorizationListBytes(input) {
	if (input.length === 0) {
		return true
	}
	const firstItem = input[0]
	if (Array.isArray(firstItem)) {
		return true
	}
	return false
}

/**
 * Type guard to check if an authorization list is in JSON format (array of objects).
 *
 * @param {EOACode7702AuthorizationListBytesItem[] | EOACode7702AuthorizationJSON[]} input - The authorization list to check
 * @returns {input is EOACode7702AuthorizationJSON[]} True if the input is in JSON format
 * @example
 * ```javascript
 * import { isEOACode7702AuthorizationList } from '@tevm/utils'
 *
 * if (isEOACode7702AuthorizationList(authList)) {
 *   // authList is array of JSON objects
 * } else {
 *   // authList is array of bytes tuples
 * }
 * ```
 */
export function isEOACode7702AuthorizationList(input) {
	return !isEOACode7702AuthorizationListBytes(input)
}
