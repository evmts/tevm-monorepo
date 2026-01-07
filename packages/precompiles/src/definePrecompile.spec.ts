import { SimpleContract } from '@tevm/contract'
import { encodeFunctionData, toBytes } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
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
		).toEqual({ returnValue: toBytes(value, { size: 32 }), executionGasUsed: 0n })
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
		).toEqual({ returnValue: toBytes(10n, { size: 32 }), executionGasUsed: 0n })
	})

	it('should correctly process logs', async () => {
		let value = 0n
		const call = defineCall(SimpleContract.abi, {
			set: async ({ args }) => {
				value = args[0]
				return {
					returnValue: undefined,
					executionGasUsed: 0n,
					logs: [
						{
							eventName: 'ValueSet' as const,
							address: '0x1234567890123456789012345678901234567890' as const,
							args: { newValue: 20n },
						},
					],
				}
			},
			get: async () => ({ returnValue: value, executionGasUsed: 0n }),
		})
		expect(
			await call({
				gasLimit: 1n,
				data: encodeFunctionData(SimpleContract.read.get()),
			}),
		).toMatchSnapshot()
		expect(
			await call({
				gasLimit: 1n,
				data: encodeFunctionData(SimpleContract.write.set(5n)),
			}),
		).toMatchSnapshot()
		expect(
			await call({
				gasLimit: 1n,
				data: encodeFunctionData(SimpleContract.read.get()),
			}),
		).toMatchSnapshot()
	})

	it('should handle errors in the catch block', async () => {
		const call = defineCall(SimpleContract.abi, {
			get: async () => {
				throw new Error('Test Error')
			},
			set: async () => ({ returnValue: undefined, executionGasUsed: 0n }),
		})
		const result = await call({
			gasLimit: 1n,
			data: encodeFunctionData(SimpleContract.read.get()),
		})
		expect(result.executionGasUsed).toBe(BigInt(0))
		expect(result.returnValue).toEqual(new Uint8Array())
		expect(result.exceptionError).toBeDefined()
		expect(result.exceptionError).toMatchSnapshot()
	})
})
