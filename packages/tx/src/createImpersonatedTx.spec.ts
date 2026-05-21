import { InternalError, InvalidGasLimitError } from '@evmts/zevm/tx'
import { createAddressFromString } from '@evmts/zevm/util'
import { describe, expect, it } from 'vitest'
import { createImpersonatedTx } from './createImpersonatedTx.js'

describe(createImpersonatedTx.name, () => {
	it('should create an EIP-1559 tx impersonating the address', () => {
		const impersonatedAddress = createAddressFromString(`0x${'42'.repeat(20)}`)
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
		const impersonatedAddress = createAddressFromString(`0x${'42'.repeat(20)}`)
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

	it('should support Object.keys', () => {
		const impersonatedAddress = createAddressFromString(`0x${'42'.repeat(20)}`)
		expect(Object.keys(createImpersonatedTx({ impersonatedAddress }))).toMatchSnapshot()
	})

	it('should throw InvalidGasLimitError if bigger than MAX_INTEGER', () => {
		const impersonatedAddress = createAddressFromString(`0x${'42'.repeat(20)}`)
		const data = '0x5234'
		expect(() => createImpersonatedTx({ impersonatedAddress, data, gasLimit: `0x${'ff'.repeat(21)}` })).toThrow(
			InvalidGasLimitError,
		)
	})

	it('should throw GasLimitExceededError if smaller than max priority fee', () => {
		const impersonatedAddress = createAddressFromString(`0x${'42'.repeat(20)}`)
		const data = '0x5234'
		expect(() =>
			createImpersonatedTx({ impersonatedAddress, data, maxFeePerGas: 0n, maxPriorityFeePerGas: 1n }),
		).toThrow(InvalidGasLimitError)
	})

	it('should throw an error if FeeMarket1559Tx throws', () => {
		const impersonatedAddress = createAddressFromString(`0x${'42'.repeat(20)}`)
		expect(() => createImpersonatedTx({ impersonatedAddress, data: '0xzz' as any })).toThrow(InternalError)
	})
})
