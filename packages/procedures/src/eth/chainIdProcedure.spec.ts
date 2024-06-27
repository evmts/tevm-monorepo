import { describe, expect, it, beforeEach } from 'bun:test'
import { createBaseClient, type BaseClient } from '@tevm/base-client'
import { chainIdProcedure } from './chainIdProcedure.js'
import type { EthChainIdJsonRpcRequest } from './EthJsonRpcRequest.js'

let client: BaseClient

beforeEach(() => {
	client = createBaseClient()
})

describe('chainIdProcedure', () => {
	it('should return the current chain ID', async () => {
		const request: EthChainIdJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_chainId',
			id: 1,
			params: [],
		}

		const response = await chainIdProcedure(client)(request)
		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('eth_chainId')
		expect(response.id).toBe(request.id as any)
		expect(response.result).toMatchSnapshot()
	})

	it('should handle requests without an id', async () => {
		const request: EthChainIdJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_chainId',
			params: [],
		}

		const response = await chainIdProcedure(client)(request)
		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('eth_chainId')
		expect(response.id).toBeUndefined()
		expect(response.result).toMatchSnapshot()
	})
})
