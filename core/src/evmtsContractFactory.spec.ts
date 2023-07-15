import { evmtsContractFactory } from './evmtsContractFactory'
import { dummyAbi } from './test/fixtures'
import type { Address } from 'abitype'
import { describe, expect, it } from 'vitest'

const dummyAddresses = { 1: '0x12345678' } as const satisfies Record<
	number,
	Address
>

const bytecode = '0x12345678'

describe(evmtsContractFactory.name, () => {
	const contract = evmtsContractFactory({
		abi: dummyAbi,
		name: 'DummyContract',
		addresses: dummyAddresses,
		bytecode,
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

	it('should contain the bytecode', () => {
		expect(contract.bytecode).toEqual(bytecode)
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
})
