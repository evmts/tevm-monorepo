import { describe, expect, it } from 'vitest'
import { EvmError, EVMErrorMessage, EVMErrorTypeString } from './EvmError.js'

describe('EVMErrorTypeString', () => {
	it('should be "EVMError"', () => {
		expect(EVMErrorTypeString).toBe('EVMError')
	})
})

describe('EVMErrorMessage', () => {
	it('should contain OUT_OF_GAS', () => {
		expect(EVMErrorMessage.OUT_OF_GAS).toBe('out of gas')
	})

	it('should contain CODESTORE_OUT_OF_GAS', () => {
		expect(EVMErrorMessage.CODESTORE_OUT_OF_GAS).toBe('code store out of gas')
	})

	it('should contain CODESIZE_EXCEEDS_MAXIMUM', () => {
		expect(EVMErrorMessage.CODESIZE_EXCEEDS_MAXIMUM).toBe('code size to deposit exceeds maximum code size')
	})

	it('should contain STACK_UNDERFLOW', () => {
		expect(EVMErrorMessage.STACK_UNDERFLOW).toBe('stack underflow')
	})

	it('should contain STACK_OVERFLOW', () => {
		expect(EVMErrorMessage.STACK_OVERFLOW).toBe('stack overflow')
	})

	it('should contain INVALID_JUMP', () => {
		expect(EVMErrorMessage.INVALID_JUMP).toBe('invalid JUMP')
	})

	it('should contain INVALID_OPCODE', () => {
		expect(EVMErrorMessage.INVALID_OPCODE).toBe('invalid opcode')
	})

	it('should contain OUT_OF_RANGE', () => {
		expect(EVMErrorMessage.OUT_OF_RANGE).toBe('value out of range')
	})

	it('should contain REVERT', () => {
		expect(EVMErrorMessage.REVERT).toBe('revert')
	})

	it('should contain STATIC_STATE_CHANGE', () => {
		expect(EVMErrorMessage.STATIC_STATE_CHANGE).toBe('static state change')
	})

	it('should contain INTERNAL_ERROR', () => {
		expect(EVMErrorMessage.INTERNAL_ERROR).toBe('internal error')
	})

	it('should contain CREATE_COLLISION', () => {
		expect(EVMErrorMessage.CREATE_COLLISION).toBe('create collision')
	})

	it('should contain STOP', () => {
		expect(EVMErrorMessage.STOP).toBe('stop')
	})

	it('should contain REFUND_EXHAUSTED', () => {
		expect(EVMErrorMessage.REFUND_EXHAUSTED).toBe('refund exhausted')
	})

	it('should contain VALUE_OVERFLOW', () => {
		expect(EVMErrorMessage.VALUE_OVERFLOW).toBe('value overflow')
	})

	it('should contain INSUFFICIENT_BALANCE', () => {
		expect(EVMErrorMessage.INSUFFICIENT_BALANCE).toBe('insufficient balance')
	})

	it('should contain INVALID_BYTECODE_RESULT', () => {
		expect(EVMErrorMessage.INVALID_BYTECODE_RESULT).toBe('invalid bytecode deployed')
	})

	it('should contain INITCODE_SIZE_VIOLATION', () => {
		expect(EVMErrorMessage.INITCODE_SIZE_VIOLATION).toBe('initcode exceeds max initcode size')
	})

	it('should contain INVALID_INPUT_LENGTH', () => {
		expect(EVMErrorMessage.INVALID_INPUT_LENGTH).toBe('invalid input length')
	})

	it('should contain INVALID_EOF_FORMAT', () => {
		expect(EVMErrorMessage.INVALID_EOF_FORMAT).toBe('invalid EOF format')
	})

	it('should contain BLS_12_381_INVALID_INPUT_LENGTH', () => {
		expect(EVMErrorMessage.BLS_12_381_INVALID_INPUT_LENGTH).toBe('invalid input length')
	})

	it('should contain BLS_12_381_POINT_NOT_ON_CURVE', () => {
		expect(EVMErrorMessage.BLS_12_381_POINT_NOT_ON_CURVE).toBe('point not on curve')
	})

	it('should contain BLS_12_381_INPUT_EMPTY', () => {
		expect(EVMErrorMessage.BLS_12_381_INPUT_EMPTY).toBe('input is empty')
	})

	it('should contain BLS_12_381_FP_NOT_IN_FIELD', () => {
		expect(EVMErrorMessage.BLS_12_381_FP_NOT_IN_FIELD).toBe('fp point not in field')
	})

	it('should contain BN254_FP_NOT_IN_FIELD', () => {
		expect(EVMErrorMessage.BN254_FP_NOT_IN_FIELD).toBe('fp point not in field')
	})

	it('should contain INVALID_COMMITMENT', () => {
		expect(EVMErrorMessage.INVALID_COMMITMENT).toBe('kzg commitment does not match versioned hash')
	})

	it('should contain INVALID_INPUTS', () => {
		expect(EVMErrorMessage.INVALID_INPUTS).toBe('kzg inputs invalid')
	})

	it('should contain INVALID_PROOF', () => {
		expect(EVMErrorMessage.INVALID_PROOF).toBe('kzg proof invalid')
	})
})

describe('EvmError', () => {
	describe('constructor', () => {
		it('should create an error with the given message', () => {
			const error = new EvmError(EVMErrorMessage.REVERT)
			expect(error.error).toBe('revert')
		})

		it('should set errorType to EVMErrorTypeString', () => {
			const error = new EvmError(EVMErrorMessage.OUT_OF_GAS)
			expect(error.errorType).toBe('EVMError')
		})

		it('should accept any string as error message', () => {
			const customMessage = 'custom error message'
			const error = new EvmError(customMessage)
			expect(error.error).toBe(customMessage)
			expect(error.errorType).toBe('EVMError')
		})
	})

	describe('static errorMessages', () => {
		it('should reference EVMErrorMessage', () => {
			expect(EvmError.errorMessages).toBe(EVMErrorMessage)
		})

		it('should provide access to all standard error messages', () => {
			expect(EvmError.errorMessages.REVERT).toBe('revert')
			expect(EvmError.errorMessages.OUT_OF_GAS).toBe('out of gas')
			expect(EvmError.errorMessages.STACK_UNDERFLOW).toBe('stack underflow')
		})
	})

	describe('error types', () => {
		it('should create OUT_OF_GAS error', () => {
			const error = new EvmError(EVMErrorMessage.OUT_OF_GAS)
			expect(error.error).toBe('out of gas')
			expect(error.errorType).toBe('EVMError')
		})

		it('should create STACK_OVERFLOW error', () => {
			const error = new EvmError(EVMErrorMessage.STACK_OVERFLOW)
			expect(error.error).toBe('stack overflow')
		})

		it('should create INVALID_OPCODE error', () => {
			const error = new EvmError(EVMErrorMessage.INVALID_OPCODE)
			expect(error.error).toBe('invalid opcode')
		})

		it('should create STATIC_STATE_CHANGE error', () => {
			const error = new EvmError(EVMErrorMessage.STATIC_STATE_CHANGE)
			expect(error.error).toBe('static state change')
		})

		it('should create INSUFFICIENT_BALANCE error', () => {
			const error = new EvmError(EVMErrorMessage.INSUFFICIENT_BALANCE)
			expect(error.error).toBe('insufficient balance')
		})
	})

	describe('instance properties', () => {
		it('should have error property that can be accessed', () => {
			const error = new EvmError(EVMErrorMessage.REVERT)
			expect(typeof error.error).toBe('string')
		})

		it('should have errorType property that can be accessed', () => {
			const error = new EvmError(EVMErrorMessage.REVERT)
			expect(typeof error.errorType).toBe('string')
		})
	})
})
