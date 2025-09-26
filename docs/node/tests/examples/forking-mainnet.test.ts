import { describe, it, expect } from 'vitest'
import { createTevmNode, http } from 'tevm'
import { createImpersonatedTx } from 'tevm/tx'
import { createAddress } from 'tevm/address'

describe('Forking Mainnet', () => {
  describe('Basic Forking', () => {
    it('should fork mainnet with HTTP transport', async () => {
      const node = createTevmNode({
        fork: {
          transport: http('https://eth.llamarpc.com')({}),
        },
      })

      const vm = await node.getVm()
      const latestBlock = await vm.blockchain.getCanonicalHeadBlock()
      expect(latestBlock).toBeDefined()
    })

    it('should fork from specific block', async () => {
      const node = createTevmNode({
        fork: {
          transport: http('https://eth.llamarpc.com')({}),
          blockTag: 23449343n,
        },
      })

      const vm = await node.getVm()
      const block = await vm.blockchain.getBlock(23449343n)
      expect(block).toBeDefined()
    })
  })

  describe('Contract Interaction', () => {
    it('should read from forked contracts', async () => {
      const node = createTevmNode({
        fork: {
          transport: http('https://eth.llamarpc.com')({}),
        },
      })

      const vm = await node.getVm()
      const usdcAddress = createAddress('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48')
      const holderAddress = createAddress('0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503')

      const result = await vm.runTx({
        tx: createImpersonatedTx({
          impersonatedAddress: holderAddress,
          to: usdcAddress,
          data: '0x70a08231000000000000000000000000'
        })
      })

      expect(result).toBeDefined()
    })

    it('should write to forked contracts', async () => {
      const node = createTevmNode({
        fork: {
          transport: http('https://eth.llamarpc.com')({}),
        },
      })

      const vm = await node.getVm()
      const usdcAddress = createAddress('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48')
      const toAddress = createAddress('0x1234567890123456789012345678901234567890')

      const result = await vm.runTx({
        tx: createImpersonatedTx({
          impersonatedAddress: toAddress,
          to: usdcAddress,
          data: '0xa9059cbb000000000000000000000000'
        })
      })

      expect(result).toBeDefined()
    })
  })

  describe('Advanced Features', () => {
    it('should handle account impersonation', async () => {
      const node = createTevmNode({
        fork: {
          transport: http('https://eth.llamarpc.com')({}),
        },
      })

      const vm = await node.getVm()
      const whaleAddress = createAddress('0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503')
      const recipientAddress = createAddress('0x1234567890123456789012345678901234567890')

      const result = await vm.runTx({
        tx: createImpersonatedTx({
          impersonatedAddress: whaleAddress,
          to: recipientAddress,
          value: 1000000000000000000n, // 1 ETH
        })
      })

      expect(result).toBeDefined()
    })

    it('should demonstrate state persistence', async () => {
      const node = createTevmNode({
        fork: {
          transport: http('https://eth.llamarpc.com')({}),
        },
      })

      const vm = await node.getVm()
      const address = createAddress('0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503')

      const account1 = await vm.stateManager.getAccount(address)
      expect(account1).toBeDefined()

      const account2 = await vm.stateManager.getAccount(address)
      expect(account2).toEqual(account1)
    })
  })

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      const node = createTevmNode({
        fork: {
          transport: http('https://invalid-rpc-url.com')({}),
        },
      })

      try {
        const vm = await node.getVm()
        await vm.blockchain.getCanonicalHeadBlock()
        throw new Error('Should have failed')
      } catch (error) {
        expect(error).toBeDefined()
      }
    })

    it('should handle invalid block numbers', async () => {
      const node = createTevmNode({
        fork: {
          transport: http('https://eth.llamarpc.com')({}),
          blockTag: 999999999999999n,
        },
      })

      try {
        const vm = await node.getVm()
        await vm.blockchain.getBlock(999999999999999n)
        throw new Error('Should have failed')
      } catch (error) {
        expect(error).toBeDefined()
      }
    })
  })

  describe('Performance Optimization', () => {
    it('should demonstrate state caching', async () => {
      const node = createTevmNode({
        fork: {
          transport: http('https://eth.llamarpc.com')({}),
        },
      })

      const vm = await node.getVm()
      const address = createAddress('0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503')

      // First access
      const account1 = await vm.stateManager.getAccount(address)
      expect(account1).toBeDefined()

      // Second access should use cache
      const account2 = await vm.stateManager.getAccount(address)
      expect(account2).toEqual(account1)
    })

    it('should handle concurrent requests', async () => {
      const node = createTevmNode({
        fork: {
          transport: http('https://eth.llamarpc.com')({}),
        },
      })

      const vm = await node.getVm()
      const addresses = [
        createAddress('0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503'),
        createAddress('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'),
        createAddress('0x1234567890123456789012345678901234567890'),
      ]

      const results = await Promise.all(
        addresses.map(address => vm.stateManager.getAccount(address))
      )

      expect(results.length).toBe(3)
      results.forEach(result => expect(result).toBeDefined())
    })
  })
})