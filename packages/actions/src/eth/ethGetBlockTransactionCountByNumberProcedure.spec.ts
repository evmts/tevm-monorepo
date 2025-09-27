import { Block } from '@tevm/block'
import { createTevmNode, type TevmNode } from '@tevm/node'
import { numberToHex } from '@tevm/utils'
import type { Vm } from '@tevm/vm'
import { beforeEach, describe, expect, it } from 'vitest'
import type { EthGetBlockTransactionCountByNumberJsonRpcRequest } from './EthJsonRpcRequest.js'
import { ethGetBlockTransactionCountByNumberJsonRpcProcedure } from './ethGetBlockTransactionCountByNumberProcedure.js'

let client: TevmNode
let vm: Vm

beforeEach(async () => {
	client = createTevmNode()
	vm = await client.getVm()
})

describe('ethGetBlockTransactionCountByNumberJsonRpcProcedure', () => {
	it('should return the transaction count for a given block number', async () => {
		// Prepare mock block with transactions
		const mockBlock = Block.fromBlockData(
			{
				header: {
					number: 1,
					parentHash: `0x${'0'.repeat(64)}`,
					coinbase: `0x${'1'.repeat(40)}`,
					stateRoot: `0x${'0'.repeat(64)}`,
					transactionsTrie: `0x${'0'.repeat(64)}`,
					receiptTrie: `0x${'0'.repeat(64)}`,
					logsBloom: `0x${'0'.repeat(512)}`,
					gasLimit: 1,
					gasUsed: 0,
					timestamp: 0,
					extraData: '0x',
					mixHash: `0x${'0'.repeat(64)}`,
					nonce: `0x${'0'.repeat(16)}`,
					baseFeePerGas: 0,
				},
				transactions: [
					{
						to: `0x${'2'.repeat(40)}`,
						value: 1,
						gasLimit: 1,
						gasPrice: 1,
						nonce: 0,
						data: '0x',
					},
					{
						to: `0x${'2'.repeat(40)}`,
						value: 1,
						gasLimit: 1,
						gasPrice: 1,
						nonce: 1,
						data: '0x',
					},
					{
						to: `0x${'2'.repeat(40)}`,
						value: 1,
						gasLimit: 1,
						gasPrice: 1,
						nonce: 2,
						data: '0x',
					},
				],
			},
			{ common: vm.common },
		)

		await vm.blockchain.putBlock(mockBlock)

		const request: EthGetBlockTransactionCountByNumberJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_getBlockTransactionCountByNumber',
			id: 1,
			params: [numberToHex(mockBlock.header.number)],
		}

		const response = await ethGetBlockTransactionCountByNumberJsonRpcProcedure(client)(request)
		expect(response.error).toBeUndefined()
		expect(response.result).toBe(numberToHex(mockBlock.transactions.length))
		expect(response.method).toBe('eth_getBlockTransactionCountByNumber')
		expect(response.id).toBe(request.id as any)
	})

	it('should handle requests without an id', async () => {
		const mockBlock = Block.fromBlockData(
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
					extraData: '0x',
					mixHash: `0x${'0'.repeat(64)}`,
					nonce: `0x${'0'.repeat(16)}`,
					baseFeePerGas: 0,
				},
				transactions: [{}, {}, {}], // Mock 3 transactions
			},
			{ common: vm.common },
		)

		await vm.blockchain.putBlock(mockBlock)

		const request: EthGetBlockTransactionCountByNumberJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_getBlockTransactionCountByNumber',
			params: [numberToHex(mockBlock.header.number)],
		}

		const response = await ethGetBlockTransactionCountByNumberJsonRpcProcedure(client)(request)
		expect(response.error).toBeUndefined()
		expect(response.result).toBe(numberToHex(mockBlock.transactions.length))
		expect(response.method).toBe('eth_getBlockTransactionCountByNumber')
		expect(response.id).toBeUndefined()
	})
})
