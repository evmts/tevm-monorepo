import { describe, it, expect } from 'vitest'
import { createStateManager } from '@tevm/state'
import { createCommon } from '@tevm/common'
import { mainnet } from 'viem/chains'

describe('@tevm/state', () => {
  describe('StateManager', () => {
    it('should create a state manager', () => {
      const common = createCommon({ ...mainnet })
      const stateManager = createStateManager({
        common,
        loggingLevel: 'info'
      })

      expect(stateManager).toBeDefined()
      expect(stateManager.ready).toBeDefined()
      expect(stateManager.getAccountAddresses).toBeDefined()
      expect(stateManager.deepCopy).toBeDefined()
      expect(stateManager.dumpCanonicalGenesis).toBeDefined()
      expect(stateManager.clearCaches).toBeDefined()
    })
  })

  describe('Account Management', () => {
    it('should manage account state', async () => {
      const common = createCommon({ ...mainnet })
      const stateManager = createStateManager({ common })
      const address = '0x1234567890123456789012345678901234567890'

      // Get account state
      const account = await stateManager.getAccount(address)
      expect(account).toBeDefined()

      // Update account
      await stateManager.putAccount(address, account)

      // Delete account
      await stateManager.deleteAccount(address)

      // Modify specific account fields
      await stateManager.modifyAccountFields(address, {
        nonce: 1n,
        balance: 100n
      })
    })
  })

  describe('Contract Management', () => {
    it('should manage contract code and storage', async () => {
      const common = createCommon({ ...mainnet })
      const stateManager = createStateManager({ common })
      const address = '0x1234567890123456789012345678901234567890'
      const key = '0x0000000000000000000000000000000000000000000000000000000000000001'
      const value = '0x0000000000000000000000000000000000000000000000000000000000000002'
      const code = new Uint8Array([1, 2, 3])

      // Get and set contract code
      await stateManager.putContractCode(address, code)
      const retrievedCode = await stateManager.getContractCode(address)
      expect(retrievedCode).toBeDefined()

      // Get and set contract storage
      await stateManager.putContractStorage(address, key, value)
      const retrievedValue = await stateManager.getContractStorage(address, key)
      expect(retrievedValue).toBeDefined()

      // Clear contract storage
      await stateManager.clearContractStorage(address)
    })
  })

  describe('State Management', () => {
    it('should manage state checkpoints and roots', async () => {
      const common = createCommon({ ...mainnet })
      const stateManager = createStateManager({ common })

      // Create checkpoint
      await stateManager.checkpoint()

      // Commit changes
      await stateManager.commit()

      // Revert to last checkpoint
      await stateManager.revert()

      // Get state root
      const root = await stateManager.getStateRoot()
      expect(root).toBeDefined()

      // Set state root
      await stateManager.setStateRoot(root)

      // Check if state root exists
      const exists = await stateManager.hasStateRoot(root)
      expect(exists).toBeDefined()
    })
  })

  describe('State Dumping and Proofs', () => {
    it('should dump state and generate proofs', async () => {
      const common = createCommon({ ...mainnet })
      const stateManager = createStateManager({ common })
      const address = '0x1234567890123456789012345678901234567890'
      const storageKeys = ['0x0000000000000000000000000000000000000000000000000000000000000001']

      // Dump canonical genesis state
      const state = await stateManager.dumpCanonicalGenesis()
      expect(state).toBeDefined()

      // Dump storage for address
      const storage = await stateManager.dumpStorage(address)
      expect(storage).toBeDefined()

      // Dump storage range
      const range = await stateManager.dumpStorageRange(address, '0x00', 10)
      expect(range).toBeDefined()

      // Get merkle proof
      const proof = await stateManager.getProof(address, storageKeys)
      expect(proof).toBeDefined()
    })
  })

  describe('Cache Management and Copying', () => {
    it('should manage caches and create copies', async () => {
      const common = createCommon({ ...mainnet })
      const stateManager = createStateManager({ common })

      // Clear all caches
      stateManager.clearCaches()

      // Access original storage cache
      expect(stateManager.originalStorageCache).toBeDefined()

      // Deep copy (independent state)
      const deepCopy = await stateManager.deepCopy()
      expect(deepCopy).toBeDefined()

      // Shallow copy (shared state)
      const shallowCopy = stateManager.shallowCopy()
      expect(shallowCopy).toBeDefined()
    })
  })
})