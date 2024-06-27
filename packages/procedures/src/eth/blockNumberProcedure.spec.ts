import { describe, expect, it, beforeEach } from 'bun:test'
import { createBaseClient, type BaseClient } from '@tevm/base-client'
import { blockNumberProcedure } from './blockNumberProcedure.js'
import type { EthBlockNumberJsonRpcRequest } from './EthJsonRpcRequest.js'

let client: BaseClient

beforeEach(() => {
	client = createBaseClient()
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
