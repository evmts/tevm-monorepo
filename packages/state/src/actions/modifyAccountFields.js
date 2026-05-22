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
	const account = await getAccount(baseState)(address)
	/** @type {Parameters<typeof createAccount>[0]} */
	const accountData = {
		nonce: accountFields.nonce ?? account?.nonce ?? 0n,
		balance: accountFields.balance ?? account?.balance ?? 0n,
	}
	const storageRoot = accountFields.storageRoot ?? account?.storageRoot
	const codeHash = accountFields.codeHash ?? account?.codeHash

	if (storageRoot !== undefined) {
		accountData.storageRoot = storageRoot
	}
	if (codeHash !== undefined) {
		accountData.codeHash = codeHash
	}

	await putAccount(baseState)(address, /** @type {any} */ (createAccount(accountData)))
}
