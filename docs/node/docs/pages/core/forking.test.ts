import { describe, it, expect } from 'vitest'
import { createTevmNode, http } from 'tevm'
import { performance } from 'node:perf_hooks'

describe('Forking', () => {
  describe('Basic Forking', () => {
    it('should create a forked node', async () => {
      const node = createTevmNode({
        fork: {
          transport: http('https://eth-mainnet.g.alchemy.com/v2/YOUR-API-KEY'),
          blockTag: 'latest',
        },
      })
      await node.ready()
      expect(node).toBeDefined()
    })
  })

  describe('Reforking Strategies', () => {
    describe('Using Node as Transport', () => {
      it('should fork from existing node', async () => {
        // Create initial node
        const sourceNode = createTevmNode({
          fork: {
            transport: http('https://mainnet.infura.io/v3/YOUR-KEY'),
            blockTag: 17_000_000n,
          },
        })

        // Get current block number
        const currentBlock = await sourceNode.request({
          method: 'eth_blockNumber',
          params: [],
        })

        // Create new fork from the current state
        const newNode = createTevmNode({
          fork: {
            transport: sourceNode,
            blockTag: currentBlock,
          },
        })

        await newNode.ready()
        expect(newNode).toBeDefined()
      })
    })

    describe('Using Deep Copy', () => {
      it('should create independent copy of node', async () => {
        const sourceNode = createTevmNode({
          fork: {
            transport: http('https://mainnet.infura.io/v3/YOUR-KEY'),
          },
        })

        const copiedNode = await sourceNode.deepCopy()
        expect(copiedNode).toBeDefined()
      })
    })
  })

  describe('Working with Forked State', () => {
    it('should read state from forked node', async () => {
      const node = createTevmNode({
        fork: {
          transport: http('https://mainnet.infura.io/v3/YOUR-KEY'),
        },
      })

      // Get USDC contract state
      const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
      const vm = await node.getVm()
      const usdcContract = await vm.stateManager.getAccount(USDC_ADDRESS)

      expect(usdcContract).toBeDefined()
      expect(usdcContract.balance).toBeDefined()
      expect(usdcContract.nonce).toBeDefined()
      expect(usdcContract.codeHash).toBeDefined()
    })

    it('should modify state in forked node', async () => {
      const node = createTevmNode({
        fork: {
          transport: http('https://mainnet.infura.io/v3/YOUR-KEY'),
        },
      })

      const vm = await node.getVm()
      const address = '0x1234567890123456789012345678901234567890'
      const account = await vm.stateManager.getAccount(address)
      account.balance += 1000000000000000000n // Add 1 ETH
      await vm.stateManager.putAccount(address, account)

      const updatedAccount = await vm.stateManager.getAccount(address)
      expect(updatedAccount.balance).toBe(account.balance)
    })
  })

  describe('Account Impersonation', () => {
    it('should impersonate accounts', async () => {
      const node = createTevmNode({
        fork: {
          transport: http('https://mainnet.infura.io/v3/YOUR-KEY'),
        },
      })

      // Impersonate Binance hot wallet
      const BINANCE_14 = '0x28C6c06298d514Db089934071355E5743bf21d60'
      node.setImpersonatedAccount(BINANCE_14)

      const vm = await node.getVm()
      const result = await vm.runTx({
        tx: {
          from: BINANCE_14,
          to: '0x1234567890123456789012345678901234567890',
          value: 1000000000000000000n, // 1 ETH
        },
      })

      expect(result.execResult.exceptionError).toBeUndefined()

      // Stop impersonating
      node.setImpersonatedAccount(undefined)
    })
  })

  describe('Performance Optimization', () => {
    it('should demonstrate state caching', async () => {
      const node = createTevmNode({
        fork: {
          transport: http('https://mainnet.infura.io/v3/YOUR-KEY'),
        },
      })

      const vm = await node.getVm()

      // First access - fetches from remote
      const t0 = performance.now()
      await vm.stateManager.getAccount('0x1234567890123456789012345678901234567890')
      const firstAccess = performance.now() - t0

      // Second access - uses cache
      const t1 = performance.now()
      await vm.stateManager.getAccount('0x1234567890123456789012345678901234567890')
      const cachedAccess = performance.now() - t1

      expect(cachedAccess).toBeLessThan(firstAccess)
    })
  })

  describe('Error Handling', () => {
    it('should handle RPC errors', async () => {
      try {
        const node = createTevmNode({
          fork: {
            transport: http('https://...'),
          },
        })
        await node.ready()
      } catch (error) {
        if (error.message.includes('rate limit')) {
          // Handle RPC rate limiting
          console.warn('RPC rate limit hit')
        }
      }
    })
  })
})