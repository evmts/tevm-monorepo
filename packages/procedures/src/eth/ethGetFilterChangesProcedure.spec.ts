import { describe, expect, it, beforeEach } from 'bun:test'
import { createBaseClient, type BaseClient, type Filter } from '@tevm/base-client'
import { ethGetFilterChangesProcedure } from './ethGetFilterChangesProcedure.js'
import type { EthGetFilterChangesJsonRpcRequest } from './EthJsonRpcRequest.js'
import { Block } from '@tevm/block'
import { FeeMarketEIP1559Transaction } from '@tevm/tx'

let client: BaseClient

beforeEach(() => {
	client = createBaseClient()
})

describe('ethGetFilterChangesProcedure', () => {
	it('should return log changes for Log type filter', async () => {
		const filterId = '0x1' as const

		client.setFilter({
			...{ created: Date.now() },
			id: filterId,
			created: Date.now(),
			type: 'Log',
			logs: [
				{
					address: '0x1234',
					topics: ['0x5678'],
					data: '0x9abc',
					blockNumber: 1n,
					transactionHash: '0xdef',
					transactionIndex: 0,
					blockHash: '0x12345',
					logIndex: 0,
					removed: false,
				},
			],
			tx: [],
			blocks: [],
			installed: {},
			err: undefined,
			registeredListeners: [],
		})

		const request: EthGetFilterChangesJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_getFilterChanges',
			id: 1,
			params: [filterId],
		}

		const response = await ethGetFilterChangesProcedure(client)(request)
		expect(response.error).toBeUndefined()
		expect(response.method).toBe('eth_getFilterChanges')
		expect(response.id).toBe(request.id as any)
		expect(response.result).toMatchSnapshot()
	})

	it('should return block changes for Block type filter', async () => {
		const filterId = '0x2' as const
		const vm = await client.getVm()
		const blocks = [
			Block.fromBlockData(
				{
					header: {
						number: 1,
						parentHash: '0x',
						coinbase: '0x',
						stateRoot: '0x',
						transactionsTrie: '0x',
						receiptTrie: '0x',
						logsBloom: '0x',
						difficulty: 1,
						gasLimit: 1,
						gasUsed: 0,
						timestamp: 0,
						extraData: '0x',
						mixHash: '0x',
						nonce: '0x',
						baseFeePerGas: 0,
					},
				},
				{ common: vm.common },
			),
		]

		const filter: Filter = {
			id: filterId,
			type: 'Block',
			created: Date.now(),
			logs: [],
			tx: [],
			blocks,
			installed: {},
			err: undefined,
			registeredListeners: [],
		}

		client.setFilter(filter)

		const request: EthGetFilterChangesJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_getFilterChanges',
			id: 1,
			params: [filterId],
		}

		const response = await ethGetFilterChangesProcedure(client)(request)
		expect(response.error).toBeUndefined()
		expect(response.method).toBe('eth_getFilterChanges')
		expect(response.id).toBe(request.id as any)
		expect(response.result).toMatchSnapshot()
	})

	it('should return transaction changes for PendingTransaction type filter', async () => {
		const filterId = '0x3' as const
		const tx = [
			new FeeMarketEIP1559Transaction({
				to: `0x${'0'.repeat(40)}`,
				data: `0x${'0'.repeat(40)}`,
			}),
		]

		const filter: Filter = {
			id: filterId,
			type: 'PendingTransaction',
			created: Date.now(),
			logs: [],
			tx,
			blocks: [],
			installed: {},
			err: undefined,
			registeredListeners: [],
		}

		client.setFilter(filter)

		const request: EthGetFilterChangesJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_getFilterChanges',
			id: 1,
			params: [filterId],
		}

		const response = await ethGetFilterChangesProcedure(client)(request)
		expect(response.error).toBeUndefined()
		expect(response.method).toBe('eth_getFilterChanges')
		expect(response.id).toBe(request.id as any)
		expect(response.result).toMatchSnapshot()
	})

	it('should return an error if the filter is not found', async () => {
		const filterId = '0x4' as const
		const request: EthGetFilterChangesJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_getFilterChanges',
			id: 1,
			params: [filterId],
		}

		const response = await ethGetFilterChangesProcedure(client)(request)
		expect(response.error).toBeDefined()
		expect(response.error).toMatchSnapshot()
		expect(response.method).toBe('eth_getFilterChanges')
		expect(response.id).toBe(request.id as any)
	})

	it('should throw an error for an unknown filter type', async () => {
		const filterId = '0x5' as const
		const filter: Filter = {
			id: filterId,
			type: 'UnknownType' as any, // Invalid type to test error handling
			created: Date.now(),
			logs: [],
			tx: [],
			blocks: [],
			installed: {},
			err: undefined,
			registeredListeners: [],
		}

		client.setFilter(filter)

		const request: EthGetFilterChangesJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_getFilterChanges',
			id: 1,
			params: [filterId],
		}

		expect(await ethGetFilterChangesProcedure(client)(request).catch((e) => e)).toMatchSnapshot()
	})
})
