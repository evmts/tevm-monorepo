import { EthjsAccount } from '@tevm/utils'
import { getAccountFromProvider } from './getAccountFromProvider.js'

/**
 * Gets the code corresponding to the provided `address`.
 * @type {import("../state-types/index.js").StateAction<'getAccount'>}
 */
export const getAccount = (baseState) => async (address) => {
  const {
    _caches: { accounts },
  } = baseState
  const elem = accounts.get(address)
  if (elem !== undefined) {
    return elem.accountRLP !== undefined ? EthjsAccount.fromRlpSerializedAccount(elem.accountRLP) : undefined
  }
  if (!baseState._options.fork?.url && elem === undefined) {
    return undefined
  }
  const rlp = (
    await getAccountFromProvider(baseState)(/** @type {import('@tevm/utils').Address}*/(address.toString()))
  ).serialize()
  const account = rlp !== null ? EthjsAccount.fromRlpSerializedAccount(rlp) : undefined
  accounts.put(address, account)
  return account
}
