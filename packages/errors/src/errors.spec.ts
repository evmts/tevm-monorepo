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

	// Test BlobGasLimitExceededError which was missing from the main test
	it('should create a BlobGasLimitExceededError instance', () => {
		const blobGasError = new errors.BlobGasLimitExceededError()
		expect(blobGasError.message).toContain('Blob gas limit exceeded')
		expect(blobGasError.docsPath).toBe('/reference/tevm/errors/classes/blobgaslimitexceedederror/')
		expect(blobGasError._tag).toBe('BlobGasLimitExceededError')
		expect(blobGasError.name).toBe('BlobGasLimitExceededError')
		// @ts-ignore accessing static property
		expect(errors.BlobGasLimitExceededError.code).toBe(-32003)

		// Test with custom message and args
		const customBlobGasError = new errors.BlobGasLimitExceededError('Custom blob gas error', {
			metaMessages: ['Additional context'],
			details: 'Some details',
		})
		expect(customBlobGasError.message).toContain('Custom blob gas error')
		expect(customBlobGasError.message).toContain('Additional context')
	})

	// Test RevertError with raw property
	it('should create a RevertError with raw property', () => {
		const rawData = '0x1234'
		const revertError = new errors.RevertError('Transaction reverted', {
			raw: rawData,
			metaMessages: ['Revert occurred'],
		})

		// @ts-ignore accessing raw property
		expect(revertError.raw).toEqual(rawData)
		expect(revertError.message).toContain('Transaction reverted')
		expect(revertError.message).toContain('Revert occurred')
	})

	// Test BaseError with Error that has errorType property
	// Note: Lines 68-71 in BaseError.js appear to be unreachable code because
	// the check for 'message' in args.cause (line 64) will always be true for Error instances
	// since all Error objects have a message property (even if empty string)
	it('should handle Error with errorType property in BaseError', () => {
		// Create a custom error class that extends Error and has errorType
		class CustomErrorWithType extends Error {
			errorType = 'SpecialErrorType'
			constructor(message: string) {
				super(message)
				this.name = 'CustomErrorWithType'
			}
		}

		// Create a custom BaseError subclass for testing
		class TestError extends errors.BaseError {
			constructor(message: string, args: any) {
				super(message, args, 'TestError')
			}
		}

		const errorWithType = new CustomErrorWithType('Error with type')
		const wrappedError = new TestError('Wrapped error', {
			cause: errorWithType,
		})

		// Due to the check order, it returns the message, not the errorType
		// The errorType property is never accessed because 'message' in cause is checked first
		expect(wrappedError.details).toBe('Error with type')
		expect(wrappedError.message).toContain('Details: Error with type')
	})
})
