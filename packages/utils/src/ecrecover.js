import { secp256k1 } from '@noble/curves/secp256k1.js'
import { concatBytes } from './concatBytes.js'
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
	const signature = concatBytes(setLengthLeft(r, 32), setLengthLeft(s, 32))
	const recovery = calculateSigRecovery(v, chainId)
	if (!isValidSigRecovery(recovery)) {
		throw new Error('Invalid signature v value')
	}
	// Use noble-curves Signature.recoverPublicKey method
	// Note: The standalone secp256k1.recoverPublicKey(sig65, msgHash) gives WRONG results
	// The Signature.recoverPublicKey(msgHash) method is correct
	const sigObj = secp256k1.Signature.fromBytes(signature).addRecoveryBit(Number(recovery))
	const pubKeyPoint = sigObj.recoverPublicKey(msgHash)
	// toBytes(false) returns uncompressed public key (65 bytes with 0x04 prefix)
	// Return 64 bytes without the 0x04 prefix
	return pubKeyPoint.toBytes(false).slice(1)
}
