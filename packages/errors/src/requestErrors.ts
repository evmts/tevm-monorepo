/**
 * @module requestErrors
 * @description This module exports various RPC-related errors from the 'viem' library.
 */

export {
	InternalRpcError,
	InvalidInputRpcError,
	InvalidParamsRpcError,
	InvalidRequestRpcError,
	JsonRpcVersionUnsupportedError,
	LimitExceededRpcError,
	MethodNotFoundRpcError,
	MethodNotSupportedRpcError,
	ParseRpcError,
	ProviderDisconnectedError,
	ResourceNotFoundRpcError,
	ResourceUnavailableRpcError,
	TimeoutError,
	UnknownRpcError,
	UnsupportedProviderMethodError,
	UserRejectedRequestError,
} from 'viem'

/**
 * Represents the possible error codes for RPC errors.
 */
export type RpcErrorCode =
	| -1 // Unknown error
	// Standard JSON-RPC 2.0 errors
	| -32700 // Parse error
	| -32600 // Invalid request
	| -32601 // Method not found
	| -32602 // Invalid params
	| -32603 // Internal error
	// EIP-1474 and common convention errors
	| -32000 // Invalid input
	| -32001 // Resource not found
	| -32002 // Resource unavailable
	| -32003 // Transaction rejected
	| -32004 // Method not supported
	| -32005 // Limit exceeded
	| -32015 // VM execution error
	| -32020 // Account locked
	| 3 // Execution reverted
	// Tevm-specific implementation errors
	| -32006 // Block gas limit exceeded
	| -32007 // Unsupported chain
	| -32008 // Nonce already used
	| -32009 // Insufficient permissions
	| -32011 // Transaction too large
	| -32012 // Invalid gas price
	| -32013 // Invalid address
	| -32014 // Transaction underpriced
	// Other provider-specific errors (for compatibility)
	| 4001 // User rejected request
	| 4100 // Unauthorized
	| 4200 // Method not supported
	| 4900 // Provider disconnected
	| 4901 // Provider disconnected from chain
	| -32010 // QuickNode: Transaction cost exceeds current gas limit
	| -32042 // MetaMask: Method not found
	| -32500 // Alchemy/EIP-4337: Invalid user operation
	| -32501 // Alchemy/EIP-4337: User operation validation error
	| -32521 // Alchemy/EIP-4337: Invalid signature
	| -32604 // BlockVision: Record not found
	| -32605 // BlockVision: Rate Limit
	| -32606 // BlockVision: Illegal Ip
	| -32607 // BlockVision: Call Limit
	| -32612 // QuickNode: Tracing/debugging blocked
	| -32613 // QuickNode: Tracing/debugging blocked
	| -32616 // QuickNode: WebSocket response size exceeded
	| -33000 // Infura: Payment required
	| -33100 // Infura: Forbidden
	| -33200 // Infura: Too Many Requests
	| -33300 // Infura: Too Many Requests
	| -33400 // Infura: Too Many Requests
