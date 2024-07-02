import { describe, expect, it, beforeEach } from 'bun:test'
import { createBaseClient, type BaseClient } from '@tevm/base-client'
import { setAccountHandler } from '@tevm/actions'
import { callProcedure } from './callProcedure.js'
import type { CallJsonRpcRequest } from './CallJsonRpcRequest.js'
import { encodeFunctionData, numberToHex, parseEther } from '@tevm/utils'
import { ERC20 } from '@tevm/contract'

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
			deployedBytecode: ERC20.deployedBytecode,
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
					data: encodeFunctionData(ERC20.read.name()),
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
		const to = `0x${'69'.repeat(20)}` as const
		const from = `0x${'42'.repeat(20)}` as const
		const request: CallJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'tevm_call',
			id: 1,
			params: [
				{
					to,
					from,
					value: numberToHex(parseEther('.9')),
				},
				{
					[from]: {
						balance: numberToHex(parseEther('1')),
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

	it.todo('should handle a call with block override', async () => {})

	it('should handle errors from callHandler', async () => {
		const request: CallJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'tevm_call',
			id: 1,
			params: [
				{
					to: `0x${'00'.repeat(20)}` as const, // Invalid address
					from: `0x${'42'.repeat(20)}` as const,
					data: '0x0',
					value: numberToHex(500n),
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
