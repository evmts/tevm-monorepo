import { EthjsAddress, bytesToHex, toHex } from '@tevm/utils'
import { dumpStorage } from './dumpStorage.js'
import { getAccount } from './getAccount.js'

// might be good to cache this to optimize perf and memory

/**
 * Dumps the state of the state manager as a {@link TevmState}
 * @type {import("../state-types/index.js").StateAction<'dumpCanonicalGenesis'>}
 */
export const dumpCanonicalGenesis = (baseState) => async () => {
  const {
    _caches: { accounts, contracts },
  } = baseState

  /**
   * @type {string[]}
   */
  const accountAddresses = []
  accounts._orderedMapCache?.forEach((e) => {
    accountAddresses.push(e[0])
  })

  /**
   * @type {import('../state-types/TevmState.js').TevmState}
   */
  const state = {}

  for (const address of accountAddresses) {
    const hexAddress = /** @type {import('@tevm/utils').Address}*/(`0x${address}`)
    const account = await getAccount(baseState)(EthjsAddress.fromString(hexAddress))

    if (account !== undefined) {
      const storage = await dumpStorage(baseState)(EthjsAddress.fromString(hexAddress))

      const deployedBytecode = contracts.get(EthjsAddress.fromString(hexAddress))

      state[hexAddress] = {
        ...account,
        storageRoot: bytesToHex(account.storageRoot),
        codeHash: bytesToHex(account.codeHash),
        storage,
        ...(deployedBytecode
          ? {
            deployedBytecode: toHex(deployedBytecode),
          }
          : {}),
      }
    }
  }

  return state
}
