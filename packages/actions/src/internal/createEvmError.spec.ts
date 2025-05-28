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
// import { EvmErrorMessage } from '@tevm/evm' // No longer exported
import { describe, expect, it } from 'vitest'
import { createEvmError } from './createEvmError.js'

describe('createEvmError', () => {
	const testCases = [
		{ error: { error: 'stop' }, expected: StopError },
		{ error: { error: 'revert' }, expected: RevertError },
		{ error: { error: 'out of gas' }, expected: OutOfGasError },
		{ error: { error: 'invalid opcode' }, expected: InvalidOpcodeError },
		{ error: { error: 'stack overflow' }, expected: StackOverflowError },
		{ error: { error: 'stack underflow' }, expected: StackUnderflowError },
		{ error: { error: 'invalid JUMP' }, expected: InvalidJumpError },
		{ error: { error: 'value out of range' }, expected: OutOfRangeError },
		{ error: { error: 'kzg proof invalid' }, expected: InvalidProofError },
		{ error: { error: 'attempting to AUTHCALL without AUTH set' }, expected: AuthCallUnsetError },
		{ error: { error: 'internal error' }, expected: InternalError },
		{ error: { error: 'kzg inputs invalid' }, expected: InvalidKzgInputsError },
		{ error: { error: 'value overflow' }, expected: ValueOverflowError },
		{ error: { error: 'invalid JUMPSUB' }, expected: InvalidJumpSubError },
		{ error: { error: 'create collision' }, expected: CreateCollisionError },
		{ error: { error: 'invalid BEGINSUB' }, expected: InvalidBeginSubError },
		{ error: { error: 'refund exhausted' }, expected: RefundExhaustedError },
		{ error: { error: 'invalid RETURNSUB' }, expected: InvalidReturnSubError },
		{ error: { error: 'kzg commitment does not match versioned hash' }, expected: InvalidCommitmentError },
		{ error: { error: 'invalid EOF format' }, expected: InvalidEofFormatError },
		{ error: { error: 'static state change' }, expected: StaticStateChangeError },
		{ error: { error: 'code store out of gas' }, expected: CodeStoreOutOfGasError },
		{ error: { error: 'insufficient balance' }, expected: InsufficientBalanceError },
		{ error: { error: 'invalid input length' }, expected: InvalidInputLengthError },
		{ error: { error: 'input is empty' }, expected: BLS12381InputEmptyError },
		{ error: { error: 'initcode exceeds max initcode size' }, expected: InitcodeSizeViolationError },
		{ error: { error: 'invalid bytecode deployed' }, expected: InvalidBytecodeResultError },
		{ error: { error: 'code size to deposit exceeds maximum code size' }, expected: CodeSizeExceedsMaximumError },
		{ error: { error: 'fp point not in field' }, expected: BLS12381FpNotInFieldError },
		{ error: { error: 'point not on curve' }, expected: BLS12381PointNotOnCurveError },
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
			error: 'revert',
			data: '0x08c379a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001a4e6f7420656e6f75676820657468657220746f2077697468647261770000000000',
		}
		const result = createEvmError(error as any)
		expect(result).toBeInstanceOf(RevertError)
		expect(result.message.includes('revert')).toBe(true)
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
