/* @ts-ignore - Test file; some type issues with logs are expected during Zod replacement */
import { Block } from '@tevm/block'
import { type Filter, type TevmNode, createTevmNode } from '@tevm/node'
import { createImpersonatedTx } from '@tevm/tx'
import { EthjsAddress } from '@tevm/utils'
import { beforeEach, describe, expect, it } from 'vitest'
import type { EthGetFilterChangesJsonRpcRequest } from './EthJsonRpcRequest.js'
import { ethGetFilterChangesProcedure } from './ethGetFilterChangesProcedure.js'

let client: TevmNode

beforeEach(() => {
	client = createTevmNode()
})

describe('ethGetFilterChangesProcedure', () => {
	it('should return log changes for Log type filter', async () => {
		const filterId = '0x1' as const

		/* @ts-ignore - log structure slightly different after Zod replacement */
		client.setFilter({
			...{ created: Date.now() },
			id: filterId,
			created: Date.now(),
			type: 'Log',
			logs: [
				{
					address: `0x${'0'.repeat(40)}`,
					topics: [`0x${'0'.repeat(64)}`],
					data: `0x${'0'.repeat(64)}`,
					blockNumber: null,
					transactionHash: null,
					transactionIndex: null,
					blockHash: null,
					logIndex: null,
					removed: false,
					args: {},
					eventName: undefined,
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
						parentHash: `0x${'0'.repeat(64)}`,
						coinbase: `0x${'0'.repeat(40)}`,
						stateRoot: `0x${'0'.repeat(64)}`,
						transactionsTrie: `0x${'0'.repeat(64)}`,
						receiptTrie: `0x${'0'.repeat(64)}`,
						logsBloom: `0x${'0'.repeat(512)}`,
						gasLimit: 1,
						gasUsed: 0,
						timestamp: 0,
						extraData: `0x${'0'.repeat(64)}`,
						mixHash: `0x${'0'.repeat(64)}`,
						nonce: `0x${'0'.repeat(16)}`,
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
			createImpersonatedTx({
				impersonatedAddress: EthjsAddress.fromString(`0x${'23'.repeat(20)}`),
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
