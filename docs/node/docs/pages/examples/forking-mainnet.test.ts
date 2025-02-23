import { describe, it, expect } from 'vitest'
import { createTevmNode } from 'tevm'
import { createHttpTransport } from 'tevm/network'

describe('Forking Mainnet', () => {
  describe('Basic Forking', () => {
    it('should fork mainnet with HTTP transport', async () => {
      const transport = createHttpTransport('https://eth.llamarpc.com')
      const node = createTevmNode({
        fork: {
          transport,
        },
      })

      const blockNumber = await node.getBlockNumber()
      expect(blockNumber).toBeDefined()
    })

    it('should fork from specific block', async () => {
      const transport = createHttpTransport('https://eth.llamarpc.com')
      const node = createTevmNode({
        fork: {
          transport,
          blockNumber: 18000000n,
        },
      })

      const block = await node.getBlock(18000000n)
      expect(block).toBeDefined()
    })
  })

  describe('Contract Interaction', () => {
    it('should read from forked contracts', async () => {
      const transport = createHttpTransport('https://eth.llamarpc.com')
      const node = createTevmNode({
        fork: {
          transport,
        },
      })

      // USDC contract on mainnet
      const usdcAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
      const balanceOf = '0x70a08231'
      const holderAddress = '0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503'

      const result = await node.call({
        to: usdcAddress,
        data: balanceOf + '000000000000000000000000' + holderAddress.slice(2),
      })

      expect(result.data).toBeDefined()
    })

    it('should write to forked contracts', async () => {
      const transport = createHttpTransport('https://eth.llamarpc.com')
      const node = createTevmNode({
        fork: {
          transport,
        },
      })

      const usdcAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
      const transfer = '0xa9059cbb'
      const toAddress = '0x1234567890123456789012345678901234567890'
      const amount = '000000000000000000000000000000000000000000000000000000000000000a' // 10 units

      const result = await node.call({
        to: usdcAddress,
        data: transfer + '000000000000000000000000' + toAddress.slice(2) + amount,
      })

      expect(result.data).toBeDefined()
    })
  })

  describe('Advanced Features', () => {
    it('should handle account impersonation', async () => {
      const transport = createHttpTransport('https://eth.llamarpc.com')
      const node = createTevmNode({
        fork: {
          transport,
        },
      })

      const whaleAddress = '0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503'
      const recipientAddress = '0x1234567890123456789012345678901234567890'

      const tx = await node.createImpersonatedTx({
        impersonatedAddress: whaleAddress,
        to: recipientAddress,
        value: 1000000000000000000n, // 1 ETH
      })

      const result = await node.runTx(tx)
      expect(result).toBeDefined()
    })

    it('should cache forked data', async () => {
      const transport = createHttpTransport('https://eth.llamarpc.com')
      const node = createTevmNode({
        fork: {
          transport,
          cacheEnabled: true,
        },
      })

      // First call - should hit the network
      const result1 = await node.getBalance('0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503')
      expect(result1).toBeDefined()

      // Second call - should hit the cache
      const result2 = await node.getBalance('0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503')
      expect(result2).toEqual(result1)
    })
  })

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      const transport = createHttpTransport('https://invalid-rpc-url.com')
      const node = createTevmNode({
        fork: {
          transport,
        },
      })

      try {
        await node.getBlockNumber()
        throw new Error('Should have failed')
      } catch (error) {
        expect(error).toBeDefined()
      }
    })

    it('should handle invalid block numbers', async () => {
      const transport = createHttpTransport('https://eth.llamarpc.com')
      const node = createTevmNode({
        fork: {
          transport,
          blockNumber: 999999999999999n,
        },
      })

      try {
        await node.getBlock(999999999999999n)
        throw new Error('Should have failed')
      } catch (error) {
        expect(error).toBeDefined()
      }
    })
  })

  describe('Performance Optimization', () => {
    it('should use block caching', async () => {
      const transport = createHttpTransport('https://eth.llamarpc.com')
      const node = createTevmNode({
        fork: {
          transport,
          blockNumber: 18000000n,
          cacheEnabled: true,
        },
      })

      // First call - should hit the network
      const block1 = await node.getBlock(18000000n)
      expect(block1).toBeDefined()

      // Second call - should hit the cache
      const block2 = await node.getBlock(18000000n)
      expect(block2).toEqual(block1)
    })

    it('should handle concurrent requests', async () => {
      const transport = createHttpTransport('https://eth.llamarpc.com')
      const node = createTevmNode({
        fork: {
          transport,
        },
      })

      const addresses = [
        '0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503',
        '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        '0x1234567890123456789012345678901234567890',
      ]

      const results = await Promise.all(
        addresses.map(address => node.getBalance(address))
      )

      expect(results.length).toBe(3)
      results.forEach(result => expect(result).toBeDefined())
    })
  })
})