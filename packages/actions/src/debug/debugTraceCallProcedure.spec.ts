// @ts-nocheck - Disabling TypeScript checks for test file to simplify mocking
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { debugTraceCallJsonRpcProcedure } from './debugTraceCallProcedure.js'

// Mock dependencies
vi.mock('@tevm/utils', () => ({
	hexToBigInt: vi.fn((hex) => BigInt(Number.parseInt(hex, 16))),
	numberToHex: vi.fn((num) => `0x${num.toString(16)}`),
}))

vi.mock('./traceCallHandler.js', () => ({
	traceCallHandler: vi.fn(),
}))

import { hexToBigInt, numberToHex } from '@tevm/utils'
import { traceCallHandler } from './traceCallHandler.js'

describe('debugTraceCallJsonRpcProcedure', () => {
	const mockClient = {}
	const mockTraceCallHandlerFn = vi.fn()

	beforeEach(() => {
		vi.clearAllMocks()
		vi.mocked(traceCallHandler).mockReturnValue(mockTraceCallHandlerFn)
	})

	it('should handle debug_traceCall with minimal parameters', async () => {
		// Mock trace result
		const mockTraceResult = {
			gas: 21000n,
			failed: false,
			returnValue: '0x',
			structLogs: [
				{
					gas: 21000n,
					gasCost: 2n,
					op: 'PUSH1',
					pc: 0,
					stack: ['0x1'],
					depth: 1,
				},
			],
		}

		mockTraceCallHandlerFn.mockResolvedValue(mockTraceResult)

		const request = {
			jsonrpc: '2.0',
			method: 'debug_traceCall',
			params: [
				{
					to: '0x1234567890123456789012345678901234567890',
				},
			],
			id: 1,
		}

		const procedure = debugTraceCallJsonRpcProcedure(mockClient)
		const result = await procedure(request)

		// Verify traceCallHandler was called correctly
		expect(traceCallHandler).toHaveBeenCalledWith(mockClient)
		expect(mockTraceCallHandlerFn).toHaveBeenCalledWith({
			to: '0x1234567890123456789012345678901234567890',
		})

		// Check the result format
		expect(result).toEqual({
			jsonrpc: '2.0',
			method: 'debug_traceCall',
			id: 1,
			result: {
				gas: '0x5208', // 21000 in hex
				failed: false,
				returnValue: '0x',
				structLogs: [
					{
						gas: '0x5208', // 21000 in hex
						gasCost: '0x2',
						op: 'PUSH1',
						pc: 0,
						stack: ['0x1'],
						depth: 1,
					},
				],
			},
		})
	})

	it('should handle debug_traceCall with all parameters', async () => {
		// Mock trace result
		const mockTraceResult = {
			gas: 100000n,
			failed: false,
			returnValue: '0xabcdef',
			structLogs: [
				{
					gas: 100000n,
					gasCost: 10n,
					op: 'CALL',
					pc: 123,
					stack: ['0x1', '0x2'],
					depth: 2,
				},
			],
		}

		mockTraceCallHandlerFn.mockResolvedValue(mockTraceResult)

		const request = {
			jsonrpc: '2.0',
			method: 'debug_traceCall',
			params: [
				{
					to: '0x1234567890123456789012345678901234567890',
					from: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
					gas: '0x186a0', // 100000 in hex
					gasPrice: '0x3b9aca00', // 1000000000 in hex
					value: '0x1', // 1 in hex
					data: '0xabcdef',
					blockTag: 'latest',
					timeout: 10000,
					tracer: 'callTracer',
					tracerConfig: { enableMemory: true },
				},
			],
			id: 2,
		}

		const procedure = debugTraceCallJsonRpcProcedure(mockClient)
		const result = await procedure(request)

		// Verify traceCallHandler was called with all parameters
		expect(mockTraceCallHandlerFn).toHaveBeenCalledWith({
			to: '0x1234567890123456789012345678901234567890',
			from: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
			gas: 100000n,
			gasPrice: 1000000000n,
			value: 1n,
			data: '0xabcdef',
			blockTag: 'latest',
			timeout: 10000,
			tracer: 'callTracer',
			tracerConfig: { enableMemory: true },
		})

		// Verify hexToBigInt was called for numeric conversions
		expect(hexToBigInt).toHaveBeenCalledWith('0x186a0')
		expect(hexToBigInt).toHaveBeenCalledWith('0x3b9aca00')
		expect(hexToBigInt).toHaveBeenCalledWith('0x1')

		// Verify numberToHex was called for result formatting
		expect(numberToHex).toHaveBeenCalledWith(100000n)
		expect(numberToHex).toHaveBeenCalledWith(100000n)
		expect(numberToHex).toHaveBeenCalledWith(10n)

		// Check the result
		expect(result).toEqual({
			jsonrpc: '2.0',
			method: 'debug_traceCall',
			id: 2,
			result: {
				gas: '0x186a0',
				failed: false,
				returnValue: '0xabcdef',
				structLogs: [
					{
						gas: '0x186a0',
						gasCost: '0xa',
						op: 'CALL',
						pc: 123,
						stack: ['0x1', '0x2'],
						depth: 2,
					},
				],
			},
		})
	})

	it('should handle requests without an ID', async () => {
		// Mock trace result
		const mockTraceResult = {
			gas: 21000n,
			failed: true,
			returnValue: '0x',
			structLogs: [],
		}

		mockTraceCallHandlerFn.mockResolvedValue(mockTraceResult)

		const request = {
			jsonrpc: '2.0',
			method: 'debug_traceCall',
			params: [
				{
					to: '0x1234567890123456789012345678901234567890',
				},
			],
		}

		const procedure = debugTraceCallJsonRpcProcedure(mockClient)
		const result = await procedure(request)

		// Check the result
		expect(result).toEqual({
			jsonrpc: '2.0',
			method: 'debug_traceCall',
			result: {
				gas: '0x5208',
				failed: true,
				returnValue: '0x',
				structLogs: [],
			},
		})

		// Verify ID is not present
		expect(result).not.toHaveProperty('id')
	})

	it('should handle missing optional parameters', async () => {
		// Mock trace result
		const mockTraceResult = {
			gas: 50000n,
			failed: false,
			returnValue: '0x1234',
			structLogs: [
				{
					gas: 50000n,
					gasCost: 5n,
					op: 'SSTORE',
					pc: 10,
					stack: ['0x3'],
					depth: 1,
				},
			],
		}

		mockTraceCallHandlerFn.mockResolvedValue(mockTraceResult)

		// Create request with some parameters undefined
		const request = {
			jsonrpc: '2.0',
			method: 'debug_traceCall',
			params: [
				{
					to: '0x1234567890123456789012345678901234567890',
					// Explicitly set some params to undefined
					from: undefined,
					gas: undefined,
					data: '0x1234',
				},
			],
			id: 3,
		}

		const procedure = debugTraceCallJsonRpcProcedure(mockClient)
		const result = await procedure(request)

		// Verify traceCallHandler was called with only defined parameters
		expect(mockTraceCallHandlerFn).toHaveBeenCalledWith({
			to: '0x1234567890123456789012345678901234567890',
			data: '0x1234',
		})

		// The undefined parameters should not be included in the handler call
		const handlerParams = mockTraceCallHandlerFn.mock.calls[0][0]
		expect(handlerParams).not.toHaveProperty('from')
		expect(handlerParams).not.toHaveProperty('gas')

		// Check the result
		expect(result).toEqual({
			jsonrpc: '2.0',
			method: 'debug_traceCall',
			id: 3,
			result: {
				gas: expect.any(String),
				failed: false,
				returnValue: '0x1234',
				structLogs: [
					{
						gas: expect.any(String),
						gasCost: expect.any(String),
						op: 'SSTORE',
						pc: 10,
						stack: ['0x3'],
						depth: 1,
					},
				],
			},
		})
	})
})
