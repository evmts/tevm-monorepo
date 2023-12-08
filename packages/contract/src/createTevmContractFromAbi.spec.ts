import { createTevmContractFromAbi } from './createTevmContractFromAbi'
import { dummyAbi } from './test/fixtures'
import { describe, expect, it } from 'vitest'

describe(createTevmContractFromAbi.name, () => {
	const contract = createTevmContractFromAbi({
		bytecode: undefined,
		abi: dummyAbi,
		name: 'DummyContract',
		deployedBytecode: undefined,
	})

	it('should have correct name', () => {
		expect(contract.name).toBe('DummyContract')
	})

	it('should contain the ABI', () => {
		expect(contract.abi).toMatchInlineSnapshot(`
			[
			  {
			    "inputs": [
			      {
			        "name": "str",
			        "type": "string",
			      },
			      {
			        "name": "num",
			        "type": "uint256",
			      },
			    ],
			    "name": "exampleWrite",
			    "outputs": [
			      {
			        "name": "",
			        "type": "string",
			      },
			    ],
			    "stateMutability": "payable",
			    "type": "function",
			  },
			  {
			    "inputs": [
			      {
			        "name": "str",
			        "type": "string",
			      },
			    ],
			    "name": "overloadedWrite",
			    "outputs": [
			      {
			        "name": "",
			        "type": "string",
			      },
			    ],
			    "stateMutability": "payable",
			    "type": "function",
			  },
			  {
			    "inputs": [],
			    "name": "overloadedWrite",
			    "outputs": [
			      {
			        "name": "",
			        "type": "string",
			      },
			    ],
			    "stateMutability": "payable",
			    "type": "function",
			  },
			  {
			    "inputs": [
			      {
			        "name": "str",
			        "type": "string",
			      },
			      {
			        "name": "num",
			        "type": "uint256",
			      },
			    ],
			    "name": "exampleRead",
			    "outputs": [
			      {
			        "name": "",
			        "type": "string",
			      },
			    ],
			    "stateMutability": "pure",
			    "type": "function",
			  },
			  {
			    "inputs": [],
			    "name": "exampleReadNoArgs",
			    "outputs": [
			      {
			        "name": "",
			        "type": "string",
			      },
			    ],
			    "stateMutability": "pure",
			    "type": "function",
			  },
			  {
			    "inputs": [
			      {
			        "name": "str",
			        "type": "string",
			      },
			    ],
			    "name": "overloadedRead",
			    "outputs": [
			      {
			        "name": "",
			        "type": "string",
			      },
			    ],
			    "stateMutability": "pure",
			    "type": "function",
			  },
			  {
			    "inputs": [],
			    "name": "overloadedRead",
			    "outputs": [
			      {
			        "name": "",
			        "type": "string",
			      },
			    ],
			    "stateMutability": "pure",
			    "type": "function",
			  },
			  {
			    "inputs": [
			      {
			        "indexed": false,
			        "name": "data",
			        "type": "string",
			      },
			    ],
			    "name": "exampleEvent",
			    "type": "event",
			  },
			]
		`)
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
