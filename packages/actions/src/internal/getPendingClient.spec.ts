import { createTevmNode } from '@tevm/node'
import { parseEther } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { callHandler } from '../Call/callHandler.js'
import { getAccountHandler } from '../GetAccount/getAccountHandler.js'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { getPendingClient } from './getPendingClient.js'

describe('getPendingClient', () => {
	const createClient = () => createTevmNode()

	it('should process pending transactions', async () => {
		const client = createClient()
		const from = `0x${'1'.repeat(40)}` as const
		const to = `0x${'2'.repeat(40)}` as const
		const value = parseEther('1')

		// Set initial balance for sender
		const setAccountResult = await setAccountHandler(client)({
			address: from,
			balance: value * 2n, // Set balance higher to cover the transaction cost
			nonce: 0n,
		})
		expect(setAccountResult.errors).toBeUndefined()

		const callResult = await callHandler(client)({
			from,
			to,
			value,
			createTransaction: true,
		})
		expect(callResult.errors).toBeUndefined()
		expect(callResult.txHash).toBeDefined()

		const txPool = await client.getTxPool()

		expect(txPool.txsInPool).toBe(1)

		const mineResult = await getPendingClient(client)

		if ('errors' in mineResult) {
			throw mineResult.errors[0]
		}

		expect((await mineResult.pendingClient.getTxPool()).txsInPool).toBe(0)

		const fromAccount = await getAccountHandler(mineResult.pendingClient)({ address: from })
		const toAccount = await getAccountHandler(mineResult.pendingClient)({ address: to })

		expect(fromAccount.balance).toBeLessThan(value * 2n)
		expect(fromAccount.nonce).toBe(1n)
		expect(toAccount.balance).toBe(value)
	})
})
