import { type TevmNode, createTevmNode } from '@tevm/node'
import { beforeEach, describe, expect, it } from 'vitest'
import { mineHandler } from '../Mine/mineHandler.js'
import type { EthGetBlockByNumberJsonRpcRequest } from './EthJsonRpcRequest.js'
import { ethGetBlockByNumberJsonRpcProcedure } from './ethGetBlockByNumberProcedure.js'

let client: TevmNode

beforeEach(async () => {
	client = createTevmNode()
	await mineHandler(client)()
	await mineHandler(client)()
})

describe('ethGetBlockByNumberJsonRpcProcedure', () => {
	const normalizeBlockForSnapshot = (block: any) => {
		if (!block) return block
		return {
			...block,
			// Replace non-deterministic values with placeholders
			hash: typeof block.hash === 'string' && block.hash.startsWith('0x') ? '0x[HASH]' : block.hash,
			stateRoot:
				typeof block.stateRoot === 'string' && block.stateRoot.startsWith('0x') ? '0x[STATE_ROOT]' : block.stateRoot,
			timestamp:
				typeof block.timestamp === 'string' && block.timestamp.startsWith('0x') ? '0x[TIMESTAMP]' : block.timestamp,
		}
	}

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

		// Normalize the result before snapshot comparison
		const normalizedResult = normalizeBlockForSnapshot(response.result)
		expect(normalizedResult).toMatchSnapshot()
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

		// Normalize the result before snapshot comparison
		const normalizedResult = normalizeBlockForSnapshot(response.result)
		expect(normalizedResult).toMatchSnapshot()
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

		// Normalize the result before snapshot comparison
		const normalizedResult = normalizeBlockForSnapshot(response.result)
		expect(normalizedResult).toMatchSnapshot()
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

	it('should NOT return a Promise object in the result (reproduces bug)', async () => {
		const request: EthGetBlockByNumberJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_getBlockByNumber',
			id: 1,
			params: ['0x1', false], // Block number as hex
		}

		const response = await ethGetBlockByNumberJsonRpcProcedure(client)(request)
		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()

		// This test reproduces the bug: the result should be a plain object, not a Promise
		expect(response.result).not.toBeInstanceOf(Promise)
		expect(typeof response.result).toBe('object')
		expect(response.result).toHaveProperty('number')
		expect(response.result).toHaveProperty('hash')
		expect(response.result).toHaveProperty('parentHash')
	})
})
