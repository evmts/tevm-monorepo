import { Account, Address } from "@ethereumjs/util"
import { DefaultTevmStateManager, TevmStateManager } from '@tevm/state'
import { fromRlp, hexToBytes, isHex } from "viem"

/**
 * @param {TevmStateManager | DefaultTevmStateManager} stateManager
 * @param {import("@tevm/state").SerializableTevmState} tevmState
 */
export const RunLoadStateActionHandler = async ( stateManager, tevmState ) => {
  for (const [k, v] of Object.entries(tevmState)) {
    const { nonce, balance, storageRoot, codeHash, storage } = v
    const account = new Account(nonce, balance, storageRoot, codeHash)
    const address = Address.fromString(k)
    stateManager.putAccount(address, account)
    if (storage !== undefined) {
      for (const [storageKey, storageData] of Object.entries(storage)) {
        const key = hexToBytes(isHex(storageKey) ? storageKey : `0x${storageKey}`)
        const encodedStorageData = fromRlp(isHex(storageData) ? storageData : `0x${storageData}`)
        const data =  hexToBytes(isHex(encodedStorageData) ? encodedStorageData : `0x${encodedStorageData}`)
        stateManager.putContractStorage(address, key, data)
      }
    }
  }
}
