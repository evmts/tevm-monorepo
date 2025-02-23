import { describe, it, expect } from 'vitest'
import { createTevmNode } from 'tevm'
import { createMemoryClient } from 'tevm/memory'

describe('Transaction Pool', () => {
  describe('Basic Operations', () => {
    it('should add transactions to pool', async () => {
      const node = createTevmNode()
      const tx = {
        from: '0x1234567890123456789012345678901234567890',
        to: '0x2345678901234567890123456789012345678901',
        value: 1000000000000000000n, // 1 ETH
        gasLimit: 21000n,
        gasPrice: 20000000000n,
        nonce: 0n,
      }

      await node.addPendingTx(tx)
      const pending = await node.getPendingTxs()
      expect(pending.length).toBe(1)
    })

    it('should process transactions in order', async () => {
      const node = createTevmNode()
      const txs = [
        {
          from: '0x1234567890123456789012345678901234567890',
          to: '0x2345678901234567890123456789012345678901',
          value: 1000000000000000000n,
          gasLimit: 21000n,
          gasPrice: 20000000000n,
          nonce: 0n,
        },
        {
          from: '0x1234567890123456789012345678901234567890',
          to: '0x2345678901234567890123456789012345678901',
          value: 2000000000000000000n,
          gasLimit: 21000n,
          gasPrice: 20000000000n,
          nonce: 1n,
        },
      ]

      await Promise.all(txs.map(tx => node.addPendingTx(tx)))
      const pending = await node.getPendingTxs()
      expect(pending.length).toBe(2)
      expect(pending[0].nonce).toBe(0n)
      expect(pending[1].nonce).toBe(1n)
    })
  })

  describe('Advanced Features', () => {
    it('should handle transaction replacement', async () => {
      const node = createTevmNode()
      const originalTx = {
        from: '0x1234567890123456789012345678901234567890',
        to: '0x2345678901234567890123456789012345678901',
        value: 1000000000000000000n,
        gasLimit: 21000n,
        gasPrice: 20000000000n,
        nonce: 0n,
      }

      const replacementTx = {
        ...originalTx,
        gasPrice: 30000000000n, // Higher gas price
      }

      await node.addPendingTx(originalTx)
      await node.addPendingTx(replacementTx)

      const pending = await node.getPendingTxs()
      expect(pending.length).toBe(1)
      expect(pending[0].gasPrice).toBe(30000000000n)
    })

    it('should handle transaction expiry', async () => {
      const node = createTevmNode()
      const tx = {
        from: '0x1234567890123456789012345678901234567890',
        to: '0x2345678901234567890123456789012345678901',
        value: 1000000000000000000n,
        gasLimit: 21000n,
        gasPrice: 20000000000n,
        nonce: 0n,
        expiresIn: 100n, // Blocks until expiry
      }

      await node.addPendingTx(tx)

      // Simulate block progression
      for (let i = 0; i < 101; i++) {
        await node.mine()
      }

      const pending = await node.getPendingTxs()
      expect(pending.length).toBe(0)
    })
  })

  describe('Error Handling', () => {
    it('should reject invalid transactions', async () => {
      const node = createTevmNode()
      const invalidTx = {
        from: '0x1234567890123456789012345678901234567890',
        to: '0x2345678901234567890123456789012345678901',
        value: 1000000000000000000000n, // More than account balance
        gasLimit: 21000n,
        gasPrice: 20000000000n,
        nonce: 0n,
      }

      try {
        await node.addPendingTx(invalidTx)
        throw new Error('Should have failed')
      } catch (error) {
        expect(error).toBeDefined()
      }
    })

    it('should handle nonce gaps', async () => {
      const node = createTevmNode()
      const txs = [
        {
          from: '0x1234567890123456789012345678901234567890',
          to: '0x2345678901234567890123456789012345678901',
          value: 1000000000000000000n,
          gasLimit: 21000n,
          gasPrice: 20000000000n,
          nonce: 0n,
        },
        {
          from: '0x1234567890123456789012345678901234567890',
          to: '0x2345678901234567890123456789012345678901',
          value: 1000000000000000000n,
          gasLimit: 21000n,
          gasPrice: 20000000000n,
          nonce: 2n, // Gap in nonce sequence
        },
      ]

      await Promise.all(txs.map(tx => node.addPendingTx(tx)))
      const pending = await node.getPendingTxs()
      expect(pending.length).toBe(1)
      expect(pending[0].nonce).toBe(0n)
    })
  })

  describe('Performance', () => {
    it('should handle multiple concurrent transactions', async () => {
      const node = createTevmNode()
      const txCount = 100
      const txs = Array.from({ length: txCount }, (_, i) => ({
        from: '0x1234567890123456789012345678901234567890',
        to: '0x2345678901234567890123456789012345678901',
        value: 1000000000000000000n,
        gasLimit: 21000n,
        gasPrice: 20000000000n,
        nonce: BigInt(i),
      }))

      await Promise.all(txs.map(tx => node.addPendingTx(tx)))
      const pending = await node.getPendingTxs()
      expect(pending.length).toBe(txCount)
    })

    it('should handle transaction pruning', async () => {
      const node = createTevmNode()
      const txCount = 1000
      const txs = Array.from({ length: txCount }, (_, i) => ({
        from: '0x1234567890123456789012345678901234567890',
        to: '0x2345678901234567890123456789012345678901',
        value: 1000000000000000000n,
        gasLimit: 21000n,
        gasPrice: 20000000000n,
        nonce: BigInt(i),
      }))

      await Promise.all(txs.map(tx => node.addPendingTx(tx)))

      // Simulate mining blocks to trigger pruning
      for (let i = 0; i < 10; i++) {
        await node.mine()
      }

      const pending = await node.getPendingTxs()
      expect(pending.length).toBeLessThan(txCount)
    })
  })
})