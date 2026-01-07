/**
 * Account Abstraction types (EIP-4337)
 *
 * This module provides types for ERC-4337 Account Abstraction,
 * reducing the need to import them from external dependencies like viem.
 *
 * @module account-abstraction-types
 */

import type { Address, Hex } from './abitype.js'

/**
 * Signed Authorization for EIP-7702
 *
 * Represents an authorization signed by an account to delegate
 * execution to another contract.
 *
 * @example
 * ```typescript
 * import type { SignedAuthorization } from '@tevm/utils'
 *
 * const auth: SignedAuthorization = {
 *   address: '0x...',
 *   chainId: '0x1',
 *   nonce: '0x0',
 *   r: '0x...',
 *   s: '0x...',
 *   v: 27,
 * }
 * ```
 */
export type SignedAuthorization = {
	/** The contract address to delegate execution to */
	address?: Address | undefined
	/** The chain ID for the authorization */
	chainId?: Hex | undefined
	/** The nonce for the authorization */
	nonce?: Hex | undefined
	/** ECDSA signature r value */
	r?: Hex | undefined
	/** ECDSA signature s value */
	s?: Hex | undefined
	/** ECDSA signature v value (legacy format) */
	v?: number | undefined
	/** ECDSA signature yParity value (EIP-2930 format) */
	yParity?: Hex | number | undefined
}

/**
 * RPC Authorization for EIP-7702
 *
 * Represents an authorization in RPC format.
 */
export type RpcAuthorization = {
	/** The contract address to delegate execution to */
	address?: Address | undefined
	/** The chain ID for the authorization */
	chainId?: Hex | undefined
	/** The nonce for the authorization */
	nonce?: Hex | undefined
	/** ECDSA signature r value */
	r?: Hex | undefined
	/** ECDSA signature s value */
	s?: Hex | undefined
	/** ECDSA signature yParity value */
	yParity?: Hex | number | undefined
}

/**
 * RPC User Operation type (EIP-4337)
 *
 * Represents a user operation in JSON-RPC format. Supports both v0.6 and v0.7+
 * entry point versions and EIP-7702 authorization extensions.
 *
 * All numeric values are represented as hex strings in RPC format.
 *
 * @example
 * ```typescript
 * import type { RpcUserOperation } from '@tevm/utils'
 *
 * // v0.7 format
 * const userOp: RpcUserOperation = {
 *   sender: '0xABC...',
 *   nonce: '0x1',
 *   callData: '0xDEF...',
 *   callGasLimit: '0x5000',
 *   verificationGasLimit: '0x10000',
 *   preVerificationGas: '0x1000',
 *   maxFeePerGas: '0x100',
 *   maxPriorityFeePerGas: '0x10',
 *   signature: '0x...',
 * }
 *
 * // v0.6 format
 * const userOpV6: RpcUserOperation = {
 *   sender: '0xABC...',
 *   nonce: '0x1',
 *   callData: '0xDEF...',
 *   callGasLimit: '0x5000',
 *   verificationGasLimit: '0x10000',
 *   preVerificationGas: '0x1000',
 *   maxFeePerGas: '0x100',
 *   maxPriorityFeePerGas: '0x10',
 *   signature: '0x...',
 *   initCode: '0x...',
 *   paymasterAndData: '0x...',
 * }
 * ```
 */
export type RpcUserOperation = {
	// === EIP-7702 Authorization Fields ===
	/** Signed authorization (SignedAuthorization format) */
	authorization?: SignedAuthorization | undefined
	/** EIP-7702 authorization (RpcAuthorization format) */
	eip7702Auth?: RpcAuthorization | undefined

	// === Common Fields (all versions) ===
	/** The data to pass to the sender during the main execution call */
	callData?: Hex | undefined
	/** The amount of gas to allocate for the main execution call */
	callGasLimit?: Hex | undefined
	/** Maximum fee per gas */
	maxFeePerGas?: Hex | undefined
	/** Maximum priority fee per gas */
	maxPriorityFeePerGas?: Hex | undefined
	/** Anti-replay parameter (nonce) */
	nonce?: Hex | undefined
	/** Extra gas to pay the Bundler */
	preVerificationGas?: Hex | undefined
	/** The account making the operation */
	sender?: Address | undefined
	/** Data passed into the account to verify authorization */
	signature?: Hex | undefined
	/** The amount of gas to allocate for the verification step */
	verificationGasLimit?: Hex | undefined

	// === Version 0.6 Specific Fields ===
	/** Account init code (v0.6 only). Only for new accounts. */
	initCode?: Hex | undefined
	/** Paymaster address with calldata (v0.6 only) */
	paymasterAndData?: Hex | undefined

	// === Version 0.7+ Specific Fields ===
	/** Account factory (v0.7+). Only for new accounts. */
	factory?: Address | undefined
	/** Data for account factory (v0.7+) */
	factoryData?: Hex | undefined
	/** Address of paymaster contract (v0.7+) */
	paymaster?: Address | undefined
	/** Data for paymaster (v0.7+) */
	paymasterData?: Hex | undefined
	/** The amount of gas to allocate for the paymaster post-operation code (v0.7+) */
	paymasterPostOpGasLimit?: Hex | undefined
	/** The amount of gas to allocate for the paymaster validation code (v0.7+) */
	paymasterVerificationGasLimit?: Hex | undefined
}
