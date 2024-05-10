import { EthjsAccount, bytesToHex } from '@tevm/utils'
import { getAccountFromProvider } from './getAccountFromProvider.js'

/**
 * Gets the code corresponding to the provided `address`.
 * @type {import("../state-types/index.js").StateAction<'getAccount'>}
 */
export const getAccount = (baseState) => async (address) => {
  const {
    caches: { accounts },
  } = baseState
  const elem = accounts.get(address)
  if (elem !== undefined) {
    return elem.accountRLP !== undefined ? EthjsAccount.fromRlpSerializedAccount(elem.accountRLP) : undefined
  }
  if (!baseState.options.fork?.url && elem === undefined) {
    return undefined
  }
  baseState.logger.debug({ address }, 'fetching account from remote RPC')
  const rlp = (
    await getAccountFromProvider(baseState)(/** @type {import('@tevm/utils').Address}*/(address.toString()))
  ).serialize()
  const account = rlp !== null ? EthjsAccount.fromRlpSerializedAccount(rlp) : undefined
  accounts.put(address, account)
  baseState.logger.debug({ address, rlp: bytesToHex(rlp) }, 'Cached forked account in state manager')
  return account
}
