import { BaseError } from './base.js'
/**
 * geth:    https://github.com/ethereum/go-ethereum/blob/master/core/error.go
 *          https://github.com/ethereum/go-ethereum/blob/master/core/types/transaction.go#L34-L41
 *
 * erigon:  https://github.com/ledgerwatch/erigon/blob/master/core/error.go
 *          https://github.com/ledgerwatch/erigon/blob/master/core/types/transaction.go#L41-L46
 *
 * anvil:   https://github.com/foundry-rs/foundry/blob/master/anvil/src/eth/error.rs#L108
 */
export declare class ExecutionRevertedError extends BaseError {
	static code: number
	static nodeMessage: RegExp
	name: string
	constructor({
		cause,
		message,
	}?: {
		cause?: BaseError
		message?: string
	})
}
export declare class FeeCapTooHighError extends BaseError {
	static nodeMessage: RegExp
	name: string
	constructor({
		cause,
		maxFeePerGas,
	}?: {
		cause?: BaseError
		maxFeePerGas?: bigint
	})
}
export declare class FeeCapTooLowError extends BaseError {
	static nodeMessage: RegExp
	name: string
	constructor({
		cause,
		maxFeePerGas,
	}?: {
		cause?: BaseError
		maxFeePerGas?: bigint
	})
}
export declare class NonceTooHighError extends BaseError {
	static nodeMessage: RegExp
	name: string
	constructor({
		cause,
		nonce,
	}?: {
		cause?: BaseError
		nonce?: number
	})
}
export declare class NonceTooLowError extends BaseError {
	static nodeMessage: RegExp
	name: string
	constructor({
		cause,
		nonce,
	}?: {
		cause?: BaseError
		nonce?: number
	})
}
export declare class NonceMaxValueError extends BaseError {
	static nodeMessage: RegExp
	name: string
	constructor({
		cause,
		nonce,
	}?: {
		cause?: BaseError
		nonce?: number
	})
}
export declare class InsufficientFundsError extends BaseError {
	static nodeMessage: RegExp
	name: string
	constructor({
		cause,
	}?: {
		cause?: BaseError
	})
}
export declare class IntrinsicGasTooHighError extends BaseError {
	static nodeMessage: RegExp
	name: string
	constructor({
		cause,
		gas,
	}?: {
		cause?: BaseError
		gas?: bigint
	})
}
export declare class IntrinsicGasTooLowError extends BaseError {
	static nodeMessage: RegExp
	name: string
	constructor({
		cause,
		gas,
	}?: {
		cause?: BaseError
		gas?: bigint
	})
}
export declare class TransactionTypeNotSupportedError extends BaseError {
	static nodeMessage: RegExp
	name: string
	constructor({
		cause,
	}: {
		cause?: BaseError
	})
}
export declare class TipAboveFeeCapError extends BaseError {
	static nodeMessage: RegExp
	name: string
	constructor({
		cause,
		maxPriorityFeePerGas,
		maxFeePerGas,
	}?: {
		cause?: BaseError
		maxPriorityFeePerGas?: bigint
		maxFeePerGas?: bigint
	})
}
export declare class UnknownNodeError extends BaseError {
	name: string
	constructor({
		cause,
	}: {
		cause?: BaseError
	})
}
//# sourceMappingURL=node.d.ts.map
