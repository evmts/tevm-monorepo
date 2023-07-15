import { evmtsContractFactory } from '../evmtsContractFactory'
import { dummyAbi } from '../test/fixtures'
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

	describe('read', () => {
		it('should return information for read function', () => {
			const readInfo = contract.read().exampleRead('data', BigInt(420))
			expect(readInfo.address).toMatchInlineSnapshot('"0x12345678"')
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
                "name": "",
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
			const readInfo = contract.read().exampleReadNoArgs()
			expect(readInfo.address).toMatchInlineSnapshot('"0x12345678"')
			expect(Object.keys(readInfo).includes('args')).toBe(false)
		})

		it('should work for overloaded function', () => {
			const readInfo1Arg = contract.read().overloadedRead('data')
			expect(readInfo1Arg.address).toMatchInlineSnapshot('"0x12345678"')
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
				]
			`)
			expect(readInfo1Arg.humanReadableAbi).toMatchInlineSnapshot(`
				[
				  "function overloadedRead() pure returns (string)",
				]
			`)
			const readInfo0Arg = contract.read().overloadedRead()
			expect(readInfo0Arg.address).toMatchInlineSnapshot('"0x12345678"')
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
				]
			`)
			expect(readInfo0Arg.humanReadableAbi).toMatchInlineSnapshot(`
				[
				  "function overloadedRead() pure returns (string)",
				]
			`)
		})
	})
})
