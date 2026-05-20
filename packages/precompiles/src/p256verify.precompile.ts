import { p256 } from '@noble/curves/nist.js'
import { EvmError } from '@evmts/zevm/evm'
import { createAddress } from '@tevm/address'
import { bytesToBigInt, toBytes } from '@tevm/utils'

/**
 * RIP-7212 p256verify precompile implementation
 * @see https://github.com/ethereum/RIPs/blob/master/RIPS/rip-7212.md
 */

/**
 * The gas cost for the p256verify precompile (RIP-7212)
 * This is a fixed cost regardless of success or failure
 */
export const P256_VERIFY_GAS_COST = 6900n

const P256_ORDER = BigInt('0xffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551')

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
		function: (input: { data: Uint8Array; gasLimit: bigint }) => {
			// Always consume the fixed gas amount
			const executionGasUsed = P256_VERIFY_GAS_COST

			if (input.gasLimit < P256_VERIFY_GAS_COST) {
				return {
					returnValue: new Uint8Array(),
					executionGasUsed: input.gasLimit,
					exceptionError: new EvmError('out of gas' as any),
				}
			}

			// Input validation: must be exactly 160 bytes
			if (input.data.length !== 160) {
				return {
					returnValue: new Uint8Array(),
					executionGasUsed,
				}
			}

			try {
				// Parse the 160-byte input according to RIP-7212:
				// - msgHash: bytes 0-32
				// - r: bytes 32-64
				// - s: bytes 64-96
				// - x: bytes 96-128
				// - y: bytes 128-160
				const msgHash = input.data.slice(0, 32)
				const r = input.data.slice(32, 64)
				const s = input.data.slice(64, 96)
				const x = input.data.slice(96, 128)
				const y = input.data.slice(128, 160)
				const rValue = bytesToBigInt(r)
				const sValue = bytesToBigInt(s)

				if (rValue <= 0n || rValue >= P256_ORDER || sValue <= 0n || sValue >= P256_ORDER) {
					return {
						returnValue: new Uint8Array(),
						executionGasUsed,
					}
				}

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
				const isValid = p256.verify(signature, msgHash, publicKey, { prehash: false, lowS: false })

				if (isValid) {
					// Return 32-byte padded 1 for valid signature
					return {
						returnValue: toBytes(1, { size: 32 }),
						executionGasUsed,
					}
				}
				// Return empty bytes for invalid signature
				return {
					returnValue: new Uint8Array(),
					executionGasUsed,
				}
			} catch (_error) {
				// Any exception during verification results in failure
				return {
					returnValue: new Uint8Array(),
					executionGasUsed,
				}
			}
		},
	}
}
