import { Account, Address } from "@ethereumjs/util"
import { fromRlp, hexToBytes, isHex } from "viem"

/**
 * @type {import("./RunLoadStateHandlerGeneric.js").RunLoadStateActionHandler}
 */
export const RunLoadStateActionHandler = async ( tevm, tevmState ) => {
  for (const [k, v] of Object.entries(tevmState)) {
    const { nonce, balance, storageRoot, codeHash, storage } = v
    const account = new Account(nonce, balance, storageRoot, codeHash)
    const address = Address.fromString(k)
    tevm._evm.stateManager.putAccountData(address, account)
    if (storage !== undefined) {
      for (const [storageKey, storageData] of Object.entries(storage)) {
        const key = hexToBytes(isHex(storageKey) ? storageKey : `0x${storageKey}`)
        const encodedStorageData = fromRlp(isHex(storageData) ? storageData : `0x${storageData}`)
        const data =  hexToBytes(isHex(encodedStorageData) ? encodedStorageData : `0x${encodedStorageData}`)
        tevm._evm.stateManager.putContractStorage(address, key, data)
      }
    }
  }
}
