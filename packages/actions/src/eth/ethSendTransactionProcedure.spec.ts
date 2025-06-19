import { createAddress } from '@tevm/address'
import { createTevmNode } from '@tevm/node'
import { parseEther } from '@tevm/utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { getAccountHandler } from '../GetAccount/getAccountHandler.js'
import { mineHandler } from '../Mine/mineHandler.js'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { ethSendTransactionJsonRpcProcedure } from './ethSendTransactionProcedure.js'

describe('ethSendTransactionJsonRpcProcedure', () => {
	let client: ReturnType<typeof createTevmNode>
	let procedure: ReturnType<typeof ethSendTransactionJsonRpcProcedure>

	beforeEach(() => {
		client = createTevmNode()
		procedure = ethSendTransactionJsonRpcProcedure(client)
	})

	it('should handle a simple transaction request', async () => {
		const from = createAddress('0x1234')
		const to = createAddress('0x5678')
		const value = parseEther('1')

		// Set up the sender's account
		await setAccountHandler(client)({
			address: from.toString(),
			balance: parseEther('10'),
		})

		const request = {
			method: 'eth_sendTransaction',
			params: [
				{
					from: from.toString(),
					to: to.toString(),
					value: `0x${value.toString(16)}`,
					gas: '0x5208', // 21000
				},
			],
			jsonrpc: '2.0',
			id: 1,
		} as const

		const result = await procedure(request)

		// Check the response structure
		expect(result).toEqual({
			jsonrpc: '2.0',
			id: 1,
			method: 'eth_sendTransaction',
			result: expect.stringMatching(/^0x[a-fA-F0-9]{64}$/), // Transaction hash
		})

		// Mine the block to process the transaction
		await mineHandler(client)()

		// Verify the balance change
		// @ts-expect-error: Monorepo type conflict: TevmNode from source (/src) conflicts with the matcher's type from compiled output (/dist).
		await expect(to.toString()).toHaveState(client, { balance: value })

		// Verify the sender's balance change (should be less than 10 - 1 due to gas costs)
		const fromAccount = await getAccountHandler(client)({ address: from.toString() })
		expect(fromAccount.balance).toBeLessThan(parseEther('9'))
		expect(fromAccount.balance).toBeGreaterThan(parseEther('8.9'))
	})
})
