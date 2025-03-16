import {
	AuthCallUnsetError,
	BLS12381FpNotInFieldError,
	BLS12381InputEmptyError,
	BLS12381PointNotOnCurveError,
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
import { describe, expect, it } from 'vitest'
import { createEvmError } from './createEvmError.js'

describe('createEvmError', () => {
	const testCases = [
		{ error: { error: EvmErrorMessage.STOP }, expected: StopError },
		{ error: { error: EvmErrorMessage.REVERT }, expected: RevertError },
		{ error: { error: EvmErrorMessage.OUT_OF_GAS }, expected: OutOfGasError },
		{ error: { error: EvmErrorMessage.INVALID_OPCODE }, expected: InvalidOpcodeError },
		{ error: { error: EvmErrorMessage.STACK_OVERFLOW }, expected: StackOverflowError },
		{ error: { error: EvmErrorMessage.STACK_UNDERFLOW }, expected: StackUnderflowError },
		{ error: { error: EvmErrorMessage.INVALID_JUMP }, expected: InvalidJumpError },
		{ error: { error: EvmErrorMessage.OUT_OF_RANGE }, expected: OutOfRangeError },
		{ error: { error: EvmErrorMessage.INVALID_PROOF }, expected: InvalidProofError },
		{ error: { error: EvmErrorMessage.AUTHCALL_UNSET }, expected: AuthCallUnsetError },
		{ error: { error: EvmErrorMessage.INTERNAL_ERROR }, expected: InternalError },
		{ error: { error: EvmErrorMessage.INVALID_INPUTS }, expected: InvalidKzgInputsError },
		{ error: { error: EvmErrorMessage.VALUE_OVERFLOW }, expected: ValueOverflowError },
		{ error: { error: EvmErrorMessage.INVALID_JUMPSUB }, expected: InvalidJumpSubError },
		{ error: { error: EvmErrorMessage.CREATE_COLLISION }, expected: CreateCollisionError },
		{ error: { error: EvmErrorMessage.INVALID_BEGINSUB }, expected: InvalidBeginSubError },
		{ error: { error: EvmErrorMessage.REFUND_EXHAUSTED }, expected: RefundExhaustedError },
		{ error: { error: EvmErrorMessage.INVALID_RETURNSUB }, expected: InvalidReturnSubError },
		{ error: { error: EvmErrorMessage.INVALID_COMMITMENT }, expected: InvalidCommitmentError },
		{ error: { error: EvmErrorMessage.INVALID_EOF_FORMAT }, expected: InvalidEofFormatError },
		{ error: { error: EvmErrorMessage.STATIC_STATE_CHANGE }, expected: StaticStateChangeError },
		{ error: { error: EvmErrorMessage.CODESTORE_OUT_OF_GAS }, expected: CodeStoreOutOfGasError },
		{ error: { error: EvmErrorMessage.INSUFFICIENT_BALANCE }, expected: InsufficientBalanceError },
		{ error: { error: EvmErrorMessage.INVALID_INPUT_LENGTH }, expected: InvalidInputLengthError },
		{ error: { error: EvmErrorMessage.BLS_12_381_INPUT_EMPTY }, expected: BLS12381InputEmptyError },
		{ error: { error: EvmErrorMessage.INITCODE_SIZE_VIOLATION }, expected: InitcodeSizeViolationError },
		{ error: { error: EvmErrorMessage.INVALID_BYTECODE_RESULT }, expected: InvalidBytecodeResultError },
		{ error: { error: EvmErrorMessage.CODESIZE_EXCEEDS_MAXIMUM }, expected: CodeSizeExceedsMaximumError },
		{ error: { error: EvmErrorMessage.BLS_12_381_FP_NOT_IN_FIELD }, expected: BLS12381FpNotInFieldError },
		{ error: { error: EvmErrorMessage.BLS_12_381_POINT_NOT_ON_CURVE }, expected: BLS12381PointNotOnCurveError },
	]

	testCases.forEach(({ error, expected }) => {
		it(`should return ${expected.name} for ${error.error}`, () => {
			const result = createEvmError(error as any)
			expect(result).toBeInstanceOf(expected)
			expect(result.message.includes(error.error)).toBe(true)
		})
	})

	it('should return InternalError for unknown error', () => {
		const error = { error: 'UNKNOWN_ERROR' }
		const result = createEvmError(error as any)
		expect(result).toBeInstanceOf(InternalError)
		expect(result).toMatchSnapshot()
	})

	it('should return the same error if it is an instance of BaseError', () => {
		const baseError = new InternalError('Existing BaseError')
		const result = createEvmError(baseError as any)
		expect(result).toBe(baseError)
	})

	it('should handle error with additional data', () => {
		const error = {
			error: EvmErrorMessage.REVERT,
			data: '0x08c379a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001a4e6f7420656e6f75676820657468657220746f2077697468647261770000000000',
		}
		const result = createEvmError(error as any)
		expect(result).toBeInstanceOf(RevertError)
		expect(result.message.includes(EvmErrorMessage.REVERT)).toBe(true)
	})

	it('should handle error with null or undefined error property', () => {
		// With null error
		const nullError = { error: null }
		const nullResult = createEvmError(nullError as any)
		expect(nullResult).toBeInstanceOf(InternalError)

		// With undefined error
		const undefinedError = { error: undefined }
		const undefinedResult = createEvmError(undefinedError as any)
		expect(undefinedResult).toBeInstanceOf(InternalError)
	})
})
