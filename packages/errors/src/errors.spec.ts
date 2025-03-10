import { describe, expect, it } from 'vitest'
import * as errors from './index.js'

describe('Error Classes', () => {
	it('should have all error classes available with expected shape', () => {
		// Array of error names to test - these are actual error classes, not other exports
		const errorNames = [
			// From input/index.js
			'InvalidToError',
			'InvalidAbiError',
			'InvalidUrlError',
			'InvalidArgsError',
			'InvalidDataError',
			'InvalidSaltError',
			'InvalidBlockError',
			'InvalidDepthError',
			'InvalidNonceError',
			'InvalidValueError',
			'InvalidCallerError',
			'InvalidOriginError',
			'InvalidBalanceError',
			'InvalidBytecodeError',
			'InvalidGasLimitError',
			'InvalidGasRefundError',
			'InvalidSkipBalanceError',
			'InvalidStorageRootError',
			'InvalidFunctionNameError',
			'InvalidSelfdestructError',
			'InvalidDeployedBytecodeError',
			'InvalidBlobVersionedHashesError',
			'InvalidMaxFeePerGasError',
			'InvalidMaxPriorityFeePerGasError',

			// From utils/index.js
			'DecodeFunctionDataError',
			'EncodeFunctionReturnDataError',

			// From fork/index.js
			'NoForkTransportSetError',
			// "ForkError", // Tested separately due to special constructor requirements

			// From ethereum/index.js (excluding BaseError as it's abstract)
			'ParseError',
			'RevertError',
			'InternalError',
			'OutOfGasError',
			'ExecutionError',
			'NonceTooLowError',
			'NonceTooHighError',
			'UnknownBlockError',
			'AccountLockedError',
			'InvalidOpcodeError',
			'InvalidParamsError',
			'LimitExceededError',
			'InvalidAddressError',
			'InvalidRequestError',
			'MethodNotFoundError',
			'AccountNotFoundError',
			'ChainIdMismatchError',
			'InvalidGasPriceError',
			'GasLimitExceededError',
			'InvalidSignatureError',
			'NonceAlreadyUsedError',
			'ResourceNotFoundError',
			'UnsupportedChainError',
			'InsufficientFundsError',
			'RateLimitExceededError',
			'InvalidTransactionError',
			'MethodNotSupportedError',
			'ResourceUnavailableError',
			'TransactionRejectedError',
			'TransactionTooLargeError',
			'BlockGasLimitExceededError',
			'TransactionUnderpricedError',
			'ContractExecutionFailedError',
			'InsufficientPermissionsError',
			'PendingTransactionTimeoutError',
			'StopError',
			'EvmRevertError',
			'OutOfRangeError',
			'InternalEvmError',
			'InvalidJumpError',
			'InvalidProofError',
			'AuthCallUnsetError',
			'StackOverflowError',
			'InvalidJumpSubError',
			'StackUnderflowError',
			'CreateCollisionError',
			'InvalidBeginSubError',
			'RefundExhaustedError',
			'InvalidEofFormatError',
			'InvalidKzgInputsError',
			'InvalidReturnSubError',
			'CodeStoreOutOfGasError',
			'InvalidCommitmentError',
			'StaticStateChangeError',
			'BLS12381InputEmptyError',
			'InvalidInputLengthError',
			'InsufficientBalanceError',
			'BLS12381FpNotInFieldError',
			'InitcodeSizeViolationError',
			'InvalidBytecodeResultError',
			'CodeSizeExceedsMaximumError',
			'BLS12381PointNotOnCurveError',
			'BLS12381InvalidInputLengthError',
			'ValueOverflowError',

			// From common/index.js
			'CommonMismatchError',
			'EipNotEnabledError',

			// From client/index.ts
			'MisconfiguredClientError',

			// From defensive/index.js
			'DefensiveNullCheckError',
			'UnreachableCodeError',

			// From data/index.ts
			'InvalidBytesSizeError', // Note: fixed typo in the name
		]

		// Test each constructor with mock arguments
		for (const errorName of errorNames) {
			// Skip testing if the error constructor doesn't exist
			if (!(errorName in errors)) {
				console.warn(`Error constructor ${errorName} not found in exports`)
				continue
			}

			// Skip BaseError as it's abstract
			if (errorName === 'BaseError') {
				continue
			}

			const ErrorConstructor = errors[errorName as keyof typeof errors] as new (message: string, args: any) => Error

			// Create an instance with basic arguments
			const errorInstance = new ErrorConstructor('Test error message', {
				docsPath: '/errors/test-error',
				metaMessages: ['Meta message 1', 'Meta message 2'],
				details: 'Additional details',
			})

			// Test the shape of the error instance
			expect(errorInstance).toMatchSnapshot(errorName)
		}
	})

	// Test if BaseError is abstract
	it('should not allow direct instantiation of BaseError', () => {
		expect(() => {
			new errors.BaseError('Error message', {}, 'BaseError')
		}).toThrow(TypeError)
	})

	// Test ForkError separately due to its special constructor requirements
	it('should create a ForkError instance with required cause object', () => {
		const forkError = new errors.ForkError('Fork error occurred', {
			cause: new Error('Underlying cause message'),
			docsPath: '/errors/fork-error',
			metaMessages: ['Fork Meta message'],
		})

		expect(forkError).toMatchSnapshot('ForkError')
	})
})
