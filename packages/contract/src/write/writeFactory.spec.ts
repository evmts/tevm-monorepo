import { formatAbi } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { createContract } from '../createContract.js'
import { dummyAbi } from '../test/fixtures.js'
import { writeFactory } from './writeFactory.js'

const contract = createContract({
	humanReadableAbi: formatAbi(dummyAbi),
	name: 'DummyContract',
})

describe('write', () => {
	it('should work for 0 arguments', () => {
		const contract = createContract({
			humanReadableAbi: ['function noArgs() payable returns (string)'] as const,
		})
		const writeInfo = contract.write.noArgs()
		expect(writeInfo).toMatchInlineSnapshot(`
			{
			  "abi": [
			    {
			      "inputs": [],
			      "name": "noArgs",
			      "outputs": [
			        {
			          "type": "string",
			        },
			      ],
			      "stateMutability": "payable",
			      "type": "function",
			    },
			  ],
			  "functionName": "noArgs",
			  "humanReadableAbi": [
			    "function noArgs() payable returns (string)",
			  ],
			}
		`)
	})
	it('should return information for write function', () => {
		const writeInfo = contract.write.exampleWrite('data', BigInt(420))
		expect(writeInfo.args).toMatchInlineSnapshot(`
				[
				  "data",
				  420n,
				]
			`)
		expect(writeInfo.abi).toMatchInlineSnapshot(`
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
			        "type": "string",
			      },
			    ],
			    "stateMutability": "payable",
			    "type": "function",
			  },
			]
		`)
		expect(writeInfo.humanReadableAbi).toMatchInlineSnapshot(`
        [
          "function exampleWrite(string str, uint256 num) payable returns (string)",
        ]
      `)
	})
	it('should work with a contract without deployedBytecode', () => {
		const contractWithoutDeployedBytecode = createContract({
			name: 'DummyContractNoDeployed',
			humanReadableAbi: formatAbi(dummyAbi),
			bytecode: '0x420',
			code: '0x69',
		})
		const write = contractWithoutDeployedBytecode.write.exampleWrite('test', BigInt(123))
		expect(write).toMatchObject({
			abi: expect.any(Array),
			functionName: 'exampleWrite',
			args: ['test', BigInt(123)],
		})
		expect((write as any).deployedBytecode).toBeUndefined()
		expect((write as any).code).toEqual('0x69')
	})
	it('should work for overloaded function', () => {
		const writeInfo1Arg = contract.write.overloadedWrite('data')
		expect(writeInfo1Arg.args).toMatchInlineSnapshot(`
				[
				  "data",
				]
			`)
		expect(writeInfo1Arg.abi).toMatchInlineSnapshot(`
			[
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
			]
		`)
		expect(writeInfo1Arg.humanReadableAbi).toMatchInlineSnapshot(`
				[
				  "function overloadedWrite() payable returns (string)",
				]
			`)
		const writeInfo0Arg = contract.write.overloadedWrite()
		expect(Object.keys(writeInfo0Arg).includes('args')).toBe(false)
		expect(writeInfo0Arg.abi).toMatchInlineSnapshot(`
			[
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
			]
		`)
		expect(writeInfo0Arg.humanReadableAbi).toMatchInlineSnapshot(`
				[
				  "function overloadedWrite() payable returns (string)",
				]
			`)
	})

	it('should return an empty object when methods list is empty', () => {
		const write = writeFactory({ methods: [], errors: [] })
		expect(write).toEqual({})
	})
})
