import { createAddress } from '@tevm/address'
import { NoForkUrlSetError } from '@tevm/errors'
import { createTevmNode } from '@tevm/node'
import { transports } from '@tevm/test-utils'
import { type Address, parseEther } from '@tevm/utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { mineHandler } from '../Mine/mineHandler.js'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { getBalanceHandler } from './getBalanceHandler.js'

describe(getBalanceHandler.name, () => {
	let baseClient: ReturnType<typeof createTevmNode>
	let address: Address
	let handler: ReturnType<typeof getBalanceHandler>

	beforeEach(() => {
		baseClient = createTevmNode()
		address = createAddress('0x1234567890123456789012345678901234567890').toString()
		handler = getBalanceHandler(baseClient)
	})

	it('should fetch balance from state manager if tag is not defined defaulting the tag to `latest`', async () => {
		await setAccountHandler(baseClient)({ address, balance: parseEther('1') })
		expect(await handler({ address })).toEqual(parseEther('1'))
	})

	it('should return 0n for an address with no balance', async () => {
		const emptyAddress = createAddress('0x0000000000000000000000000000000000000002')
		expect(await handler({ address: emptyAddress.toString() })).toEqual(0n)
	})

	it('should fetch balance for a specific block number', async () => {
		await setAccountHandler(baseClient)({ address, balance: parseEther('1') })
		await mineHandler(baseClient)()
		await setAccountHandler(baseClient)({ address, balance: parseEther('2') })

		const balanceAtBlock2 = await handler({ address, blockTag: 1n })
		expect(balanceAtBlock2).toEqual(parseEther('2'))

		const balanceAtBlock1 = await handler({ address, blockTag: 0n })
		expect(balanceAtBlock1).toEqual(parseEther('1'))
	})

	it('should fetch balance for `pending` block', async () => {
		await setAccountHandler(baseClient)({ address, balance: parseEther('1') })
		await mineHandler(baseClient)()
		await setAccountHandler(baseClient)({ address, balance: parseEther('2') })

		const pendingBalance = await handler({ address, blockTag: 'pending' })
		expect(pendingBalance).toEqual(parseEther('2'))
	})

	it('should throw NoForkUrlSetError when trying to fetch balance for non-existent block in non-fork mode', async () => {
		await expect(handler({ address, blockTag: '0x1000' })).rejects.toThrow(NoForkUrlSetError)
	})

	// This test assumes you have a way to set up a forked client
	it('should fetch balance from fork when block is not in local state', async () => {
		const forkedClient = createTevmNode({
			fork: {
				transport: transports.mainnet,
			},
		})
		const forkedHandler = getBalanceHandler(forkedClient)

		// Use a known address from mainnet with a stable balance
		const vitalikAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
		const balance = await forkedHandler({ address: vitalikAddress, blockTag: 'latest' })

		expect(balance).toBeGreaterThan(0n)
	})
})
