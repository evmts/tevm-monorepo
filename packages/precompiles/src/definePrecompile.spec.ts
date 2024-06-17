import { describe, expect, it } from 'bun:test'
import { SimpleContract } from '@tevm/contract'
import { EthjsAddress, encodeFunctionData, hexToBytes, toBytes } from '@tevm/utils'
import { defineCall } from './defineCall.js'
import { definePrecompile } from './definePrecompile.js'

describe(definePrecompile.name, () => {
	it('should define a precompile', async () => {
		let value = 20n
		const contract = SimpleContract.withAddress(`0x${'f2'.repeat(20)}`)
		const call = defineCall(SimpleContract.abi, {
			get: async () => ({ returnValue: value, executionGasUsed: 0n }),
			set: async ({ args }) => {
				value = args[0]
				return { returnValue: undefined, executionGasUsed: 0n }
			},
		})
		const precompile = definePrecompile({
			contract,
			call,
		})
		expect(precompile.contract).toBe(contract)
		expect(precompile.precompile().address).toEqual(EthjsAddress.fromString(contract.address))
		expect(
			await precompile
				.precompile()
				.function({ gasLimit: 1n, data: hexToBytes(encodeFunctionData(contract.read.get())) }),
		).toEqual({ returnValue: toBytes(value), executionGasUsed: 0n })
		await precompile.precompile().function({
			gasLimit: 1n,
			data: hexToBytes(encodeFunctionData(contract.write.set(10n))),
		})
		expect(
			await precompile
				.precompile()
				.function({ gasLimit: 1n, data: hexToBytes(encodeFunctionData(contract.read.get())) }),
		).toEqual({ returnValue: toBytes(10n), executionGasUsed: 0n })
	})
})
