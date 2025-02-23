import { describe, it, expect } from 'vitest'
import { createTevmNode, http } from 'tevm'
import { requestEip1193, ethActions } from 'tevm/decorators'
import { type Hex, hexToBytes } from '@tevm/utils'
import { type Filter } from '@tevm/node'

describe('Methods Documentation Examples', () => {
  describe('Core Methods', () => {
    it('should initialize a node', async () => {
      const node = createTevmNode({
        fork: {
          transport: http('https://mainnet.optimism.io')({})
        }
      })

      await node.ready()
      expect(node).toBeDefined()
    })

    it('should access virtual machine', async () => {
      const node = createTevmNode()
      const vm = await node.getVm()
      expect(vm).toBeDefined()
    })

    it('should access transaction pool', async () => {
      const node = createTevmNode()
      const txPool = await node.getTxPool()
      expect(txPool).toBeDefined()

      const pending = await txPool.txsByPriceAndNonce({
        baseFee: 1000000000n,
        allowedBlobs: 6
      })
      expect(pending).toBeDefined()
    })

    it('should access receipts manager', async () => {
      const node = createTevmNode()
      const receipts = await node.getReceiptsManager()
      expect(receipts).toBeDefined()

      const fromBlock = await node.getVm().then(vm => vm.blockchain.getBlock(0n))
      const toBlock = await node.getVm().then(vm => vm.blockchain.getBlock(1n))

      const logs = await receipts.getLogs(
        fromBlock,
        toBlock,
        [hexToBytes('0x1234567890123456789012345678901234567890')],
        []
      )
      expect(logs).toBeDefined()
    })
  })

  describe('State Management', () => {
    it('should manage event filters', async () => {
      const node = createTevmNode()

      const filterId = '0x1' as Hex
      const filter: Filter = {
        id: filterId,
        type: 'Log',
        created: Date.now(),
        logs: [],
        tx: [],
        blocks: [],
        installed: {},
        registeredListeners: [],
        err: undefined,
        logsCriteria: undefined
      }
      node.setFilter(filter)

      const filters = node.getFilters()
      expect(filters).toBeDefined()

      node.removeFilter(filterId)
      expect(node.getFilters().get(filterId)).toBeUndefined()
    })
  })

  describe('JSON-RPC Support', () => {
    it('should support EIP-1193 interface', async () => {
      const node = createTevmNode().extend(requestEip1193())

      const blockNumber = await node.request({
        method: 'eth_blockNumber',
        params: undefined
      })
      expect(blockNumber).toBeDefined()
    })

    it('should support eth actions', async () => {
      const node = createTevmNode().extend(ethActions())

      const blockNumber = await node.eth.blockNumber()
      expect(blockNumber).toBeDefined()

      const balance = await node.eth.getBalance({
        address: '0x1234567890123456789012345678901234567890' as `0x${string}`
      })
      expect(balance).toBeDefined()
    })
  })
})
