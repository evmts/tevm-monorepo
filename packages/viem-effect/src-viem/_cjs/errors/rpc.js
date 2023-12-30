'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.UnknownRpcError =
	exports.SwitchChainError =
	exports.ChainDisconnectedError =
	exports.ProviderDisconnectedError =
	exports.UnsupportedProviderMethodError =
	exports.UnauthorizedProviderError =
	exports.UserRejectedRequestError =
	exports.JsonRpcVersionUnsupportedError =
	exports.LimitExceededRpcError =
	exports.MethodNotSupportedRpcError =
	exports.TransactionRejectedRpcError =
	exports.ResourceUnavailableRpcError =
	exports.ResourceNotFoundRpcError =
	exports.InvalidInputRpcError =
	exports.InternalRpcError =
	exports.InvalidParamsRpcError =
	exports.MethodNotFoundRpcError =
	exports.InvalidRequestRpcError =
	exports.ParseRpcError =
	exports.ProviderRpcError =
	exports.RpcError =
		void 0
const base_js_1 = require('./base.js')
const request_js_1 = require('./request.js')
const unknownErrorCode = -1
class RpcError extends base_js_1.BaseError {
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
			cause instanceof request_js_1.RpcRequestError
				? cause.code
				: code ?? unknownErrorCode
	}
}
exports.RpcError = RpcError
class ProviderRpcError extends RpcError {
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
exports.ProviderRpcError = ProviderRpcError
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
exports.ParseRpcError = ParseRpcError
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
exports.InvalidRequestRpcError = InvalidRequestRpcError
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
exports.MethodNotFoundRpcError = MethodNotFoundRpcError
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
exports.InvalidParamsRpcError = InvalidParamsRpcError
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
exports.InternalRpcError = InternalRpcError
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
exports.InvalidInputRpcError = InvalidInputRpcError
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
exports.ResourceNotFoundRpcError = ResourceNotFoundRpcError
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
exports.ResourceUnavailableRpcError = ResourceUnavailableRpcError
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
exports.TransactionRejectedRpcError = TransactionRejectedRpcError
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
exports.MethodNotSupportedRpcError = MethodNotSupportedRpcError
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
exports.LimitExceededRpcError = LimitExceededRpcError
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
exports.JsonRpcVersionUnsupportedError = JsonRpcVersionUnsupportedError
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
exports.UserRejectedRequestError = UserRejectedRequestError
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
exports.UnauthorizedProviderError = UnauthorizedProviderError
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
exports.UnsupportedProviderMethodError = UnsupportedProviderMethodError
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
exports.ProviderDisconnectedError = ProviderDisconnectedError
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
exports.ChainDisconnectedError = ChainDisconnectedError
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
exports.SwitchChainError = SwitchChainError
class UnknownRpcError extends RpcError {
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
exports.UnknownRpcError = UnknownRpcError
//# sourceMappingURL=rpc.js.map
