import { createTevmNode, type TevmNode } from '@tevm/node'
import { beforeEach, describe, expect, it } from 'vitest'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import type { GetAccountJsonRpcRequest } from './GetAccountJsonRpcRequest.js'
import { getAccountProcedure } from './getAccountProcedure.js'

let client: TevmNode

beforeEach(() => {
	client = createTevmNode()
})

describe('getAccountProcedure', () => {
	it('should get account successfully', async () => {
		const address = `0x${'69'.repeat(20)}` as const

		await setAccountHandler(client)({
			address,
			balance: 420n,
			nonce: 69n,
			deployedBytecode: '0x1234',
		})

		const request: GetAccountJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'tevm_getAccount',
			id: 1,
			params: [{ address }],
		}

		const response = await getAccountProcedure(client)(request)
		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('tevm_getAccount')
		expect(response.id).toBe(request.id as any)
		expect(response.result).toMatchObject({
			address,
			balance: '0x1a4',
			deployedBytecode: '0x1234',
			nonce: '0x45',
			storageRoot: expect.any(String),
			isContract: true,
			isEmpty: false,
			codeHash: expect.any(String),
			storage: undefined,
		})
	})

	it('should handle account not found', async () => {
		const address = `0x${'69'.repeat(20)}` as const

		const request: GetAccountJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'tevm_getAccount',
			id: 1,
			params: [{ address }],
		}

		const response = await getAccountProcedure(client)(request)
		expect(response.error).toBeDefined()
		expect(response.error).toMatchSnapshot()
	})

	it('should handle errors from getAccountHandler', async () => {
		const address = `0x${'69'.repeat(20)}` as const

		const request: GetAccountJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'tevm_getAccount',
			id: 1,
			params: [{ address }],
		}
		const response = await getAccountProcedure(client)(request)
		expect(response.error).toBeDefined()
		expect(response.error).toMatchSnapshot()
		expect(response.method).toBe('tevm_getAccount')
		expect(response.id).toBe(request.id as any)
	})

	it('should return storage if returnStorage is true', async () => {
		const address = `0x${'69'.repeat(20)}` as const
		await setAccountHandler(client)({
			address,
			balance: 420n,
			nonce: 69n,
			deployedBytecode: '0x1234',
			state: {
				'0x0': '0x01',
			},
		})

		const request: GetAccountJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'tevm_getAccount',
			id: 1,
			params: [{ address, returnStorage: true }],
		}

		const response = await getAccountProcedure(client)(request)
		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('tevm_getAccount')
		expect(response.id).toBe(request.id as any)
		expect(response.result).toMatchSnapshot()
	})
})
