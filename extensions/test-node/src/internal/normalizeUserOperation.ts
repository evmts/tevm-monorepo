import { type RpcUserOperation } from 'viem'
import { normalizeHex } from './normalizeHex.js'

/**
 * Normalizes an ERC-4337 user operation to a consistent array of lowercase hex strings
 * for cache key generation. Supports both v0.6 and v0.7+ user operation formats,
 * including EIP-7702 authorization fields.
 *
 * @param userOp - The user operation to normalize (supports v0.6 and v0.7+ formats)
 * @returns An array of normalized hex strings representing the user operation fields
 *
 * @example
 * ```typescript
 * import { normalizeUserOperation } from '@tevm/test-node'
 *
 * // v0.7 format
 * const cacheKey = normalizeUserOperation({
 *   sender: '0xABC...',
 *   nonce: '0x1',
 *   callData: '0xDEF...',
 *   callGasLimit: '0x5000',
 *   verificationGasLimit: '0x10000',
 *   preVerificationGas: '0x1000',
 *   maxFeePerGas: '0x100',
 *   maxPriorityFeePerGas: '0x10',
 *   signature: '0x...'
 * })
 * ```
 */
export const normalizeUserOperation = (userOp: RpcUserOperation) => [
	// Authorization handling (SignedAuthorization)
	...(userOp.authorization
		? [
				...(userOp.authorization.address ? [normalizeHex(userOp.authorization.address)] : []),
				...(userOp.authorization.chainId ? [normalizeHex(userOp.authorization.chainId)] : []),
				...(userOp.authorization.nonce ? [normalizeHex(userOp.authorization.nonce)] : []),
				...(userOp.authorization.r ? [normalizeHex(userOp.authorization.r)] : []),
				...(userOp.authorization.s ? [normalizeHex(userOp.authorization.s)] : []),
				...(userOp.authorization.v ? [userOp.authorization.v] : []),
				...(userOp.authorization.yParity ? [normalizeHex(userOp.authorization.yParity)] : []),
			]
		: []),
	// EIP-7702 authorization handling (RpcAuthorization)
	...(userOp.eip7702Auth
		? [
				...(userOp.eip7702Auth.address ? [normalizeHex(userOp.eip7702Auth.address)] : []),
				...(userOp.eip7702Auth.chainId ? [normalizeHex(userOp.eip7702Auth.chainId)] : []),
				...(userOp.eip7702Auth.nonce ? [normalizeHex(userOp.eip7702Auth.nonce)] : []),
				...(userOp.eip7702Auth.r ? [normalizeHex(userOp.eip7702Auth.r)] : []),
				...(userOp.eip7702Auth.s ? [normalizeHex(userOp.eip7702Auth.s)] : []),
				...(userOp.eip7702Auth.yParity ? [normalizeHex(userOp.eip7702Auth.yParity)] : []),
			]
		: []),
	// Required fields (common across all versions)
	...(userOp.callData ? [normalizeHex(userOp.callData)] : []),
	...(userOp.callGasLimit ? [normalizeHex(userOp.callGasLimit)] : []),
	...(userOp.maxFeePerGas ? [normalizeHex(userOp.maxFeePerGas)] : []),
	...(userOp.maxPriorityFeePerGas ? [normalizeHex(userOp.maxPriorityFeePerGas)] : []),
	...(userOp.nonce ? [normalizeHex(userOp.nonce)] : []),
	...(userOp.preVerificationGas ? [normalizeHex(userOp.preVerificationGas)] : []),
	...(userOp.sender ? [normalizeHex(userOp.sender)] : []),
	...(userOp.signature ? [normalizeHex(userOp.signature)] : []),
	...(userOp.verificationGasLimit ? [normalizeHex(userOp.verificationGasLimit)] : []),
	// Version 0.6 specific fields
	...(userOp.initCode ? [normalizeHex(userOp.initCode)] : []),
	...(userOp.paymasterAndData ? [normalizeHex(userOp.paymasterAndData)] : []),
	// Version 0.7+ specific fields
	...(userOp.factory ? [normalizeHex(userOp.factory)] : []),
	...(userOp.factoryData ? [normalizeHex(userOp.factoryData)] : []),
	...(userOp.paymaster ? [normalizeHex(userOp.paymaster)] : []),
	...(userOp.paymasterData ? [normalizeHex(userOp.paymasterData)] : []),
	...(userOp.paymasterPostOpGasLimit ? [normalizeHex(userOp.paymasterPostOpGasLimit)] : []),
	...(userOp.paymasterVerificationGasLimit ? [normalizeHex(userOp.paymasterVerificationGasLimit)] : []),
]
