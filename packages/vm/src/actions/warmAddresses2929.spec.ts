import { type Mock, beforeEach, describe, expect, it, jest } from 'bun:test'
import { EthjsAddress, bytesToUnprefixedHex } from '@tevm/utils'
import type { Vm } from '../Vm.js'
import { warmAddresses2929 } from './warmAddresses2929.js'

describe('warmAddresses2929', () => {
	let vm: Vm
	let caller: EthjsAddress
	let to: EthjsAddress | undefined
	let coinbase: EthjsAddress

	beforeEach(() => {
		caller = EthjsAddress.fromString(`0x${'11'.repeat(20)}`)
		to = EthjsAddress.fromString(`0x${'22'.repeat(20)}`)
		coinbase = EthjsAddress.fromString(`0x${'33'.repeat(20)}`)

		vm = {
			common: {
				vmConfig: {
					isActivatedEIP: jest.fn().mockReturnValue(false),
				},
			},
			evm: {
				precompiles: new Map([
					['0x01', {}],
					['0x02', {}],
				]),
				journal: {
					addAlwaysWarmAddress: jest.fn(),
				},
			},
		} as unknown as Vm
	})

	it('should not add any addresses if EIP 2929 is not activated', () => {
		warmAddresses2929(vm, caller, to, coinbase)
		expect(vm.evm.journal.addAlwaysWarmAddress).not.toHaveBeenCalled()
	})

	it('should add origin and precompiles to warm addresses if EIP 2929 is activated', () => {
		;(vm.common.vmConfig.isActivatedEIP as Mock<typeof vm.common.vmConfig.isActivatedEIP>).mockImplementation(
			(eip) => eip === 2929,
		)

		warmAddresses2929(vm, caller, to, coinbase)

		expect(vm.evm.journal.addAlwaysWarmAddress).toHaveBeenCalledWith('0x01')
		expect(vm.evm.journal.addAlwaysWarmAddress).toHaveBeenCalledWith('0x02')
		expect(vm.evm.journal.addAlwaysWarmAddress).toHaveBeenCalledWith(caller.toString())
		expect(vm.evm.journal.addAlwaysWarmAddress).toHaveBeenCalledWith(bytesToUnprefixedHex(to?.bytes as any))
		expect(vm.evm.journal.addAlwaysWarmAddress).not.toHaveBeenCalledWith(coinbase.toString())
	})

	it('should add coinbase to warm addresses if EIP 3651 is also activated', () => {
		;(vm.common.vmConfig.isActivatedEIP as Mock<typeof vm.common.vmConfig.isActivatedEIP>).mockImplementation(
			(eip) => eip === 2929 || eip === 3651,
		)

		warmAddresses2929(vm, caller, to, coinbase)

		expect(vm.evm.journal.addAlwaysWarmAddress).toHaveBeenCalledWith('0x01')
		expect(vm.evm.journal.addAlwaysWarmAddress).toHaveBeenCalledWith('0x02')
		expect(vm.evm.journal.addAlwaysWarmAddress).toHaveBeenCalledWith(caller.toString())
		expect(vm.evm.journal.addAlwaysWarmAddress).toHaveBeenCalledWith(bytesToUnprefixedHex(to?.bytes as any))
		expect(vm.evm.journal.addAlwaysWarmAddress).toHaveBeenCalledWith(bytesToUnprefixedHex(coinbase.bytes))
	})

	it('should handle undefined "to" address correctly', () => {
		;(vm.common.vmConfig.isActivatedEIP as Mock<typeof vm.common.vmConfig.isActivatedEIP>).mockImplementation(
			(eip) => eip === 2929,
		)
		to = undefined

		warmAddresses2929(vm, caller, to, coinbase)

		expect(vm.evm.journal.addAlwaysWarmAddress).toHaveBeenCalledWith('0x01')
		expect(vm.evm.journal.addAlwaysWarmAddress).toHaveBeenCalledWith('0x02')
		expect(vm.evm.journal.addAlwaysWarmAddress).toHaveBeenCalledWith(caller.toString())
		expect(vm.evm.journal.addAlwaysWarmAddress).not.toHaveBeenCalledWith(coinbase.toString())
	})
})
