import { evmtsContractFactory } from '../evmtsContractFactory'
import { dummyAbi } from '../test/fixtures'
import { readFactory } from './readFactory'
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

describe(readFactory.name, () => {
	it('should return information for read function', () => {
		const readInfo = contract.read().exampleRead('data', BigInt(420))
		expect(readInfo.address).toMatchInlineSnapshot(
			'"0x8F0EBDaA1cF7106bE861753B0f9F5c0250fE0819"',
		)
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
		expect(readInfo.address).toMatchInlineSnapshot(
			'"0x8F0EBDaA1cF7106bE861753B0f9F5c0250fE0819"',
		)
		expect(Object.keys(readInfo).includes('args')).toBe(false)
	})

	it('should work for overloaded function', () => {
		const readInfo1Arg = contract.read().overloadedRead('data')
		expect(readInfo1Arg.address).toMatchInlineSnapshot(
			'"0x8F0EBDaA1cF7106bE861753B0f9F5c0250fE0819"',
		)
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
		expect(readInfo0Arg.address).toMatchInlineSnapshot(
			'"0x8F0EBDaA1cF7106bE861753B0f9F5c0250fE0819"',
		)
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

	it('should generate read function parameters when chainId is not provided', () => {
		const readFunc = contract.read().exampleRead('data', BigInt(420))
		expect(readFunc.address).toEqual(Object.values(dummyAddresses)[0])
	})

	it('should generate read function parameters when chainId is provided', () => {
		const readFunc = contract
			.read({ chainId: 1 })
			.exampleRead('data', BigInt(420))
		expect(readFunc.address).toEqual(dummyAddresses[1])
	})

	it('should return an empty object when the provided methods includes no functions', () => {
		const dummyAbiNoFunction = dummyAbi.filter((abi) => abi.type !== 'function')
		const read = readFactory({
			methods: dummyAbiNoFunction,
			addresses: dummyAddresses,
		})
		const readFuncCreator = read({ chainId: 1 })
		expect(readFuncCreator).toEqual({})
	})

	it('should return an empty object when methods is an empty array', () => {
		const read = readFactory({ methods: [], addresses: dummyAddresses })
		const readFuncCreator = read({ chainId: 1 })
		expect(Object.keys(readFuncCreator)).toHaveLength(0)
	})

	it('should default to the first address when chainId is not provided', () => {
		const readFunc = contract.read().exampleRead('data', BigInt(420))
		expect(readFunc.address).toEqual(Object.values(dummyAddresses)[0])
	})

	it('should default address to undefined if no addresses exist', () => {
		const c = evmtsContractFactory({
			abi: dummyAbi,
			name: 'DummyContract',
			addresses: {},
		})
		const readFunc = c.read().exampleRead('data', BigInt(420))
		expect(readFunc.address).toBeUndefined()
	})
})
