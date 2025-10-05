import { InvalidParamsError } from '@tevm/errors'
import { createTevmNode } from '@tevm/node'
import { describe, expect, it, beforeEach } from 'vitest'
import { evmSetNextBlockTimestampProcedure } from './evmSetNextBlockTimestampProcedure.js'

describe('evmSetNextBlockTimestampProcedure', () => {
	let client: ReturnType<typeof createTevmNode>
	let procedure: ReturnType<typeof evmSetNextBlockTimestampProcedure>

	beforeEach(() => {
		client = createTevmNode()
		procedure = evmSetNextBlockTimestampProcedure(client)
	})

	it('should set the next block timestamp', async () => {
		const timestamp = '0x61a80040' // 1641942912 in hex
		const request = {
			jsonrpc: '2.0' as const,
			id: 1,
			method: 'evm_setNextBlockTimestamp' as const,
			params: [timestamp] as const,
		}

		const response = await procedure(request)

		expect(response).toEqual({
			jsonrpc: '2.0',
			method: 'evm_setNextBlockTimestamp',
			result: null,
			id: 1,
		})

		// Verify the timestamp was stored
		expect(client.getNextBlockTimestamp()).toBe(BigInt(0x61a80040))
	})

	it('should accept bigint timestamp', async () => {
		const timestamp = 1641942912n
		const request = {
			jsonrpc: '2.0' as const,
			id: 1,
			method: 'evm_setNextBlockTimestamp' as const,
			params: [timestamp] as const,
		}

		const response = await procedure(request)

		expect(response).toEqual({
			jsonrpc: '2.0',
			method: 'evm_setNextBlockTimestamp',
			result: null,
			id: 1,
		})

		expect(client.getNextBlockTimestamp()).toBe(1641942912n)
	})

	it('should return error for invalid params - no params', async () => {
		const request = {
			jsonrpc: '2.0' as const,
			id: 1,
			method: 'evm_setNextBlockTimestamp' as const,
			params: [] as const,
		}

		const response = await procedure(request)

		expect(response).toMatchObject({
			jsonrpc: '2.0',
			method: 'evm_setNextBlockTimestamp',
			id: 1,
			error: {
				code: InvalidParamsError.prototype.code,
				message: 'Invalid params: Expected exactly one parameter (timestamp)',
			},
		})
	})

	it('should return error for negative timestamp', async () => {
		const request = {
			jsonrpc: '2.0' as const,
			id: 1,
			method: 'evm_setNextBlockTimestamp' as const,
			params: [-1] as const,
		}

		const response = await procedure(request)

		expect(response).toMatchObject({
			jsonrpc: '2.0',
			method: 'evm_setNextBlockTimestamp',
			id: 1,
			error: {
				code: InvalidParamsError.prototype.code,
				message: 'Timestamp cannot be negative',
			},
		})
	})

	it('should handle requests without id', async () => {
		const timestamp = '0x61a80040'
		const request = {
			jsonrpc: '2.0' as const,
			method: 'evm_setNextBlockTimestamp' as const,
			params: [timestamp] as const,
		}

		const response = await procedure(request)

		expect(response).toEqual({
			jsonrpc: '2.0',
			method: 'evm_setNextBlockTimestamp',
			result: null,
		})
	})
})