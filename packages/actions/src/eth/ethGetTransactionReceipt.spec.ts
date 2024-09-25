import { createTevmNode } from '@tevm/node'
import type { Hex } from 'viem'
import { describe, expect, it } from 'vitest'
import { callHandler } from '../Call/callHandler.js'
import { mineHandler } from '../Mine/mineHandler.js'
import { ethGetTransactionReceiptHandler } from './ethGetTransactionReceipt.js'

describe('ethGetTransactionReceiptHandler', () => {
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

		// Mine a block to include the transaction
		await mineHandler(client)({})

		const handler = ethGetTransactionReceiptHandler(client)
		const receipt = await handler({ hash: callResult.txHash as Hex })

		expect(receipt?.transactionHash).toEqual(callResult.txHash)
		expect(receipt).toMatchObject({
			blockHash: expect.stringMatching(/^0x[a-fA-F0-9]{64}$/),
			blockNumber: BigInt(1),
			transactionHash: callResult.txHash,
			transactionIndex: 0,
			from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
			to: '0x6969696969696969696969696969696969696969',
			cumulativeGasUsed: expect.any(BigInt),
			gasUsed: expect.any(BigInt),
			contractAddress: null,
			logs: expect.any(Array),
			logsBloom: expect.any(String),
			status: undefined,
		})
	})

	it('should return null if the transaction receipt is not found', async () => {
		const client = createTevmNode()

		// Mine a block without any transactions
		await mineHandler(client)({})

		const handler = ethGetTransactionReceiptHandler(client)
		const receipt = await handler({ hash: '0x5e5b342fae6b13548e62c3038078915397ebd2406a8c67afd276e8dc84ebba80' })

		expect(receipt).toBeNull()
	})
})
