import {
	BLS12381PointNotOnCurveError,
	BaseError,
	InternalError,
	RevertError,
	StopError,
	OutOfGasError,
	InvalidJumpError,
	InvalidOpcodeError,
	StackOverflowError,
	StackUnderflowError,
	OutOfRangeError,
	InvalidProofError,
	InvalidJumpSubError,
	CreateCollisionError,
	InvalidBeginSubError,
	RefundExhaustedError,
	InvalidReturnSubError,
	InvalidCommitmentError,
	AuthInvalidSError,
	AuthCallUnsetError,
	BLS12381FpNotInFieldError,
	AuthCallNonZeroValueExtError,
	CodeSizeExceedsMaximumError,
	InvalidBytecodeResultError,
	InitcodeSizeViolationError,
	BLS12381InputEmptyError,
	InvalidInputLengthError,
	InsufficientBalanceError,
	CodeStoreOutOfGasError,
	StaticStateChangeError,
	InvalidEofFormatError,
	InvalidKzgInputsError,
} from '@tevm/errors'
import { EvmErrorMessage } from '@tevm/evm'
import { ValueOverflowError } from '../../../errors/types/ethereum/ethereumjs/ValueOverflowError.js'

/**
 * @param {import('@ethereumjs/evm').EvmError} error
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
		case EvmErrorMessage.AUTH_INVALID_S: {
			return new AuthInvalidSError(error.error, { cause: error })
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
		case EvmErrorMessage.AUTHCALL_NONZERO_VALUEEXT: {
			return new AuthCallNonZeroValueExtError(error.error, { cause: error })
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
