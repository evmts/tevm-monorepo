import { evmtsContractFactory } from '../evmtsContractFactory'
import { dummyAbi } from '../test/fixtures'
import { writeFactory } from './writeFactory'
import type { Address } from 'abitype'
import { describe, expect, it } from 'vitest'

const dummyAddresses = {
	1: '0x8F0EBDaA1cF7106bE861753B0f9F5c0250fE0819',
} as const satisfies Record<number, Address>

const contract = evmtsContractFactory({
	abi: dummyAbi,
	name: 'DummyContract',
	addresses: dummyAddresses,
})

describe('write', () => {
	it('should return information for write function', () => {
		const writeInfo = contract.write().exampleWrite('data', BigInt(420))
		expect(writeInfo.address).toMatchInlineSnapshot(
			'"0x8F0EBDaA1cF7106bE861753B0f9F5c0250fE0819"',
		)
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
                "name": "",
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
	it('should work for overloaded function', () => {
		const writeInfo1Arg = contract.write().overloadedWrite('data')
		expect(writeInfo1Arg.address).toMatchInlineSnapshot(
			'"0x8F0EBDaA1cF7106bE861753B0f9F5c0250fE0819"',
		)
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
				]
			`)
		expect(writeInfo1Arg.humanReadableAbi).toMatchInlineSnapshot(`
				[
				  "function overloadedWrite() payable returns (string)",
				]
			`)
		const writeInfo0Arg = contract.write().overloadedWrite()
		expect(writeInfo0Arg.address).toMatchInlineSnapshot(
			'"0x8F0EBDaA1cF7106bE861753B0f9F5c0250fE0819"',
		)
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
				]
			`)
		expect(writeInfo0Arg.humanReadableAbi).toMatchInlineSnapshot(`
				[
				  "function overloadedWrite() payable returns (string)",
				]
			`)
	})

	it('should return an empty object when methods list is empty', () => {
		const write = writeFactory({ methods: [], addresses: dummyAddresses })
		expect(write()).toEqual({})
	})

	it('should default to the first address when chainId is not provided', () => {
		const writeFunc = contract.write().exampleWrite('data', BigInt(420))

		expect(writeFunc.address).toEqual(Object.values(dummyAddresses)[0])
	})

	it('should return undefined for address when addresses object is undefined', () => {
		const c = evmtsContractFactory({
			abi: dummyAbi,
			name: 'DummyContract',
			// empty address
			addresses: {},
		})
		const writeFunc = c.write().exampleWrite('data', BigInt(420))
		expect(writeFunc.address).toBeUndefined()
	})

	it('should default to the first address when chainId does not exist in addresses', () => {
		const writeFunc = contract
			.write({ chainId: 999 })
			.exampleWrite('data', BigInt(420))
		expect(writeFunc.address).toEqual(Object.values(dummyAddresses)[0])
	})
})
