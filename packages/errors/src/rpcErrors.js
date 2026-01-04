/**
 * @module rpcErrors
 * @description Native RPC error classes that replace viem's RPC errors.
 * These follow JSON-RPC 2.0 error codes and EIP-1193/EIP-1474 specifications.
 */

import { BaseError } from './ethereum/BaseError.js'

/**
 * Base class for RPC errors.
 * @extends {BaseError}
 */
export class RpcError extends BaseError {
	/**
	 * @param {Error} cause - The cause of the error
	 * @param {Object} options - Error options
	 * @param {number} options.code - RPC error code
	 * @param {string} options.shortMessage - Short description of the error
	 * @param {string} options.name - Error name
	 */
	constructor(cause, { code, shortMessage, name }) {
		super(shortMessage, { cause, details: cause?.message }, name, code)
	}
}

/**
 * An internal error was received (code: -32603).
 * @extends {RpcError}
 * @example
 * ```javascript
 * import { InternalRpcError } from '@tevm/errors'
 * throw new InternalRpcError(new Error('Internal server error'))
 * ```
 */
export class InternalRpcError extends RpcError {
	/**
	 * @param {Error} cause - The cause of the error
	 */
	constructor(cause) {
		super(cause, {
			code: -32603,
			shortMessage: 'An internal error was received.',
			name: 'InternalRpcError',
		})
	}
}

/**
 * Missing or invalid parameters (code: -32000).
 * @extends {RpcError}
 * @example
 * ```javascript
 * import { InvalidInputRpcError } from '@tevm/errors'
 * throw new InvalidInputRpcError(new Error('Invalid input'))
 * ```
 */
export class InvalidInputRpcError extends RpcError {
	/**
	 * @param {Error} cause - The cause of the error
	 */
	constructor(cause) {
		super(cause, {
			code: -32000,
			shortMessage: 'Missing or invalid parameters.\nDouble check you have provided the correct parameters.',
			name: 'InvalidInputRpcError',
		})
	}
}

/**
 * Invalid parameters were provided to the RPC method (code: -32602).
 * @extends {RpcError}
 * @example
 * ```javascript
 * import { InvalidParamsRpcError } from '@tevm/errors'
 * throw new InvalidParamsRpcError(new Error('Invalid params'))
 * ```
 */
export class InvalidParamsRpcError extends RpcError {
	/**
	 * @param {Error} cause - The cause of the error
	 */
	constructor(cause) {
		super(cause, {
			code: -32602,
			shortMessage: 'Invalid parameters were provided to the RPC method.\nDouble check you have provided the correct parameters.',
			name: 'InvalidParamsRpcError',
		})
	}
}

/**
 * JSON is not a valid request object (code: -32600).
 * @extends {RpcError}
 * @example
 * ```javascript
 * import { InvalidRequestRpcError } from '@tevm/errors'
 * throw new InvalidRequestRpcError(new Error('Invalid request'))
 * ```
 */
export class InvalidRequestRpcError extends RpcError {
	/**
	 * @param {Error} cause - The cause of the error
	 */
	constructor(cause) {
		super(cause, {
			code: -32600,
			shortMessage: 'JSON is not a valid request object.',
			name: 'InvalidRequestRpcError',
		})
	}
}

/**
 * Version of JSON-RPC protocol is not supported (code: -32006).
 * @extends {RpcError}
 * @example
 * ```javascript
 * import { JsonRpcVersionUnsupportedError } from '@tevm/errors'
 * throw new JsonRpcVersionUnsupportedError(new Error('Unsupported version'))
 * ```
 */
export class JsonRpcVersionUnsupportedError extends RpcError {
	/**
	 * @param {Error} cause - The cause of the error
	 */
	constructor(cause) {
		super(cause, {
			code: -32006,
			shortMessage: 'Version of JSON-RPC protocol is not supported.',
			name: 'JsonRpcVersionUnsupportedError',
		})
	}
}

/**
 * Request exceeds defined limit (code: -32005).
 * @extends {RpcError}
 * @example
 * ```javascript
 * import { LimitExceededRpcError } from '@tevm/errors'
 * throw new LimitExceededRpcError(new Error('Limit exceeded'))
 * ```
 */
export class LimitExceededRpcError extends RpcError {
	/**
	 * @param {Error} cause - The cause of the error
	 */
	constructor(cause) {
		super(cause, {
			code: -32005,
			shortMessage: 'Request exceeds defined limit.',
			name: 'LimitExceededRpcError',
		})
	}
}

/**
 * The method does not exist / is not available (code: -32601).
 * @extends {RpcError}
 * @example
 * ```javascript
 * import { MethodNotFoundRpcError } from '@tevm/errors'
 * throw new MethodNotFoundRpcError(new Error('Method not found'))
 * ```
 */
export class MethodNotFoundRpcError extends RpcError {
	/**
	 * @param {Error} cause - The cause of the error
	 */
	constructor(cause) {
		super(cause, {
			code: -32601,
			shortMessage: 'The method does not exist / is not available.',
			name: 'MethodNotFoundRpcError',
		})
	}
}

/**
 * Method is not supported (code: -32004).
 * @extends {RpcError}
 * @example
 * ```javascript
 * import { MethodNotSupportedRpcError } from '@tevm/errors'
 * throw new MethodNotSupportedRpcError(new Error('Method not supported'))
 * ```
 */
export class MethodNotSupportedRpcError extends RpcError {
	/**
	 * @param {Error} cause - The cause of the error
	 */
	constructor(cause) {
		super(cause, {
			code: -32004,
			shortMessage: 'Method is not supported.',
			name: 'MethodNotSupportedRpcError',
		})
	}
}

/**
 * Invalid JSON was received by the server (code: -32700).
 * @extends {RpcError}
 * @example
 * ```javascript
 * import { ParseRpcError } from '@tevm/errors'
 * throw new ParseRpcError(new Error('Parse error'))
 * ```
 */
export class ParseRpcError extends RpcError {
	/**
	 * @param {Error} cause - The cause of the error
	 */
	constructor(cause) {
		super(cause, {
			code: -32700,
			shortMessage: 'Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text.',
			name: 'ParseRpcError',
		})
	}
}

/**
 * The Provider is disconnected from all chains (code: 4900).
 * @extends {RpcError}
 * @example
 * ```javascript
 * import { ProviderDisconnectedError } from '@tevm/errors'
 * throw new ProviderDisconnectedError(new Error('Disconnected'))
 * ```
 */
export class ProviderDisconnectedError extends RpcError {
	/**
	 * @param {Error} cause - The cause of the error
	 */
	constructor(cause) {
		super(cause, {
			code: 4900,
			shortMessage: 'The Provider is disconnected from all chains.',
			name: 'ProviderDisconnectedError',
		})
	}
}

/**
 * Requested resource not found (code: -32001).
 * @extends {RpcError}
 * @example
 * ```javascript
 * import { ResourceNotFoundRpcError } from '@tevm/errors'
 * throw new ResourceNotFoundRpcError(new Error('Resource not found'))
 * ```
 */
export class ResourceNotFoundRpcError extends RpcError {
	/**
	 * @param {Error} cause - The cause of the error
	 */
	constructor(cause) {
		super(cause, {
			code: -32001,
			shortMessage: 'Requested resource not found.',
			name: 'ResourceNotFoundRpcError',
		})
	}
}

/**
 * Requested resource not available (code: -32002).
 * @extends {RpcError}
 * @example
 * ```javascript
 * import { ResourceUnavailableRpcError } from '@tevm/errors'
 * throw new ResourceUnavailableRpcError(new Error('Resource unavailable'))
 * ```
 */
export class ResourceUnavailableRpcError extends RpcError {
	/**
	 * @param {Error} cause - The cause of the error
	 */
	constructor(cause) {
		super(cause, {
			code: -32002,
			shortMessage: 'Requested resource not available.',
			name: 'ResourceUnavailableRpcError',
		})
	}
}

/**
 * The request took too long to respond.
 * Note: This error doesn't have a standard code, using undefined.
 * @extends {BaseError}
 * @example
 * ```javascript
 * import { TimeoutError } from '@tevm/errors'
 * throw new TimeoutError(new Error('Request timed out'))
 * ```
 */
export class TimeoutError extends BaseError {
	/**
	 * @param {Error} cause - The cause of the error
	 */
	constructor(cause) {
		super('The request took too long to respond.', { cause, details: cause?.message }, 'TimeoutError')
	}
}

/**
 * An unknown RPC error occurred (code: -1).
 * @extends {RpcError}
 * @example
 * ```javascript
 * import { UnknownRpcError } from '@tevm/errors'
 * throw new UnknownRpcError(new Error('Unknown error'))
 * ```
 */
export class UnknownRpcError extends RpcError {
	/**
	 * @param {Error} cause - The cause of the error
	 */
	constructor(cause) {
		super(cause, {
			code: -1,
			shortMessage: 'An unknown RPC error occurred.',
			name: 'UnknownRpcError',
		})
	}
}

/**
 * The Provider does not support the requested method (code: 4200).
 * @extends {RpcError}
 * @example
 * ```javascript
 * import { UnsupportedProviderMethodError } from '@tevm/errors'
 * throw new UnsupportedProviderMethodError(new Error('Unsupported method'))
 * ```
 */
export class UnsupportedProviderMethodError extends RpcError {
	/**
	 * @param {Error} cause - The cause of the error
	 */
	constructor(cause) {
		super(cause, {
			code: 4200,
			shortMessage: 'The Provider does not support the requested method.',
			name: 'UnsupportedProviderMethodError',
		})
	}
}

/**
 * User rejected the request (code: 4001).
 * @extends {RpcError}
 * @example
 * ```javascript
 * import { UserRejectedRequestError } from '@tevm/errors'
 * throw new UserRejectedRequestError(new Error('User rejected'))
 * ```
 */
export class UserRejectedRequestError extends RpcError {
	/**
	 * @param {Error} cause - The cause of the error
	 */
	constructor(cause) {
		super(cause, {
			code: 4001,
			shortMessage: 'User rejected the request.',
			name: 'UserRejectedRequestError',
		})
	}
}
