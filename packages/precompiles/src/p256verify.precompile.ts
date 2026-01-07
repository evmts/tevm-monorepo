import { verify as p256Verify } from '@tevm/voltaire/P256'
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

				// Construct the public key as a 64-byte uncompressed key (x || y)
				// voltaire's P256.verify expects 64 bytes without the 0x04 prefix
				const publicKey = new Uint8Array(64)
				publicKey.set(x, 0)
				publicKey.set(y, 32)

				// Verify the signature using voltaire's P256 implementation
				// voltaire's verify takes { r, s } object and 64-byte public key
				// Use type assertions for the branded types
				const isValid = p256Verify({ r, s } as any, msgHash as any, publicKey)

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
