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
			raw: '0x08c379a00000000000000000',
			reason: 'Insufficient allowance',
		}

		const result = toTaggedError(baseErrorLike)
		expect(result._tag).toBe('RevertError')
		expect(result).toBeInstanceOf(RevertError)
		const revertError = result as RevertError
		expect(revertError.raw).toBe('0x08c379a00000000000000000')
		expect(revertError.reason).toBe('Insufficient allowance')
	})

	it('should convert a BaseError-like with _tag Revert (original package) to RevertError', () => {
		// Original @tevm/errors uses _tag: 'Revert', not 'RevertError'
		const baseErrorLike = {
			_tag: 'Revert',
			message: 'Execution reverted',
			code: 3,
			raw: '0xdeadbeef',
			reason: 'Transfer failed',
		}

		const result = toTaggedError(baseErrorLike)
		expect(result._tag).toBe('RevertError')
		expect(result).toBeInstanceOf(RevertError)
		const revertError = result as RevertError
		expect(revertError.raw).toBe('0xdeadbeef')
		expect(revertError.reason).toBe('Transfer failed')
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

	it('should preserve cause when converting InsufficientBalanceError-like objects', () => {
		const originalError = new Error('Original cause')
		const baseErrorLike = {
			_tag: 'InsufficientBalanceError',
			message: 'Insufficient balance',
			code: -32000,
			address: '0x1234',
			required: 1000n,
			available: 500n,
			cause: originalError,
		}

		const result = toTaggedError(baseErrorLike) as InsufficientBalanceError
		expect(result.cause).toBe(originalError)
		expect((result.cause as Error).message).toBe('Original cause')
	})

	it('should preserve cause when converting OutOfGasError-like objects', () => {
		const originalError = new Error('Gas error cause')
		const baseErrorLike = {
			_tag: 'OutOfGasError',
			message: 'Out of gas',
			code: -32003,
			gasUsed: 100000n,
			gasLimit: 21000n,
			cause: originalError,
		}

		const result = toTaggedError(baseErrorLike) as OutOfGasError
		expect(result.cause).toBe(originalError)
	})

	it('should preserve cause when converting RevertError-like objects', () => {
		const originalError = new Error('Revert cause')
		const baseErrorLike = {
			_tag: 'RevertError',
			message: 'Execution reverted',
			code: 3,
			data: '0x08c379a0',
			reason: 'Test',
			cause: originalError,
		}

		const result = toTaggedError(baseErrorLike) as RevertError
		expect(result.cause).toBe(originalError)
	})

	it('should preserve cause when converting InvalidOpcodeError-like objects', () => {
		const originalError = new Error('Opcode cause')
		const baseErrorLike = {
			_tag: 'InvalidOpcodeError',
			message: 'Invalid opcode',
			code: -32015,
			opcode: 0xfe,
			cause: originalError,
		}

		const result = toTaggedError(baseErrorLike) as InvalidOpcodeError
		expect(result.cause).toBe(originalError)
	})

	it('should preserve cause when converting StackOverflowError-like objects', () => {
		const originalError = new Error('Stack cause')
		const baseErrorLike = {
			_tag: 'StackOverflowError',
			message: 'Stack overflow',
			code: -32015,
			stackSize: 1025,
			cause: originalError,
		}

		const result = toTaggedError(baseErrorLike) as StackOverflowError
		expect(result.cause).toBe(originalError)
	})

	it('should preserve cause when converting StackUnderflowError-like objects', () => {
		const originalError = new Error('Underflow cause')
		const baseErrorLike = {
			_tag: 'StackUnderflowError',
			message: 'Stack underflow',
			code: -32015,
			cause: originalError,
		}

		const result = toTaggedError(baseErrorLike) as StackUnderflowError
		expect(result.cause).toBe(originalError)
	})

	it('should use default code 0 when BaseError-like object has undefined code', () => {
		const baseErrorLike = {
			_tag: 'SomeUnknownError',
			message: 'Error without code',
			// code is intentionally undefined
		}

		const result = toTaggedError(baseErrorLike)
		expect(result._tag).toBe('TevmError')
		expect(result.code).toBe(0)
	})

	// Tests for new error types

	it('should convert a BaseError-like ForkError to TaggedError', () => {
		const baseErrorLike = {
			_tag: 'ForkError',
			message: 'Fork request failed',
			code: -32604,
			method: 'eth_getBalance',
		}

		const result = toTaggedError(baseErrorLike)
		expect(result._tag).toBe('ForkError')
		expect((result as any).method).toBe('eth_getBalance')
	})

	it('should preserve cause when converting ForkError-like objects', () => {
		const originalError = new Error('Network timeout')
		const baseErrorLike = {
			_tag: 'ForkError',
			message: 'Fork request failed',
			code: -32604,
			method: 'eth_call',
			cause: originalError,
		}

		const result = toTaggedError(baseErrorLike)
		expect(result.cause).toBe(originalError)
	})

	it('should convert a BaseError-like BlockNotFoundError to TaggedError', () => {
		const baseErrorLike = {
			_tag: 'BlockNotFoundError',
			message: 'Block not found',
			code: -32001,
			blockTag: 'latest',
		}

		const result = toTaggedError(baseErrorLike)
		expect(result._tag).toBe('BlockNotFoundError')
		expect((result as any).blockTag).toBe('latest')
	})

	it('should convert a BaseError-like with _tag UnknownBlock to BlockNotFoundError', () => {
		const baseErrorLike = {
			_tag: 'UnknownBlock',
			message: 'Block not found',
			code: -32001,
			blockTag: 12345n,
		}

		const result = toTaggedError(baseErrorLike)
		expect(result._tag).toBe('BlockNotFoundError')
		expect((result as any).blockTag).toBe(12345n)
	})

	it('should convert a BaseError-like InvalidTransactionError to TaggedError', () => {
		const baseErrorLike = {
			_tag: 'InvalidTransactionError',
			message: 'Invalid transaction',
			code: -32003,
			reason: 'Invalid nonce',
			tx: { to: '0x123', value: 100n },
		}

		const result = toTaggedError(baseErrorLike)
		expect(result._tag).toBe('InvalidTransactionError')
		expect((result as any).reason).toBe('Invalid nonce')
		expect((result as any).tx).toEqual({ to: '0x123', value: 100n })
	})

	it('should convert a BaseError-like with _tag InvalidTransaction to InvalidTransactionError', () => {
		const baseErrorLike = {
			_tag: 'InvalidTransaction',
			message: 'Invalid transaction',
			code: -32003,
			reason: 'Gas too low',
		}

		const result = toTaggedError(baseErrorLike)
		expect(result._tag).toBe('InvalidTransactionError')
		expect((result as any).reason).toBe('Gas too low')
	})

	it('should convert a BaseError-like StateRootNotFoundError to TaggedError', () => {
		const baseErrorLike = {
			_tag: 'StateRootNotFoundError',
			message: 'State root not found',
			code: -32602,
			stateRoot: '0x1234567890abcdef',
		}

		const result = toTaggedError(baseErrorLike)
		expect(result._tag).toBe('StateRootNotFoundError')
		expect((result as any).stateRoot).toBe('0x1234567890abcdef')
	})

	it('should preserve cause when converting StateRootNotFoundError-like objects', () => {
		const originalError = new Error('State root cause')
		const baseErrorLike = {
			_tag: 'StateRootNotFoundError',
			message: 'State root not found',
			code: -32602,
			stateRoot: '0xabcd',
			cause: originalError,
		}

		const result = toTaggedError(baseErrorLike)
		expect(result.cause).toBe(originalError)
	})

	it('should handle ForkError with non-string method', () => {
		const baseErrorLike = {
			_tag: 'ForkError',
			message: 'Fork request failed',
			code: -32604,
			method: 12345, // Not a string
		}

		const result = toTaggedError(baseErrorLike)
		expect(result._tag).toBe('ForkError')
		expect((result as any).method).toBeUndefined()
	})

	it('should handle InvalidTransactionError with non-string reason', () => {
		const baseErrorLike = {
			_tag: 'InvalidTransactionError',
			message: 'Invalid transaction',
			code: -32003,
			reason: { code: 'INVALID_NONCE' }, // Not a string
		}

		const result = toTaggedError(baseErrorLike)
		expect(result._tag).toBe('InvalidTransactionError')
		expect((result as any).reason).toBeUndefined()
	})

	it('should handle StateRootNotFoundError with non-string stateRoot', () => {
		const baseErrorLike = {
			_tag: 'StateRootNotFoundError',
			message: 'State root not found',
			code: -32602,
			stateRoot: 12345, // Not a string
		}

		const result = toTaggedError(baseErrorLike)
		expect(result._tag).toBe('StateRootNotFoundError')
		expect((result as any).stateRoot).toBeUndefined()
	})
})
