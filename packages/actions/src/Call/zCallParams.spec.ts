import { expect, test } from 'vitest'
import type { CallParams } from './CallParams.js'
import { validateCallParamsZod } from './zCallParams.js'

test('validateCallParamsZod', () => {
	const callParams: CallParams = {
		blobVersionedHashes: ['0x0000000'],
		blockTag: 'safe',
		data: '0x4242',
		gas: 0x420n,
		caller: `0x${'69'.repeat(20)}`,
		code: `0x${'69'.repeat(32)}`,
	}
	const result = validateCallParamsZod(callParams)
	expect(result.isValid).toBe(true)

	const invalidResult = validateCallParamsZod('0x4')
	expect(invalidResult.isValid).toBe(false)
})

test('should not allow both code and deployedBytecode', () => {
	const params = {
		code: '0x1234',
		deployedBytecode: '0x5678',
	}
	const result = validateCallParamsZod(params)
	expect(result.isValid).toBe(false)
	expect(result.errors.some((err) => err.message.includes('Cannot have both code and deployedBytecode'))).toBe(true)
})

test('should not allow createTransaction with stateOverrideSet', () => {
	const params = {
		createTransaction: true,
		stateOverrideSet: {},
	}
	const result = validateCallParamsZod(params)
	expect(result.isValid).toBe(false)
	expect(result.errors.some((err) => err.message.includes('Cannot have stateOverrideSet for createTransaction'))).toBe(
		true,
	)
})

test('should not allow createTransaction with blockOverrideSet', () => {
	const params = {
		createTransaction: true,
		blockOverrideSet: {},
	}
	const result = validateCallParamsZod(params)
	expect(result.isValid).toBe(false)
	expect(result.errors.some((err) => err.message.includes('Cannot have blockOverrideSet for createTransaction'))).toBe(
		true,
	)
})
