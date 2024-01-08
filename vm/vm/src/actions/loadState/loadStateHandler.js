import { Account, Address } from "@ethereumjs/util"
import { fromRlp, hexToBytes, toHex } from "viem"

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
        const key = hexToBytes(toHex(storageKey))
        const encodedStorageData = fromRlp(toHex(storageData))
        const data =  hexToBytes(toHex(encodedStorageData.toString()))
        tevm._evm.stateManager.putContractStorage(address, key, data)
      }
    }
  }
}
