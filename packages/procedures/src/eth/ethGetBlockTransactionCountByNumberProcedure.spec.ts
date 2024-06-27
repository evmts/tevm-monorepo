import { describe, expect, it, beforeEach } from 'bun:test'
import { createBaseClient, type BaseClient } from '@tevm/base-client'
import { ethGetBlockTransactionCountByNumberJsonRpcProcedure } from './ethGetBlockTransactionCountByNumberProcedure.js'
import type { EthGetBlockTransactionCountByNumberJsonRpcRequest } from './EthJsonRpcRequest.js'
import { numberToHex } from '@tevm/utils'
import { Block } from '@tevm/block'
import type { Vm } from '@tevm/vm'

let client: BaseClient
let vm: Vm

beforeEach(async () => {
	client = createBaseClient()
	vm = await client.getVm()
})

describe('ethGetBlockTransactionCountByNumberJsonRpcProcedure', () => {
	it('should return the transaction count for a given block number', async () => {
		// Prepare mock block with transactions
		const mockBlock = Block.fromBlockData(
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
				transactions: [{}, {}, {}], // Mock 3 transactions
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
		// Prepare mock block with transactions
		const mockBlock = Block.fromBlockData(
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

	it('should handle an invalid block number', async () => {
		const request: EthGetBlockTransactionCountByNumberJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_getBlockTransactionCountByNumber',
			id: 1,
			params: ['0xInvalidNumber'],
		}

		const response = await ethGetBlockTransactionCountByNumberJsonRpcProcedure(client)(request)
		expect(response.error).toBeDefined()
		expect(response.error).toMatchSnapshot()
	})
})
