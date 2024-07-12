import { validateContractParams } from './validateContractParams.js'
import { describe, expect, it } from 'bun:test'
import { createAddress } from '@tevm/address'

describe('validateContractParams', () => {
	it('should return no errors for valid params', () => {
		expect(
			validateContractParams({
				abi: [],
				functionName: 'myFunction',
				args: [1, 2, 3],
				to: createAddress(420).toString(),
			}),
		).toEqual([])
	})

	it('should return InvalidBytecodeError for invalid code', () => {
		expect(
			validateContractParams({
				// @ts-expect-error
				code: 1234,
				abi: [],
				functionName: 'myFunction',
			}),
		).toMatchSnapshot()
	})

	it('should return InvalidBytecodeError for invalid deployedBytecode', () => {
		expect(
			validateContractParams({
				// @ts-expect-error
				deployedBytecode: 1234,
				abi: [],
				functionName: 'myFunction',
			}),
		).toMatchSnapshot()
	})

	it('should return InvalidAbiError for invalid ABI', () => {
		expect(
			validateContractParams({
				// @ts-expect-error
				abi: 1234,
				functionName: 'myFunction',
			}),
		).toMatchSnapshot()
	})

	it('should return InvalidArgsError for invalid args', () => {
		expect(
			validateContractParams({
				abi: [],
				functionName: 'myFunction',
				// @ts-expect-error
				args: 'invalid args',
			}),
		).toMatchSnapshot()
	})

	it('should return InvalidFunctionNameError for invalid function name', () => {
		expect(
			validateContractParams({
				abi: [],
				// @ts-expect-error
				functionName: 1234,
			}),
		).toMatchSnapshot()
	})

	it('should return InvalidAddressError for invalid address', () => {
		expect(
			validateContractParams({
				abi: [],
				functionName: 'myFunction',
				args: [1, 2, 3],
				// @ts-expect-error
				to: 'not an address',
			}),
		).toMatchSnapshot()
	})

	it('should return multiple errors for multiple invalid fields', () => {
		expect(
			validateContractParams({
				// @ts-expect-error
				code: 1234,
				// @ts-expect-error
				abi: 5678,
				// @ts-expect-error
				functionName: 9012,
				// @ts-expect-error
				to: 'not an address',
			}),
		).toMatchSnapshot()
	})

	it('should return errors from validateBaseCallParams', () => {
		// @ts-expect-error
		const baseErrors = validateContractParams({})
		expect(
			// @ts-expect-error
			validateContractParams({}),
		).toEqual(baseErrors)
	})

	it('should validate that either code or to is provided', () => {
		expect(
			// @ts-expect-error
			validateContractParams({
				abi: [],
				functionName: 'myFunction',
			}),
		).toMatchSnapshot()
	})

	it('should validate that createTransaction and stateOverrideSet cannot be used together', () => {
		// for sake of simpler types we don't throw an ts error
		expect(
			validateContractParams({
				to: createAddress(420).toString(),
				createTransaction: true,
				stateOverrideSet: {
					'0x1234': { nonce: 0n, balance: 0n, code: '0x5678' },
				} as const,
				abi: [],
				functionName: 'myFunction',
			}),
		).toMatchSnapshot()
	})

	it('should validate that createTransaction and blockOverrideSet cannot be used together', () => {
		expect(
			validateContractParams({
				to: createAddress(2).toString(),
				createTransaction: true,
				blockOverrideSet: {
					number: 1n,
					time: 1000n,
				},
				abi: [],
				functionName: 'myFunction',
			}),
		).toMatchSnapshot()
	})
})
