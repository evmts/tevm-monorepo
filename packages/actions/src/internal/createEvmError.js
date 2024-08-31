import {
	AuthCallUnsetError,
	BLS12381FpNotInFieldError,
	BLS12381InputEmptyError,
	BLS12381PointNotOnCurveError,
	BaseError,
	CodeSizeExceedsMaximumError,
	CodeStoreOutOfGasError,
	CreateCollisionError,
	InitcodeSizeViolationError,
	InsufficientBalanceError,
	InternalError,
	InvalidBeginSubError,
	InvalidBytecodeResultError,
	InvalidCommitmentError,
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
	RevertError,
	StackOverflowError,
	StackUnderflowError,
	StaticStateChangeError,
	StopError,
	ValueOverflowError,
} from '@tevm/errors'
import { EvmErrorMessage } from '@tevm/evm'

/**
 * @type {ReturnType<typeof createEvmError>} EvmError
 */

/**
 * @param {import('@tevm/evm').EvmError} error
 */
export const createEvmError = (error) => {
	// make it so we can always override it for now
	if (error instanceof BaseError) {
		return /** @type {never}*/ (error)
	}
	switch (error.error) {
		case EvmErrorMessage.STOP: {
			return new StopError(error.error, { cause: error })
		}
		case EvmErrorMessage.REVERT: {
			return new RevertError(error.error, { cause: error })
		}
		case EvmErrorMessage.OUT_OF_GAS: {
			return new OutOfGasError(error.error, { cause: error })
		}
		case EvmErrorMessage.INVALID_OPCODE: {
			return new InvalidOpcodeError(error.error, { cause: error })
		}
		case EvmErrorMessage.STACK_OVERFLOW: {
			return new StackOverflowError(error.error, { cause: error })
		}
		case EvmErrorMessage.STACK_UNDERFLOW: {
			return new StackUnderflowError(error.error, { cause: error })
		}
		case EvmErrorMessage.INVALID_JUMP: {
			return new InvalidJumpError(error.error, { cause: error })
		}
		case EvmErrorMessage.OUT_OF_RANGE: {
			return new OutOfRangeError(error.error, { cause: error })
		}
		case EvmErrorMessage.INVALID_PROOF: {
			return new InvalidProofError(error.error, { cause: error })
		}
		case EvmErrorMessage.AUTHCALL_UNSET: {
			return new AuthCallUnsetError(error.error, { cause: error })
		}
		case EvmErrorMessage.INTERNAL_ERROR: {
			return new InternalError(error.error, { cause: error })
		}
		case EvmErrorMessage.INVALID_INPUTS: {
			return new InvalidKzgInputsError(error.error, { cause: error })
		}
		case EvmErrorMessage.VALUE_OVERFLOW: {
			return new ValueOverflowError(error.error, { cause: error })
		}
		case EvmErrorMessage.INVALID_JUMPSUB: {
			return new InvalidJumpSubError(error.error, { cause: error })
		}
		case EvmErrorMessage.CREATE_COLLISION: {
			return new CreateCollisionError(error.error, { cause: error })
		}
		case EvmErrorMessage.INVALID_BEGINSUB: {
			return new InvalidBeginSubError(error.error, { cause: error })
		}
		case EvmErrorMessage.REFUND_EXHAUSTED: {
			return new RefundExhaustedError(error.error, { cause: error })
		}
		case EvmErrorMessage.INVALID_RETURNSUB: {
			return new InvalidReturnSubError(error.error, { cause: error })
		}
		case EvmErrorMessage.INVALID_COMMITMENT: {
			return new InvalidCommitmentError(error.error, { cause: error })
		}
		case EvmErrorMessage.INVALID_EOF_FORMAT: {
			return new InvalidEofFormatError(error.error, { cause: error })
		}
		case EvmErrorMessage.STATIC_STATE_CHANGE: {
			return new StaticStateChangeError(error.error, { cause: error })
		}
		case EvmErrorMessage.CODESTORE_OUT_OF_GAS: {
			return new CodeStoreOutOfGasError(error.error, { cause: error })
		}
		case EvmErrorMessage.INSUFFICIENT_BALANCE: {
			return new InsufficientBalanceError(error.error, { cause: error })
		}
		case EvmErrorMessage.INVALID_INPUT_LENGTH: {
			return new InvalidInputLengthError(error.error, { cause: error })
		}
		case EvmErrorMessage.BLS_12_381_INPUT_EMPTY: {
			return new BLS12381InputEmptyError(error.error, { cause: error })
		}
		case EvmErrorMessage.INITCODE_SIZE_VIOLATION: {
			return new InitcodeSizeViolationError(error.error, { cause: error })
		}
		case EvmErrorMessage.INVALID_BYTECODE_RESULT: {
			return new InvalidBytecodeResultError(error.error, { cause: error })
		}
		case EvmErrorMessage.CODESIZE_EXCEEDS_MAXIMUM: {
			return new CodeSizeExceedsMaximumError(error.error, { cause: error })
		}
		case EvmErrorMessage.BLS_12_381_FP_NOT_IN_FIELD: {
			return new BLS12381FpNotInFieldError(error.error, { cause: error })
		}
		case EvmErrorMessage.BLS_12_381_POINT_NOT_ON_CURVE: {
			return new BLS12381PointNotOnCurveError(error.error, { cause: error })
		}
		default: {
			return new InternalError(error.error, { cause: error })
		}
	}
}
