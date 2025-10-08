import { formatAbi, type Hex, parseAbi } from '@tevm/utils'
import { assertType, describe, expect, it } from 'vitest'
import type { Contract } from './Contract.js'
import { createContract } from './createContract.js'
import { dummyAbi } from './test/fixtures.js'

describe(createContract.name, () => {
	const contract = createContract({
		humanReadableAbi: formatAbi(dummyAbi),
		name: 'DummyContract',
	})

	it('should have correct name', () => {
		expect(contract.name).toBe('DummyContract')
	})

	it('should set deployedBytecode correctly', () => {
		const contractWithoutDeployedBytecode = createContract({
			humanReadableAbi: formatAbi(dummyAbi),
			name: 'DummyContract',
			bytecode: '0x420',
		})
		expect(contractWithoutDeployedBytecode.deployedBytecode).toBeUndefined()

		const contractWithDeployedBytecode = createContract({
			humanReadableAbi: formatAbi(dummyAbi),
			name: 'DummyContract',
			bytecode: '0x420',
			deployedBytecode: '0x69',
		})
		expect(contractWithDeployedBytecode.deployedBytecode).toEqualHex('0x69')
	})

	it('should contain the ABI', () => {
		expect(contract.abi).toEqual(parseAbi(formatAbi(dummyAbi)))
	})

	it('should generate human readable ABI', () => {
		expect(contract.humanReadableAbi).toBeDefined()
	})

	it('deploy should throw if bytecode is not provided', () => {
		expect(() =>
			createContract({
				humanReadableAbi: formatAbi(dummyAbi),
				name: 'DummyContract',
			}).deploy(),
		).toThrowErrorMatchingInlineSnapshot('[Error: Bytecode is required to generate deploy data]')
	})

	it('should contain deploy', () => {
		expect(
			createContract({ humanReadableAbi: formatAbi(dummyAbi), name: 'DummyContract', bytecode: '0x420' }).deploy(),
		).toMatchInlineSnapshot(`
			{
			  "abi": [
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
			          "type": "string",
			        },
			      ],
			      "stateMutability": "pure",
			      "type": "function",
			    },
			    {
			      "inputs": [
			        {
			          "name": "data",
			          "type": "string",
			        },
			      ],
			      "name": "exampleEvent",
			      "type": "event",
			    },
			  ],
			  "bytecode": "0x420",
			}
		`)
		expect(
			createContract({
				humanReadableAbi: ['constructor(uint256 num) payable'] as const,
				bytecode: '0x420',
			} as const).deploy(20n),
		).toMatchInlineSnapshot(`
			{
			  "abi": [
			    {
			      "inputs": [
			        {
			          "name": "num",
			          "type": "uint256",
			        },
			      ],
			      "stateMutability": "payable",
			      "type": "constructor",
			    },
			  ],
			  "args": [
			    20n,
			  ],
			  "bytecode": "0x420",
			}
		`)
	})

	it('should contain read', () => {
		// see ./read for more tests
		expect(contract.read).toMatchInlineSnapshot(`
			{
			  "exampleRead": [Function],
			  "exampleReadNoArgs": [Function],
			  "overloadedRead": [Function],
			}
		`)
	})

	it('should contain write', () => {
		// see ./write for more tests
		expect(contract.write).toMatchInlineSnapshot(`
			{
			  "exampleWrite": [Function],
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

	it('should be able to read write and event with an address', () => {
		expect(contract.withAddress(`0x${'a'.repeat(40)}`).write.exampleWrite('hello', 2n)).toMatchInlineSnapshot(`
			{
			  "abi": [
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
			          "type": "string",
			        },
			      ],
			      "stateMutability": "payable",
			      "type": "function",
			    },
			  ],
			  "address": "0xaAaAaAaaAaAaAaaAaAAAAAAAAaaaAaAaAaaAaaAa",
			  "args": [
			    "hello",
			    2n,
			  ],
			  "functionName": "exampleWrite",
			  "humanReadableAbi": [
			    "function exampleWrite(string str, uint256 num) payable returns (string)",
			  ],
			  "to": "0xaAaAaAaaAaAaAaaAaAAAAAAAAaaaAaAaAaaAaaAa",
			}
		`)
		expect(contract.withAddress(`0x${'a'.repeat(40)}`).read.exampleRead('hello', 2n)).toMatchInlineSnapshot(`
			{
			  "abi": [
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
			          "type": "string",
			        },
			      ],
			      "stateMutability": "pure",
			      "type": "function",
			    },
			  ],
			  "address": "0xaAaAaAaaAaAaAaaAaAAAAAAAAaaaAaAaAaaAaaAa",
			  "args": [
			    "hello",
			    2n,
			  ],
			  "functionName": "exampleRead",
			  "humanReadableAbi": [
			    "function exampleRead(string str, uint256 num) pure returns (string)",
			  ],
			  "to": "0xaAaAaAaaAaAaAaaAaAAAAAAAAaaaAaAaAaaAaaAa",
			}
		`)
		expect(contract.withAddress(`0x${'a'.repeat(40)}`).events.exampleEvent({})).toMatchInlineSnapshot(`
			{
			  "abi": [
			    {
			      "inputs": [
			        {
			          "name": "data",
			          "type": "string",
			        },
			      ],
			      "name": "exampleEvent",
			      "type": "event",
			    },
			  ],
			  "address": "0xaAaAaAaaAaAaAaaAaAAAAAAAAaaaAaAaAaaAaaAa",
			  "bytecode": undefined,
			  "deployedBytecode": undefined,
			  "eventName": "exampleEvent",
			  "humanReadableAbi": [
			    "event exampleEvent(string data)",
			  ],
			}
		`)
	})

	it('should throw if no abi or humanReadableAbi is provided', () => {
		expect(() => createContract({ name: 'ContractWithConstructor' } as any)).toThrowErrorMatchingInlineSnapshot(`
			[InvalidParams: Must provide either humanReadableAbi or abi

			Docs: https://tevm.sh/learn/contracts/
			Version: 1.1.0.next-73]
		`)
	})

	it('should optionally take an abi rather than a humanReadableAbi', () => {
		const contract = createContract({
			name: 'ContractWithConstructor',
			bytecode: '0x123456',
			abi: [
				{
					constant: true,
					inputs: [],
					name: 'name',
					outputs: [
						{
							name: '',
							type: 'string',
						},
					],
					payable: false,
					stateMutability: 'view',
					type: 'function',
				},
			] as const,
		})
		assertType<
			Contract<
				'ContractWithConstructor',
				readonly ['function name() view returns (string)'],
				undefined,
				Hex,
				undefined,
				undefined
			>
		>(contract)
		expect(contract.read.name()).toEqual({
			abi: [
				{
					constant: true,
					inputs: [],
					name: 'name',
					outputs: [
						{
							name: '',
							type: 'string',
						},
					],
					payable: false,
					stateMutability: 'view',
					type: 'function',
				},
			],
			functionName: 'name',
			humanReadableAbi: ['function name() view returns (string)'],
		})
	})

	it('should contain withCode method', () => {
		const contract = createContract({
			humanReadableAbi: formatAbi(dummyAbi),
			name: 'DummyContract',
		})
		expect(contract.withCode).toBeDefined()
		expect(typeof contract.withCode).toBe('function')
	})

	it('should update code properties with withCode method', () => {
		const contract = createContract({
			humanReadableAbi: formatAbi(dummyAbi),
			name: 'DummyContract',
		})
		const updatedContract = contract.withCode('0xabcdef')
		expect(updatedContract.code).toEqualHex('0xabcdef')
	})
})
