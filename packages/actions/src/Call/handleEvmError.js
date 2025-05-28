import {
	AuthCallUnsetError,
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
import { EvmError } from '@tevm/evm'

/**
 * @internal
 * Array of every error EVM can throw
 * @type {[typeof AuthCallUnsetError, typeof CodeSizeExceedsMaximumError, typeof CreateCollisionError, typeof InvalidCommitmentError, typeof EvmRevertError, typeof InitcodeSizeViolationError, typeof InsufficientBalanceError, typeof InternalEvmError, typeof InvalidBeginSubError, typeof InvalidBytecodeResultError, typeof InvalidEofFormatError, typeof InvalidInputLengthError, typeof InvalidJumpError, typeof InvalidJumpSubError, typeof InvalidKzgInputsError, typeof InvalidOpcodeError, typeof InvalidProofError, typeof InvalidReturnSubError, typeof OutOfGasError, typeof OutOfRangeError, typeof RefundExhaustedError, typeof StackOverflowError, typeof StackUnderflowError, typeof StaticStateChangeError, typeof StopError, typeof ValueOverflowError, typeof BLS12381InputEmptyError, typeof BLS12381FpNotInFieldError, typeof BLS12381InvalidInputLengthError, typeof BLS12381PointNotOnCurveError, typeof CodeStoreOutOfGasError]}
 */
const evmErrors = [
	AuthCallUnsetError,
	CodeSizeExceedsMaximumError,
	CreateCollisionError,
	InvalidCommitmentError,
	EvmRevertError,
	InitcodeSizeViolationError,
	InsufficientBalanceError,
	InternalEvmError,
	InvalidBeginSubError,
	InvalidBytecodeResultError,
	InvalidEofFormatError,
	InvalidInputLengthError,
	InvalidJumpError,
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
	BLS12381InputEmptyError,
	BLS12381FpNotInFieldError,
	BLS12381InvalidInputLengthError,
	BLS12381PointNotOnCurveError,
	CodeStoreOutOfGasError,
]

/**
 * @internal
 *  The union of all possible EVM errors
 * @typedef {(typeof evmErrors)[number]} EvmErrorConstructor
 */

/**
 * @internal
 * The union of all possible EVM errors
 * @typedef {AuthCallUnsetError| 		BLS12381FpNotInFieldError| BLS12381InputEmptyError| BLS12381InvalidInputLengthError| BLS12381PointNotOnCurveError| CodeStoreOutOfGasError| CodeSizeExceedsMaximumError| CreateCollisionError| InvalidCommitmentError| EvmRevertError| InitcodeSizeViolationError| InsufficientBalanceError| InternalEvmError| InvalidBeginSubError| InvalidBytecodeResultError| InvalidEofFormatError| InvalidInputLengthError| InvalidJumpError| InvalidJumpSubError| InvalidKzgInputsError| InvalidOpcodeError| InvalidProofError| InvalidReturnSubError| OutOfGasError| OutOfRangeError| RefundExhaustedError| StackOverflowError| StackUnderflowError| StaticStateChangeError| StopError| ValueOverflowError} TevmEvmError
 */

/**
 * @internal
 * @typedef {TevmEvmError | InvalidGasPriceError | InvalidAddressError | InvalidGasLimitError} HandleRunTxError
 */

/**
 * @internal
 * Takes an unknown error that is suspected of coming from EVM and returns a strongly typed error
 * @param {unknown} e
 * @returns {HandleRunTxError}
 * @throws {never} returns errors as values
 */
export const handleRunTxError = (e) => {
	if (e instanceof Error) {
		if (e.message.includes("is less than the block's baseFeePerGas")) {
			return new InvalidGasPriceError(e.message, { cause: e })
		}
		if (e.message.includes('invalid sender address, address is not an EOA (EIP-3607)')) {
			return new InvalidAddressError(e.message, { cause: e })
		}
		if (e.message.includes('is lower than the minimum gas limit')) {
			return new InvalidGasLimitError(e.message, { cause: e })
		}
		if (e.message.includes('tx has a higher gas limit than the block')) {
			return new GasLimitExceededError(e.message, { cause: e })
		}
		if (e.message.includes('block has a different hardfork than the vm')) {
			return new MisconfiguredClientError(e.message, { cause: /** @type {any}*/ (e) })
		}
		if (e.message.includes("the tx doesn't have the correct nonce.")) {
			return new InvalidNonceError(e.message, { cause: e })
		}
		if (e.message.includes("sender doesn't have enough funds to send tx.")) {
			return new InsufficientBalanceError(e.message, { cause: /** @type {any}*/ (e) })
		}
		return new InternalEvmError(e.message, { cause: /** @type {any}*/ (e) })
	}
	if (!(e instanceof EvmError)) {
		return new InternalEvmError('Unknown error', { cause: /** @type {any}*/ (e) })
	}
	const ErrorConstructor = evmErrors.find((error) => 'EVMErrorMessage' in error && error.EVMErrorMessage === e.error)
	if (!ErrorConstructor) {
		return new InternalEvmError(`Unknown error: ${e.error}`, { cause: e })
	}
	return new ErrorConstructor(e.error, { cause: e })
}
