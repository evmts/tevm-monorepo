import { p256 } from '@noble/curves/nist.js'
import { createAddress } from '@tevm/address'
import { toBytes } from '@tevm/utils'

/**
 * RIP-7212 p256verify precompile implementation
 * @see https://github.com/ethereum/RIPs/blob/master/RIPS/rip-7212.md
 */

/**
 * The gas cost for the p256verify precompile (RIP-7212)
 * This is a fixed cost regardless of success or failure
 */
export const P256_VERIFY_GAS_COST = 3450n

/**
 * The address of the p256verify precompile (RIP-7212)
 */
export const P256_VERIFY_ADDRESS = createAddress('0x0000000000000000000000000000000000000100')

/**
 * Creates the p256verify precompile as specified in RIP-7212
 * Verifies ECDSA signatures on the secp256r1 (P-256) curve
 *
 * @returns The p256verify precompile object
 */
export const p256VerifyPrecompile = () => {
	return {
		address: P256_VERIFY_ADDRESS,
		function: (input: { data: Uint8Array }) => {
			// Always consume the fixed gas amount
			const executionGasUsed = P256_VERIFY_GAS_COST

			// Input validation: must be exactly 160 bytes
			if (input.data.length !== 160) {
				return {
					returnValue: toBytes(0, { size: 32 }),
					executionGasUsed,
				}
			}

			try {
				// Parse the 160-byte input according to RIP-7212:
				// - r: bytes 0-32
				// - s: bytes 32-64
				// - x: bytes 64-96
				// - y: bytes 96-128
				// - msgHash: bytes 128-160
				const r = input.data.slice(0, 32)
				const s = input.data.slice(32, 64)
				const x = input.data.slice(64, 96)
				const y = input.data.slice(96, 128)
				const msgHash = input.data.slice(128, 160)

				// Construct the signature as a 64-byte compact (r, s) format
				const signature = new Uint8Array(64)
				signature.set(r, 0)
				signature.set(s, 32)

				// Construct the public key as a 65-byte uncompressed key (0x04 || x || y)
				const publicKey = new Uint8Array(65)
				publicKey[0] = 0x04
				publicKey.set(x, 1)
				publicKey.set(y, 33)

				// Verify the signature using the noble/curves p256 implementation
				// Note: We use prehash: false because the input is already a hash (msgHash)
				const isValid = p256.verify(signature, msgHash, publicKey, { prehash: false })

				if (isValid) {
					// Return 32-byte padded 1 for valid signature
					return {
						returnValue: toBytes(1, { size: 32 }),
						executionGasUsed,
					}
				}
				// Return 32-byte padded 0 for invalid signature
				return {
					returnValue: toBytes(0, { size: 32 }),
					executionGasUsed,
				}
			} catch (_error) {
				// Any exception during verification results in failure
				return {
					returnValue: toBytes(0, { size: 32 }),
					executionGasUsed,
				}
			}
		},
	}
}
