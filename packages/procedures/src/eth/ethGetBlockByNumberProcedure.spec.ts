import { describe, expect, it, beforeEach } from 'bun:test'
import { createBaseClient, type BaseClient } from '@tevm/base-client'
import { ethGetBlockByNumberJsonRpcProcedure } from './ethGetBlockByNumberProcedure.js'
import type { EthGetBlockByNumberJsonRpcRequest } from './EthJsonRpcRequest.js'

let client: BaseClient

beforeEach(() => {
	client = createBaseClient()
})

describe('ethGetBlockByNumberJsonRpcProcedure', () => {
	it('should return block details by number', async () => {
		const request: EthGetBlockByNumberJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_getBlockByNumber',
			id: 1,
			params: ['0x1', false], // Block number as hex
		}

		const response = await ethGetBlockByNumberJsonRpcProcedure(client)(request)
		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('eth_getBlockByNumber')
		expect(response.id).toBe(request.id as any)
		expect(response.result).toMatchSnapshot()
	})

	it('should include transactions if requested', async () => {
		const request: EthGetBlockByNumberJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_getBlockByNumber',
			id: 1,
			params: ['0x1', true], // Block number as hex
		}

		const response = await ethGetBlockByNumberJsonRpcProcedure(client)(request)
		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('eth_getBlockByNumber')
		expect(response.id).toBe(request.id as any)
		expect(response.result).toMatchSnapshot()
	})

	it('should handle requests without an id', async () => {
		const request: EthGetBlockByNumberJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_getBlockByNumber',
			params: ['0x1', false], // Block number as hex
		}

		const response = await ethGetBlockByNumberJsonRpcProcedure(client)(request)
		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('eth_getBlockByNumber')
		expect(response.id).toBeUndefined()
		expect(response.result).toMatchSnapshot()
	})

	it('should handle invalid block tag', async () => {
		const request: EthGetBlockByNumberJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_getBlockByNumber',
			id: 1,
			params: ['invalidTag' as any, false], // Invalid block tag
		}

		const response = await ethGetBlockByNumberJsonRpcProcedure(client)(request)
		expect(response.error).toBeDefined()
		expect(response.error).toMatchSnapshot()
	})
})
