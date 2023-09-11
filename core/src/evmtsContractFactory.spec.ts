import { evmtsContractFactory } from './evmtsContractFactory'
import { dummyAbi } from './test/fixtures'
import type { Address } from 'abitype'
import { describe, expect, it } from 'vitest'

const dummyAddresses = {
	1: '0x8F0EBDaA1cF7106bE861753B0f9F5c0250fE0819',
} as const satisfies Record<number, Address>

describe(evmtsContractFactory.name, () => {
	const contract = evmtsContractFactory({
		abi: dummyAbi,
		name: 'DummyContract',
		addresses: dummyAddresses,
	})

	it('should have correct name', () => {
		expect(contract.name).toBe('DummyContract')
	})

	it('should contain the ABI', () => {
		expect(contract.abi).toEqual(dummyAbi)
	})

	it('should generate human readable ABI', () => {
		expect(contract.humanReadableAbi).toBeDefined()
	})

	it('should contain the addresses', () => {
		expect(contract.addresses).toEqual(dummyAddresses)
	})

	it('should contain read', () => {
		// see ./read for more tests
		expect(contract.read).toMatchInlineSnapshot('[Function]')
	})

	it('should contain write', () => {
		// see ./write for more tests
		expect(contract.write).toMatchInlineSnapshot('[Function]')
	})

	it('should contain events', () => {
		// see ./events for more tests
		expect(contract.events).toMatchInlineSnapshot('[Function]')
	})

	it('should throw is address is not a valid address', () => {
		expect(() => {
			evmtsContractFactory({
				abi: dummyAbi,
				name: 'DummyContract',
				addresses: { 1: '0xnot a valid addy' } as const satisfies Record<
					number,
					Address
				>,
			})
		}).toThrowErrorMatchingInlineSnapshot(
			'"\\"0xnot a valid addy is not a valid ethereum address"',
		)
	})
})
