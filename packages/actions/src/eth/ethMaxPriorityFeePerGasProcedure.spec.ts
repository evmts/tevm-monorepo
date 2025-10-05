import { createTevmNode, type TevmNode } from '@tevm/node'
import { beforeEach, describe, expect, it } from 'vitest'
import type { EthMaxPriorityFeePerGasJsonRpcRequest } from './EthJsonRpcRequest.js'
import { ethMaxPriorityFeePerGasProcedure } from './ethMaxPriorityFeePerGasProcedure.js'

let client: TevmNode

beforeEach(() => {
	client = createTevmNode()
})

describe('ethMaxPriorityFeePerGasProcedure', () => {
	it('should return the current maximum priority fee per gas', async () => {
		const request: EthMaxPriorityFeePerGasJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_maxPriorityFeePerGas',
			id: 1,
			params: [],
		}

		const response = await ethMaxPriorityFeePerGasProcedure({
			getVm: client.getVm,
			forkTransport: client.forkTransport,
		} as any)(request)

		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('eth_maxPriorityFeePerGas')
		expect(response.id).toBe(request.id as any)
		expect(typeof response.result).toBe('string')
		expect(response.result).toMatch(/^0x[0-9a-f]+$/i) // should be hex string
		expect(response.result).toMatchSnapshot()
	})

	it('should handle requests without an id', async () => {
		const request: EthMaxPriorityFeePerGasJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_maxPriorityFeePerGas',
			params: [],
		}

		const response = await ethMaxPriorityFeePerGasProcedure({
			getVm: client.getVm,
			forkTransport: client.forkTransport,
		} as any)(request)

		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('eth_maxPriorityFeePerGas')
		expect(response.id).toBeUndefined()
		expect(typeof response.result).toBe('string')
		expect(response.result).toMatch(/^0x[0-9a-f]+$/i) // should be hex string
		expect(response.result).toMatchSnapshot()
	})

	it('should return a reasonable default value when not forked', async () => {
		// Create a client without fork transport for this test
		const nonForkedClient = createTevmNode({
			fork: undefined,
		})

		const request: EthMaxPriorityFeePerGasJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_maxPriorityFeePerGas',
			id: 1,
			params: [],
		}

		const response = await ethMaxPriorityFeePerGasProcedure({
			getVm: nonForkedClient.getVm,
			forkTransport: nonForkedClient.forkTransport,
		} as any)(request)

		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('eth_maxPriorityFeePerGas')
		expect(response.id).toBe(request.id as any)
		expect(typeof response.result).toBe('string')
		expect(response.result).toMatch(/^0x[0-9a-f]+$/i) // should be hex string
		// Should return a default value like 1 gwei in hex
		expect(response.result).toBe('0x3b9aca00') // 1 gwei in hex
	})
})