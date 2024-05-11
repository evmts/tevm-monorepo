import { describe, expect, it } from 'bun:test'
import { EthjsAccount, EthjsAddress } from '@tevm/utils'
import { createBaseState } from '../createBaseState.js'
import { deleteAccount } from './deleteAccount.js'
import { getAccount } from './getAccount.js'
import { putAccount } from './putAccount.js'

describe(deleteAccount.name, () => {
	it('should delete an accoount from state', async () => {
		const baseState = createBaseState({
			loggingLevel: 'warn',
		})

		const address = EthjsAddress.fromString(`0x${'01'.repeat(20)}`)
		const balance = 420n
		const nonce = 2n
		const account = EthjsAccount.fromAccountData({
			balance,
			nonce,
		})

		await putAccount(baseState)(address, account)

		expect(await getAccount(baseState)(address)).toEqual(account)

		await deleteAccount(baseState)(address)

		expect(await getAccount(baseState)(address)).toBeUndefined()
	})
})
