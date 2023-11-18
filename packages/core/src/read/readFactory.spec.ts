import { evmtsContractFactory } from '../evmtsContractFactory'
import { dummyAbi } from '../test/fixtures'
import { readFactory } from './readFactory'
import { formatAbi } from 'abitype'
import { describe, expect, it } from 'vitest'

const contract = evmtsContractFactory({
	humanReadableAbi: formatAbi(dummyAbi),
	name: 'DummyContract',
	bytecode: undefined,
	deployedBytecode: undefined,
})

describe(readFactory.name, () => {
	it('should return information for read function', () => {
		const readInfo = contract.read.exampleRead('data', BigInt(420))
		expect(readInfo.args).toMatchInlineSnapshot(`
				[
				  "data",
				  420n,
				]
			`)
		expect(readInfo.abi).toMatchInlineSnapshot(`
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
			    "name": "exampleRead",
			    "outputs": [
			      {
			        "type": "string",
			      },
			    ],
			    "stateMutability": "pure",
			    "type": "function",
			  },
			]
		`)
		expect(readInfo.humanReadableAbi).toMatchInlineSnapshot(`
        [
          "function exampleRead(string str, uint256 num) pure returns (string)",
        ]
      `)
	})

	it('should return information for read function with no args', () => {
		const readInfo = contract.read.exampleReadNoArgs()
		expect(Object.keys(readInfo).includes('args')).toBe(false)
	})

	it('should work for overloaded function', () => {
		const readInfo1Arg = contract.read.overloadedRead('data')
		expect(readInfo1Arg.args).toMatchInlineSnapshot(`
				[
				  "data",
				]
			`)
		expect(readInfo1Arg.abi).toMatchInlineSnapshot(`
			[
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
			]
		`)
		expect(readInfo1Arg.humanReadableAbi).toMatchInlineSnapshot(`
				[
				  "function overloadedRead() pure returns (string)",
				]
			`)
		const readInfo0Arg = contract.read.overloadedRead()
		expect(Object.keys(readInfo0Arg).includes('args')).toBe(false)
		expect(readInfo0Arg.abi).toMatchInlineSnapshot(`
			[
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
			]
		`)
		expect(readInfo0Arg.humanReadableAbi).toMatchInlineSnapshot(`
				[
				  "function overloadedRead() pure returns (string)",
				]
			`)
	})

	it('should return an empty object when the provided methods includes no functions', () => {
		const dummyAbiNoFunction = dummyAbi.filter((abi) => abi.type !== 'function')
		const read = readFactory({
			methods: dummyAbiNoFunction,
		})
		expect(read).toEqual({})
	})

	it('should return an empty object when methods is an empty array', () => {
		const read = readFactory({ methods: [] })
		expect(Object.keys(read)).toHaveLength(0)
	})
})
