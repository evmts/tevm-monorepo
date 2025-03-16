import { expect, test } from 'vitest'
import type { CallParams } from './CallParams.js'
import { zCallParams } from './zCallParams.js'

test('zCallParams', () => {
	const callParams: CallParams = {
		blobVersionedHashes: ['0x0000000'],
		blockTag: 'safe',
		data: '0x4242',
		gas: 0x420n,
		caller: `0x${'69'.repeat(20)}`,
		code: `0x${'69'.repeat(32)}`,
	}
	expect(zCallParams.parse(callParams)).toEqual(callParams)
	expect(() => zCallParams.parse('0x4')).toThrow()
})

test('should not allow both code and deployedBytecode', () => {
	const params = {
		code: '0x1234',
		deployedBytecode: '0x5678',
	}
	expect(() => zCallParams.parse(params)).toThrow('Cannot have both code and deployedBytecode set')
})

test('should not allow createTransaction with stateOverrideSet', () => {
	const params = {
		createTransaction: true,
		stateOverrideSet: {},
	}
	expect(() => zCallParams.parse(params)).toThrow(
		'Cannot have stateOverrideSet or blockOverrideSet for createTransaction',
	)
})

test('should not allow createTransaction with blockOverrideSet', () => {
	const params = {
		createTransaction: true,
		blockOverrideSet: {},
	}
	expect(() => zCallParams.parse(params)).toThrow(
		'Cannot have stateOverrideSet or blockOverrideSet for createTransaction',
	)
})
