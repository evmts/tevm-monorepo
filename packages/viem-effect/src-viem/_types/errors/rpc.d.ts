import type { Prettify } from '../types/utils.js'
import { BaseError } from './base.js'
export type RpcErrorCode =
	| -1
	| -32700
	| -32600
	| -32601
	| -32602
	| -32603
	| -32000
	| -32001
	| -32002
	| -32003
	| -32004
	| -32005
	| -32006
	| -32042
type RpcErrorOptions<TCode extends number = RpcErrorCode> = {
	code?: TCode | (number & {})
	docsPath?: string
	metaMessages?: string[]
	shortMessage: string
}
/**
 * Error subclass implementing JSON RPC 2.0 errors and Ethereum RPC errors per EIP-1474.
 *
 * - EIP https://eips.ethereum.org/EIPS/eip-1474
 */
export declare class RpcError<
	TCode extends number = RpcErrorCode,
> extends BaseError {
	name: string
	code: TCode | (number & {})
	constructor(
		cause: Error,
		{ code, docsPath, metaMessages, shortMessage }: RpcErrorOptions<TCode>,
	)
}
export type ProviderRpcErrorCode = 4001 | 4100 | 4200 | 4900 | 4901 | 4902
/**
 * Error subclass implementing Ethereum Provider errors per EIP-1193.
 *
 * - EIP https://eips.ethereum.org/EIPS/eip-1193
 */
export declare class ProviderRpcError<
	T = undefined,
> extends RpcError<ProviderRpcErrorCode> {
	name: string
	data?: T
	constructor(
		cause: Error,
		options: Prettify<
			RpcErrorOptions<ProviderRpcErrorCode> & {
				data?: T
			}
		>,
	)
}
/**
 * Subclass for a "Parse error" EIP-1474 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1474#error-codes
 */
export declare class ParseRpcError extends RpcError {
	name: string
	static code: -32700
	constructor(cause: Error)
}
/**
 * Subclass for a "Invalid request" EIP-1474 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1474#error-codes
 */
export declare class InvalidRequestRpcError extends RpcError {
	name: string
	static code: -32600
	constructor(cause: Error)
}
/**
 * Subclass for a "Method not found" EIP-1474 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1474#error-codes
 */
export declare class MethodNotFoundRpcError extends RpcError {
	name: string
	static code: -32601
	constructor(cause: Error)
}
/**
 * Subclass for an "Invalid params" EIP-1474 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1474#error-codes
 */
export declare class InvalidParamsRpcError extends RpcError {
	name: string
	static code: -32602
	constructor(cause: Error)
}
/**
 * Subclass for an "Internal error" EIP-1474 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1474#error-codes
 */
export declare class InternalRpcError extends RpcError {
	name: string
	static code: -32603
	constructor(cause: Error)
}
/**
 * Subclass for an "Invalid input" EIP-1474 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1474#error-codes
 */
export declare class InvalidInputRpcError extends RpcError {
	name: string
	static code: -32000
	constructor(cause: Error)
}
/**
 * Subclass for a "Resource not found" EIP-1474 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1474#error-codes
 */
export declare class ResourceNotFoundRpcError extends RpcError {
	name: string
	static code: -32001
	constructor(cause: Error)
}
/**
 * Subclass for a "Resource unavailable" EIP-1474 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1474#error-codes
 */
export declare class ResourceUnavailableRpcError extends RpcError {
	name: string
	static code: -32002
	constructor(cause: Error)
}
/**
 * Subclass for a "Transaction rejected" EIP-1474 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1474#error-codes
 */
export declare class TransactionRejectedRpcError extends RpcError {
	name: string
	static code: -32003
	constructor(cause: Error)
}
/**
 * Subclass for a "Method not supported" EIP-1474 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1474#error-codes
 */
export declare class MethodNotSupportedRpcError extends RpcError {
	name: string
	static code: -32004
	constructor(cause: Error)
}
/**
 * Subclass for a "Limit exceeded" EIP-1474 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1474#error-codes
 */
export declare class LimitExceededRpcError extends RpcError {
	name: string
	static code: -32005
	constructor(cause: Error)
}
/**
 * Subclass for a "JSON-RPC version not supported" EIP-1474 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1474#error-codes
 */
export declare class JsonRpcVersionUnsupportedError extends RpcError {
	name: string
	static code: -32006
	constructor(cause: Error)
}
/**
 * Subclass for a "User Rejected Request" EIP-1193 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1193#provider-errors
 */
export declare class UserRejectedRequestError extends ProviderRpcError {
	name: string
	static code: 4001
	constructor(cause: Error)
}
/**
 * Subclass for an "Unauthorized" EIP-1193 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1193#provider-errors
 */
export declare class UnauthorizedProviderError extends ProviderRpcError {
	name: string
	static code: 4100
	constructor(cause: Error)
}
/**
 * Subclass for an "Unsupported Method" EIP-1193 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1193#provider-errors
 */
export declare class UnsupportedProviderMethodError extends ProviderRpcError {
	name: string
	static code: 4200
	constructor(cause: Error)
}
/**
 * Subclass for an "Disconnected" EIP-1193 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1193#provider-errors
 */
export declare class ProviderDisconnectedError extends ProviderRpcError {
	name: string
	static code: 4900
	constructor(cause: Error)
}
/**
 * Subclass for an "Chain Disconnected" EIP-1193 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1193#provider-errors
 */
export declare class ChainDisconnectedError extends ProviderRpcError {
	name: string
	static code: 4901
	constructor(cause: Error)
}
/**
 * Subclass for an "Switch Chain" EIP-1193 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1193#provider-errors
 */
export declare class SwitchChainError extends ProviderRpcError {
	name: string
	static code: 4902
	constructor(cause: Error)
}
/**
 * Subclass for an unknown RPC error.
 */
export declare class UnknownRpcError extends RpcError {
	name: string
	constructor(cause: Error)
}
export {}
//# sourceMappingURL=rpc.d.ts.map
