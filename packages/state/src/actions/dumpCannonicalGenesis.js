import { EthjsAddress, bytesToHex, getAddress, toHex } from '@tevm/utils'
import { dumpStorage } from './dumpStorage.js'
import { getAccount } from './getAccount.js'
import { getContractCode } from '../../dist/index.js'

// might be good to cache this to optimize perf and memory

/**
 * Dumps the state of the state manager as a {@link TevmState}
 * @type {import("../state-types/index.js").StateAction<'dumpCanonicalGenesis'>}
 */
export const dumpCanonicalGenesis = (baseState) => async () => {
  const {
    caches: { accounts },
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
    const hexAddress = getAddress(`0x${address}`)
    const account = await getAccount(baseState)(EthjsAddress.fromString(hexAddress))

    if (account !== undefined) {
      const storage = await dumpStorage(baseState)(EthjsAddress.fromString(hexAddress))

      const deployedBytecode = await getContractCode(baseState)(EthjsAddress.fromString(hexAddress))

      state[hexAddress] = {
        nonce: account.nonce,
        balance: account.balance,
        storageRoot: bytesToHex(account.storageRoot),
        codeHash: bytesToHex(account.codeHash),
        storage,
        ...(deployedBytecode.length > 0
          ? {
            deployedBytecode: toHex(deployedBytecode),
          }
          : {}),
      }
    }
  }

  return state
}
