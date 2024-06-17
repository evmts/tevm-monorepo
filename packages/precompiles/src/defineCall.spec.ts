import { describe, expect, it } from 'bun:test'
import { SimpleContract } from '@tevm/contract'
import { encodeFunctionData, toBytes } from '@tevm/utils'
import { defineCall } from './defineCall.js'

describe(defineCall.name, () => {
	it('should define a precompile', async () => {
		let value = 20n
		const call = defineCall(SimpleContract.abi, {
			get: async () => ({ returnValue: value, executionGasUsed: 0n }),
			set: async ({ args }) => {
				value = args[0]
				return { returnValue: undefined, executionGasUsed: 0n }
			},
		})
		expect(
			await call({
				gasLimit: 1n,
				data: encodeFunctionData(SimpleContract.read.get()),
			}),
		).toEqual({ returnValue: toBytes(value), executionGasUsed: 0n })
		expect(
			await call({
				gasLimit: 1n,
				data: encodeFunctionData(SimpleContract.write.set(10n)),
			}),
		).toEqual({ returnValue: new Uint8Array(), executionGasUsed: 0n })
		expect(
			await call({
				gasLimit: 1n,
				data: encodeFunctionData(SimpleContract.read.get()),
			}),
		).toEqual({ returnValue: toBytes(10n), executionGasUsed: 0n })
	})
})
