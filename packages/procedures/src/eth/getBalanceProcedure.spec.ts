import { describe, expect, it, beforeEach } from 'bun:test'
import { createBaseClient, type BaseClient } from '@tevm/base-client'
import { getBalanceProcedure } from './getBalanceProcedure.js'
import { setAccountHandler, mineHandler } from '@tevm/actions'
import { type Address, numberToHex } from '@tevm/utils'
import type { EthGetBalanceJsonRpcRequest } from './EthJsonRpcRequest.js'

let client: BaseClient
let accountAddress: Address

beforeEach(async () => {
	client = createBaseClient()
	accountAddress = `0x${'69'.repeat(20)}` as Address
	await setAccountHandler(client)({
		address: accountAddress,
		balance: 1000n,
	})
	await mineHandler(client)()
})

describe('getBalanceProcedure', () => {
	it('should return the balance of an account', async () => {
		const request: EthGetBalanceJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_getBalance',
			id: 1,
			params: [accountAddress, 'latest'],
		}

		const response = await getBalanceProcedure(client)(request)
		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('eth_getBalance')
		expect(response.id).toBe(request.id as any)
		expect(response.result).toBe(numberToHex(1000n))
	})

	it('should handle requests without an id', async () => {
		const request: EthGetBalanceJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_getBalance',
			params: [accountAddress, 'latest'],
		}

		const response = await getBalanceProcedure(client)(request)
		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('eth_getBalance')
		expect(response.id).toBeUndefined()
		expect(response.result).toBe(numberToHex(1000n))
	})

	it('should return an error if the block parameter is missing', async () => {
		const request: EthGetBalanceJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_getBalance',
			id: 1,
			params: [accountAddress] as any,
		}

		expect(await getBalanceProcedure(client)(request).catch((e) => e)).toMatchSnapshot()
	})
})
