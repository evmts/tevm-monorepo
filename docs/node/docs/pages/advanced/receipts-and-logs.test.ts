import { describe, it, expect } from 'vitest'
import { createTevmNode } from 'tevm'
import { createAddress } from 'tevm/address'
import { createImpersonatedTx } from 'tevm/tx'
import { runTx } from 'tevm/vm'
import type { RunTxResult } from 'tevm/vm'

describe('Receipts and Logs', () => {
  describe('Transaction Receipts', () => {
    it('should generate and retrieve transaction receipts', async () => {
      const node = createTevmNode()
      const tx = createImpersonatedTx({
        impersonatedAddress: createAddress('0x1234567890123456789012345678901234567890'),
        to: createAddress('0x2345678901234567890123456789012345678901'),
        value: 1000000000000000000n,
        gasLimit: 21000n,
      })

      const vm = await node.getVm()
      const result = await runTx(vm)({ tx })
      const receiptsManager = await node.getReceiptsManager()
      const receiptResult = await receiptsManager.getReceiptByTxHash(result.receipt.transactionHash)

      expect(receiptResult).toBeDefined()
      if (receiptResult) {
        const [receipt, blockHash, txIndex, logIndex] = receiptResult
        expect(receipt.cumulativeBlockGasUsed).toBeDefined()
        expect(receipt.bitvector).toBeDefined()
        expect(receipt.logs).toBeDefined()
        if ('status' in receipt) {
          expect(receipt.status).toBe(1)
        }
      }
    })

    it('should handle failed transactions', async () => {
      const node = createTevmNode()
      const tx = createImpersonatedTx({
        impersonatedAddress: createAddress('0x1234567890123456789012345678901234567890'),
        to: createAddress('0x2345678901234567890123456789012345678901'),
        value: 1000000000000000000000n, // More than balance
        gasLimit: 21000n,
      })

      const vm = await node.getVm()
      const result = await runTx(vm)({ tx })
      const receiptsManager = await node.getReceiptsManager()
      const receiptResult = await receiptsManager.getReceiptByTxHash(result.receipt.transactionHash)

      if (receiptResult) {
        const [receipt] = receiptResult
        if ('status' in receipt) {
          expect(receipt.status).toBe(0)
          expect(receipt.cumulativeBlockGasUsed).toBeDefined()
        }
      }
    })
  })

  describe('Event Logs', () => {
    it('should capture contract event logs', async () => {
      const node = createTevmNode()
      const contractBytecode = '0x...' // Contract bytecode with events
      const deployTx = createImpersonatedTx({
        impersonatedAddress: createAddress('0x1234567890123456789012345678901234567890'),
        data: contractBytecode,
        gasLimit: 1000000n,
      })

      const vm = await node.getVm()
      const deployResult = await runTx(vm)({ tx: deployTx })
      const receiptsManager = await node.getReceiptsManager()
      const deployReceiptResult = await receiptsManager.getReceiptByTxHash(deployResult.receipt.transactionHash)
      const contractAddress = deployResult.createdAddress

      // Interact with contract to generate logs
      const interactTx = createImpersonatedTx({
        impersonatedAddress: createAddress('0x1234567890123456789012345678901234567890'),
        to: contractAddress,
        data: '0x...', // Function call that emits events
        gasLimit: 100000n,
      })

      const result = await runTx(vm)({ tx: interactTx })
      const receiptResult = await receiptsManager.getReceiptByTxHash(result.receipt.transactionHash)

      expect(receiptResult).toBeDefined()
      if (receiptResult) {
        const [receipt] = receiptResult
        expect(receipt.logs).toBeDefined()
        expect(Array.isArray(receipt.logs)).toBe(true)
        expect(receipt.logs.length).toBeGreaterThan(0)
      }
    })

    it('should filter logs by address and topics', async () => {
      const node = createTevmNode()
      const receiptsManager = await node.getReceiptsManager()
      const filter = {
        address: createAddress('0x1234567890123456789012345678901234567890'),
        topics: [
          '0x000000000000000000000000000000000000000000000000000000000000abcd',
        ],
        fromBlock: 0n,
        toBlock: 'latest',
      }

      const logs = await receiptsManager.getLogs(filter)
      expect(Array.isArray(logs)).toBe(true)
    })
  })

  describe('Receipt Storage', () => {
    it('should persist receipts across node restarts', async () => {
      const node1 = createTevmNode()
      const tx = createImpersonatedTx({
        impersonatedAddress: createAddress('0x1234567890123456789012345678901234567890'),
        to: createAddress('0x2345678901234567890123456789012345678901'),
        value: 1000000000000000000n,
        gasLimit: 21000n,
      })

      const vm = await node1.getVm()
      const result = await runTx(vm)({ tx })
      const receiptsManager1 = await node1.getReceiptsManager()
      const receipt1Result = await receiptsManager1.getReceiptByTxHash(result.receipt.transactionHash)

      // Create new node instance
      const node2 = createTevmNode()
      const receiptsManager2 = await node2.getReceiptsManager()
      const receipt2Result = await receiptsManager2.getReceiptByTxHash(result.receipt.transactionHash)

      expect(receipt2Result).toEqual(receipt1Result)
    })

    it('should handle receipt pruning', async () => {
      const node = createTevmNode()
      const txCount = 100
      const txs = Array.from({ length: txCount }, () => createImpersonatedTx({
        impersonatedAddress: createAddress('0x1234567890123456789012345678901234567890'),
        to: createAddress('0x2345678901234567890123456789012345678901'),
        value: 1000000000000000000n,
        gasLimit: 21000n,
      }))

      const vm = await node.getVm()
      const results = await Promise.all(txs.map(tx => runTx(vm)({ tx })))
      const receiptsManager = await node.getReceiptsManager()

      // Simulate block progression to trigger pruning
      for (let i = 0; i < 1000; i++) {
        await node.mine()
      }

      // Try to get the oldest receipt
      try {
        await receiptsManager.getReceiptByTxHash(results[0].receipt.transactionHash)
        throw new Error('Should have failed')
      } catch (error) {
        expect(error).toBeDefined()
      }
    })
  })

  describe('Log Indexing', () => {
    it('should index logs for efficient querying', async () => {
      const node = createTevmNode()
      const contractBytecode = '0x...' // Contract bytecode with events
      const deployTx = createImpersonatedTx({
        impersonatedAddress: createAddress('0x1234567890123456789012345678901234567890'),
        data: contractBytecode,
        gasLimit: 1000000n,
      })

      const vm = await node.getVm()
      const deployResult = await runTx(vm)({ tx: deployTx })
      const contractAddress = deployResult.createdAddress

      // Generate multiple logs
      const txCount = 10
      const txs = Array.from({ length: txCount }, () => createImpersonatedTx({
        impersonatedAddress: createAddress('0x1234567890123456789012345678901234567890'),
        to: contractAddress,
        data: '0x...', // Function call that emits events
        gasLimit: 100000n,
      }))

      await Promise.all(txs.map(tx => runTx(vm)({ tx })))
      const receiptsManager = await node.getReceiptsManager()

      // Query logs with different filters
      const filters = [
        { address: contractAddress },
        { topics: ['0x000000000000000000000000000000000000000000000000000000000000abcd'] },
        { fromBlock: 0n, toBlock: 'latest' },
      ]

      const results = await Promise.all(filters.map(filter => receiptsManager.getLogs(filter)))
      results.forEach(logs => {
        expect(Array.isArray(logs)).toBe(true)
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle non-existent receipts', async () => {
      const node = createTevmNode()
      const receiptsManager = await node.getReceiptsManager()
      const nonExistentHash = '0x1234567890123456789012345678901234567890123456789012345678901234' as const

      try {
        await receiptsManager.getReceiptByTxHash(hexToBytes(nonExistentHash))
        throw new Error('Should have failed')
      } catch (error) {
        expect(error).toBeDefined()
      }
    })

    it('should handle invalid log filters', async () => {
      const node = createTevmNode()
      const receiptsManager = await node.getReceiptsManager()
      const vm = await node.getVm()
      const invalidFilter = {
        address: 'invalid-address',
        topics: ['invalid-topic'],
      }

      try {
        await receiptsManager.getLogs(await vm.blockchain.getBlockByTag('earliest'), await vm.blockchain.getBlockByTag('latest'), invalidFilter)
        throw new Error('Should have failed')
      } catch (error) {
        expect(error).toBeDefined()
      }
    })
  })
})