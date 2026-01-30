import { describe, expect, it } from 'vitest'
import { toTaggedError } from './toTaggedError.js'
import { TevmError } from '../TevmError.js'
import { InsufficientBalanceError } from '../evm/InsufficientBalanceError.js'
import { InvalidOpcodeError } from '../evm/InvalidOpcodeError.js'
import { OutOfGasError } from '../evm/OutOfGasError.js'
import { RevertError } from '../evm/RevertError.js'
import { StackOverflowError } from '../evm/StackOverflowError.js'
import { StackUnderflowError } from '../evm/StackUnderflowError.js'

describe('toTaggedError', () => {
	it('should return TevmError as-is', () => {
		const error = new TevmError({
			message: 'Test error',
			code: -32000,
		})

		const result = toTaggedError(error)
		expect(result).toBe(error)
	})

	it('should return InsufficientBalanceError as-is', () => {
		const error = new InsufficientBalanceError({
			address: '0x1234',
			required: 100n,
			available: 50n,
		})

		const result = toTaggedError(error)
		expect(result).toBe(error)
	})

	it('should convert a BaseError-like object to TevmError', () => {
		const baseErrorLike = {
			_tag: 'SomeUnknownError',
			message: 'Test base error',
			code: -32000,
			docsPath: '/reference/tevm/errors/',
			cause: new Error('Original'),
		}

		const result = toTaggedError(baseErrorLike)
		expect(result._tag).toBe('TevmError')
		expect(result.message).toBe('Test base error')
		expect(result.code).toBe(-32000)
	})

	it('should convert a BaseError-like InsufficientBalanceError to TaggedError', () => {
		const baseErrorLike = {
			_tag: 'InsufficientBalanceError',
			message: 'Insufficient balance',
			code: -32000,
		}

		const result = toTaggedError(baseErrorLike)
		expect(result._tag).toBe('InsufficientBalanceError')
		expect(result).toBeInstanceOf(InsufficientBalanceError)
	})

	it('should extract properties from InsufficientBalanceError-like objects', () => {
		const baseErrorLike = {
			_tag: 'InsufficientBalanceError',
			message: 'Insufficient balance',
			code: -32000,
			address: '0x1234567890123456789012345678901234567890',
			required: 1000n,
			available: 500n,
		}

		const result = toTaggedError(baseErrorLike)
		expect(result._tag).toBe('InsufficientBalanceError')
		expect(result).toBeInstanceOf(InsufficientBalanceError)
		const insufficientError = result as InsufficientBalanceError
		expect(insufficientError.address).toBe('0x1234567890123456789012345678901234567890')
		expect(insufficientError.required).toBe(1000n)
		expect(insufficientError.available).toBe(500n)
	})

	it('should convert a BaseError-like OutOfGasError to TaggedError', () => {
		const baseErrorLike = {
			_tag: 'OutOfGasError',
			message: 'Out of gas',
			code: -32003,
		}

		const result = toTaggedError(baseErrorLike)
		expect(result._tag).toBe('OutOfGasError')
		expect(result).toBeInstanceOf(OutOfGasError)
	})

	it('should extract properties from OutOfGasError-like objects', () => {
		const baseErrorLike = {
			_tag: 'OutOfGasError',
			message: 'Out of gas',
			code: -32003,
			gasUsed: 100000n,
			gasLimit: 21000n,
		}

		const result = toTaggedError(baseErrorLike)
		expect(result._tag).toBe('OutOfGasError')
		expect(result).toBeInstanceOf(OutOfGasError)
		const outOfGasError = result as OutOfGasError
		expect(outOfGasError.gasUsed).toBe(100000n)
		expect(outOfGasError.gasLimit).toBe(21000n)
	})

	it('should convert a BaseError-like RevertError to TaggedError', () => {
		const baseErrorLike = {
			_tag: 'RevertError',
			message: 'Execution reverted',
			code: 3,
		}

		const result = toTaggedError(baseErrorLike)
		expect(result._tag).toBe('RevertError')
		expect(result).toBeInstanceOf(RevertError)
	})

	it('should extract properties from RevertError-like objects', () => {
		const baseErrorLike = {
			_tag: 'RevertError',
			message: 'Execution reverted',
			code: 3,
			data: '0x08c379a00000000000000000',
			reason: 'Insufficient allowance',
		}

		const result = toTaggedError(baseErrorLike)
		expect(result._tag).toBe('RevertError')
		expect(result).toBeInstanceOf(RevertError)
		const revertError = result as RevertError
		expect(revertError.data).toBe('0x08c379a00000000000000000')
		expect(revertError.reason).toBe('Insufficient allowance')
	})

	it('should convert a BaseError-like InvalidOpcodeError to TaggedError', () => {
		const baseErrorLike = {
			_tag: 'InvalidOpcodeError',
			message: 'Invalid opcode',
			code: -32015,
		}

		const result = toTaggedError(baseErrorLike)
		expect(result._tag).toBe('InvalidOpcodeError')
		expect(result).toBeInstanceOf(InvalidOpcodeError)
	})

	it('should extract properties from InvalidOpcodeError-like objects', () => {
		const baseErrorLike = {
			_tag: 'InvalidOpcodeError',
			message: 'Invalid opcode',
			code: -32015,
			opcode: 0xfe,
		}

		const result = toTaggedError(baseErrorLike)
		expect(result._tag).toBe('InvalidOpcodeError')
		expect(result).toBeInstanceOf(InvalidOpcodeError)
		const invalidOpcodeError = result as InvalidOpcodeError
		expect(invalidOpcodeError.opcode).toBe(0xfe)
	})

	it('should convert a BaseError-like StackOverflowError to TaggedError', () => {
		const baseErrorLike = {
			_tag: 'StackOverflowError',
			message: 'Stack overflow',
			code: -32015,
		}

		const result = toTaggedError(baseErrorLike)
		expect(result._tag).toBe('StackOverflowError')
		expect(result).toBeInstanceOf(StackOverflowError)
	})

	it('should extract properties from StackOverflowError-like objects', () => {
		const baseErrorLike = {
			_tag: 'StackOverflowError',
			message: 'Stack overflow',
			code: -32015,
			stackSize: 1025,
		}

		const result = toTaggedError(baseErrorLike)
		expect(result._tag).toBe('StackOverflowError')
		expect(result).toBeInstanceOf(StackOverflowError)
		const stackOverflowError = result as StackOverflowError
		expect(stackOverflowError.stackSize).toBe(1025)
	})

	it('should convert a BaseError-like StackUnderflowError to TaggedError', () => {
		const baseErrorLike = {
			_tag: 'StackUnderflowError',
			message: 'Stack underflow',
			code: -32015,
		}

		const result = toTaggedError(baseErrorLike)
		expect(result._tag).toBe('StackUnderflowError')
		expect(result).toBeInstanceOf(StackUnderflowError)
	})

	it('should convert a regular Error to TevmError', () => {
		const error = new Error('Standard error')

		const result = toTaggedError(error)
		expect(result._tag).toBe('TevmError')
		expect(result.message).toBe('Standard error')
		expect(result.code).toBe(0)
		expect(result.cause).toBe(error)
	})

	it('should convert a string to TevmError', () => {
		const result = toTaggedError('String error')
		expect(result._tag).toBe('TevmError')
		expect(result.message).toBe('String error')
	})

	it('should convert null to TevmError', () => {
		const result = toTaggedError(null)
		expect(result._tag).toBe('TevmError')
		expect(result.message).toBe('null')
	})

	it('should convert undefined to TevmError', () => {
		const result = toTaggedError(undefined)
		expect(result._tag).toBe('TevmError')
		expect(result.message).toBe('undefined')
	})
})
