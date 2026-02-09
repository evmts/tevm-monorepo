import {
	InsufficientBalanceError,
	InsufficientFundsError,
	InvalidJumpError,
	InvalidOpcodeError,
	OutOfGasError,
	RevertError,
	StackOverflowError,
	StackUnderflowError,
	TevmError,
} from '@tevm/errors-effect'
import { describe, expect, it } from 'vitest'
import { mapEvmError } from './mapEvmError.js'

describe('mapEvmError', () => {
	describe('error pattern detection', () => {
		it('should map "out of gas" errors to OutOfGasError', () => {
			const error = new Error('Out of gas: execution used all available gas')
			const result = mapEvmError(error)
			expect(result).toBeInstanceOf(OutOfGasError)
			expect(result._tag).toBe('OutOfGasError')
			expect(result.cause).toBe(error)
		})

		it('should map "OOG" errors to OutOfGasError', () => {
			const error = new Error('OOG during execution')
			const result = mapEvmError(error)
			expect(result).toBeInstanceOf(OutOfGasError)
		})

		it('should map "revert" errors to RevertError', () => {
			const error = new Error('Transaction reverted without a reason')
			const result = mapEvmError(error)
			expect(result).toBeInstanceOf(RevertError)
			expect(result._tag).toBe('RevertError')
			expect(result.cause).toBe(error)
		})

		it('should map "invalid opcode" errors to InvalidOpcodeError', () => {
			const error = new Error('Invalid opcode: 0xfe')
			const result = mapEvmError(error)
			expect(result).toBeInstanceOf(InvalidOpcodeError)
			expect(result._tag).toBe('InvalidOpcodeError')
		})

		it('should map "stack overflow" errors to StackOverflowError', () => {
			const error = new Error('Stack overflow: exceeded 1024 items')
			const result = mapEvmError(error)
			expect(result).toBeInstanceOf(StackOverflowError)
			expect(result._tag).toBe('StackOverflowError')
		})

		it('should map "stack underflow" errors to StackUnderflowError', () => {
			const error = new Error('Stack underflow: need 2 items, have 1')
			const result = mapEvmError(error)
			expect(result).toBeInstanceOf(StackUnderflowError)
			expect(result._tag).toBe('StackUnderflowError')
		})

		it('should map "insufficient balance" errors to InsufficientBalanceError', () => {
			const error = new Error('Insufficient balance for transfer')
			const result = mapEvmError(error)
			expect(result).toBeInstanceOf(InsufficientBalanceError)
			expect(result._tag).toBe('InsufficientBalanceError')
		})

		it('should map "insufficient funds" errors to InsufficientFundsError', () => {
			const error = new Error('Insufficient funds for gas * price + value')
			const result = mapEvmError(error)
			expect(result).toBeInstanceOf(InsufficientFundsError)
			expect(result._tag).toBe('InsufficientFundsError')
		})

		it('should map "invalid jump" errors to InvalidJumpError', () => {
			const error = new Error('Invalid jump destination')
			const result = mapEvmError(error)
			expect(result).toBeInstanceOf(InvalidJumpError)
			expect(result._tag).toBe('InvalidJumpError')
		})

		it('should map "bad jump destination" errors to InvalidJumpError', () => {
			const error = new Error('Bad jump destination at 0x123')
			const result = mapEvmError(error)
			expect(result).toBeInstanceOf(InvalidJumpError)
		})
	})

	describe('default case', () => {
		it('should map unrecognized errors to TevmError', () => {
			const error = new Error('Some unknown EVM error')
			const result = mapEvmError(error)
			expect(result).toBeInstanceOf(TevmError)
			expect(result._tag).toBe('TevmError')
			expect(result.message).toContain('EVM execution error')
			expect(result.message).toContain('Some unknown EVM error')
		})
	})

	describe('non-Error inputs', () => {
		it('should handle string errors', () => {
			const result = mapEvmError('Out of gas')
			expect(result).toBeInstanceOf(OutOfGasError)
		})

		it('should handle non-string, non-Error inputs', () => {
			const result = mapEvmError({ error: 'unknown' })
			expect(result).toBeInstanceOf(TevmError)
		})

		it('should handle null input', () => {
			const result = mapEvmError(null)
			expect(result).toBeInstanceOf(TevmError)
		})

		it('should handle undefined input', () => {
			const result = mapEvmError(undefined)
			expect(result).toBeInstanceOf(TevmError)
		})
	})

	describe('case insensitivity', () => {
		it('should match errors case-insensitively', () => {
			const error1 = new Error('OUT OF GAS')
			const error2 = new Error('Out Of Gas')
			const error3 = new Error('REVERT')

			expect(mapEvmError(error1)).toBeInstanceOf(OutOfGasError)
			expect(mapEvmError(error2)).toBeInstanceOf(OutOfGasError)
			expect(mapEvmError(error3)).toBeInstanceOf(RevertError)
		})
	})

	describe('cause preservation', () => {
		it('should preserve the original error as cause', () => {
			const originalError = new Error('Stack overflow')
			const result = mapEvmError(originalError)
			expect(result.cause).toBe(originalError)
		})
	})
})
