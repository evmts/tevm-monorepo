import { createAddress } from '@tevm/address'
import type { Address, EthjsLog } from '@tevm/utils'
import { bytesToHex, getAddress, toHex } from '@tevm/utils'
import type { RunTxResult } from '@tevm/vm'
import { stringToBytes } from 'viem'
import { describe, expect, it } from 'vitest'
import { callHandlerResult } from './callHandlerResult.js'

describe('callHandlerResult', async () => {
	const dummyAddress = `0x${'1'.repeat(40)}` as const
	const mockLog: EthjsLog = [
		new Uint8Array(20), // Address
		[new Uint8Array(32), new Uint8Array(32)], // Topics (an array of two Uint8Array elements)
		new Uint8Array(64), // Data
	] as const
	const dummyEVMResult = {
		execResult: {
			returnValue: stringToBytes('test'),
			executionGasUsed: 21000n,
			gasRefund: 1000n,
			selfdestruct: new Set([dummyAddress]),
			gas: 50000n,
			logs: [mockLog],
			blobGasUsed: 3000n,
			createdAddresses: new Set([dummyAddress]),
		},
	}

	const dummyRuntxResult = {
		minerValue: 20n,
		bloom: {} as any,
		// createdAddress: createAddress(dummyEVMResult.execResult.createdAddresses.values().next().value as Address),
		accessList: {} as any,
		totalGasSpent: 100n,
		preimages: new Map(),
		gasRefund: dummyEVMResult.execResult.gasRefund,
		execResult: dummyEVMResult.execResult,
		receipt: {} as any,
		amountSpent: 10n,
		blobGasUsed: dummyEVMResult.execResult.blobGasUsed,
	} satisfies RunTxResult

	it('should handle EVMResult correctly', async () => {
		const result = callHandlerResult(dummyRuntxResult, undefined, undefined, undefined)
		expect(result.rawData).toEqual(toHex(stringToBytes('test')))
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
			...dummyRuntxResult,
			execResult: {
				...dummyEVMResult.execResult,
				gasRefund: undefined,
				selfdestruct: undefined,
				blobGasUsed: undefined,
				exceptionError: undefined,
				createdAddresses: undefined,
			},
		} as any

		const result = callHandlerResult(modifiedResult, undefined, undefined, undefined)
		expect(result).not.toHaveProperty('gasRefund')
		expect(result).not.toHaveProperty('selfdestruct')
		expect(result).not.toHaveProperty('exceptionError')
		expect(result).not.toHaveProperty('createdAddresses')
	})

	it('should handle trace data', () => {
		const traceData = {
			gas: 21000n,
			failed: false,
			returnValue: '0x' as const,
			structLogs: [],
		}
		const result = callHandlerResult(dummyRuntxResult, '0x1234', traceData, new Map())
		expect(result.trace).toEqual(traceData)
	})
})
