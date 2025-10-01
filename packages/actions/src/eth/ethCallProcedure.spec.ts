import { createTevmNode, type TevmNode } from '@tevm/node'
import { PREFUNDED_ACCOUNTS } from '@tevm/utils'
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
					from: PREFUNDED_ACCOUNTS[0].address,
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
					from: PREFUNDED_ACCOUNTS[0].address,
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
					from: PREFUNDED_ACCOUNTS[0].address,
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

	it('should not create transactions or trigger mining during call', async () => {
		const automineClient = createTevmNode({ miningConfig: { type: 'auto' } })
		const initialBlock = await automineClient.getVm().then((vm) => vm.blockchain.getCanonicalHeadBlock())
		const initialBlockNumber = initialBlock.header.number

		const txPool = await automineClient.getTxPool()
		const initialTxPoolSize = txPool.pool.size

		const request: EthCallJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_call',
			id: 1,
			params: [
				{
					from: PREFUNDED_ACCOUNTS[0].address,
					to: `0x${'69'.repeat(20)}`,
				},
				'latest',
			],
		}

		const response = await ethCallProcedure(automineClient)(request)

		const finalBlock = await automineClient.getVm().then((vm) => vm.blockchain.getCanonicalHeadBlock())
		const finalBlockNumber = finalBlock.header.number
		const finalTxPoolSize = txPool.pool.size

		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(finalBlockNumber).toBe(initialBlockNumber)
		expect(finalTxPoolSize).toBe(initialTxPoolSize)
	})
})
