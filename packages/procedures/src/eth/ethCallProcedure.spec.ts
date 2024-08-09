import { type TevmNode, createTevmNode } from '@tevm/node'
import { beforeEach, describe, expect, it } from 'vitest'
import type { EthCallJsonRpcRequest } from './EthJsonRpcRequest.js'
import { ethCallProcedure } from './ethCallProcedure.js'

let client: TevmNode

beforeEach(() => {
	client = createTevmNode()
})

describe('ethCallProcedure', () => {
	it('should execute a message call successfully', async () => {
		const request: EthCallJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_call',
			id: 1,
			params: [
				{
					data: '0x0',
					from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
					to: `0x${'69'.repeat(20)}`,
					value: '0x1',
				},
				'latest',
			],
		}

		const response = await ethCallProcedure(client)(request)
		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('eth_call')
		expect(response.id).toBe(request.id as any)
		expect(response.result).toMatchSnapshot()
	})

	it('should handle missing optional fields in the request', async () => {
		const request: EthCallJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_call',
			id: 1,
			params: [
				{
					from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
					to: `0x${'69'.repeat(20)}`,
				},
				'latest',
			],
		}

		const response = await ethCallProcedure(client)(request)
		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('eth_call')
		expect(response.id).toBe(request.id as any)
		expect(response.result).toMatchSnapshot()
	})

	it('should handle requests without an id', async () => {
		const request: EthCallJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_call',
			params: [
				{
					from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
					to: `0x${'69'.repeat(20)}`,
				},
				'latest',
			],
		}

		const response = await ethCallProcedure(client)(request)
		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('eth_call')
		expect(response.id).toBeUndefined()
		expect(response.result).toMatchSnapshot()
	})
})
