import { describe, expect, it, beforeEach } from 'bun:test'
import { createBaseClient, type BaseClient } from '@tevm/base-client'
import { ethCallProcedure } from './ethCallProcedure.js'
import type { EthCallJsonRpcRequest } from './EthJsonRpcRequest.js'

let client: BaseClient

beforeEach(() => {
	client = createBaseClient()
})

describe('ethCallProcedure', () => {
	it('should execute a message call successfully', async () => {
		const request: EthCallJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_call',
			id: 1,
			params: [
				{
					data: '0x',
					from: `0x${'69'.repeat(20)}`,
					to: `0x${'69'.repeat(20)}`,
					gas: '0x5208',
					gasPrice: '0x3b9aca00',
					value: '0x1',
				},
				'latest',
				{},
				{},
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
					from: `0x${'69'.repeat(20)}`,
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

	it('should return error when call fails', async () => {
		// Provide invalid parameters to simulate a failure
		const request: EthCallJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_call',
			id: 1,
			params: [
				{
					from: `0x${'69'.repeat(20)}`,
					to: `0x${'00'.repeat(20)}`,
					data: '0x1234', // Invalid data to trigger an error
				},
				'latest',
			],
		}

		const response = await ethCallProcedure(client)(request)
		expect(response.result).toBeUndefined()
		expect(response.error).toBeDefined()
		expect(response.method).toBe('eth_call')
		expect(response.id).toBe(request.id as any)
		expect(response.error).toMatchSnapshot()
	})

	it('should handle requests without an id', async () => {
		const request: EthCallJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_call',
			params: [
				{
					from: `0x${'69'.repeat(20)}`,
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
