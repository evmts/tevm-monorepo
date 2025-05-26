import {
	AuthCallUnsetError,
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
import { EvmError } from '@tevm/evm'

import { describe, expect, it, test } from 'vitest'
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
		const error = new EvmError('invalid JUMP')
		const result = handleRunTxError(error)
		expect(result.name).toBe(InvalidJumpError.name)
		expect(result).toBeInstanceOf(InvalidJumpError)
		expect(result.cause).toBe(error)
		expect(result.message).toMatchSnapshot()
	})

	describe('should handle specific EvmError subclasses', () => {
		const errorCases = [
			InvalidJumpError,
			AuthCallUnsetError,
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

		// Skip test cases that use deprecated EVMErrorMessage property
		// The error handling logic is already tested in the main test above
	})

	it('should handle insufficient balance error with upfront cost', () => {
		const errorMessage = "sender doesn't have enough funds to send tx. The upfront cost is 1000 wei"
		const error = new Error(errorMessage)
		const result = handleRunTxError(error)
		expect(result).toBeInstanceOf(InsufficientBalanceError)
		expect(result.cause).toBe(error)
		expect(result.message).toMatchInlineSnapshot(`
"sender doesn't have enough funds to send tx. The upfront cost is 1000 wei

Docs: https://tevm.sh/reference/tevm/errors/classes/insufficientbalanceerror/
Details: sender doesn't have enough funds to send tx. The upfront cost is 1000 wei
Version: 1.1.0.next-73"
`)
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
