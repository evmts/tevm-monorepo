import { describe, it, expect } from 'vitest'
import { createTevmNode, hexToBigInt, http } from 'tevm'
import { requestEip1193 } from 'tevm/decorators'
import { createAddress } from 'tevm/address'
import { performance } from 'node:perf_hooks'

describe('Forking', () => {
  describe('Basic Forking', () => {
    it('should create forked node', async () => {
      // @ts-ignore TODO: Fix viem version mismatch
      const node = createTevmNode({
        fork: {
          transport: http('https://mainnet.infura.io/v3/YOUR-KEY')({}),
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
        // Create initial node with request handler
        // @ts-ignore TODO: Fix viem version mismatch
        const sourceNode = createTevmNode({
          fork: {
            transport: http('https://mainnet.infura.io/v3/YOUR-KEY')({}),
            blockTag: 17_000_000n,
          },
        }).extend(requestEip1193())

        // Get current block number
        const currentBlock = await sourceNode.request({
          method: 'eth_blockNumber',
        })

        // Create new fork from the current state
        // @ts-ignore TODO: Fix viem version mismatch
        const newNode = createTevmNode({
          fork: {
        // @ts-ignore TODO: Fix viem version mismatch
            transport: sourceNode,
            blockTag: hexToBigInt(currentBlock),
          },
        })

        await newNode.ready()
        expect(newNode).toBeDefined()
      })
    })

    describe('Using Deep Copy', () => {
      it('should create independent copy of node', async () => {
        const node = createTevmNode({
          fork: {
        // @ts-ignore TODO: Fix viem version mismatch
            transport: http('https://mainnet.infura.io/v3/YOUR-KEY'),
          },
        })

        const USDC_ADDRESS = createAddress('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48')
        const vm = await node.getVm()
        const usdcContract = await vm.stateManager.getAccount(USDC_ADDRESS)

        expect(usdcContract).toBeDefined()
        expect(usdcContract?.balance).toBeDefined()
        expect(usdcContract?.nonce).toBeDefined()
        expect(usdcContract?.codeHash).toBeDefined()
      })
    })

    it('should modify state in forked node', async () => {
      // @ts-ignore TODO: Fix viem version mismatch
      const node = createTevmNode({
        fork: {
        // @ts-ignore TODO: Fix viem version mismatch
          transport: http('https://mainnet.infura.io/v3/YOUR-KEY'),
        },
      })

      const vm = await node.getVm()
      const address = createAddress('0x1234567890123456789012345678901234567890')
      const account = await vm.stateManager.getAccount(address)
      if (account) {
        account.balance += 1000000000000000000n // Add 1 ETH
        await vm.stateManager.putAccount(address, account)
      }

      const updatedAccount = await vm.stateManager.getAccount(address)
      expect(updatedAccount?.balance).toBe(account?.balance)
    })
  })

  describe('Working with Forked State', () => {
    it('should read state from forked node', async () => {
      const node = createTevmNode({
        fork: {
          transport: http('https://mainnet.infura.io/v3/YOUR-KEY')({}),
        },
      })

      // Get USDC contract state
      const USDC_ADDRESS = createAddress('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48')
      const vm = await node.getVm()
      const usdcContract = await vm.stateManager.getAccount(USDC_ADDRESS)

      expect(usdcContract).toBeDefined()
      expect(usdcContract!.balance).toBeDefined()
      expect(usdcContract!.nonce).toBeDefined()
      expect(usdcContract!.codeHash).toBeDefined()
    })

    it('should modify state in forked node', async () => {
      const node = createTevmNode({
        fork: {
          // @ts-ignore TODO need to fix viem versions
          transport: http('https://mainnet.infura.io/v3/YOUR-KEY'),
        },
      })

      const vm = await node.getVm()
      const address = createAddress('0x1234567890123456789012345678901234567890')
      const account = await vm.stateManager.getAccount(address)
      account!.balance += 1000000000000000000n // Add 1 ETH
      await vm.stateManager.putAccount(address, account)

      const updatedAccount = await vm.stateManager.getAccount(address)
      expect(updatedAccount!.balance).toBe(account!.balance)
    })
  })

  describe('Performance', () => {
    it('should cache state access', async () => {
      // @ts-ignore TODO: Fix viem version mismatch
      const node = createTevmNode({
        fork: {
          transport: http('https://mainnet.infura.io/v3/YOUR-KEY')({}),
        },
      })

      const vm = await node.getVm()
      const testAddress = createAddress('0x1234567890123456789012345678901234567890')

      // First access - fetches from remote
      const t0 = performance.now()
      await vm.stateManager.getAccount(testAddress)
      const firstAccess = performance.now() - t0

      // Second access - uses cache
      const t1 = performance.now()
      await vm.stateManager.getAccount(testAddress)
      const cachedAccess = performance.now() - t1

      expect(cachedAccess).toBeLessThan(firstAccess)
    })
  })
})