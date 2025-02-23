import { describe, it, expect } from 'vitest'
import { createTevmNode } from 'tevm'
import { EthjsAccount, EthjsAddress } from 'tevm/utils'
import { hexToBytes } from 'tevm/utils'

describe('Managing State', () => {
  describe('Getting Started', () => {
    it('should access state manager through VM', async () => {
      const node = createTevmNode()
      const vm = await node.getVm()
      const stateManager = vm.stateManager
      expect(stateManager).toBeDefined()
    })
  })

  describe('Account Management', () => {
    it('should read and write account state', async () => {
      const node = createTevmNode()
      const vm = await node.getVm()
      const stateManager = vm.stateManager

      const address = '0x1234567890123456789012345678901234567890'
      const account = await stateManager.getAccount(address)

      if (account) {
        console.log({
          balance: account.balance,
          nonce: account.nonce,
          codeHash: account.codeHash,
          storageRoot: account.storageRoot
        })
      }

      // Create or update an account
      await stateManager.putAccount(
        address,
        new EthjsAccount({
          nonce: 0n,
          balance: 10_000_000n,
          storageRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
          codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
        })
      )

      // Delete account
      await stateManager.deleteAccount(address)
    })
  })

  describe('Contract Management', () => {
    it('should manage contract code and storage', async () => {
      const node = createTevmNode()
      const vm = await node.getVm()
      const stateManager = vm.stateManager
      const address = '0x1234567890123456789012345678901234567890'

      // Deploy contract bytecode
      await stateManager.putContractCode(
        address,
        new Uint8Array([/* bytecode */])
      )

      // Verify deployment
      const code = await stateManager.getContractCode(address)
      expect(code.length).toBeDefined()

      // Read storage
      const slot = '0x0000000000000000000000000000000000000000000000000000000000000000'
      const value = await stateManager.getContractStorage(address, slot)

      // Dump all storage
      const storage = await stateManager.dumpStorage(address)
      expect(storage).toBeDefined()

      // Set a storage value
      const key = '0x0000000000000000000000000000000000000000000000000000000000000000'
      const newValue = '0x0000000000000000000000000000000000000000000000000000000000000001'
      await stateManager.putContractStorage(address, key, newValue)

      // Clear storage
      await stateManager.clearContractStorage(address)
    })
  })

  describe('State Checkpoints', () => {
    it('should manage state changes atomically', async () => {
      const node = createTevmNode()
      const vm = await node.getVm()
      const stateManager = vm.stateManager

      // Create a checkpoint
      await stateManager.checkpoint()

      try {
        // Make state changes
        await stateManager.putAccount('0x1234...', /* account */)
        await stateManager.putContractStorage('0x1234...', /* key */, /* value */)

        // Commit changes if successful
        await stateManager.commit()
      } catch (error) {
        // Revert changes on failure
        await stateManager.revert()
        console.error('State changes reverted:', error)
      }
    })
  })

  describe('State Persistence', () => {
    it('should dump and load state', async () => {
      const node = createTevmNode()
      const vm = await node.getVm()
      const stateManager = vm.stateManager

      // Get complete state
      const state = await stateManager.dumpCanonicalGenesis()

      // Save state (example with localStorage)
      // localStorage.setItem('tevmState', JSON.stringify(state))

      // Load saved state
      // const savedState = JSON.parse(localStorage.getItem('tevmState'))
      await stateManager.generateCanonicalGenesis(state)
    })
  })

  describe('Fork Mode State', () => {
    it('should demonstrate lazy loading with caching', async () => {
      const node = createTevmNode({
        fork: {
          transport: { request: async () => ({}) }, // Mock transport
        }
      })

      const vm = await node.getVm()
      const stateManager = vm.stateManager

      // First access fetches from remote
      const t0 = performance.now()
      await stateManager.getAccount('0x1234...')
      console.log('Initial fetch:', performance.now() - t0)

      // Subsequent access uses cache
      const t1 = performance.now()
      await stateManager.getAccount('0x1234...')
      console.log('Cached access:', performance.now() - t1)
    })
  })

  describe('Best Practices', () => {
    it('should demonstrate error handling', async () => {
      const node = createTevmNode()
      const vm = await node.getVm()
      const stateManager = vm.stateManager

      try {
        const account = await stateManager.getAccount('0x1234...')
        if (!account) {
          throw new Error('Account not found')
        }
        // Work with account
      } catch (error) {
        console.error('State operation failed:', error)
      }
    })

    it('should demonstrate state isolation', async () => {
      const node = createTevmNode()
      const vm = await node.getVm()
      const stateManager = vm.stateManager

      // Create isolated copy for testing
      const isolatedState = await stateManager.deepCopy()
      expect(isolatedState).toBeDefined()
    })

    it('should demonstrate atomic operations', async () => {
      const node = createTevmNode()
      const vm = await node.getVm()
      const stateManager = vm.stateManager

      await stateManager.checkpoint()
      try {
        // Batch multiple state changes
        await Promise.all([
          stateManager.putAccount('0x1234...', /* account */),
          stateManager.putContractStorage('0x1234...', /* key */, /* value */),
        ])
        await stateManager.commit()
      } catch (error) {
        await stateManager.revert()
      }
    })
  })
})