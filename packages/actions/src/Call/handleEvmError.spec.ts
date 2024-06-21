import { describe, expect, it } from 'bun:test'
import {
	AuthCallNonZeroValueExtError,
	AuthCallUnsetError,
	AuthInvalidSError,
	BLS12381FpNotInFieldError,
	BLS12381InputEmptyError,
	BLS12381InvalidInputLengthError,
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
		expect(result.message).toBe('Uknown errror')
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

	it.todo('should handle specific EvmError subclasses', () => {
		const errorCases = [
			{
				errorInstance: new AuthCallNonZeroValueExtError('AuthCallNonZeroValueExtError'),
				expectedError: AuthCallNonZeroValueExtError,
			},
			{ errorInstance: new AuthCallUnsetError('AuthCallUnsetError'), expectedError: AuthCallUnsetError },
			{ errorInstance: new AuthInvalidSError('AuthInvalidSError'), expectedError: AuthInvalidSError },
			{
				errorInstance: new BLS12381FpNotInFieldError('BLS12381FpNotInFieldError'),
				expectedError: BLS12381FpNotInFieldError,
			},
			{ errorInstance: new BLS12381InputEmptyError('BLS12381InputEmptyError'), expectedError: BLS12381InputEmptyError },
			{
				errorInstance: new BLS12381InvalidInputLengthError('BLS12381InvalidInputLengthError'),
				expectedError: BLS12381InvalidInputLengthError,
			},
			{
				errorInstance: new BLS12381PointNotOnCurveError('BLS12381PointNotOnCurveError'),
				expectedError: BLS12381PointNotOnCurveError,
			},
			{
				errorInstance: new CodeSizeExceedsMaximumError('CodeSizeExceedsMaximumError'),
				expectedError: CodeSizeExceedsMaximumError,
			},
			{ errorInstance: new CodeStoreOutOfGasError('CodeStoreOutOfGasError'), expectedError: CodeStoreOutOfGasError },
			{ errorInstance: new CreateCollisionError('CreateCollisionError'), expectedError: CreateCollisionError },
			{ errorInstance: new InvalidCommitmentError('InvalidCommitmentError'), expectedError: InvalidCommitmentError },
			{ errorInstance: new EvmRevertError('EvmRevertError'), expectedError: EvmRevertError },
			{
				errorInstance: new InitcodeSizeViolationError('InitcodeSizeViolationError'),
				expectedError: InitcodeSizeViolationError,
			},
			{
				errorInstance: new InsufficientBalanceError('InsufficientBalanceError'),
				expectedError: InsufficientBalanceError,
			},
			{ errorInstance: new InternalEvmError('InternalEvmError'), expectedError: InternalEvmError },
			{ errorInstance: new InvalidBeginSubError('InvalidBeginSubError'), expectedError: InvalidBeginSubError },
			{
				errorInstance: new InvalidBytecodeResultError('InvalidBytecodeResultError'),
				expectedError: InvalidBytecodeResultError,
			},
			{ errorInstance: new InvalidEofFormatError('InvalidEofFormatError'), expectedError: InvalidEofFormatError },
			{ errorInstance: new InvalidInputLengthError('InvalidInputLengthError'), expectedError: InvalidInputLengthError },
			{ errorInstance: new InvalidJumpError('InvalidJumpError'), expectedError: InvalidJumpError },
			{ errorInstance: new InvalidJumpSubError('InvalidJumpSubError'), expectedError: InvalidJumpSubError },
			{ errorInstance: new InvalidKzgInputsError('InvalidKzgInputsError'), expectedError: InvalidKzgInputsError },
			{ errorInstance: new InvalidOpcodeError('InvalidOpcodeError'), expectedError: InvalidOpcodeError },
			{ errorInstance: new InvalidProofError('InvalidProofError'), expectedError: InvalidProofError },
			{ errorInstance: new InvalidReturnSubError('InvalidReturnSubError'), expectedError: InvalidReturnSubError },
			{ errorInstance: new OutOfGasError('OutOfGasError'), expectedError: OutOfGasError },
			{ errorInstance: new OutOfRangeError('OutOfRangeError'), expectedError: OutOfRangeError },
			{ errorInstance: new RefundExhaustedError('RefundExhaustedError'), expectedError: RefundExhaustedError },
			{ errorInstance: new StackOverflowError('StackOverflowError'), expectedError: StackOverflowError },
			{ errorInstance: new StackUnderflowError('StackUnderflowError'), expectedError: StackUnderflowError },
			{ errorInstance: new StaticStateChangeError('StaticStateChangeError'), expectedError: StaticStateChangeError },
			{ errorInstance: new StopError('StopError'), expectedError: StopError },
			{ errorInstance: new ValueOverflowError('ValueOverflowError'), expectedError: ValueOverflowError },
		]

		errorCases.forEach(({ errorInstance, expectedError }) => {
			const result = handleRunTxError(errorInstance)
			expect(result).toBeInstanceOf(expectedError)
			expect(result.message).toBe(errorInstance.message)
			expect(result.cause).toBe(errorInstance)
		})
	})

	it.todo('should handle unknown EvmError subclasses', () => {
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
})
