import { EthjsAccount, toBytes } from '@tevm/utils'
import { getForkBlockTag } from './getForkBlockTag.js'
import { getForkClient } from './getForkClient.js'

/**
 * Retrieves an account from the provider and stores in the local trie
 * @param {import('../BaseState.js').BaseState} baseState
 * @returns {(address: import('@tevm/utils').Address) => Promise<EthjsAccount>}
 * @private
 */
export const getAccountFromProvider = (baseState) => async (address) => {
	const client = getForkClient(baseState)
	const blockTag = getForkBlockTag(baseState)
	const accountData = await client.getProof({
		address: /** @type {import('@tevm/utils').Address}*/ (address.toString()),
		storageKeys: [],
		...blockTag,
	})
	const account = EthjsAccount.fromAccountData({
		balance: BigInt(accountData.balance),
		nonce: BigInt(accountData.nonce),
		codeHash: toBytes(accountData.codeHash),
		storageRoot: toBytes(accountData.storageHash),
	})
	return account
}
