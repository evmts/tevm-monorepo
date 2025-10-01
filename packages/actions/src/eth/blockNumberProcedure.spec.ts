import { createTevmNode, type TevmNode } from '@tevm/node'
import { beforeEach, describe, expect, it } from 'vitest'
import { blockNumberProcedure } from './blockNumberProcedure.js'
import type { EthBlockNumberJsonRpcRequest } from './EthJsonRpcRequest.js'

let client: TevmNode

beforeEach(() => {
	client = createTevmNode()
})

describe('blockNumberProcedure', () => {
	it('should return the current block number', async () => {
		const request: EthBlockNumberJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_blockNumber',
			id: 1,
			params: [],
		}

		const response = await blockNumberProcedure(client)(request)
		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('eth_blockNumber')
		expect(response.id).toBe(request.id as any)
		expect(response.result).toMatchSnapshot()
	})

	it('should handle requests without an id', async () => {
		const request: EthBlockNumberJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_blockNumber',
			params: [],
		}

		const response = await blockNumberProcedure(client)(request)
		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('eth_blockNumber')
		expect(response.id).toBeUndefined()
		expect(response.result).toMatchSnapshot()
	})
})
