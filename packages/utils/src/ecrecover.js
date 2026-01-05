import { recoverPublicKeyFromHash } from '@tevm/voltaire/Secp256k1'
import { Hash } from '@tevm/voltaire/Hash'
import { setLengthLeft } from './setLengthLeft.js'

const BIGINT_0 = 0n
const BIGINT_1 = 1n
const BIGINT_2 = 2n
const BIGINT_27 = 27n

/**
 * Calculates signature recovery parameter from v value
 * @param {bigint} v - The v value from the signature
 * @param {bigint} [chainId] - Optional chain ID for EIP-155 signatures
 * @returns {bigint} The recovery parameter (0 or 1)
 */
function calculateSigRecovery(v, chainId) {
	if (v === BIGINT_0 || v === BIGINT_1) return v
	if (chainId === undefined) {
		return v - BIGINT_27
	}
	return v - (chainId * BIGINT_2 + BigInt(35))
}

/**
 * Validates that the recovery parameter is valid (0 or 1)
 * @param {bigint} recovery - The recovery parameter
 * @returns {boolean} Whether the recovery parameter is valid
 */
function isValidSigRecovery(recovery) {
	return recovery === BIGINT_0 || recovery === BIGINT_1
}

/**
 * ECDSA public key recovery from signature.
 * NOTE: Accepts `v === 0 | v === 1` for EIP1559 transactions
 *
 * @param {Uint8Array} msgHash - The hash of the message
 * @param {bigint} v - The v value of the signature (recovery id)
 * @param {Uint8Array} r - The r value of the signature
 * @param {Uint8Array} s - The s value of the signature
 * @param {bigint} [chainId] - Optional chain ID for EIP-155 signatures
 * @returns {Uint8Array} The recovered public key (64 bytes, uncompressed without prefix)
 * @throws {Error} If the signature is invalid
 * @example
 * ```js
 * import { ecrecover } from '@tevm/utils'
 *
 * const publicKey = ecrecover(
 *   msgHash,
 *   27n,
 *   rBytes,
 *   sBytes
 * )
 * ```
 */
export const ecrecover = function (msgHash, v, r, s, chainId) {
	const recovery = calculateSigRecovery(v, chainId)
	if (!isValidSigRecovery(recovery)) {
		throw new Error('Invalid signature v value')
	}

	// Use voltaire's recoverPublicKeyFromHash for cleaner implementation
	// The function expects r and s as 32-byte Uint8Arrays
	const rPadded = setLengthLeft(r, 32)
	const sPadded = setLengthLeft(s, 32)

	// Convert recovery to v format expected by voltaire (0, 1, 27, or 28)
	// voltaire handles both formats internally
	const vNum = Number(recovery)

	// Convert msgHash to voltaire's Hash type for proper type compatibility
	const hashTyped = Hash.from(msgHash)

	return recoverPublicKeyFromHash(
		{ r: rPadded, s: sPadded, v: vNum },
		hashTyped
	)
}
