import { Block } from '@tevm/block'
import { createTevmNode, type TevmNode } from '@tevm/node'
import { bytesToHex, numberToHex } from '@tevm/utils'
import type { Vm } from '@tevm/vm'
import { beforeEach, describe, expect, it } from 'vitest'
import type { EthGetBlockTransactionCountByHashJsonRpcRequest } from './EthJsonRpcRequest.js'
import { ethGetBlockTransactionCountByHashJsonRpcProcedure } from './ethGetBlockTransactionCountByHashProcedure.js'

let client: TevmNode
let vm: Vm

beforeEach(async () => {
	client = createTevmNode()
	vm = await client.getVm()
})

describe('ethGetBlockTransactionCountByHashJsonRpcProcedure', () => {
	it('should return the transaction count for a given block hash', async () => {
		// Prepare mock block with transactions
		const mockBlock = Block.fromBlockData(
			{
				header: {
					parentHash: numberToHex(32, { size: 32 }),
					coinbase: `0x${'12'.repeat(20)}`,
					stateRoot: numberToHex(599, { size: 32 }),
					transactionsTrie: numberToHex(999, { size: 32 }),
					receiptTrie: numberToHex(10, { size: 32 }),
					logsBloom: '0x',
					number: 0,
					gasLimit: 1,
					gasUsed: 0,
					timestamp: 0,
					extraData: '0x',
					mixHash: numberToHex(77, { size: 32 }),
					nonce: numberToHex(0, { size: 8 }),
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
					number: 0,
					parentHash: numberToHex(32, { size: 32 }),
					coinbase: `0x${'12'.repeat(20)}`,
					stateRoot: numberToHex(599, { size: 32 }),
					transactionsTrie: numberToHex(999, { size: 32 }),
					receiptTrie: numberToHex(10, { size: 32 }),
					logsBloom: '0x',
					gasLimit: 1,
					gasUsed: 0,
					timestamp: 0,
					extraData: '0x',
					mixHash: numberToHex(77, { size: 32 }),
					nonce: numberToHex(0, { size: 8 }),
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

		const e = await ethGetBlockTransactionCountByHashJsonRpcProcedure(client)(request).catch((e) => e)
		expect(e).toBeDefined()
		expect(e).toMatchSnapshot()
	})
})
