import { describe, expect, it, beforeEach } from 'bun:test'
import { createBaseClient, type BaseClient } from '@tevm/base-client'
import { ethGetBlockByHashJsonRpcProcedure } from './ethGetBlockByHashProcedure.js'
import type { EthGetBlockByHashJsonRpcRequest } from './EthJsonRpcRequest.js'
import { callHandler, mineHandler } from '@tevm/actions'
import { bytesToHex, numberToHex } from '@tevm/utils'

let client: BaseClient

beforeEach(async () => {
	client = createBaseClient()
	await callHandler(client)({ createTransaction: true, value: 420n, to: `0x${'01'.repeat(20)}` })
	await mineHandler(client)()
})

describe('ethGetBlockByHashJsonRpcProcedure', () => {
	it('should return block details by hash', async () => {
		const vm = await client.getVm()
		const head = await vm.blockchain.getCanonicalHeadBlock()
		const request: EthGetBlockByHashJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_getBlockByHash',
			id: 1,
			params: [
				bytesToHex(head.header.hash()),
				false, // Do not include transactions
			],
		}

		const response = await ethGetBlockByHashJsonRpcProcedure(client)(request)
		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('eth_getBlockByHash')
		expect(response.id).toBe(request.id as any)
		expect(response.result?.hash).toBe(bytesToHex(head.header.hash()))
		expect(response.result?.number).toBe(numberToHex(head.header.number))
	})

	it('should include transactions if requested', async () => {
		const vm = await client.getVm()
		const head = await vm.blockchain.getCanonicalHeadBlock()
		const request: EthGetBlockByHashJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_getBlockByHash',
			id: 1,
			params: [
				bytesToHex(head.header.hash()),
				true, // Include transactions
			],
		}

		const response = await ethGetBlockByHashJsonRpcProcedure(client)(request)
		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('eth_getBlockByHash')
		expect(response.id).toBe(request.id as any)
		expect(response.result?.hash).toBe(bytesToHex(head.header.hash()))
		expect(response.result?.number).toBe(numberToHex(head.header.number))
	})

	it('should handle requests without an id', async () => {
		const vm = await client.getVm()
		const head = await vm.blockchain.getCanonicalHeadBlock()
		const request: EthGetBlockByHashJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_getBlockByHash',
			params: [
				bytesToHex(head.header.hash()),
				false, // Do not include transactions
			],
		}

		const response = await ethGetBlockByHashJsonRpcProcedure(client)(request)
		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('eth_getBlockByHash')
		expect(response.id).toBeUndefined()
		expect(response.result?.hash).toBe(bytesToHex(head.header.hash()))
		expect(response.result?.number).toBe(numberToHex(head.header.number))
	})
})
