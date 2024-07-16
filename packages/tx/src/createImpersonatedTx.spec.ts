import { Common } from '@ethereumjs/common'
import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx'
import { InternalError, InvalidGasLimitError } from '@tevm/errors'
import { EthjsAddress } from '@tevm/utils'
import { type MockedFunction, afterEach, describe, expect, it, vi } from 'vitest'
import { createImpersonatedTx } from './createImpersonatedTx.js'

vi.mock('@ethereumjs/tx', async () => {
	const actualEthjsTx = (await vi.importActual('@ethereumjs/tx')) as any
	const mockClass = vi.fn()
	mockClass.mockImplementation((...args: any[]) => {
		return new actualEthjsTx.FeeMarketEIP1559Transaction(...args)
	})
	return {
		...actualEthjsTx,
		FeeMarketEIP1559Transaction: mockClass,
	}
})

const FeeMarketEIP1559TransactionMock = FeeMarketEIP1559Transaction as unknown as MockedFunction<any>

afterEach(async () => {
	vi.resetAllMocks()
	const actualEthjsTx = (await vi.importActual('@ethereumjs/tx')) as any
	FeeMarketEIP1559TransactionMock.mockImplementation((...args: any[]) => {
		return new actualEthjsTx.FeeMarketEIP1559Transaction(...args)
	})
})

describe(createImpersonatedTx.name, () => {
	it('should create an EIP-1559 tx impersonating the address', () => {
		const impersonatedAddress = EthjsAddress.fromString(`0x${'42'.repeat(20)}`)
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

	it('should support Object.keys', () => {
		const impersonatedAddress = EthjsAddress.fromString(`0x${'42'.repeat(20)}`)
		expect(Object.keys(createImpersonatedTx({ impersonatedAddress }))).toMatchSnapshot()
	})

	it('should throw InternalError if EIP-1559 is not enabled', () => {
		const common = Common.custom(
			{},
			{
				eips: [],
			},
		)
		common.isActivatedEIP = (eip) => {
			if (eip === 1559) {
				return false
			}
			return true
		}
		const impersonatedAddress = EthjsAddress.fromString(`0x${'42'.repeat(20)}`)
		const data = '0x5234'
		expect(() => createImpersonatedTx({ impersonatedAddress, data }, { common })).toThrow(
			new InternalError(
				'EIP-1559 is not enabled on Common. Tevm currently only supports 1559 and it should be enabled by default',
				{ cause: new Error('EIP-1559 not enabled on Common') },
			),
		)
	})

	it('should throw InvalidGasLimitError if bigger than MAX_INTEGER', () => {
		const impersonatedAddress = EthjsAddress.fromString(`0x${'42'.repeat(20)}`)
		const data = '0x5234'
		const ethjsError = new Error(
			'gasLimit cannot exceed MAX_UINT64 (2^64-1), given 374144419156711147060143317175368453031918731001855 (tx type=2 hash=not available (unsigned) nonce=0 value=0 signed=false hf=error maxFeePerGas=undefined maxPriorityFeePerGas=undefined)',
		)
		FeeMarketEIP1559TransactionMock.mockImplementation(() => {
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
		FeeMarketEIP1559TransactionMock.mockImplementation(() => {
			throw expectedError
		})
		const impersonatedAddress = EthjsAddress.fromString(`0x${'42'.repeat(20)}`)
		const data = '0x5234'
		expect(() => createImpersonatedTx({ impersonatedAddress, data, maxFeePerGas: 0n })).toThrow(
			new InvalidGasLimitError(expectedError.message, { cause: expectedError }),
		)
	})

	it('should throw an error if FeeMarketEIP1559Transaction throws', () => {
		const expectedError = new Error('Constructor error')
		FeeMarketEIP1559TransactionMock.mockImplementation(() => {
			throw expectedError
		})

		const impersonatedAddress = EthjsAddress.fromString(`0x${'42'.repeat(20)}`)
		const data = '0x5234'
		expect(() => createImpersonatedTx({ impersonatedAddress, data })).toThrow(
			new InternalError(expectedError.message, { cause: expectedError }),
		)
	})

	it('should throw an error if FeeMarketEIP1559Transaction throws non error', () => {
		const notError = { not: 'error' }
		FeeMarketEIP1559TransactionMock.mockImplementation(() => {
			throw notError
		})
		const impersonatedAddress = EthjsAddress.fromString(`0x${'42'.repeat(20)}`)
		const data = '0x5234'
		expect(() => createImpersonatedTx({ impersonatedAddress, data })).toThrow(
			new InternalError('Unknown Error', { cause: notError }),
		)
	})
})
