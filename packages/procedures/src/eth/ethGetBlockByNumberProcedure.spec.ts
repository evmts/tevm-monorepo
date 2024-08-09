import { mineHandler } from '@tevm/actions'
import { type TevmNode, createTevmNode } from '@tevm/node'
import { beforeEach, describe, expect, it } from 'vitest'
import type { EthGetBlockByNumberJsonRpcRequest } from './EthJsonRpcRequest.js'
import { ethGetBlockByNumberJsonRpcProcedure } from './ethGetBlockByNumberProcedure.js'

let client: TevmNode

beforeEach(async () => {
	client = createTevmNode()
	await mineHandler(client)()
	await mineHandler(client)()
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
