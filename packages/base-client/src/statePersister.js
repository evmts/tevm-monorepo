import { dumpCanonicalGenesis } from '@tevm/state'
import { toHex } from '@tevm/utils'

/**
 * @param {import('@tevm/sync-storage-persister').SyncStoragePersister} persister
 * @param {import('@tevm/logger').Logger} logger
 * @returns {(state: import('@tevm/state').BaseState) => void}
 */
export const statePersister = (persister, logger) => (stateManager) => {
  logger.debug('persisting state manager...')
  dumpCanonicalGenesis(stateManager)()
    .then((state) => {
      /**
       * @type {import('@tevm/state').ParameterizedTevmState}
       */
      const parsedState = {}

      for (const [k, v] of Object.entries(state)) {
        const { nonce, balance, storageRoot, codeHash } = v
        parsedState[k] = {
          ...v,
          nonce: toHex(nonce),
          balance: toHex(balance),
          storageRoot: storageRoot,
          codeHash: codeHash,
        }
      }

      persister.persistTevmState(parsedState)
    })
    .catch((error) => {
      logger.error('Failed to persist state:', error)
    })
}
