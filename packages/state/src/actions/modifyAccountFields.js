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
	const existingAccount = await getAccount(baseState)(address)
	// Create a new account with modified fields (Account is immutable)
	const newAccount = createAccount({
		nonce: accountFields.nonce ?? existingAccount?.nonce ?? 0n,
		balance: accountFields.balance ?? existingAccount?.balance ?? 0n,
		storageRoot: accountFields.storageRoot ?? existingAccount?.storageRoot,
		codeHash: accountFields.codeHash ?? existingAccount?.codeHash,
	})
	await putAccount(baseState)(address, newAccount)
}
