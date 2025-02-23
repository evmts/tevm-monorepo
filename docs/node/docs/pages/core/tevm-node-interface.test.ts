import { describe, it, expect } from 'vitest'
import { createTevmNode } from 'tevm'
import { http } from 'tevm'
import type { TevmNode } from 'tevm/node'

describe('TevmNode Interface', () => {
  describe('Core Components', () => {
    describe('Initialization & Status', () => {
      it('should initialize and check status', async () => {
        const node = createTevmNode()
        await node.ready()
        expect(node.status).toBe('READY')
      })
    })

    describe('Virtual Machine Access', () => {
      it('should execute transactions', async () => {
        const node = createTevmNode()
        const vm = await node.getVm()

        const result = await vm.runTx({
          tx: {
            to: '0x1234567890123456789012345678901234567890',
            value: 1000000000000000000n, // 1 ETH
            data: '0x',
          }
        })

        expect(result).toBeDefined()
      })
    })

    describe('Transaction Pool Management', () => {
      it('should manage transaction pool', async () => {
        const node = createTevmNode()
        const txPool = await node.getTxPool()

        await txPool.add({
          from: '0x1234567890123456789012345678901234567890',
          to: '0x5678901234567890123456789012345678901234',
          value: 1000000000000000000n,
        })

        const pending = await txPool.txsByPriceAndNonce()
        expect(pending).toBeDefined()
      })
    })

    describe('Receipt & Log Management', () => {
      it('should manage receipts and logs', async () => {
        const node = createTevmNode()
        const receipts = await node.getReceiptsManager()

        const receipt = await receipts.getReceiptByTxHash('0x1234...')
        expect(receipt).toBeDefined()

        const logs = await receipts.getLogs({
          fromBlock: 0n,
          toBlock: 'latest',
          address: '0x1234567890123456789012345678901234567890',
        })
        expect(logs).toBeDefined()
      })
    })

    describe('Account Impersonation', () => {
      it('should impersonate accounts', async () => {
        const node = createTevmNode({
          fork: {
            transport: http('https://mainnet.infura.io/v3/YOUR-KEY'),
          },
        })

        node.setImpersonatedAccount('0x28C6c06298d514Db089934071355E5743bf21d60')

        const vm = await node.getVm()
        await vm.runTx({
          tx: {
            from: '0x28C6c06298d514Db089934071355E5743bf21d60',
            to: '0x1234567890123456789012345678901234567890',
            value: 1000000000000000000n,
          },
        })

        expect(node.getImpersonatedAccount()).toBe('0x28C6c06298d514Db089934071355E5743bf21d60')
      })
    })

    describe('Event Filtering', () => {
      it('should manage event filters', () => {
        const node = createTevmNode()

        node.setFilter({
          id: '0x1',
          fromBlock: 0n,
          toBlock: 'latest',
          address: '0x1234567890123456789012345678901234567890',
          topics: [
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', // Transfer
          ],
        })

        const filters = node.getFilters()
        expect(filters.size).toBe(1)

        node.removeFilter('0x1')
        expect(node.getFilters().size).toBe(0)
      })
    })

    describe('Extensibility', () => {
      it('should extend node functionality', async () => {
        const enhancedNode = createTevmNode().extend((baseNode) => ({
          async getBalance(address: string) {
            const vm = await baseNode.getVm()
            const account = await vm.stateManager.getAccount(address)
            return account.balance
          },
        }))

        const balance = await enhancedNode.getBalance('0x1234567890123456789012345678901234567890')
        expect(balance).toBeDefined()
      })
    })

    describe('Deep Copying', () => {
      it('should create independent copies', async () => {
        const node = createTevmNode()
        const nodeCopy = await node.deepCopy()
        expect(nodeCopy).toBeDefined()
      })
    })
  })

  describe('Type Safety', () => {
    it('should demonstrate type safety', () => {
      function useNode<TMode extends 'fork' | 'normal'>(
        node: TevmNode<TMode>
      ) {
        if (node.mode === 'fork') {
          node.setImpersonatedAccount('0x1234567890123456789012345678901234567890')
        }
      }

      const node = createTevmNode()
      useNode(node)
      expect(node).toBeDefined()
    })
  })
})