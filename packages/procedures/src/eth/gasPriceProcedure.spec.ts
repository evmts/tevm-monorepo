import { describe, expect, it, beforeEach } from 'bun:test'
import { createBaseClient, type BaseClient } from '@tevm/base-client'
import { gasPriceProcedure } from './gasPriceProcedure.js'
import type { EthGasPriceJsonRpcRequest } from './EthJsonRpcRequest.js'
import { numberToHex } from '@tevm/utils'

let client: BaseClient

beforeEach(() => {
	client = createBaseClient()
})

describe('gasPriceProcedure', () => {
	it('should return the current gas price', async () => {
		const request: EthGasPriceJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_gasPrice',
			id: 1,
			params: [],
		}

		const response = await gasPriceProcedure({
			getVm: client.getVm,
			forkTransport: client.forkTransport,
		} as any)(request)

		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('eth_gasPrice')
		expect(response.id).toBe(request.id as any)
		expect(response.result).toMatchSnapshot()
	})

	it('should handle requests without an id', async () => {
		const request: EthGasPriceJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_gasPrice',
			params: [],
		}

		const response = await gasPriceProcedure({
			getVm: client.getVm,
			forkTransport: client.forkTransport,
		} as any)(request)

		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('eth_gasPrice')
		expect(response.id).toBeUndefined()
		expect(response.result).toMatchSnapshot()
	})
})
