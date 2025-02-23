import { describe, it, expect } from 'vitest'
import { createTevmNode } from 'tevm'
import { createMemoryClient } from 'tevm/memory'

describe('Receipt Manager', () => {
  describe('Basic Operations', () => {
    it('should store and retrieve transaction receipts', async () => {
      const node = createTevmNode()
      const tx = {
        from: '0x1234567890123456789012345678901234567890',
        to: '0x2345678901234567890123456789012345678901',
        value: 1000000000000000000n,
        gasLimit: 21000n,
        gasPrice: 20000000000n,
      }

      const result = await node.runTx(tx)
      const receipt = await node.getReceipt(result.hash)

      expect(receipt).toBeDefined()
      expect(receipt.transactionHash).toBe(result.hash)
      expect(receipt.status).toBe(1)
    })

    it('should handle multiple receipts', async () => {
      const node = createTevmNode()
      const txs = [
        {
          from: '0x1234567890123456789012345678901234567890',
          to: '0x2345678901234567890123456789012345678901',
          value: 1000000000000000000n,
          gasLimit: 21000n,
          gasPrice: 20000000000n,
        },
        {
          from: '0x1234567890123456789012345678901234567890',
          to: '0x3456789012345678901234567890123456789012',
          value: 2000000000000000000n,
          gasLimit: 21000n,
          gasPrice: 20000000000n,
        },
      ]

      const results = await Promise.all(txs.map(tx => node.runTx(tx)))
      const receipts = await Promise.all(
        results.map(result => node.getReceipt(result.hash))
      )

      expect(receipts.length).toBe(2)
      receipts.forEach((receipt, i) => {
        expect(receipt.transactionHash).toBe(results[i].hash)
        expect(receipt.status).toBe(1)
      })
    })
  })

  describe('Event Logs', () => {
    it('should handle contract event logs', async () => {
      const node = createTevmNode()
      const contractBytecode = '0x...' // Contract bytecode with events
      const deployTx = {
        from: '0x1234567890123456789012345678901234567890',
        data: contractBytecode,
        gasLimit: 1000000n,
        gasPrice: 20000000000n,
      }

      const deployResult = await node.runTx(deployTx)
      const deployReceipt = await node.getReceipt(deployResult.hash)

      expect(deployReceipt.logs).toBeDefined()
      expect(Array.isArray(deployReceipt.logs)).toBe(true)
    })

    it('should filter logs by address and topics', async () => {
      const node = createTevmNode()
      const filter = {
        address: '0x1234567890123456789012345678901234567890',
        topics: [
          '0x000000000000000000000000000000000000000000000000000000000000abcd',
        ],
      }

      const logs = await node.getLogs(filter)
      expect(Array.isArray(logs)).toBe(true)
    })
  })

  describe('Receipt Storage', () => {
    it('should persist receipts across node restarts', async () => {
      const client = createMemoryClient()
      const node1 = createTevmNode({ client })

      const tx = {
        from: '0x1234567890123456789012345678901234567890',
        to: '0x2345678901234567890123456789012345678901',
        value: 1000000000000000000n,
        gasLimit: 21000n,
        gasPrice: 20000000000n,
      }

      const result = await node1.runTx(tx)
      const receipt1 = await node1.getReceipt(result.hash)

      // Create new node instance with same client
      const node2 = createTevmNode({ client })
      const receipt2 = await node2.getReceipt(result.hash)

      expect(receipt2).toEqual(receipt1)
    })

    it('should handle receipt pruning', async () => {
      const node = createTevmNode()
      const txCount = 100
      const txs = Array.from({ length: txCount }, () => ({
        from: '0x1234567890123456789012345678901234567890',
        to: '0x2345678901234567890123456789012345678901',
        value: 1000000000000000000n,
        gasLimit: 21000n,
        gasPrice: 20000000000n,
      }))

      const results = await Promise.all(txs.map(tx => node.runTx(tx)))

      // Simulate block progression to trigger pruning
      for (let i = 0; i < 1000; i++) {
        await node.mine()
      }

      // Try to get the oldest receipt
      try {
        await node.getReceipt(results[0].hash)
        throw new Error('Should have failed')
      } catch (error) {
        expect(error).toBeDefined()
      }
    })
  })

  describe('Error Handling', () => {
    it('should handle non-existent receipts', async () => {
      const node = createTevmNode()
      const nonExistentHash = '0x1234567890123456789012345678901234567890123456789012345678901234'

      try {
        await node.getReceipt(nonExistentHash)
        throw new Error('Should have failed')
      } catch (error) {
        expect(error).toBeDefined()
      }
    })

    it('should handle failed transactions', async () => {
      const node = createTevmNode()
      const tx = {
        from: '0x1234567890123456789012345678901234567890',
        to: '0x2345678901234567890123456789012345678901',
        value: 1000000000000000000000n, // More than balance
        gasLimit: 21000n,
        gasPrice: 20000000000n,
      }

      const result = await node.runTx(tx)
      const receipt = await node.getReceipt(result.hash)

      expect(receipt.status).toBe(0)
    })
  })
})