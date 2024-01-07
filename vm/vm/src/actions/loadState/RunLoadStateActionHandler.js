import { Account, Address } from "@ethereumjs/util"

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
        const key = Uint8Array.from(Buffer.from(storageKey, 'hex'))
        const data = Uint8Array.from(Buffer.from(storageData, 'hex'))
        tevm._evm.stateManager.putContractStorage(address, key, data)
      }
    }
  }
}
