import { encodeDeployData, formatAbi, parseAbi } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
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

	it('should contain the ABI', () => {
		expect(contract.abi).toEqual(parseAbi(formatAbi(dummyAbi)))
	})

	it('should generate human readable ABI', () => {
		expect(contract.humanReadableAbi).toBeDefined()
	})

	it('should contain deploy', () => {
		expect(contract.deploy()).toMatchInlineSnapshot(`
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
			  "bytecode": undefined,
			}
		`)
		expect(
			createContract({
				humanReadableAbi: ['constructor(uint256 num) payable'] as const,
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
			  "bytecode": undefined,
			}
		`)
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
	it('should handle bytecode from params in script function', () => {
		const params = { bytecode: '0x123456' }
		const scriptContract = contract.script(params)
		expect(scriptContract.bytecode).toBe(params.bytecode)
		expect(scriptContract.code).toBe(params.bytecode)
	})

	it('should handle bytecode from base contract in script function', () => {
		const contractWithBytecode = createContract({
			humanReadableAbi: formatAbi(dummyAbi),
			name: 'DummyContract',
			bytecode: '0x654321',
		})
		const scriptContract = contractWithBytecode.script({})
		expect(scriptContract.bytecode).toBe('0x654321')
		expect(scriptContract.code).toBe('0x654321')
	})

	it('should handle deployedBytecode from base contract in script function', () => {
		const contractWithDeployedBytecode = createContract({
			humanReadableAbi: formatAbi(dummyAbi),
			name: 'DummyContract',
			deployedBytecode: '0xabcdef',
		})
		const scriptContract = contractWithDeployedBytecode.script({} as any)
		expect(scriptContract.bytecode).toBe('0xabcdef')
		expect(scriptContract.code).toBe('0xabcdef')
	})

	it('should throw an error if no bytecode is provided in script function', () => {
		expect(() => contract.script({} as any)).toThrow('Unknown bytecode error')
	})

	it('should handle constructor without args in script function', () => {
		const contractWithConstructor = createContract({
			humanReadableAbi: ['constructor() payable'] as const,
			name: 'ContractWithConstructor',
			bytecode: '0x123456',
		})
		const scriptContract = contractWithConstructor.script({} as any)
		expect(scriptContract.bytecode).toBe('0x123456')
		expect(scriptContract.code).toBe('0x123456')
	})

	it('should handle constructor with args in script function', () => {
		const contractWithConstructor = createContract({
			humanReadableAbi: ['constructor(uint256 num) payable'] as const,
			name: 'ContractWithConstructor',
			bytecode: '0x123456',
		})
		const scriptContract = contractWithConstructor.script({ constructorArgs: [42n] })
		expect(scriptContract.bytecode).toBe('0x123456')
		expect(scriptContract.code).toBe(
			encodeDeployData({
				abi: contractWithConstructor.abi,
				bytecode: '0x123456',
				args: [42n],
			}),
		)
	})
})
