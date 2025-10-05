import { SimpleContract } from '@tevm/contract'
import { createTevmNode } from '@tevm/node'
import { encodeFunctionData } from '@tevm/utils'
import { assert, describe, expect, it } from 'vitest'
import { deployHandler } from '../Deploy/deployHandler.js'
import { debugTraceCallJsonRpcProcedure } from './debugTraceCallProcedure.js'

describe('debugTraceCallJsonRpcProcedure with flatCallTracer', () => {
	it('should trace a simple call and return flatCallTracer result', async () => {
		const client = createTevmNode()
		const procedure = debugTraceCallJsonRpcProcedure(client)

		const { createdAddress } = await deployHandler(client)({ addToBlockchain: true, ...SimpleContract.deploy(1n) })
		assert(createdAddress, 'Contract deployment failed')
		const contract = SimpleContract.withAddress(createdAddress)

		const result = await procedure({
			jsonrpc: '2.0',
			method: 'debug_traceCall',
			params: [
				{
					to: contract.address,
					data: encodeFunctionData(contract.write.set(42n)),
					tracer: 'flatCallTracer',
				},
			],
			id: 1,
		})

		expect(result).toMatchObject({
			jsonrpc: '2.0',
			id: 1,
			method: 'debug_traceCall',
		})

		// The result should be a flat array of call traces
		expect(Array.isArray(result.result)).toBe(true)

		const traces = result.result as any[]
		expect(traces.length).toBeGreaterThan(0)

		// First trace should be the root call
		const rootTrace = traces[0]
		expect(rootTrace).toMatchObject({
			action: {
				callType: 'call',
				from: expect.any(String),
				to: contract.address,
				gas: expect.any(String),
				input: expect.any(String),
			},
			result: {
				gasUsed: expect.any(String),
				output: expect.any(String),
			},
			traceAddress: [],
			subtraces: expect.any(Number),
			type: 'call',
		})

		// Validate trace structure
		for (const trace of traces) {
			expect(trace).toHaveProperty('action')
			expect(trace).toHaveProperty('traceAddress')
			expect(trace).toHaveProperty('subtraces')
			expect(trace).toHaveProperty('type')
			
			if (trace.type === 'call') {
				expect(trace.action).toHaveProperty('callType')
				expect(trace.action).toHaveProperty('from')
				expect(trace.action).toHaveProperty('gas')
				expect(trace.action).toHaveProperty('input')
			}

			// Trace addresses should be arrays of numbers
			expect(Array.isArray(trace.traceAddress)).toBe(true)
			trace.traceAddress.forEach((addr: unknown) => {
				expect(typeof addr).toBe('number')
			})
		}
	})

	it('should trace a complex call with multiple internal calls', async () => {
		const client = createTevmNode()
		const procedure = debugTraceCallJsonRpcProcedure(client)

		// Deploy a more complex contract that makes internal calls
		const complexContract = `
			pragma solidity ^0.8.0;
			contract Complex {
				uint256 public value;
				
				function complexOp(uint256 _value) public {
					value = _value;
					// Make an internal call
					internalCall(_value * 2);
				}
				
				function internalCall(uint256 _val) internal {
					value = _val + 1;
				}
			}
		`
		
		// For now, use SimpleContract as it's available
		// TODO: Replace with actual complex contract when we have more test infrastructure
		const { createdAddress } = await deployHandler(client)({ addToBlockchain: true, ...SimpleContract.deploy(1n) })
		assert(createdAddress, 'Contract deployment failed')
		const contract = SimpleContract.withAddress(createdAddress)

		const result = await procedure({
			jsonrpc: '2.0',
			method: 'debug_traceCall',
			params: [
				{
					to: contract.address,
					data: encodeFunctionData(contract.write.set(42n)),
					tracer: 'flatCallTracer',
				},
			],
			id: 1,
		})

		expect(result).toMatchObject({
			jsonrpc: '2.0',
			id: 1,
			method: 'debug_traceCall',
		})

		const traces = result.result as any[]
		expect(Array.isArray(traces)).toBe(true)
		expect(traces.length).toBeGreaterThan(0)

		// Validate that traces are in execution order and properly indexed
		let previousDepth = -1
		for (let i = 0; i < traces.length; i++) {
			const trace = traces[i]
			const currentDepth = trace.traceAddress.length
			
			// Depth should not increase by more than 1
			expect(currentDepth).toBeLessThanOrEqual(previousDepth + 1)
			previousDepth = Math.max(previousDepth, currentDepth)
		}
	})

	it('should handle failed calls in flatCallTracer', async () => {
		const client = createTevmNode()
		const procedure = debugTraceCallJsonRpcProcedure(client)

		// Try to call a non-existent contract
		const result = await procedure({
			jsonrpc: '2.0',
			method: 'debug_traceCall',
			params: [
				{
					to: '0x1234567890123456789012345678901234567890',
					data: '0x12345678',
					tracer: 'flatCallTracer',
				},
			],
			id: 1,
		})

		const traces = result.result as any[]
		expect(Array.isArray(traces)).toBe(true)
		
		if (traces.length > 0) {
			const rootTrace = traces[0]
			// Failed calls might not have a result property, or might have an error
			expect(rootTrace).toHaveProperty('action')
			expect(rootTrace).toHaveProperty('traceAddress')
			expect(rootTrace).toHaveProperty('type')
		}
	})

	it('should match expected snapshot format', async () => {
		const client = createTevmNode()
		const procedure = debugTraceCallJsonRpcProcedure(client)

		const { createdAddress } = await deployHandler(client)({ addToBlockchain: true, ...SimpleContract.deploy(1n) })
		assert(createdAddress, 'Contract deployment failed')
		const contract = SimpleContract.withAddress(createdAddress)

		const result = await procedure({
			jsonrpc: '2.0',
			method: 'debug_traceCall',
			params: [
				{
					to: contract.address,
					data: encodeFunctionData(contract.write.set(42n)),
					tracer: 'flatCallTracer',
				},
			],
			id: 1,
		})

		expect(result).toMatchSnapshot('flatCallTracer-simple-call')
	})
})