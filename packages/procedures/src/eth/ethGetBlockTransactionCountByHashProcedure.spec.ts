import { describe, expect, it, beforeEach } from 'bun:test'
import { createBaseClient, type BaseClient } from '@tevm/base-client'
import { ethGetBlockTransactionCountByHashJsonRpcProcedure } from './ethGetBlockTransactionCountByHashProcedure.js'
import type { EthGetBlockTransactionCountByHashJsonRpcRequest } from './EthJsonRpcRequest.js'
import { bytesToHex, numberToHex } from '@tevm/utils'
import { Block } from '@tevm/block'
import type { Vm } from '@tevm/vm'

let client: BaseClient
let vm: Vm

beforeEach(async () => {
	client = createBaseClient()
	vm = await client.getVm()
})

describe('ethGetBlockTransactionCountByHashJsonRpcProcedure', () => {
	it('should return the transaction count for a given block hash', async () => {
		// Prepare mock block with transactions
		const mockBlock = Block.fromBlockData(
			{
				header: {
					parentHash: '0x',
					coinbase: '0x',
					stateRoot: '0x',
					transactionsTrie: '0x',
					receiptTrie: '0x',
					logsBloom: '0x',
					difficulty: 1,
					number: 1,
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

		const request: EthGetBlockTransactionCountByHashJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_getBlockTransactionCountByHash',
			id: 1,
			params: [bytesToHex(mockBlock.hash())],
		}

		const response = await ethGetBlockTransactionCountByHashJsonRpcProcedure(client)(request)
		expect(response.error).toBeUndefined()
		expect(response.result).toBe(numberToHex(mockBlock.transactions.length))
		expect(response.method).toBe('eth_getBlockTransactionCountByHash')
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

		const request: EthGetBlockTransactionCountByHashJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_getBlockTransactionCountByHash',
			params: [bytesToHex(mockBlock.hash())],
		}

		const response = await ethGetBlockTransactionCountByHashJsonRpcProcedure(client)(request)
		expect(response.error).toBeUndefined()
		expect(response.result).toBe(numberToHex(mockBlock.transactions.length))
		expect(response.method).toBe('eth_getBlockTransactionCountByHash')
		expect(response.id).toBeUndefined()
	})

	it('should handle an invalid block hash', async () => {
		const request: EthGetBlockTransactionCountByHashJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'eth_getBlockTransactionCountByHash',
			id: 1,
			params: ['0xInvalidHash'],
		}

		const response = await ethGetBlockTransactionCountByHashJsonRpcProcedure(client)(request)
		expect(response.error).toBeDefined()
		expect(response.error).toMatchSnapshot()
	})
})
