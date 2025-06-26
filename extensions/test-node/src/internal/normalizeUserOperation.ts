import { type RpcUserOperation } from 'viem'
import { normalizeHex } from './normalizeHex.js'

export const normalizeUserOperation = (userOp: RpcUserOperation) => [
	// Authorization handling (SignedAuthorization)
	...(userOp.authorization ? [
		...(userOp.authorization.address ? [normalizeHex(userOp.authorization.address)] : []),
		...(userOp.authorization.chainId ? [normalizeHex(userOp.authorization.chainId)] : []),
		...(userOp.authorization.nonce ? [normalizeHex(userOp.authorization.nonce)] : []),
		...(userOp.authorization.r ? [normalizeHex(userOp.authorization.r)] : []),
		...(userOp.authorization.s ? [normalizeHex(userOp.authorization.s)] : []),
		...(userOp.authorization.v ? [userOp.authorization.v] : []),
		...(userOp.authorization.yParity ? [normalizeHex(userOp.authorization.yParity)] : []),
	] : []),
	// EIP-7702 authorization handling (RpcAuthorization)
	...(userOp.eip7702Auth ? [
		...(userOp.eip7702Auth.address ? [normalizeHex(userOp.eip7702Auth.address)] : []),
		...(userOp.eip7702Auth.chainId ? [normalizeHex(userOp.eip7702Auth.chainId)] : []),
		...(userOp.eip7702Auth.nonce ? [normalizeHex(userOp.eip7702Auth.nonce)] : []),
		...(userOp.eip7702Auth.r ? [normalizeHex(userOp.eip7702Auth.r)] : []),
		...(userOp.eip7702Auth.s ? [normalizeHex(userOp.eip7702Auth.s)] : []),
		...(userOp.eip7702Auth.yParity ? [normalizeHex(userOp.eip7702Auth.yParity)] : []),
	] : []),
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