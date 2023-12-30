import { BaseError } from './base.js'
import { RpcRequestError } from './request.js'
const unknownErrorCode = -1
/**
 * Error subclass implementing JSON RPC 2.0 errors and Ethereum RPC errors per EIP-1474.
 *
 * - EIP https://eips.ethereum.org/EIPS/eip-1474
 */
export class RpcError extends BaseError {
	constructor(cause, { code, docsPath, metaMessages, shortMessage }) {
		super(shortMessage, {
			cause,
			docsPath,
			metaMessages: metaMessages || cause?.metaMessages,
		})
		Object.defineProperty(this, 'name', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: 'RpcError',
		})
		Object.defineProperty(this, 'code', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0,
		})
		this.name = cause.name
		this.code =
			cause instanceof RpcRequestError ? cause.code : code ?? unknownErrorCode
	}
}
/**
 * Error subclass implementing Ethereum Provider errors per EIP-1193.
 *
 * - EIP https://eips.ethereum.org/EIPS/eip-1193
 */
export class ProviderRpcError extends RpcError {
	constructor(cause, options) {
		super(cause, options)
		Object.defineProperty(this, 'name', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: 'ProviderRpcError',
		})
		Object.defineProperty(this, 'data', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0,
		})
		this.data = options.data
	}
}
/**
 * Subclass for a "Parse error" EIP-1474 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1474#error-codes
 */
class ParseRpcError extends RpcError {
	constructor(cause) {
		super(cause, {
			code: ParseRpcError.code,
			shortMessage:
				'Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text.',
		})
		Object.defineProperty(this, 'name', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: 'ParseRpcError',
		})
	}
}
Object.defineProperty(ParseRpcError, 'code', {
	enumerable: true,
	configurable: true,
	writable: true,
	value: -32700,
})
export { ParseRpcError }
/**
 * Subclass for a "Invalid request" EIP-1474 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1474#error-codes
 */
class InvalidRequestRpcError extends RpcError {
	constructor(cause) {
		super(cause, {
			code: InvalidRequestRpcError.code,
			shortMessage: 'JSON is not a valid request object.',
		})
		Object.defineProperty(this, 'name', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: 'InvalidRequestRpcError',
		})
	}
}
Object.defineProperty(InvalidRequestRpcError, 'code', {
	enumerable: true,
	configurable: true,
	writable: true,
	value: -32600,
})
export { InvalidRequestRpcError }
/**
 * Subclass for a "Method not found" EIP-1474 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1474#error-codes
 */
class MethodNotFoundRpcError extends RpcError {
	constructor(cause) {
		super(cause, {
			code: MethodNotFoundRpcError.code,
			shortMessage: 'The method does not exist / is not available.',
		})
		Object.defineProperty(this, 'name', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: 'MethodNotFoundRpcError',
		})
	}
}
Object.defineProperty(MethodNotFoundRpcError, 'code', {
	enumerable: true,
	configurable: true,
	writable: true,
	value: -32601,
})
export { MethodNotFoundRpcError }
/**
 * Subclass for an "Invalid params" EIP-1474 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1474#error-codes
 */
class InvalidParamsRpcError extends RpcError {
	constructor(cause) {
		super(cause, {
			code: InvalidParamsRpcError.code,
			shortMessage: [
				'Invalid parameters were provided to the RPC method.',
				'Double check you have provided the correct parameters.',
			].join('\n'),
		})
		Object.defineProperty(this, 'name', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: 'InvalidParamsRpcError',
		})
	}
}
Object.defineProperty(InvalidParamsRpcError, 'code', {
	enumerable: true,
	configurable: true,
	writable: true,
	value: -32602,
})
export { InvalidParamsRpcError }
/**
 * Subclass for an "Internal error" EIP-1474 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1474#error-codes
 */
class InternalRpcError extends RpcError {
	constructor(cause) {
		super(cause, {
			code: InternalRpcError.code,
			shortMessage: 'An internal error was received.',
		})
		Object.defineProperty(this, 'name', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: 'InternalRpcError',
		})
	}
}
Object.defineProperty(InternalRpcError, 'code', {
	enumerable: true,
	configurable: true,
	writable: true,
	value: -32603,
})
export { InternalRpcError }
/**
 * Subclass for an "Invalid input" EIP-1474 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1474#error-codes
 */
class InvalidInputRpcError extends RpcError {
	constructor(cause) {
		super(cause, {
			code: InvalidInputRpcError.code,
			shortMessage: [
				'Missing or invalid parameters.',
				'Double check you have provided the correct parameters.',
			].join('\n'),
		})
		Object.defineProperty(this, 'name', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: 'InvalidInputRpcError',
		})
	}
}
Object.defineProperty(InvalidInputRpcError, 'code', {
	enumerable: true,
	configurable: true,
	writable: true,
	value: -32000,
})
export { InvalidInputRpcError }
/**
 * Subclass for a "Resource not found" EIP-1474 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1474#error-codes
 */
class ResourceNotFoundRpcError extends RpcError {
	constructor(cause) {
		super(cause, {
			code: ResourceNotFoundRpcError.code,
			shortMessage: 'Requested resource not found.',
		})
		Object.defineProperty(this, 'name', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: 'ResourceNotFoundRpcError',
		})
	}
}
Object.defineProperty(ResourceNotFoundRpcError, 'code', {
	enumerable: true,
	configurable: true,
	writable: true,
	value: -32001,
})
export { ResourceNotFoundRpcError }
/**
 * Subclass for a "Resource unavailable" EIP-1474 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1474#error-codes
 */
class ResourceUnavailableRpcError extends RpcError {
	constructor(cause) {
		super(cause, {
			code: ResourceUnavailableRpcError.code,
			shortMessage: 'Requested resource not available.',
		})
		Object.defineProperty(this, 'name', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: 'ResourceUnavailableRpcError',
		})
	}
}
Object.defineProperty(ResourceUnavailableRpcError, 'code', {
	enumerable: true,
	configurable: true,
	writable: true,
	value: -32002,
})
export { ResourceUnavailableRpcError }
/**
 * Subclass for a "Transaction rejected" EIP-1474 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1474#error-codes
 */
class TransactionRejectedRpcError extends RpcError {
	constructor(cause) {
		super(cause, {
			code: TransactionRejectedRpcError.code,
			shortMessage: 'Transaction creation failed.',
		})
		Object.defineProperty(this, 'name', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: 'TransactionRejectedRpcError',
		})
	}
}
Object.defineProperty(TransactionRejectedRpcError, 'code', {
	enumerable: true,
	configurable: true,
	writable: true,
	value: -32003,
})
export { TransactionRejectedRpcError }
/**
 * Subclass for a "Method not supported" EIP-1474 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1474#error-codes
 */
class MethodNotSupportedRpcError extends RpcError {
	constructor(cause) {
		super(cause, {
			code: MethodNotSupportedRpcError.code,
			shortMessage: 'Method is not implemented.',
		})
		Object.defineProperty(this, 'name', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: 'MethodNotSupportedRpcError',
		})
	}
}
Object.defineProperty(MethodNotSupportedRpcError, 'code', {
	enumerable: true,
	configurable: true,
	writable: true,
	value: -32004,
})
export { MethodNotSupportedRpcError }
/**
 * Subclass for a "Limit exceeded" EIP-1474 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1474#error-codes
 */
class LimitExceededRpcError extends RpcError {
	constructor(cause) {
		super(cause, {
			code: LimitExceededRpcError.code,
			shortMessage: 'Request exceeds defined limit.',
		})
		Object.defineProperty(this, 'name', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: 'LimitExceededRpcError',
		})
	}
}
Object.defineProperty(LimitExceededRpcError, 'code', {
	enumerable: true,
	configurable: true,
	writable: true,
	value: -32005,
})
export { LimitExceededRpcError }
/**
 * Subclass for a "JSON-RPC version not supported" EIP-1474 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1474#error-codes
 */
class JsonRpcVersionUnsupportedError extends RpcError {
	constructor(cause) {
		super(cause, {
			code: JsonRpcVersionUnsupportedError.code,
			shortMessage: 'Version of JSON-RPC protocol is not supported.',
		})
		Object.defineProperty(this, 'name', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: 'JsonRpcVersionUnsupportedError',
		})
	}
}
Object.defineProperty(JsonRpcVersionUnsupportedError, 'code', {
	enumerable: true,
	configurable: true,
	writable: true,
	value: -32006,
})
export { JsonRpcVersionUnsupportedError }
/**
 * Subclass for a "User Rejected Request" EIP-1193 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1193#provider-errors
 */
class UserRejectedRequestError extends ProviderRpcError {
	constructor(cause) {
		super(cause, {
			code: UserRejectedRequestError.code,
			shortMessage: 'User rejected the request.',
		})
		Object.defineProperty(this, 'name', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: 'UserRejectedRequestError',
		})
	}
}
Object.defineProperty(UserRejectedRequestError, 'code', {
	enumerable: true,
	configurable: true,
	writable: true,
	value: 4001,
})
export { UserRejectedRequestError }
/**
 * Subclass for an "Unauthorized" EIP-1193 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1193#provider-errors
 */
class UnauthorizedProviderError extends ProviderRpcError {
	constructor(cause) {
		super(cause, {
			code: UnauthorizedProviderError.code,
			shortMessage:
				'The requested method and/or account has not been authorized by the user.',
		})
		Object.defineProperty(this, 'name', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: 'UnauthorizedProviderError',
		})
	}
}
Object.defineProperty(UnauthorizedProviderError, 'code', {
	enumerable: true,
	configurable: true,
	writable: true,
	value: 4100,
})
export { UnauthorizedProviderError }
/**
 * Subclass for an "Unsupported Method" EIP-1193 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1193#provider-errors
 */
class UnsupportedProviderMethodError extends ProviderRpcError {
	constructor(cause) {
		super(cause, {
			code: UnsupportedProviderMethodError.code,
			shortMessage: 'The Provider does not support the requested method.',
		})
		Object.defineProperty(this, 'name', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: 'UnsupportedProviderMethodError',
		})
	}
}
Object.defineProperty(UnsupportedProviderMethodError, 'code', {
	enumerable: true,
	configurable: true,
	writable: true,
	value: 4200,
})
export { UnsupportedProviderMethodError }
/**
 * Subclass for an "Disconnected" EIP-1193 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1193#provider-errors
 */
class ProviderDisconnectedError extends ProviderRpcError {
	constructor(cause) {
		super(cause, {
			code: ProviderDisconnectedError.code,
			shortMessage: 'The Provider is disconnected from all chains.',
		})
		Object.defineProperty(this, 'name', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: 'ProviderDisconnectedError',
		})
	}
}
Object.defineProperty(ProviderDisconnectedError, 'code', {
	enumerable: true,
	configurable: true,
	writable: true,
	value: 4900,
})
export { ProviderDisconnectedError }
/**
 * Subclass for an "Chain Disconnected" EIP-1193 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1193#provider-errors
 */
class ChainDisconnectedError extends ProviderRpcError {
	constructor(cause) {
		super(cause, {
			code: ChainDisconnectedError.code,
			shortMessage: 'The Provider is not connected to the requested chain.',
		})
		Object.defineProperty(this, 'name', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: 'ChainDisconnectedError',
		})
	}
}
Object.defineProperty(ChainDisconnectedError, 'code', {
	enumerable: true,
	configurable: true,
	writable: true,
	value: 4901,
})
export { ChainDisconnectedError }
/**
 * Subclass for an "Switch Chain" EIP-1193 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1193#provider-errors
 */
class SwitchChainError extends ProviderRpcError {
	constructor(cause) {
		super(cause, {
			code: SwitchChainError.code,
			shortMessage: 'An error occurred when attempting to switch chain.',
		})
		Object.defineProperty(this, 'name', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: 'SwitchChainError',
		})
	}
}
Object.defineProperty(SwitchChainError, 'code', {
	enumerable: true,
	configurable: true,
	writable: true,
	value: 4902,
})
export { SwitchChainError }
/**
 * Subclass for an unknown RPC error.
 */
export class UnknownRpcError extends RpcError {
	constructor(cause) {
		super(cause, {
			shortMessage: 'An unknown RPC error occurred.',
		})
		Object.defineProperty(this, 'name', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: 'UnknownRpcError',
		})
	}
}
//# sourceMappingURL=rpc.js.map
