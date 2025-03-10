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
			new InternalRpcError({ message: 'Internal error occurred' }),
			new InvalidInputRpcError({ message: 'Invalid input provided' }),
			new InvalidParamsRpcError({ message: 'Invalid parameters' }),
			new InvalidRequestRpcError({ message: 'Invalid request' }),
			new JsonRpcVersionUnsupportedError({ message: 'JSON-RPC version not supported' }),
			new LimitExceededRpcError({ message: 'Limit exceeded' }),
			new MethodNotFoundRpcError({ message: 'Method not found' }),
			new MethodNotSupportedRpcError({ message: 'Method not supported' }),
			new ParseRpcError({ message: 'Parse error' }),
			new ProviderDisconnectedError('Provider disconnected'),
			new ResourceNotFoundRpcError({ message: 'Resource not found' }),
			new ResourceUnavailableRpcError({ message: 'Resource unavailable' }),
			new UnknownRpcError({ message: 'Unknown error' }),
			new UnsupportedProviderMethodError({ method: 'eth_unsupportedMethod' }),
			new UserRejectedRequestError({ message: 'User rejected request' }),
			new TimeoutError('Request timed out'),
		]

		// Test each error instance with a snapshot
		rpcErrors.forEach((error) => {
			expect(error).toMatchSnapshot(error.constructor.name)
		})
	})
})
