import { numberToHex } from 'viem'
import { describe, expect, it } from 'vitest'
import { serializeTraceResult } from './serializeTraceResult.js'

describe('serializeTraceResult', () => {
	it('should serialize a trace result with structLogs, converting bigints to hex', () => {
		const traceResult = {
			failed: false,
			gas: 100000n,
			returnValue: '0xabcdef',
			structLogs: [
				{
					pc: 0,
					op: 'PUSH1',
					gasCost: 3n,
					gas: 99997n,
					depth: 1,
					stack: ['0x01'],
					memory: [],
					storage: {},
					error: undefined,
				},
				{
					pc: 2,
					op: 'STOP',
					gasCost: 0n,
					gas: 99994n,
					depth: 1,
					stack: ['0x01'],
					memory: [],
					storage: {},
					error: undefined,
				},
			],
		}

		const serialized = serializeTraceResult(traceResult)

		expect(serialized).toEqual({
			failed: false,
			gas: numberToHex(100000n),
			returnValue: '0xabcdef',
			structLogs: [
				{
					pc: 0,
					op: 'PUSH1',
					gasCost: numberToHex(3n),
					gas: numberToHex(99997n),
					depth: 1,
					stack: ['0x01'],
					memory: [],
					storage: {},
					error: undefined,
				},
				{
					pc: 2,
					op: 'STOP',
					gasCost: numberToHex(0n),
					gas: numberToHex(99994n),
					depth: 1,
					stack: ['0x01'],
					memory: [],
					storage: {},
					error: undefined,
				},
			],
		})
	})
})
