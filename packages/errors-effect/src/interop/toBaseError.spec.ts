import { describe, expect, it } from 'vitest'
import { toBaseError } from './toBaseError.js'
import { TevmError } from '../TevmError.js'
import { InsufficientBalanceError } from '../evm/InsufficientBalanceError.js'
import { OutOfGasError } from '../evm/OutOfGasError.js'

describe('toBaseError', () => {
	it('should convert TevmError to BaseError-like object', () => {
		const error = new TevmError({
			message: 'Test error',
			code: -32000,
			docsPath: '/reference/tevm/errors/',
		})

		const result = toBaseError(error)

		expect(result._tag).toBe('TevmError')
		expect(result.name).toBe('TevmError')
		expect(result.message).toBe('Test error')
		expect(result.code).toBe(-32000)
		expect(result.docsPath).toBe('/reference/tevm/errors/')
		expect(result.shortMessage).toBe('Test error')
		expect(result.version).toBe('1.0.0-next.148')
	})

	it('should convert InsufficientBalanceError to BaseError-like object', () => {
		const error = new InsufficientBalanceError({
			address: '0x1234567890123456789012345678901234567890',
			required: 100n,
			available: 50n,
		})

		const result = toBaseError(error)

		expect(result._tag).toBe('InsufficientBalanceError')
		expect(result.name).toBe('InsufficientBalanceError')
		expect(result.code).toBe(-32000)
		expect(result.docsPath).toBe('/reference/tevm/errors/classes/insufficientbalanceerror/')
	})

	it('should convert OutOfGasError to BaseError-like object', () => {
		const error = new OutOfGasError({
			gasUsed: 100000n,
			gasLimit: 21000n,
		})

		const result = toBaseError(error)

		expect(result._tag).toBe('OutOfGasError')
		expect(result.name).toBe('OutOfGasError')
		expect(result.code).toBe(-32003)
	})

	it('should produce an Error instance', () => {
		const error = new TevmError({
			message: 'Test error',
			code: -32000,
		})

		const result = toBaseError(error)

		expect(result).toBeInstanceOf(Error)
	})

	it('should be throwable', () => {
		const error = new TevmError({
			message: 'Throwable error',
			code: -32000,
		})

		const result = toBaseError(error)

		expect(() => {
			throw result
		}).toThrow('Throwable error')
	})

	it('should preserve undefined docsPath', () => {
		const error = new TevmError({
			message: 'Test error',
			code: -32000,
		})

		const result = toBaseError(error)

		expect(result.docsPath).toBeUndefined()
	})
})
