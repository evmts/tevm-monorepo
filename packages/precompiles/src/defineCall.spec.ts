import { SimpleContract } from '@tevm/contract'
import { decodeErrorResult, encodeFunctionData, toBytes } from '@tevm/utils'
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

	it('should propagate handler-declared errors as EVM exception errors', async () => {
		const call = defineCall(SimpleContract.abi, {
			get: async () => ({
				returnValue: 0n,
				executionGasUsed: 0n,
				error: {
					_tag: 'TestError',
					name: 'TestError',
					message: 'handler failed',
				},
			}),
			set: async () => ({ returnValue: undefined, executionGasUsed: 0n }),
		})

		const result = await call({
			gasLimit: 1n,
			data: encodeFunctionData(SimpleContract.read.get()),
		})

		expect(result.exceptionError).toMatchObject({ message: 'handler failed' })
		expect('exeptionError' in result).toBe(false)
	})

	it('should ABI-encode handler-declared errors as Error(string) revert data', async () => {
		const call = defineCall(SimpleContract.abi, {
			get: async () => ({
				returnValue: 0n,
				executionGasUsed: 0n,
				error: {
					_tag: 'TestError',
					name: 'TestError',
					message: 'handler failed',
				},
			}),
			set: async () => ({ returnValue: undefined, executionGasUsed: 0n }),
		})

		const result = await call({
			gasLimit: 1n,
			data: encodeFunctionData(SimpleContract.read.get()),
		})

		// The revert must carry data so Solidity try/catch can decode the reason.
		expect(result.returnValue.length).toBeGreaterThan(0)
		const decoded = decodeErrorResult({
			abi: [
				{
					type: 'error',
					name: 'Error',
					inputs: [{ type: 'string', name: 'message' }],
				},
			],
			data: `0x${Buffer.from(result.returnValue).toString('hex')}`,
		})
		expect(decoded.errorName).toBe('Error')
		expect(decoded.args).toEqual(['handler failed'])
	})

	it('should forward raw byte revert data unchanged', async () => {
		const rawData = new Uint8Array([1, 2, 3, 4])
		const call = defineCall(SimpleContract.abi, {
			get: async () => ({
				returnValue: rawData as any,
				executionGasUsed: 0n,
				error: {
					_tag: 'TestError',
					name: 'TestError',
					message: 'raw revert',
				},
			}),
			set: async () => ({ returnValue: undefined, executionGasUsed: 0n }),
		})

		const result = await call({
			gasLimit: 1n,
			data: encodeFunctionData(SimpleContract.read.get()),
		})

		expect(result.returnValue).toEqual(rawData)
	})
})
