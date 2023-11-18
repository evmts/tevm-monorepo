import { evmtsContractFactory } from './evmtsContractFactory'
import { dummyAbi } from './test/fixtures'
import { formatAbi, parseAbi } from 'abitype'
import { describe, expect, it } from 'vitest'

describe(evmtsContractFactory.name, () => {
	const contract = evmtsContractFactory({
		bytecode: undefined,
		humanReadableAbi: formatAbi(dummyAbi),
		name: 'DummyContract',
		deployedBytecode: undefined,
	})

	it('should have correct name', () => {
		expect(contract.name).toBe('DummyContract')
	})

	it('should contain the ABI', () => {
		expect(contract.abi).toEqual(parseAbi(formatAbi(dummyAbi)))
	})

	it('should generate human readable ABI', () => {
		expect(contract.humanReadableAbi).toBeDefined()
	})

	it('should contain read', () => {
		// see ./read for more tests
		expect(contract.read).toMatchInlineSnapshot(`
			{
			  "exampleRead": [Function],
			  "exampleReadNoArgs": [Function],
			  "exampleWrite": [Function],
			  "overloadedRead": [Function],
			  "overloadedWrite": [Function],
			}
		`)
	})

	it('should contain write', () => {
		// see ./write for more tests
		expect(contract.write).toMatchInlineSnapshot(`
			{
			  "exampleRead": [Function],
			  "exampleReadNoArgs": [Function],
			  "exampleWrite": [Function],
			  "overloadedRead": [Function],
			  "overloadedWrite": [Function],
			}
		`)
	})

	it('should contain events', () => {
		// see ./events for more tests
		expect(contract.events).toMatchInlineSnapshot(`
			{
			  "exampleEvent": [Function],
			}
		`)
	})
})
