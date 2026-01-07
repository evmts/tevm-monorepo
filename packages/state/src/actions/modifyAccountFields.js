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
	// Create account data with only defined fields
	/** @type {{nonce: bigint, balance: bigint, storageRoot?: Uint8Array, codeHash?: Uint8Array}} */
	const accountData = {
		nonce: accountFields.nonce ?? existingAccount?.nonce ?? 0n,
		balance: accountFields.balance ?? existingAccount?.balance ?? 0n,
	}
	// Only add storageRoot if defined
	const storageRoot = accountFields.storageRoot ?? existingAccount?.storageRoot
	if (storageRoot !== undefined) {
		accountData.storageRoot = storageRoot
	}
	// Only add codeHash if defined
	const codeHash = accountFields.codeHash ?? existingAccount?.codeHash
	if (codeHash !== undefined) {
		accountData.codeHash = codeHash
	}
	const newAccount = createAccount(accountData)
	await putAccount(baseState)(address, /** @type {import('@tevm/common').AccountInterface} */ (newAccount))
}
