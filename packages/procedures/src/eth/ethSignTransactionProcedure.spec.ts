import { describe, expect, it, beforeEach } from 'bun:test'
import { createBaseClient, type BaseClient } from '@tevm/base-client'
import { ethSignTransactionProcedure } from './ethSignTransactionProcedure.js'
import type { EthSignTransactionJsonRpcRequest } from './EthJsonRpcRequest.js'
import { testAccounts } from '@tevm/utils'

let client: BaseClient

beforeEach(() => {
	client = createBaseClient()
})

describe('ethSignTransactionProcedure', () => {
	it('should sign a transaction successfully', async () => {
		const request: EthSignTransactionJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_signTransaction',
			id: 1,
			params: [
				{
					from: testAccounts[0].address,
					to: `0x${'69'.repeat(20)}`,
					value: '0x1a4',
					gas: '0x5208',
					gasPrice: '0x3b9aca00',
					nonce: '0x0',
					data: '0x',
				},
			],
		}

		const response = await ethSignTransactionProcedure({
			getAccounts: async () => testAccounts,
		})(request)
		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('eth_signTransaction')
		expect(response.id).toBe(request.id as any)
		expect(response.result).toMatchSnapshot()
	})

	it('should handle requests without an id', async () => {
		const request: EthSignTransactionJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_signTransaction',
			params: [
				{
					from: testAccounts[0].address,
					to: `0x${'69'.repeat(20)}`,
					value: '0x1a4',
					gas: '0x5208',
					gasPrice: '0x3b9aca00',
					nonce: '0x0',
					data: '0x',
				},
			],
		}

		const response = await ethSignTransactionProcedure({
			getAccounts: async () => testAccounts,
		})(request)
		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('eth_signTransaction')
		expect(response.id).toBeUndefined()
		expect(response.result).toMatchSnapshot()
	})

	it('should handle errors from ethSignTransactionHandler', async () => {
		const request: EthSignTransactionJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_signTransaction',
			id: 1,
			params: [
				{
					from: `0x${'00'.repeat(20)}`,
					to: `0x${'69'.repeat(20)}`,
					value: '0x1a4',
					gas: '0x5208',
					gasPrice: '0x3b9aca00',
					nonce: '0x0',
					data: '0x',
				},
			],
		}

		const response = await ethSignTransactionProcedure({
			getAccounts: async () => testAccounts,
		})(request)
		expect(response.method).toBe('eth_signTransaction')
		expect(response.id).toBe(request.id as any)
		expect(response.error).toBeDefined()
		expect(response.error).toMatchSnapshot()
	})
})
