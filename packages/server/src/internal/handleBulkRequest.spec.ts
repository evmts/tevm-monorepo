import { beforeEach, describe, expect, it } from 'bun:test'
import { optimism } from '@tevm/common'
import { type MemoryClient, createMemoryClient } from '@tevm/memory-client'
import { transports } from '@tevm/test-utils'
import { handleBulkRequest } from './handleBulkRequest.js'

describe('handleBulkRequest', () => {
	let client: MemoryClient<any, any>

	beforeEach(() => {
		client = createMemoryClient({
			common: optimism,
			fork: {
				transport: transports.optimism,
				blockTag: 115325880n,
			},
		})
	})

	it('should handle valid requests and return responses', async () => {
		const requests = [
			{ jsonrpc: '2.0', method: 'eth_chainId', params: [], id: 1 },
			{ jsonrpc: '2.0', method: 'eth_blockNumber', params: [], id: 2 },
		] as const

		const result = await handleBulkRequest(client, requests)
		expect(result).toMatchSnapshot()
	})

	it('should handle errors and return error responses', async () => {
		const requests = [
			{ jsonrpc: '2.0', method: 'eth_invalidMethod', params: [], id: 1 },
			{ jsonrpc: '2.0', method: 'eth_blockNumber', params: [], id: 2 },
		] as const

		const result = await handleBulkRequest(client, requests)
		expect(result[0]).toMatchSnapshot()
		expect(result[1]).toMatchSnapshot()
	})

	it('should handle requests without IDs', async () => {
		const requests = [
			{ jsonrpc: '2.0', method: 'eth_chainId', params: [] },
			{ jsonrpc: '2.0', method: 'eth_blockNumber', params: [] },
		] as const

		const result = await handleBulkRequest(client, requests)
		expect(result).toMatchSnapshot()
	})

	it('should log errors and return error responses for invalid requests', async () => {
		const requests = [{ jsonrpc: '2.0', method: 'eth_invalidMethod', params: [], id: 1 }] as const

		const result = await handleBulkRequest(client, requests)
		expect(result[0]).toMatchSnapshot()
	})

	it('should log errors and return error responses if underlying client throws', async () => {
		;(client as any).transport.tevm.extend = () => ({ send: () => Promise.reject(new Error('test error')) })
		const requests = [{ jsonrpc: '2.0', method: 'eth_invalidMethod', params: [], id: 1 }] as const

		const result = await handleBulkRequest(client, requests)
		expect(result[0]).toMatchSnapshot()
	})
})
