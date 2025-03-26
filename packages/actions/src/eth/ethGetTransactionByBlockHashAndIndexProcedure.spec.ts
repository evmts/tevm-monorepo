import { createTevmNode } from '@tevm/node'
import { bytesToHex } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { callHandler } from '../Call/callHandler.js'
import { mineHandler } from '../Mine/mineHandler.js'
import { ethGetTransactionByBlockHashAndIndexJsonRpcProcedure } from './ethGetTransactionByBlockHashAndIndexProcedure.js'

describe('ethGetTransactionByBlockHashAndIndexJsonRpcProcedure', () => {
	it('should return the transaction if found', async () => {
		const client = createTevmNode()
		const to = `0x${'69'.repeat(20)}` as const

		// Send a transaction
		const callResult = await callHandler(client)({
			createTransaction: true,
			to,
			value: 420n,
			skipBalance: true,
		})

		// Mine a block to include the transaction
		await mineHandler(client)({})

		// Get the block hash
		const block = await client.getVm().then((vm) => vm.blockchain.getCanonicalHeadBlock())
		const blockHash = bytesToHex(block.hash())

		const request = {
			id: 1,
			method: 'eth_getTransactionByBlockHashAndIndex',
			params: [blockHash, '0x0'],
			jsonrpc: '2.0',
		} as const

		const procedure = ethGetTransactionByBlockHashAndIndexJsonRpcProcedure(client)
		const response = await procedure(request)

		expect(response.result?.hash).toEqual(callResult.txHash)
		expect(response).toMatchObject({
			id: 1,
			jsonrpc: '2.0',
			method: 'eth_getTransactionByBlockHashAndIndex',
			result: {
				accessList: [],
				blobVersionedHashes: undefined,
				blockHash: expect.stringMatching(/^0x[a-fA-F0-9]{64}$/),
				blockNumber: '0x1',
				input: '0x',
				from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
				gas: '0x5a3c',
				gasPrice: '0x7',
				hash: '0x5e5b342fae6b13548e62c3038078915397ebd2406a8c67afd276e8dc84ebba80',
				maxFeePerBlobGas: undefined,
				maxFeePerGas: '0x7',
				maxPriorityFeePerGas: '0x0',
				nonce: '0x0',
				to: '0x6969696969696969696969696969696969696969',
				transactionIndex: '0x0',
				type: '0x2',
				value: '0x1a4',
			},
		})
	})

	it('should return an error if the transaction is not found', async () => {
		const client = createTevmNode()

		// Mine a block without any transactions
		await mineHandler(client)({})

		// Get the block hash
		const block = await client.getVm().then((vm) => vm.blockchain.getCanonicalHeadBlock())
		const blockHash = bytesToHex(block.hash())

		const request = {
			id: 1,
			method: 'eth_getTransactionByBlockHashAndIndex',
			params: [blockHash, '0x0'],
			jsonrpc: '2.0',
		} as const

		const procedure = ethGetTransactionByBlockHashAndIndexJsonRpcProcedure(client)
		const response = await procedure(request)

		expect(response).toEqual({
			id: 1,
			jsonrpc: '2.0',
			method: 'eth_getTransactionByBlockHashAndIndex',
			error: {
				code: -32602,
				message: 'Transaction not found',
			},
		})
	})
})
