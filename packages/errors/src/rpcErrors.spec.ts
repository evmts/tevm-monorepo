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
import {
	AccountLockedError,
	AccountNotFoundError,
	BlockGasLimitExceededError,
	ChainIdMismatchError,
	ContractExecutionFailedError,
	ExecutionError,
	GasLimitExceededError,
	InsufficientFundsError,
	InsufficientPermissionsError,
	InternalError,
	InvalidAddressError,
	InvalidGasPriceError,
	InvalidParamsError,
	InvalidRequestError,
	InvalidSignatureError,
	InvalidTransactionError,
	LimitExceededError,
	MethodNotFoundError,
	MethodNotSupportedError,
	NonceAlreadyUsedError,
	NonceTooHighError,
	NonceTooLowError,
	ParseError,
	PendingTransactionTimeoutError,
	RateLimitExceededError,
	ResourceNotFoundError,
	ResourceUnavailableError,
	RevertError,
	TransactionRejectedError,
	TransactionTooLargeError,
	TransactionUnderpricedError,
	UnknownBlockError,
	UnsupportedChainError,
} from './ethereum/index.js'

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

	it('should create proper instances of Tevm RPC errors', () => {
		const tevmErrors = [
			new AccountLockedError('Account locked'),
			new AccountNotFoundError('Account not found'),
			new BlockGasLimitExceededError('Block gas limit exceeded'),
			new ChainIdMismatchError('Chain ID mismatch'),
			new ContractExecutionFailedError('Contract execution failed'),
			new ExecutionError('Execution error'),
			new GasLimitExceededError('Gas limit exceeded'),
			new InsufficientFundsError('Insufficient funds'),
			new InsufficientPermissionsError('Insufficient permissions'),
			new InternalError('Internal error'),
			new InvalidAddressError('Invalid address'),
			new InvalidGasPriceError('Invalid gas price'),
			new InvalidParamsError('Invalid params'),
			new InvalidRequestError('Invalid request'),
			new InvalidSignatureError('Invalid signature'),
			new InvalidTransactionError('Invalid transaction'),
			new LimitExceededError('Limit exceeded'),
			new MethodNotFoundError('Method not found'),
			new MethodNotSupportedError('Method not supported'),
			new NonceAlreadyUsedError('Nonce already used'),
			new NonceTooHighError('Nonce too high'),
			new NonceTooLowError('Nonce too low'),
			new ParseError('Parse error'),
			new PendingTransactionTimeoutError('Pending transaction timeout'),
			new RateLimitExceededError('Rate limit exceeded'),
			new ResourceNotFoundError('Resource not found'),
			new ResourceUnavailableError('Resource unavailable'),
			new RevertError('Revert error'),
			new TransactionRejectedError('Transaction rejected'),
			new TransactionTooLargeError('Transaction too large'),
			new TransactionUnderpricedError('Transaction underpriced'),
			new UnknownBlockError('Unknown block'),
			new UnsupportedChainError('Unsupported chain'),
		]

		tevmErrors.forEach((error) => {
			expect(error).toMatchSnapshot(error.constructor.name)
		})
	})
})
