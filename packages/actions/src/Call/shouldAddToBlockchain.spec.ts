import { type RunTxResult } from '@tevm/vm'
import { describe, expect, it } from 'vitest'
import { type CallParams } from './CallParams.js'
import { shouldAddToBlockchain } from './shouldCreateTransaction.js'

describe('shouldAddToBlockchain', () => {
	it('should return false when addToBlockchain is undefined', () => {
		const params = { addToBlockchain: undefined } as any as CallParams
		const runTxResult = {} as RunTxResult

		const result = shouldAddToBlockchain(params, runTxResult)
		expect(result).toBe(false)
	})

	it('should return true when addToBlockchain is true', () => {
		const params = { addToBlockchain: true } as CallParams
		const runTxResult = {} as RunTxResult

		const result = shouldAddToBlockchain(params, runTxResult)
		expect(result).toBe(true)
	})

	it('should return true when addToBlockchain is "always"', () => {
		const params = { addToBlockchain: 'always' } as CallParams
		const runTxResult = {} as RunTxResult

		const result = shouldAddToBlockchain(params, runTxResult)
		expect(result).toBe(true)
	})

	it('should return false when addToBlockchain is false', () => {
		const params = { addToBlockchain: false } as CallParams
		const runTxResult = {} as RunTxResult

		const result = shouldAddToBlockchain(params, runTxResult)
		expect(result).toBe(false)
	})

	it('should return false when addToBlockchain is "never"', () => {
		const params = { addToBlockchain: 'never' } as CallParams
		const runTxResult = {} as RunTxResult

		const result = shouldAddToBlockchain(params, runTxResult)
		expect(result).toBe(false)
	})

	it('should return true when addToBlockchain is "on-success" and there is no exceptionError', () => {
		const params = { addToBlockchain: 'on-success' } as CallParams
		const runTxResult = { execResult: { exceptionError: undefined } } as any as RunTxResult

		const result = shouldAddToBlockchain(params, runTxResult)
		expect(result).toBe(true)
	})

	it('should return false when addToBlockchain is "on-success" and there is an exceptionError', () => {
		const params = { addToBlockchain: 'on-success' } as CallParams
		const runTxResult = { execResult: { exceptionError: new Error('test error') } } as any as RunTxResult

		const result = shouldAddToBlockchain(params, runTxResult)
		expect(result).toBe(false)
	})

	it('should throw an error when addToBlockchain has an invalid value', () => {
		const params = { addToBlockchain: 'invalid-value' } as any as CallParams
		const runTxResult = {} as RunTxResult

		expect(() => shouldAddToBlockchain(params, runTxResult)).toThrow('Invalid addToBlockchain value: invalid-value')
	})
})
