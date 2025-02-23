import { describe, it, expect } from 'vitest'
import { createTevmNode } from 'tevm'
import { createImpersonatedTx } from 'tevm/tx'
import { Contract } from 'tevm/contract'
import { createBlock } from 'tevm/block'

describe('Local Testing', () => {
  describe('Basic Test Setup', () => {
    it('should perform basic ETH transfer', async () => {
      const node = createTevmNode({
        miningConfig: { type: 'auto' },
      })
      await node.ready()

      const vm = await node.getVm()

      const tx = createImpersonatedTx({
        from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        to: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
        value: 1000000000000000000n, // 1 ETH
      })

      const result = await vm.runTx({ tx })
      expect(result.execResult.exceptionError).toBeUndefined()

      const account = await vm.stateManager.getAccount(tx.to)
      expect(account.balance).toBe(1000000000000000000n)
    })
  })

  describe('Contract Testing', () => {
    it('should deploy and interact with contract', async () => {
      const node = createTevmNode()
      await node.ready()
      const vm = await node.getVm()

      // Mock contract data
      const bytecode = '0x...'
      const abi = []

      // Deploy contract
      const deployTx = createImpersonatedTx({
        data: bytecode,
      })

      const result = await vm.runTx({ tx: deployTx })
      expect(result.execResult.exceptionError).toBeUndefined()

      const contractAddress = result.createdAddress
      expect(contractAddress).toBeDefined()

      // Create contract instance
      const contract = new Contract(contractAddress, abi)

      // Call contract method
      const callResult = await contract.read.getValue()
      expect(callResult).toBeDefined()

      // Send transaction to contract
      const tx = await contract.write.setValue([123])
      const txResult = await vm.runTx({ tx })
      expect(txResult.execResult.exceptionError).toBeUndefined()

      // Verify state change
      const updatedValue = await contract.read.getValue()
      expect(updatedValue).toBe(123)
    })

    it('should handle contract events', async () => {
      const node = createTevmNode()
      await node.ready()

      // Mock contract deployment
      const contract = {
        address: '0x1234567890123456789012345678901234567890',
        interface: {
          getEventTopic: (name: string) => '0x...',
        },
      }

      // Create event filter
      node.setFilter({
        id: '0x1',
        address: contract.address,
        topics: [
          contract.interface.getEventTopic('ValueChanged'),
        ],
      })

      // Trigger event
      const vm = await node.getVm()
      const tx = createImpersonatedTx({
        to: contract.address,
        data: '0x...',
      })
      await vm.runTx({ tx })

      // Get event logs
      const receipts = await node.getReceiptsManager()
      const logs = await receipts.getLogs({
        fromBlock: 0n,
        toBlock: 'latest',
        address: contract.address,
      })

      expect(logs.length).toBe(1)
      expect(logs[0].topics[0]).toBe(contract.interface.getEventTopic('ValueChanged'))
    })
  })

  describe('Complex Testing Scenarios', () => {
    it('should handle complex state changes', async () => {
      const node = createTevmNode()
      await node.ready()
      const vm = await node.getVm()

      // Create checkpoint
      await vm.stateManager.checkpoint()

      try {
        // Perform state changes
        await vm.stateManager.putAccount('0x1234...', {
          nonce: 0n,
          balance: 1000000000000000000n,
        })

        // Verify intermediate state
        const intermediateState = await vm.stateManager.getAccount('0x1234...')
        expect(intermediateState).toBeDefined()

        // More changes
        await vm.stateManager.putAccount('0x5678...', {
          nonce: 0n,
          balance: 2000000000000000000n,
        })

        // Commit changes
        await vm.stateManager.commit()
      } catch (error) {
        // Revert on failure
        await vm.stateManager.revert()
        throw error
      }
    })

    it('should handle time-dependent behavior', async () => {
      const node = createTevmNode({
        miningConfig: { type: 'interval', interval: 1000 },
      })
      await node.ready()
      const vm = await node.getVm()

      // Mock time-locked contract
      const contract = {
        address: '0x1234567890123456789012345678901234567890',
        write: {
          withdraw: async () => createImpersonatedTx({
            to: contract.address,
            data: '0x...',
          }),
        },
      }

      // Try to withdraw (should fail)
      let tx = await contract.write.withdraw()
      let result = await vm.runTx({ tx })
      expect(result.execResult.exceptionError).toBeDefined()

      // Advance time by mining blocks
      for (let i = 0; i < 100; i++) {
        await vm.blockchain.putBlock(createBlock({
          timestamp: BigInt(Date.now() + i * 1000),
        }))
      }

      // Try withdraw again (should succeed)
      tx = await contract.write.withdraw()
      result = await vm.runTx({ tx })
      expect(result.execResult.exceptionError).toBeUndefined()
    })
  })

  describe('Testing Utilities', () => {
    it('should setup test accounts', async () => {
      const node = createTevmNode()
      await node.ready()
      const vm = await node.getVm()

      const accounts = [
        '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
      ]

      for (const address of accounts) {
        await vm.stateManager.putAccount(address, {
          nonce: 0n,
          balance: 10000000000000000000n, // 10 ETH
        })
      }

      // Verify accounts
      for (const address of accounts) {
        const account = await vm.stateManager.getAccount(address)
        expect(account.balance).toBe(10000000000000000000n)
      }
    })
  })
})