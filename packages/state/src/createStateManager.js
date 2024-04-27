import {
  checkpoint,
  clearCaches,
  clearContractStorage,
  commit,
  deepCopy,
  deleteAccount,
  dumpCanonicalGenesis,
  dumpStorage,
  dumpStorageRange,
  generateCanonicalGenesis,
  getAccount,
  getAccountAddresses,
  getAppliedKey,
  getContractCode,
  getContractStorage,
  getProof,
  getStateRoot,
  hasStateRoot,
  modifyAccountFields,
  putAccount,
  putContractCode,
  putContractStorage,
  revert,
  setStateRoot,
  shallowCopy,
} from './actions/index.js'
import { originalStorageCache } from './actions/originalStorageCache.js'
import { createBaseState } from './createBaseState.js'

/**
 * @param {import('./state-types/StateOptions.js').StateOptions} [options]
 * @returns {import('./StateManager.js').StateManager}
 */
export const createStateManager = (options = {}) => {
  const baseState = createBaseState(options)
  /**
   * @param {import('./BaseState.js').BaseState} baseState
   * @returns {import('./StateManager.js').StateManager}
   */
  const decorate = (baseState) => {
    return {
      ...baseState,
      deepCopy: async () => {
        return decorate(await deepCopy(baseState)())
      },
      shallowCopy: () => {
        return decorate(shallowCopy(baseState)())
      },
      dumpCanonicalGenesis: dumpCanonicalGenesis(baseState),
      generateCanonicalGenesis: generateCanonicalGenesis(baseState),
      putAccount: putAccount(baseState),
      clearCaches: clearCaches(baseState),
      commit: commit(baseState),
      checkpoint: checkpoint(baseState),
      revert: revert(baseState),
      getProof: getProof(baseState),
      getContractCode: getContractCode(baseState),
      getAccount: getAccount(baseState),
      dumpStorage: dumpStorage(baseState),
      getStateRoot: getStateRoot(baseState),
      hasStateRoot: hasStateRoot(baseState),
      setStateRoot: setStateRoot(baseState),
      deleteAccount: deleteAccount(baseState),
      putContractCode: putContractCode(baseState),
      dumpStorageRange: dumpStorageRange(baseState),
      getContractStorage: getContractStorage(baseState),
      putContractStorage: putContractStorage(baseState),
      modifyAccountFields: modifyAccountFields(baseState),
      clearContractStorage: clearContractStorage(baseState),
      getAccountAddresses: getAccountAddresses(baseState),
      // Unused provided to fulfill interface
      getAppliedKey: /** @type {any}*/ (getAppliedKey(baseState)),
      originalStorageCache: originalStorageCache(baseState),
    }
  }

  return decorate(baseState)
}
