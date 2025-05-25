import { createAccount, keccak256 } from '@tevm/utils'
import { getAccount } from './getAccount.js'
import { putAccount } from './putAccount.js'

/**
 * Adds `value` to the state trie as code, and sets `codeHash` on the account
 * corresponding to `address` to reference this.
 * @type {import("../state-types/index.js").StateAction<'putContractCode'>}
 */
export const putContractCode = (baseState) => async (address, value) => {
	const account = await getAccount(baseState)(address)
	
	// Create account data object, conditionally including storageRoot
	/** @type {import('@tevm/utils').AccountData} */
	const accountData = {
		nonce: account?.nonce ?? 0n,
		balance: account?.balance ?? 0n,
		codeHash: keccak256(value, 'bytes'),
	}
	
	// Only include storageRoot if it exists
	if (account?.storageRoot !== undefined) {
		accountData.storageRoot = account.storageRoot
	}
	
	await putAccount(baseState)(address, createAccount(accountData))
	baseState.caches.contracts.put(address, value)
	return
}
