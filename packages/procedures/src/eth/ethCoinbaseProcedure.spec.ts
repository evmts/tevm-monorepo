import { type BaseClient, createBaseClient } from '@tevm/base-client'
import { beforeEach, describe, expect, it } from 'vitest'
import type { EthCoinbaseJsonRpcRequest } from './EthJsonRpcRequest.js'
import { ethCoinbaseJsonRpcProcedure } from './ethCoinbaseProcedure.js'

let client: BaseClient

beforeEach(() => {
	client = createBaseClient()
})

describe('ethCoinbaseJsonRpcProcedure', () => {
	it('should return the coinbase address', async () => {
		const request: EthCoinbaseJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_coinbase',
			id: 1,
			params: [],
		}

		const response = await ethCoinbaseJsonRpcProcedure(client)(request)
		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('eth_coinbase')
		expect(response.id).toBe(request.id as any)
		expect(response.result).toMatchSnapshot()
	})

	it('should handle requests without an id', async () => {
		const request: EthCoinbaseJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_coinbase',
			params: [],
		}

		const response = await ethCoinbaseJsonRpcProcedure(client)(request)
		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('eth_coinbase')
		expect(response.id).toBeUndefined()
		expect(response.result).toMatchSnapshot()
	})
})
