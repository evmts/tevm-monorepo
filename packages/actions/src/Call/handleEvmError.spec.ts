import { describe, expect, it, test } from 'bun:test'
import {
	AuthCallNonZeroValueExtError,
	AuthCallUnsetError,
	AuthInvalidSError,
	BLS12381FpNotInFieldError,
	BLS12381InputEmptyError,
	BLS12381PointNotOnCurveError,
	CodeSizeExceedsMaximumError,
	CodeStoreOutOfGasError,
	CreateCollisionError,
	EvmRevertError,
	GasLimitExceededError,
	InitcodeSizeViolationError,
	InsufficientBalanceError,
	InternalEvmError,
	InvalidAddressError,
	InvalidBeginSubError,
	InvalidBytecodeResultError,
	InvalidCommitmentError,
	InvalidEofFormatError,
	InvalidGasLimitError,
	InvalidGasPriceError,
	InvalidInputLengthError,
	InvalidJumpError,
	InvalidJumpSubError,
	InvalidKzgInputsError,
	InvalidNonceError,
	InvalidOpcodeError,
	InvalidProofError,
	InvalidReturnSubError,
	MisconfiguredClientError,
	OutOfGasError,
	OutOfRangeError,
	RefundExhaustedError,
	StackOverflowError,
	StackUnderflowError,
	StaticStateChangeError,
	StopError,
	ValueOverflowError,
} from '@tevm/errors'
import { EvmError, EvmErrorMessage } from '@tevm/evm'
import { handleRunTxError } from './handleEvmError.js'

describe('handleRunTxError', () => {
	it('should handle unknown error that is not an instance of Error', () => {
		const error = 'unknown error'
		const result = handleRunTxError(error)
		expect(result).toBeInstanceOf(InternalEvmError)
		expect(result.message).toMatchSnapshot()
		expect(result.cause).toBe(error)
	})

	it('should handle known error types', () => {
		const errorCases = [
			{ message: "is less than the block's baseFeePerGas", expectedError: InvalidGasPriceError },
			{ message: 'invalid sender address, address is not an EOA (EIP-3607)', expectedError: InvalidAddressError },
			{ message: 'is lower than the minimum gas limit', expectedError: InvalidGasLimitError },
			{ message: 'tx has a higher gas limit than the block', expectedError: GasLimitExceededError },
			{ message: 'block has a different hardfork than the vm', expectedError: MisconfiguredClientError },
			{ message: "the tx doesn't have the correct nonce.", expectedError: InvalidNonceError },
			{ message: "sender doesn't have enough funds to send tx.", expectedError: InsufficientBalanceError },
		]

		errorCases.forEach(({ message, expectedError }) => {
			const error = new Error(message)
			const result = handleRunTxError(error)
			expect(result).toBeInstanceOf(expectedError)
			expect(result.cause).toBe(error)
			expect(result.message).toBeDefined()
		})
	})

	it('should handle EvmError instances', () => {
		const error = new EvmError(EvmErrorMessage.INVALID_JUMP)
		const result = handleRunTxError(error)
		expect(result.name).toBe(InvalidJumpError.name)
		expect(result).toBeInstanceOf(InvalidJumpError)
		expect(result.cause).toBe(error)
		expect(result.message).toMatchSnapshot()
	})

	describe('should handle specific EvmError subclasses', () => {
		const errorCases = [
			InvalidJumpError,
			AuthCallNonZeroValueExtError,
			AuthCallUnsetError,
			AuthInvalidSError,
			BLS12381FpNotInFieldError,
			BLS12381InputEmptyError,
			BLS12381PointNotOnCurveError,
			CodeSizeExceedsMaximumError,
			CodeStoreOutOfGasError,
			CreateCollisionError,
			EvmRevertError,
			InitcodeSizeViolationError,
			InsufficientBalanceError,
			InternalEvmError,
			InvalidBeginSubError,
			InvalidBytecodeResultError,
			InvalidCommitmentError,
			InvalidEofFormatError,
			InvalidInputLengthError,
			InvalidJumpSubError,
			InvalidKzgInputsError,
			InvalidOpcodeError,
			InvalidProofError,
			InvalidReturnSubError,
			OutOfGasError,
			OutOfRangeError,
			RefundExhaustedError,
			StackOverflowError,
			StackUnderflowError,
			StaticStateChangeError,
			StopError,
			ValueOverflowError,
		]

		errorCases.forEach((errorCase) => {
			test(errorCase.name, () => {
				const err = new EvmError(errorCase.EVMErrorMessage)
				const result = handleRunTxError(err)
				expect(result.name).toBe(errorCase.name)
				expect(result).toBeInstanceOf(errorCase)
				expect(result.cause).toBe(err)
			})
		})
	})

	it('should handle unknown EvmError subclasses', () => {
		class UnknownEvmError extends EvmError {
			constructor(message: string) {
				super(message as any)
			}
		}

		const error = new UnknownEvmError('Unknown error occurred')
		const result = handleRunTxError(error)
		expect(result).toBeInstanceOf(InternalEvmError)
		expect(result.message).toMatchSnapshot()
	})

	it('should handle unknown unexpected errror', () => {
		const error = new Error('Unknown error occurred')
		const result = handleRunTxError(error)
		expect(result).toBeInstanceOf(InternalEvmError)
		expect(result.message).toMatchSnapshot()
	})
})
