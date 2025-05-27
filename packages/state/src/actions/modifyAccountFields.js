import { createAccount } from '@tevm/utils'
import { getAccount } from './getAccount.js'
import { putAccount } from './putAccount.js'

/**
 * Gets the account associated with `address`, modifies the given account
 * fields, then saves the account into state. Account fields can include
 * `nonce`, `balance`, `storageRoot`, and `codeHash`.
 * @type {import("../state-types/index.js").StateAction<'modifyAccountFields'>}
 */
export const modifyAccountFields = (baseState) => async (address, accountFields) => {
	const account = (await getAccount(baseState)(address)) ?? createAccount({})
	account.nonce = accountFields.nonce ?? account.nonce
	account.balance = accountFields.balance ?? account.balance
	account.storageRoot = accountFields.storageRoot ?? account.storageRoot
	account.codeHash = accountFields.codeHash ?? account.codeHash
	await putAccount(baseState)(address, account)
}
