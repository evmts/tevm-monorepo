import { describe, expect, it, beforeEach } from 'bun:test'
import { createBaseClient, type BaseClient } from '@tevm/base-client'
import { ethGetBlockByHashJsonRpcProcedure } from './ethGetBlockByHashProcedure.js'
import type { EthGetBlockByHashJsonRpcRequest } from './EthJsonRpcRequest.js'

let client: BaseClient

beforeEach(() => {
	client = createBaseClient()
})

describe('ethGetBlockByHashJsonRpcProcedure', () => {
	it('should return block details by hash', async () => {
		const request: EthGetBlockByHashJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_getBlockByHash',
			id: 1,
			params: [
				'0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', // Example block hash
				false, // Do not include transactions
			],
		}

		const response = await ethGetBlockByHashJsonRpcProcedure(client)(request)
		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('eth_getBlockByHash')
		expect(response.id).toBe(request.id as any)
		expect(response.result).toMatchSnapshot()
	})

	it('should include transactions if requested', async () => {
		const request: EthGetBlockByHashJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_getBlockByHash',
			id: 1,
			params: [
				'0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', // Example block hash
				true, // Include transactions
			],
		}

		const response = await ethGetBlockByHashJsonRpcProcedure(client)(request)
		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('eth_getBlockByHash')
		expect(response.id).toBe(request.id as any)
		expect(response.result).toMatchSnapshot()
	})

	it('should handle requests without an id', async () => {
		const request: EthGetBlockByHashJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_getBlockByHash',
			params: [
				'0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', // Example block hash
				false, // Do not include transactions
			],
		}

		const response = await ethGetBlockByHashJsonRpcProcedure(client)(request)
		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('eth_getBlockByHash')
		expect(response.id).toBeUndefined()
		expect(response.result).toMatchSnapshot()
	})
})
