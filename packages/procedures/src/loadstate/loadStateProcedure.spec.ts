import { describe, expect, it, beforeEach } from 'bun:test'
import { createBaseClient, type BaseClient } from '@tevm/base-client'
import { loadStateProcedure } from './loadStateProcedure.js'
import type { LoadStateJsonRpcRequest } from './LoadStateJsonRpcRequest.js'

let client: BaseClient

beforeEach(() => {
	client = createBaseClient()
})

describe('loadStateProcedure', () => {
	it('should load state successfully', async () => {
		const request: LoadStateJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'tevm_loadState',
			id: 1,
			params: [
				{
					state: {
						'0x1234567890abcdef1234567890abcdef12345678': {
							nonce: '0x1',
							balance: '0x10',
							storageRoot: '0x1234',
							codeHash: '0x5678',
						},
					},
				},
			],
		}

		const response = await loadStateProcedure(client)(request)
		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('tevm_loadState')
		expect(response.id).toBe(request.id as any)
	})

	it('should handle state loading with multiple accounts', async () => {
		const request: LoadStateJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'tevm_loadState',
			id: 1,
			params: [
				{
					state: {
						'0x1234567890abcdef1234567890abcdef12345678': {
							nonce: '0x1',
							balance: '0x10',
							storageRoot: '0x1234',
							codeHash: '0x5678',
						},
						'0xabcdefabcdefabcdefabcdefabcdefabcdefabcd': {
							nonce: '0x2',
							balance: '0x20',
							storageRoot: '0x5678',
							codeHash: '0x1234',
						},
					},
				},
			],
		}

		const response = await loadStateProcedure(client)(request)
		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('tevm_loadState')
		expect(response.id).toBe(request.id as any)
	})
})
