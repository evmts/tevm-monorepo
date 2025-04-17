import { type RunTxResult } from '@tevm/vm'
import { describe, expect, it } from 'vitest'
import { type CallParams } from './CallParams.js'
import { shouldCreateTransaction } from './shouldCreateTransaction.js'

describe('shouldCreateTransaction', () => {
	it('should return false when createTransaction is undefined', () => {
		const params = { createTransaction: undefined } as any as CallParams
		const runTxResult = {} as RunTxResult

		const result = shouldCreateTransaction(params, runTxResult)
		expect(result).toBe(false)
	})

	it('should return true when createTransaction is true', () => {
		const params = { createTransaction: true } as CallParams
		const runTxResult = {} as RunTxResult

		const result = shouldCreateTransaction(params, runTxResult)
		expect(result).toBe(true)
	})

	it('should return true when createTransaction is "always"', () => {
		const params = { createTransaction: 'always' } as CallParams
		const runTxResult = {} as RunTxResult

		const result = shouldCreateTransaction(params, runTxResult)
		expect(result).toBe(true)
	})

	it('should return false when createTransaction is false', () => {
		const params = { createTransaction: false } as CallParams
		const runTxResult = {} as RunTxResult

		const result = shouldCreateTransaction(params, runTxResult)
		expect(result).toBe(false)
	})

	it('should return false when createTransaction is "never"', () => {
		const params = { createTransaction: 'never' } as CallParams
		const runTxResult = {} as RunTxResult

		const result = shouldCreateTransaction(params, runTxResult)
		expect(result).toBe(false)
	})

	it('should return true when createTransaction is "on-success" and there is no exceptionError', () => {
		const params = { createTransaction: 'on-success' } as CallParams
		const runTxResult = { execResult: { exceptionError: undefined } } as any as RunTxResult

		const result = shouldCreateTransaction(params, runTxResult)
		expect(result).toBe(true)
	})

	it('should return false when createTransaction is "on-success" and there is an exceptionError', () => {
		const params = { createTransaction: 'on-success' } as CallParams
		const runTxResult = { execResult: { exceptionError: new Error('test error') } } as any as RunTxResult

		const result = shouldCreateTransaction(params, runTxResult)
		expect(result).toBe(false)
	})

	it('should throw an error when createTransaction has an invalid value', () => {
		const params = { createTransaction: 'invalid-value' } as any as CallParams
		const runTxResult = {} as RunTxResult

		expect(() => shouldCreateTransaction(params, runTxResult)).toThrow(
			'Invalid value for addToMempool/createTransaction: invalid-value',
		)
	})
})
