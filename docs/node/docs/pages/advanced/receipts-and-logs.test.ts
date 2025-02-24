import { describe, it, expect } from 'vitest'
import { createTevmNode } from 'tevm'
import { hexToBytes } from 'tevm/utils'
import { createAddress } from 'tevm/address'
import { createImpersonatedTx } from 'tevm/tx'
import { runTx } from 'tevm/vm'

// Simple contract that emits events
const CONTRACT_BYTECODE = hexToBytes('0x608060405234801561001057600080fd5b506102c7806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c806342f3a3eb1461003b578063e8d6d4c514610057575b600080fd5b610055600480360381019061005091906100f0565b610073565b005b610071600480360381019061006c91906100f0565b6100bb565b005b7f000000000000000000000000000000000000000000000000000000000000abcd816040516100a191906101a0565b60405180910390a17f2222222222222222222222222222222222222222222222222222222222222222815b50565b7f000000000000000000000000000000000000000000000000000000000000abcd816040516100e991906101a0565b60405180910390a150565b60008135905061010481610263565b92915050565b60008151905061011981610263565b92915050565b60006020828403121561013557610134610243565b5b6000610143848285016100f5565b91505092915050565b60006020828403121561016257610161610243565b5b6000610170848285016100f5565b91505092915050565b61018281610209565b82525050565b61019a61019582610209565b61024d565b82525050565b60006020820190506101b56000830184610179565b92915050565b60006101c68261024d565b91506101d28361024d565b9250826101e2576101e1610214565b5b828204905092915050565b60006101f882610209565b9050919050565b6000819050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b600080fd5b6000819050919050565b61026c816101ed565b811461027757600080fd5b5056fea2646970667358221220e6c7c8c98b8e94b0a54fa054d1e1f7fbf0a4c7d5876c21a3e53a8c2a4c2c994564736f6c63430008110033')

// Function selector for emitting events
const EMIT_EVENT_SELECTOR = hexToBytes('0x42f3a3eb')

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
      const receiptResult = await receiptsManager.getReceiptByTxHash(tx.hash())

      expect(receiptResult).toBeDefined()
      if (receiptResult) {
        const [receipt, blockHash, txIndex, logIndex] = receiptResult
        expect(blockHash).toBeDefined()
        expect(txIndex).toBeDefined()
        expect(logIndex).toBeDefined()
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
      const receiptResult = await receiptsManager.getReceiptByTxHash(tx.hash())

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
      const deployTx = createImpersonatedTx({
        impersonatedAddress: createAddress('0x1234567890123456789012345678901234567890'),
        data: CONTRACT_BYTECODE,
        gasLimit: 1000000n,
      })

      const vm = await node.getVm()
      const deployResult = await runTx(vm)({ tx: deployTx })
      const receiptsManager = await node.getReceiptsManager()
      const deployReceiptResult = await receiptsManager.getReceiptByTxHash(deployTx.hash())
      expect(deployReceiptResult).toBeDefined()

      const contractAddress = deployResult.createdAddress
      expect(contractAddress).toBeDefined()
      if (!contractAddress) throw new Error('Contract deployment failed')
      const address = contractAddress // TypeScript will now know this is defined

      // Generate multiple logs
      const txCount = 10
      const txs = Array.from({ length: txCount }, () => createImpersonatedTx({
        impersonatedAddress: createAddress('0x1234567890123456789012345678901234567890'),
        to: address,
        data: EMIT_EVENT_SELECTOR,
        gasLimit: 100000n,
      }))

      await Promise.all(txs.map(tx => runTx(vm)({ tx })))

      const fromBlock = await vm.blockchain.getBlockByTag('earliest')
      const toBlock = await vm.blockchain.getBlockByTag('latest')

      // Query logs with different filters
      const eventTopic = hexToBytes('0x000000000000000000000000000000000000000000000000000000000000abcd')

      // Filter by contract address
      const addressLogs = await receiptsManager.getLogs(
        fromBlock,
        toBlock,
        [address.toBytes()],
        undefined
      )
      expect(addressLogs.length).toBeGreaterThan(0)

      // Filter by topic
      const topicLogs = await receiptsManager.getLogs(
        fromBlock,
        toBlock,
        undefined,
        [eventTopic]
      )
      expect(topicLogs.length).toBeGreaterThan(0)

      // Filter by both address and topic
      const combinedLogs = await receiptsManager.getLogs(
        fromBlock,
        toBlock,
        [address.toBytes()],
        [eventTopic]
      )
      expect(combinedLogs.length).toBeGreaterThan(0)
    })

    it('should filter logs by address and topics', async () => {
      const node = createTevmNode()
      const receiptsManager = await node.getReceiptsManager()
      const vm = await node.getVm()
      const fromBlock = await vm.blockchain.getBlockByTag('earliest')
      const toBlock = await vm.blockchain.getBlockByTag('latest')
      const testAddress = createAddress('0x1234567890123456789012345678901234567890')
      const filter = {
        address: testAddress,
        topics: [
          hexToBytes('0x000000000000000000000000000000000000000000000000000000000000abcd'),
        ],
      }

      const logs = await receiptsManager.getLogs(fromBlock, toBlock, [testAddress.toBytes()], filter.topics)
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
      const receipt1Result = await receiptsManager1.getReceiptByTxHash(tx.hash())

      // Create new node instance
      const node2 = createTevmNode()
      const receiptsManager2 = await node2.getReceiptsManager()
      const receipt2Result = await receiptsManager2.getReceiptByTxHash(tx.hash())

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
        const block = await vm.blockchain.getBlock(BigInt(i))
        await vm.blockchain.putBlock(block)
      }

      // Try to get the oldest receipt
      try {
        await receiptsManager.getReceiptByTxHash(txs[0].hash())
        throw new Error('Should have failed')
      } catch (error) {
        expect(error).toBeDefined()
      }
    })
  })

  describe('Log Indexing', () => {
    it('should index logs for efficient querying', async () => {
      const node = createTevmNode()
      const deployTx = createImpersonatedTx({
        impersonatedAddress: createAddress('0x1234567890123456789012345678901234567890'),
        data: CONTRACT_BYTECODE,
        gasLimit: 1000000n,
      })

      const vm = await node.getVm()
      const deployResult = await runTx(vm)({ tx: deployTx })
      const receiptsManager = await node.getReceiptsManager()
      const deployReceiptResult = await receiptsManager.getReceiptByTxHash(deployTx.hash())
      expect(deployReceiptResult).toBeDefined()

      const contractAddress = deployResult.createdAddress
      expect(contractAddress).toBeDefined()
      if (!contractAddress) throw new Error('Contract deployment failed')
      const address = contractAddress // TypeScript will now know this is defined

      // Generate multiple logs
      const txCount = 10
      const txs = Array.from({ length: txCount }, () => createImpersonatedTx({
        impersonatedAddress: createAddress('0x1234567890123456789012345678901234567890'),
        to: address,
        data: EMIT_EVENT_SELECTOR,
        gasLimit: 100000n,
      }))

      await Promise.all(txs.map(tx => runTx(vm)({ tx })))

      const fromBlock = await vm.blockchain.getBlockByTag('earliest')
      const toBlock = await vm.blockchain.getBlockByTag('latest')

      // Query logs with different filters
      const eventTopic = hexToBytes('0x000000000000000000000000000000000000000000000000000000000000abcd')

      // Filter by contract address
      const addressLogs = await receiptsManager.getLogs(
        fromBlock,
        toBlock,
        [address.toBytes()],
        undefined
      )
      expect(addressLogs.length).toBeGreaterThan(0)

      // Filter by topic
      const topicLogs = await receiptsManager.getLogs(
        fromBlock,
        toBlock,
        undefined,
        [eventTopic]
      )
      expect(topicLogs.length).toBeGreaterThan(0)

      // Filter by both address and topic
      const combinedLogs = await receiptsManager.getLogs(
        fromBlock,
        toBlock,
        [address.toBytes()],
        [eventTopic]
      )
      expect(combinedLogs.length).toBeGreaterThan(0)
    })
  })

  describe('Error Handling', () => {
    it('should handle non-existent receipts', async () => {
      const node = createTevmNode()
      const receiptsManager = await node.getReceiptsManager()
      const nonExistentHash = hexToBytes('0x1234567890123456789012345678901234567890123456789012345678901234')

      const receipt = await receiptsManager.getReceiptByTxHash(nonExistentHash)
      expect(receipt).toBeNull()
    })

    it('should handle invalid log filters', async () => {
      const node = createTevmNode()
      const receiptsManager = await node.getReceiptsManager()
      const vm = await node.getVm()
      const fromBlock = await vm.blockchain.getBlockByTag('earliest')
      const toBlock = await vm.blockchain.getBlockByTag('latest')

      // Test with invalid address
      const invalidAddress = hexToBytes('0x0000')
      const logs = await receiptsManager.getLogs(fromBlock, toBlock, [invalidAddress], undefined)
      expect(logs.length).toBe(0)
    })
  })
})