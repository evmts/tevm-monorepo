import { createAccount, createAddressFromString } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { createBaseState } from '../createBaseState.js'
import { getAccount } from './getAccount.js'
import { putAccount } from './putAccount.js'

describe(putAccount.name, () => {
	it('should put account into account cache', async () => {
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
	})

	it('should delete account of account is undefined', async () => {
		const baseState = createBaseState({
			loggingLevel: 'warn',
		})
		await baseState.ready()

		const address = createAddressFromString(`0x${'01'.repeat(20)}`)
		const balance = 420n
		const nonce = 2n
		const account = createAccount({
			balance,
			nonce,
		})

		await putAccount(baseState)(address, account)

		expect(await getAccount(baseState)(address)).toEqual(account)

		await putAccount(baseState)(address, undefined)

		expect(await getAccount(baseState)(address)).toBeUndefined()
	})

	it('should handle Account properly', async () => {
		const baseState = createBaseState({
			loggingLevel: 'warn',
		})

		const address = createAddressFromString(`0x${'02'.repeat(20)}`)
		const largeBalance = 2n ** 40n // Large but reasonable balance value
		const largeNonce = 2n ** 10n // Large but reasonable nonce value

		// Create account
		const account = createAccount({
			balance: largeBalance,
			nonce: largeNonce,
		})

		// Put account into state
		await putAccount(baseState)(address, account)

		// Get account from state
		const retrievedAccount = await getAccount(baseState)(address)

		// Check that values match
		expect(retrievedAccount?.balance).toBe(largeBalance)
		expect(retrievedAccount?.nonce).toBe(largeNonce)
	})
})
