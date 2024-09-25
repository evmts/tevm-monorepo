import { createTevmNode } from '@tevm/node'
import type { Hex } from 'viem'
import { describe, expect, it } from 'vitest'
import { callHandler } from '../Call/callHandler.js'
import { mineHandler } from '../Mine/mineHandler.js'
import { ethGetTransactionReceiptJsonRpcProcedure } from './ethGetTransactionReceiptProcedure.js'

describe('ethGetTransactionReceiptJsonRpcProcedure', () => {
	it('should return the transaction receipt if found', async () => {
		const client = createTevmNode()
		const to = `0x${'69'.repeat(20)}` as const

		// Send a transaction
		const callResult = await callHandler(client)({
			createTransaction: true,
			to,
			value: 420n,
			skipBalance: true,
		})

		await mineHandler(client)({})

		const request = {
			id: 1,
			method: 'eth_getTransactionReceipt',
			params: [callResult.txHash as Hex],
			jsonrpc: '2.0',
		} as const

		const procedure = ethGetTransactionReceiptJsonRpcProcedure(client)
		const response = await procedure(request)

		expect(response.result?.transactionHash).toEqual(callResult.txHash)
		expect(response).toMatchObject({
			id: 1,
			jsonrpc: '2.0',
			method: 'eth_getTransactionReceipt',
			result: {
				blockHash: expect.stringMatching(/^0x[a-fA-F0-9]{64}$/),
				blockNumber: '0x1',
				transactionHash: callResult.txHash,
				transactionIndex: '0x0',
				from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
				to: '0x6969696969696969696969696969696969696969',
				cumulativeGasUsed: expect.any(String),
				gasUsed: expect.any(String),
				contractAddress: null,
				logs: expect.any(Array),
				logsBloom: expect.any(String),
				status: undefined,
			},
		})
	})

	it('should return null if the transaction receipt is not found', async () => {
		const client = createTevmNode()

		// Mine a block without any transactions
		await mineHandler(client)({})

		const request = {
			id: 1,
			method: 'eth_getTransactionReceipt',
			params: ['0x5e5b342fae6b13548e62c3038078915397ebd2406a8c67afd276e8dc84ebba80'],
			jsonrpc: '2.0',
		} as const

		const procedure = ethGetTransactionReceiptJsonRpcProcedure(client)
		const response = await procedure(request)

		expect(response).toEqual({
			id: 1,
			jsonrpc: '2.0',
			method: 'eth_getTransactionReceipt',
			result: null,
		})
	})
})
