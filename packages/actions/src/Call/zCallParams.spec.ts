import { expect, test } from 'vitest'
import type { CallParams } from './CallParams.js'
import { validateCallParamsZod } from './zCallParams.js'

test('validateCallParamsZod should validate correct params', () => {
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
})

test('validateCallParamsZod should invalidate non-object params', () => {
	const result = validateCallParamsZod('0x4')
	expect(result.isValid).toBe(false)
	expect(result.errors).toHaveLength(1)
	expect(result.errors?.[0]?.message).toContain('must be an object')
})

test('should not allow both code and deployedBytecode', () => {
	const params = {
		code: '0x1234',
		deployedBytecode: '0x5678',
	}
	const result = validateCallParamsZod(params)
	expect(result.isValid).toBe(false)
	expect(result.errors.some((e) => e.message.includes('Cannot have both code and deployedBytecode'))).toBe(true)
})

test('should not allow createTransaction with stateOverrideSet', () => {
	const params = {
		createTransaction: true,
		stateOverrideSet: {},
	}
	const result = validateCallParamsZod(params)
	expect(result.isValid).toBe(false)
	expect(result.errors.some((e) => e.message.includes('Cannot have stateOverrideSet'))).toBe(true)
})

test('should not allow createTransaction with blockOverrideSet', () => {
	const params = {
		createTransaction: true,
		blockOverrideSet: {},
	}
	const result = validateCallParamsZod(params)
	expect(result.isValid).toBe(false)
	expect(result.errors.some((e) => e.message.includes('Cannot have blockOverrideSet'))).toBe(true)
})
