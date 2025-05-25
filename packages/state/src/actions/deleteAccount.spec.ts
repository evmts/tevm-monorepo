import { createAccount, createAddressFromString } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { createBaseState } from '../createBaseState.js'
import { deleteAccount } from './deleteAccount.js'
import { getAccount } from './getAccount.js'
import { putAccount } from './putAccount.js'

describe(deleteAccount.name, () => {
	it('should delete an accoount from state', async () => {
		const baseState = createBaseState({
			loggingLevel: 'warn',
		})

		const address = createAddressFromString(`0x${'01'.repeat(20)}`)
		const balance = 420n
		const nonce = 2n
		const account = createAccount({
			balance,
			nonce,
		})

		await putAccount(baseState)(address, account)

		expect(await getAccount(baseState)(address)).toEqual(account)

		await deleteAccount(baseState)(address)

		expect(await getAccount(baseState)(address)).toBeUndefined()
	})
})
