import { describe, expect, it, beforeEach } from 'bun:test'
import { createBaseClient, type BaseClient } from '@tevm/base-client'
import { setAccountHandler } from '@tevm/actions'
import { callProcedure } from './callProcedure.js'
import type { CallJsonRpcRequest } from './CallJsonRpcRequest.js'
import { numberToHex } from '@tevm/utils'

let client: BaseClient

beforeEach(() => {
	client = createBaseClient()
})

describe('callProcedure', () => {
	it('should handle a basic call', async () => {
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

		const request: CallJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'tevm_call',
			id: 1,
			params: [
				{
					to: address,
					data: '0x0',
					gas: numberToHex(21000n),
					gasPrice: numberToHex(1n),
				},
			],
		}

		const response = await callProcedure(client)(request)
		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('tevm_call')
		expect(response.id).toBe(request.id as any)
		expect(response.result).toMatchSnapshot()
	})

	it('should handle a call with state override', async () => {
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

		const request: CallJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'tevm_call',
			id: 1,
			params: [
				{
					to: address,
					data: '0x0',
					gas: numberToHex(21000n),
					gasPrice: numberToHex(1n),
				},
				{
					[address]: {
						balance: numberToHex(500n),
					},
				},
			],
		}

		const response = await callProcedure(client)(request)
		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('tevm_call')
		expect(response.id).toBe(request.id as any)
		expect(response.result).toMatchSnapshot()
	})

	it('should handle a call with block override', async () => {
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

		const request: CallJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'tevm_call',
			id: 1,
			params: [
				{
					to: address,
					data: '0x0',
					gas: numberToHex(21000n),
					gasPrice: numberToHex(1n),
				},
				{},
				{
					baseFee: numberToHex(100n),
				},
			],
		}

		const response = await callProcedure(client)(request)
		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('tevm_call')
		expect(response.id).toBe(request.id as any)
		expect(response.result).toMatchSnapshot()
	})

	it('should handle errors from callHandler', async () => {
		const request: CallJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'tevm_call',
			id: 1,
			params: [
				{
					to: `0x${'00'.repeat(20)}` as const, // Invalid address
					data: '0x0',
					gas: numberToHex(21000n),
					gasPrice: numberToHex(1n),
				},
			],
		}

		const response = await callProcedure(client)(request)
		expect(response.error).toBeDefined()
		expect(response.error).toMatchSnapshot()
		expect(response.method).toBe('tevm_call')
		expect(response.id).toBe(request.id as any)
	})
})
