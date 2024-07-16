import { EthjsAccount, EthjsAddress } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { createBaseState } from '../createBaseState.js'
import { getAccount } from './getAccount.js'
import { putAccount } from './putAccount.js'

describe(putAccount.name, () => {
	it('should put account into account cache', async () => {
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
	})

	it('should delete account of account is undefined', async () => {
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

		await putAccount(baseState)(address, undefined)

		expect(await getAccount(baseState)(address)).toBeUndefined()
	})
})
