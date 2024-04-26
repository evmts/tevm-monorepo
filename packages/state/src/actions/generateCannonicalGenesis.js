import { EthjsAccount, EthjsAddress, hexToBytes, isHex } from '@tevm/utils'
import { putAccount } from './putAccount.js'
import { putContractCode } from './putContractCode.js'
import { putContractStorage } from './putContractStorage.js'

/**
 j* Loads a {@link TevmState} into the state manager
 * @type {import("../state-types/index.js").StateAction<'generateCanonicalGenesis'>}
 */
export const generateCanonicalGenesis = (baseState) => async (state) => {
  for (const [k, v] of Object.entries(state)) {
    const { nonce, balance, storageRoot, codeHash, storage, deployedBytecode } = v
    const account = new EthjsAccount(
      // replace with just the var
      nonce,
      balance,
      hexToBytes(storageRoot, { size: 32 }),
      hexToBytes(codeHash, { size: 32 }),
    )
    const address = EthjsAddress.fromString(k)
    putAccount(baseState)(address, account)
    if (deployedBytecode) {
      putContractCode(baseState)(address, hexToBytes(deployedBytecode))
    }
    if (storage !== undefined) {
      for (const [storageKey, storageData] of Object.entries(storage)) {
        const key = hexToBytes(isHex(storageKey) ? storageKey : `0x${storageKey}`)
        const data = /** @type {Uint8Array}*/ (
          hexToBytes(isHex(storageData) ? storageData : `0x${storageData}`)
        )
        putContractStorage(baseState)(address, key, data)
      }
    }
  }
}
