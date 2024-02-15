import { callHandlerResult } from './callHandlerResult.js'
import type { EthjsLog, EvmResult } from '@tevm/evm'
import { bytesToHex, getAddress, toHex } from '@tevm/utils'
import { describe, expect, it } from 'bun:test'

describe('callHandlerResult', () => {
	const dummyAddress = `0x${'1'.repeat(40)}` as const
	const mockLog: EthjsLog = [
		new Uint8Array(20), // Address
		[new Uint8Array(32), new Uint8Array(32)], // Topics (an array of two Uint8Array elements)
		new Uint8Array(64), // Data
	] as const
	const dummyEVMResult = {
		execResult: {
			returnValue: Buffer.from('test'),
			executionGasUsed: 21000n,
			gasRefund: 1000n,
			selfdestruct: new Set([dummyAddress]),
			gas: 50000n,
			logs: [mockLog],
			blobGasUsed: 3000n,
			createdAddresses: new Set([dummyAddress]),
		},
	} as const satisfies EvmResult

	it('should handle EVMResult correctly', () => {
		const result = callHandlerResult(dummyEVMResult)
		expect(result.rawData).toEqual(toHex(Buffer.from('test')))
		expect(result.executionGasUsed).toEqual(21000n)
		expect(result.gasRefund).toEqual(1000n)
		expect(result.selfdestruct).toEqual(new Set([getAddress(dummyAddress)]))
		expect(result.gas).toEqual(50000n)
		expect(result.logs).toEqual([
			{
				address: bytesToHex(mockLog[0]),
				topics: mockLog[1].map((b) => bytesToHex(b)),
				data: bytesToHex(mockLog[2]),
			},
		])
		expect(result.blobGasUsed).toEqual(3000n)
		expect(result.createdAddresses).toEqual(new Set([getAddress(dummyAddress)]))
	})

	it('should handle missing optional fields', () => {
		const modifiedResult = {
			...dummyEVMResult,
			execResult: {
				...dummyEVMResult.execResult,
				gasRefund: undefined,
				selfdestruct: undefined,
				blobGasUsed: undefined,
				exceptionError: undefined,
				createdAddresses: undefined,
			},
		} as any

		const result = callHandlerResult(modifiedResult)
		expect(result).not.toHaveProperty('gasRefund')
		expect(result).not.toHaveProperty('selfdestruct')
		expect(result).not.toHaveProperty('blobGasUsed')
		expect(result).not.toHaveProperty('exceptionError')
		expect(result).not.toHaveProperty('createdAddresses')
	})
})
