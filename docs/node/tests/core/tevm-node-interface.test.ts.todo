import { describe, it, expect } from 'vitest'
import { createTevmNode, PREFUNDED_ACCOUNTS, PREFUNDED_PRIVATE_KEYS } from 'tevm'
import { http } from 'tevm'
import type { TevmNode } from 'tevm/node'
import { createImpersonatedTx } from 'tevm/tx'
import { createAddress } from 'tevm/address'
import { LegacyTransaction } from 'tevm/tx'
import { hexToBytes } from 'tevm/utils'

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
          tx: createImpersonatedTx({data: new Uint8Array(), impersonatedAddress: createAddress(PREFUNDED_ACCOUNTS[0].address)})
        })

        expect(result).toBeDefined()
      })
    })

    describe('Transaction Pool Management', () => {
      it('should manage transaction pool', async () => {
        const node = createTevmNode()
        const txPool = await node.getTxPool()

        const tx = new LegacyTransaction({
          nonce: 0,
          gasPrice: 1000000000,
          gasLimit: 21000,
          to: '0x5678901234567890123456789012345678901234',
          value: 1000000000000000000n,
          data: '0x',
        }).sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))

        await txPool.add(tx)

        const pending = await txPool.txsByPriceAndNonce()
        expect(pending).toBeDefined()
      })
    })

    describe('Receipts and Logs', () => {
      it('should manage receipts and logs', async () => {
        const node = createTevmNode()
        const receiptManager = await node.getReceiptsManager()

        // Create and add a transaction
        const tx = createImpersonatedTx({
          impersonatedAddress: createAddress('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'),
          to: createAddress('0x5678901234567890123456789012345678901234'),
          value: 1000000000000000000n,
          data: '0x', // Include empty data field
        })

        const txPool = await node.getTxPool()
        await txPool.add(tx)

        // Get receipt by transaction hash using receipt manager
        const receipt = await receiptManager.getReceiptByTxHash(tx.hash())
        expect(receipt).toBeDefined()
        if (receipt) {
          const [txReceipt, blockHash, txIndex, logIndex] = receipt
          expect(blockHash).toBeDefined()
          expect(txIndex).toBeDefined()
          expect(logIndex).toBeDefined()
          // Verify receipt has expected post-Byzantium fields
          if ('status' in txReceipt) {
            expect(txReceipt.status).toBeDefined() // 0 or 1
          }
          expect(txReceipt.cumulativeBlockGasUsed).toBeDefined()
          expect(txReceipt.bitvector).toBeDefined() // Bloom bitvector
          expect(txReceipt.logs).toBeDefined()
        }

        // Get logs with proper filter parameters using receipt manager
        const vm = await node.getVm()
        const fromBlock = await vm.blockchain.getBlockByTag('earliest')
        const toBlock = await vm.blockchain.getBlockByTag('latest')
        const targetAddress = createAddress('0x5678901234567890123456789012345678901234')
        const logs = await receiptManager.getLogs(
          fromBlock,
          toBlock,
          [targetAddress.toBytes()], // Optional address filter
          [] // Optional topic filters
        )
        expect(logs).toBeDefined()
        // Each log should have the expected structure
        logs.forEach(({ log, block, tx, txIndex, logIndex }) => {
          expect(log).toHaveLength(3) // [address, topics, data]
          expect(block).toBeDefined()
          expect(tx).toBeDefined()
          expect(typeof txIndex).toBe('number')
          expect(typeof logIndex).toBe('number')
        })
      })
    })

    describe('Extensibility', () => {
      it('should extend node functionality', async () => {
        const enhancedNode = createTevmNode().extend((baseNode) => ({
          async getBalance(address: string) {
            const vm = await baseNode.getVm()
            const account = await vm.stateManager.getAccount(createAddress(address))
            return account!.balance
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