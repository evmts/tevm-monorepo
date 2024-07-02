import { beforeEach, describe, expect, it } from 'bun:test'
import { type BaseClient, createBaseClient } from '@tevm/base-client'
import type { MineJsonRpcRequest } from './MineJsonRpcRequest.js'
import { mineProcedure } from './mineProcedure.js'

let client: BaseClient

beforeEach(() => {
	client = createBaseClient()
})

describe('mineProcedure', () => {
	it('should mine a block successfully', async () => {
		const request: MineJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'tevm_mine',
			id: 1,
			params: ['0x1', '0x0'],
		}

		const response = await mineProcedure(client)(request)
		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('tevm_mine')
		expect(response.id).toBe(request.id as any)
	})

	it('should handle mining multiple blocks', async () => {
		const request: MineJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'tevm_mine',
			id: 1,
			params: ['0x5', '0x0'],
		}

		const response = await mineProcedure(client)(request)
		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('tevm_mine')
		expect(response.id).toBe(request.id as any)
	})

	it('should handle mining with interval', async () => {
		const request: MineJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'tevm_mine',
			id: 1,
			params: ['0x1', '0x3E8'],
		}

		const response = await mineProcedure(client)(request)
		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('tevm_mine')
		expect(response.id).toBe(request.id as any)
	})

	it('should handle errors from mineHandler', async () => {
		// Simulate an error in mineHandler by providing invalid parameters or mocking mineHandler
		const request: MineJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'tevm_mine',
			id: 1,
			params: ['0x0', '0x0'],
		}

		const response = await mineProcedure(client)(request)
		expect(response.error).toBeDefined()
		expect(response.error).toMatchSnapshot()
	})
})
