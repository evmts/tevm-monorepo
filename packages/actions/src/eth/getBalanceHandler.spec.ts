import { describe, expect, it } from 'bun:test'
import { createBaseClient } from '@tevm/base-client'
import { type Address, EthjsAddress } from '@tevm/utils'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { getBalanceHandler } from './getBalanceHandler.js'

describe(getBalanceHandler.name, () => {
	it('should fetch balance from state manager if tag is not defined defaulting the tag to `latest`', async () => {
		const baseClient = createBaseClient()
		const address = EthjsAddress.zero().toString() as `0x${string}`
		await setAccountHandler(baseClient)({ address: EthjsAddress.zero().toString() as Address, balance: 420n })
		expect(await getBalanceHandler(baseClient)({ address })).toEqual(420n)
	})
})
