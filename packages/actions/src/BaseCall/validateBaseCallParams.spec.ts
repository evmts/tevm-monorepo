import { expect, test } from 'bun:test'
import {
	InvalidBlobVersionedHashesError,
	InvalidBlockError,
	InvalidCallerError,
	InvalidDepthError,
	InvalidGasPriceError,
	InvalidGasRefundError,
	InvalidMaxFeePerGasError,
	InvalidMaxPriorityFeePerGasError,
	InvalidOriginError,
	InvalidParamsError,
	InvalidSelfdestructError,
	InvalidSkipBalanceError,
	InvalidToError,
	InvalidValueError,
} from '@tevm/errors'
import type { BaseCallParams } from './BaseCallParams.js'
import { validateBaseCallParams } from './validateBaseCallParams.js'

const validParamsCases: Array<BaseCallParams> = [
	{
		throwOnFail: true,
		blockOverrideSet: {
			time: 1234567890n,
			number: 1234567890n,
			baseFee: 1000000000n,
			coinbase: '0x1234567890abcdef1234567890abcdef12345678',
			gasLimit: 1000000n,
			blobBaseFee: 1000000000n,
		},
		createTrace: true,
		createAccessList: false,
		createTransaction: 'on-success',
		blockTag: 'latest',
		skipBalance: false,
		gas: 21000n,
		gasPrice: 1000000000n,
		gasRefund: 0n,
		from: '0x1234567890abcdef1234567890abcdef12345678',
		origin: '0x1234567890abcdef1234567890abcdef12345678',
		caller: '0x1234567890abcdef1234567890abcdef12345678',
		value: 100n,
		depth: 0,
		selfdestruct: new Set(['0x1234567890abcdef1234567890abcdef12345678']),
		to: '0x1234567890abcdef1234567890abcdef12345678',
		blobVersionedHashes: ['0x1234567890abcdef1234567890abcdef12345678'],
	},
	{
		throwOnFail: false,
		createTrace: false,
		createAccessList: true,
		createTransaction: 'always',
		blockTag: 'pending',
		skipBalance: true,
		gas: 30000n,
		gasPrice: 2000000000n,
		gasRefund: 500n,
		from: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
		origin: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
		caller: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
		value: 200n,
		depth: 1,
		selfdestruct: new Set(['0xabcdefabcdefabcdefabcdefabcdefabcdefabcd']),
		to: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
		blobVersionedHashes: ['0xabcdefabcdefabcdefabcdefabcdefabcdefabcd'],
	},
	{
		createTrace: true,
		createAccessList: false,
		createTransaction: 'never',
		blockTag: 'earliest',
		skipBalance: true,
		gas: 50000n,
		gasPrice: 3000000000n,
		gasRefund: 1000n,
		from: '0xaabbccddeeff00112233445566778899aabbccdd',
		origin: '0xaabbccddeeff00112233445566778899aabbccdd',
		caller: '0xaabbccddeeff00112233445566778899aabbccdd',
		value: 300n,
		depth: 2,
		selfdestruct: new Set(['0xaabbccddeeff00112233445566778899aabbccdd']),
		to: '0xaabbccddeeff00112233445566778899aabbccdd',
		blobVersionedHashes: ['0xaabbccddeeff00112233445566778899aabbccdd'],
	},
	{
		createTrace: false,
		createAccessList: false,
		createTransaction: true,
		blockTag: 'pending',
		skipBalance: false,
		gas: 60000n,
		gasPrice: 4000000000n,
		gasRefund: 2000n,
		from: '0x1111111111111111111111111111111111111111',
		origin: '0x1111111111111111111111111111111111111111',
		caller: '0x1111111111111111111111111111111111111111',
		value: 400n,
		depth: 3,
		selfdestruct: new Set(['0x1111111111111111111111111111111111111111']),
		to: '0x1111111111111111111111111111111111111111',
		blobVersionedHashes: ['0x1111111111111111111111111111111111111111'],
		maxFeePerGas: 5000000000n,
	},
	{
		createTrace: true,
		createAccessList: true,
		createTransaction: 'always',
		blockTag: 'latest',
		skipBalance: true,
		gas: 70000n,
		gasPrice: 5000000000n,
		gasRefund: 3000n,
		from: '0x2222222222222222222222222222222222222222',
		origin: '0x2222222222222222222222222222222222222222',
		caller: '0x2222222222222222222222222222222222222222',
		value: 500n,
		depth: 4,
		selfdestruct: new Set(['0x2222222222222222222222222222222222222222']),
		to: '0x2222222222222222222222222222222222222222',
		blobVersionedHashes: ['0x2222222222222222222222222222222222222222'],
	},
	{
		createTrace: false,
		createAccessList: false,
		createTransaction: 'on-success',
		blockTag: 'earliest',
		skipBalance: false,
		gas: 80000n,
		gasPrice: 6000000000n,
		gasRefund: 4000n,
		from: '0x3333333333333333333333333333333333333333',
		origin: '0x3333333333333333333333333333333333333333',
		caller: '0x3333333333333333333333333333333333333333',
		value: 600n,
		depth: 5,
		selfdestruct: new Set(['0x3333333333333333333333333333333333333333']),
		to: '0x3333333333333333333333333333333333333333',
		blobVersionedHashes: ['0x3333333333333333333333333333333333333333'],
		maxPriorityFeePerGas: 7000000000n,
	},
] as const

test('should return no errors for valid parameters', () => {
	validParamsCases.forEach((params) => {
		const errors = validateBaseCallParams(params)
		expect(errors).toEqual([])
	})
})

const mockInvalidParams = {
	skipBalance: 'invalid', // should be a boolean
	gasRefund: -1, // should be a positive number
	blockTag: 123, // should be a string
	gas: 'invalid', // should be a number
	origin: 'invalid address', // should be a valid address
	caller: 12345, // should be a string
	value: 'invalid', // should be a number
	depth: -1, // should be a positive number
	selfdestruct: 'invalid', // should be a boolean
	to: 12345, // should be a string
	blobVersionedHashes: ['invalid hash'], // should be a valid hash
	maxFeePerGas: 'not a number', // should be a number
	maxPriorityFeePerGas: 'not a number', // should be a number
}

test('should work for invalid blobVersionedHashes', () => {
	expect(
		validateBaseCallParams({
			blobVersionedHashes: { not: 'an array' } as any,
		}),
	).toEqual([new InvalidBlobVersionedHashesError('Expected array, received object')])
	expect(
		validateBaseCallParams({
			blobVersionedHashes: [5] as any,
		}),
	).toEqual([new InvalidBlobVersionedHashesError('Expected string, received number')])
	expect(
		validateBaseCallParams({
			blobVersionedHashes: ['invalid hash'] as any,
		}),
	).toEqual([new InvalidBlobVersionedHashesError('value must be a hex string')])
})

test('should return errors for invalid parameters', () => {
	const errors = validateBaseCallParams(mockInvalidParams as any)
	expect(errors.find((e) => e instanceof InvalidSkipBalanceError)).toBeDefined()
	expect(errors.find((e) => e instanceof InvalidGasRefundError)).toBeDefined()
	expect(errors.find((e) => e instanceof InvalidBlockError)).toBeDefined()
	expect(errors.find((e) => e instanceof InvalidGasPriceError)).toBeDefined()
	expect(errors.find((e) => e instanceof InvalidOriginError)).toBeDefined()
	expect(errors.find((e) => e instanceof InvalidCallerError)).toBeDefined()
	expect(errors.find((e) => e instanceof InvalidGasPriceError)).toBeDefined()
	expect(errors.find((e) => e instanceof InvalidValueError)).toBeDefined()
	expect(errors.find((e) => e instanceof InvalidDepthError)).toBeDefined()
	expect(errors.find((e) => e instanceof InvalidSelfdestructError)).toBeDefined()
	expect(errors.find((e) => e instanceof InvalidToError)).toBeDefined()
	expect(errors.find((e) => e instanceof InvalidDepthError)).toBeDefined()
	expect(errors.find((e) => e instanceof InvalidBlobVersionedHashesError)).toBeDefined()
	expect(errors.find((e) => e instanceof InvalidMaxFeePerGasError)).toBeDefined()
	expect(errors.find((e) => e instanceof InvalidMaxPriorityFeePerGasError)).toBeDefined()
})

test('should validate if top level is wrong', () => {
	const errors = validateBaseCallParams('not an object' as any)
	expect(errors).toContainEqual(expect.any(InvalidParamsError))
	expect(errors).toMatchSnapshot()
})

test('should match snapshot for invalid parameters', () => {
	const errors = validateBaseCallParams(mockInvalidParams as any)
	expect(errors).toMatchSnapshot()
})
