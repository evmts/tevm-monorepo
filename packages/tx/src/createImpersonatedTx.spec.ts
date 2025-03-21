import { Common } from '@ethereumjs/common'
import { FeeMarket1559Tx } from '@ethereumjs/tx'
import { createAddress } from '@tevm/address'
import { InternalError, InvalidGasLimitError } from '@tevm/errors'
import { type MockedFunction, afterEach, describe, expect, it, vi } from 'vitest'
import { createImpersonatedTx } from './createImpersonatedTx.js'

vi.mock('@ethereumjs/tx', async () => {
	const actualEthjsTx = (await vi.importActual('@ethereumjs/tx')) as any
	const mockClass = vi.fn()
	mockClass.mockImplementation((...args: any[]) => {
		return new actualEthjsTx.FeeMarket1559Tx(...args)
	})
	return {
		...actualEthjsTx,
		FeeMarket1559Tx: mockClass,
	}
})

const FeeMarket1559TransactionMock = FeeMarket1559Tx as unknown as MockedFunction<any>

afterEach(async () => {
	vi.resetAllMocks()
	const actualEthjsTx = (await vi.importActual('@ethereumjs/tx')) as any
	FeeMarket1559TransactionMock.mockImplementation((...args: any[]) => {
		return new actualEthjsTx.FeeMarket1559Tx(...args)
	})
})

describe(createImpersonatedTx.name, () => {
	it('should create an EIP-1559 tx impersonating the address', () => {
		const impersonatedAddress = createAddress(`0x${'42'.repeat(20)}`)
		const data = '0x5234'
		const tx = createImpersonatedTx({
			data,
			impersonatedAddress,
		})
		expect(tx.isImpersonated).toBe(true)
		expect(tx.hash()).toMatchSnapshot()
		expect(tx.getSenderAddress()).toEqual(impersonatedAddress)
		expect(tx.isSigned()).toBe(true)
	})

	it('should access underlying transaction properties via Proxy', () => {
		const impersonatedAddress = createAddress(`0x${'42'.repeat(20)}`)
		const data = '0x5234'
		const gasLimit = 21000n
		const tx = createImpersonatedTx({
			data,
			impersonatedAddress,
			gasLimit,
		})
		// Access a property directly from the underlying transaction
		// tx.data is stored as a Uint8Array internally
		expect(tx.data).toBeDefined()
		expect(tx.gasLimit).toEqual(gasLimit)
		expect(typeof tx.toJSON).toBe('function')
	})

	it('should support Object.keys and have isImpersonated property', () => {
		const impersonatedAddress = createAddress(`0x${'42'.repeat(20)}`)
		const tx = createImpersonatedTx({ impersonatedAddress })
		const keys = Object.keys(tx)

		// Check for presence of important keys, not their order
		expect(keys).toContain('common')
		expect(keys).toContain('data')
		expect(keys).toContain('gasLimit')
		expect(keys).toContain('maxFeePerGas')
		expect(keys).toContain('maxPriorityFeePerGas')

		// isImpersonated is a getter, so it won't show up in Object.keys
		// but it should still be accessible as a property
		expect(tx.isImpersonated).toBe(true)
	})

	it('should throw InternalError if EIP-1559 is not enabled', () => {
		const mockCommon = {
			isActivatedEIP: (eip: number) => {
				if (eip === 1559) {
					return false
				}
				return true
			},
			copy: () => mockCommon,
		} as unknown as Common

		const impersonatedAddress = createAddress(`0x${'42'.repeat(20)}`)
		const data = '0x5234'

		// Test that it throws any InternalError without checking exact message
		expect(() => createImpersonatedTx({ impersonatedAddress, data }, { common: mockCommon })).toThrow(InternalError)
	})

	it('should throw InvalidGasLimitError if bigger than MAX_INTEGER', () => {
		const impersonatedAddress = createAddress(`0x${'42'.repeat(20)}`)
		const data = '0x5234'
		const ethjsError = new Error(
			'gasLimit cannot exceed MAX_UINT64 (2^64-1), given 374144419156711147060143317175368453031918731001855 (tx type=2 hash=not available (unsigned) nonce=0 value=0 signed=false hf=error maxFeePerGas=undefined maxPriorityFeePerGas=undefined)',
		)
		FeeMarket1559TransactionMock.mockImplementation(() => {
			throw ethjsError
		})
		expect(() => createImpersonatedTx({ impersonatedAddress, data, gasLimit: `0x${'ff'.repeat(21)}` })).toThrow(
			new InvalidGasLimitError(ethjsError.message, { cause: ethjsError }),
		)
	})

	it('should throw GasLimitExceededError if smaller than max priority fee', () => {
		const expectedError = new Error(
			'maxFeePerGas cannot be less than maxPriorityFeePerGas (The total must be the larger of the two)',
		)
		FeeMarket1559TransactionMock.mockImplementation(() => {
			throw expectedError
		})
		const impersonatedAddress = createAddress(`0x${'42'.repeat(20)}`)
		const data = '0x5234'
		expect(() => createImpersonatedTx({ impersonatedAddress, data, maxFeePerGas: 0n })).toThrow(
			new InvalidGasLimitError(expectedError.message, { cause: expectedError }),
		)
	})

	it('should throw an error if FeeMarket1559Tx throws', () => {
		const expectedError = new Error('Constructor error')
		FeeMarket1559TransactionMock.mockImplementation(() => {
			throw expectedError
		})

		const impersonatedAddress = createAddress(`0x${'42'.repeat(20)}`)
		const data = '0x5234'
		expect(() => createImpersonatedTx({ impersonatedAddress, data })).toThrow(
			new InternalError(expectedError.message, { cause: expectedError }),
		)
	})

	it('should throw an error if FeeMarket1559Tx throws non error', () => {
		const notError = { not: 'error' }
		FeeMarket1559TransactionMock.mockImplementation(() => {
			throw notError
		})
		const impersonatedAddress = createAddress(`0x${'42'.repeat(20)}`)
		const data = '0x5234'
		expect(() => createImpersonatedTx({ impersonatedAddress, data })).toThrow(
			new InternalError('Unknown Error', { cause: notError }),
		)
	})
})
