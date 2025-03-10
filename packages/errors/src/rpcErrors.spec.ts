import { describe, expect, it } from 'vitest'
import {
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
} from './requestErrors.js'
import { rpcErrorCodeToMessage } from './rpcErrorToMessage.js'

describe('RPC Error Classes', () => {
	it('should have a valid rpcErrorCodeToMessage mapping', () => {
		expect(rpcErrorCodeToMessage).toMatchSnapshot('rpcErrorCodeToMessage')
	})

	it('should create proper instances of RPC errors', () => {
		// Test each RPC error class with snapshot tests
		const rpcErrors = [
			new InternalRpcError(new Error('Internal error occurred')),
			new InvalidInputRpcError(new Error('Invalid input provided')),
			new InvalidParamsRpcError(new Error('Invalid parameters')),
			new InvalidRequestRpcError(new Error('Invalid request')),
			new JsonRpcVersionUnsupportedError(new Error('JSON-RPC version not supported')),
			new LimitExceededRpcError(new Error('Limit exceeded')),
			new MethodNotFoundRpcError(new Error('Method not found')),
			new MethodNotSupportedRpcError(new Error('Method not supported')),
			new ParseRpcError(new Error('Parse error')),
			// ProviderDisconnectedError expects a string argument
			new ProviderDisconnectedError('Provider disconnected' as any),
			new ResourceNotFoundRpcError(new Error('Resource not found')),
			new ResourceUnavailableRpcError(new Error('Resource unavailable')),
			new UnknownRpcError(new Error('Unknown error')),
			// UnsupportedProviderMethodError accepts an object with method property
			new UnsupportedProviderMethodError({ method: 'eth_unsupportedMethod' } as any),
			new UserRejectedRequestError(new Error('User rejected request')),
			// TimeoutError expects request parameters
			new TimeoutError({ url: 'https://example.com', body: {} } as any),
		]

		// Test each error instance with a snapshot
		rpcErrors.forEach((error) => {
			expect(error).toMatchSnapshot(error.constructor.name)
		})
	})
})
