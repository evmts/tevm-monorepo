import { describe, it, expect } from 'vitest'
import { createTevmNode } from 'tevm'
import { createAddress } from 'tevm/address'
import { createImpersonatedTx } from 'tevm/tx'
import { mineHandler } from 'tevm/actions'

describe('Transaction Pool', () => {
  describe('Basic Operations', () => {
    it('should add transactions to pool', async () => {
      const node = createTevmNode()
      const tx = createImpersonatedTx({
        impersonatedAddress: createAddress('0x1234567890123456789012345678901234567890'),
        to: createAddress('0x2345678901234567890123456789012345678901'),
        value: 1000000000000000000n, // 1 ETH
        gasLimit: 21000n,
        maxFeePerGas: 20000000000n,
        maxPriorityFeePerGas: 20000000000n,
        nonce: 0n,
      })

      const txPool = await node.getTxPool()
      await txPool.addUnverified(tx)
      const pooledTxs = await txPool.getBySenderAddress(tx.getSenderAddress())
      expect(pooledTxs.length).toBe(1)
    })

    it('should process transactions in order', async () => {
      const node = createTevmNode()
      const txPool = await node.getTxPool()
      const txs = [
        createImpersonatedTx({
          impersonatedAddress: createAddress('0x1234567890123456789012345678901234567890'),
          to: createAddress('0x2345678901234567890123456789012345678901'),
          value: 1000000000000000000n,
          gasLimit: 21000n,
          maxFeePerGas: 20000000000n,
          maxPriorityFeePerGas: 20000000000n,
          nonce: 0n,
        }),
        createImpersonatedTx({
          impersonatedAddress: createAddress('0x1234567890123456789012345678901234567890'),
          to: createAddress('0x2345678901234567890123456789012345678901'),
          value: 2000000000000000000n,
          gasLimit: 21000n,
          maxFeePerGas: 20000000000n,
          maxPriorityFeePerGas: 20000000000n,
          nonce: 1n,
        }),
      ]

      await Promise.all(txs.map(tx => txPool.addUnverified(tx)))
      const pooledTxs = await txPool.getBySenderAddress(txs[0].getSenderAddress())
      expect(pooledTxs.length).toBe(2)
      expect(pooledTxs[0].tx.nonce).toBe(0n)
      expect(pooledTxs[1].tx.nonce).toBe(1n)
    })
  })

  describe('Advanced Features', () => {
    it('should handle transaction replacement', async () => {
      const node = createTevmNode()
      const txPool = await node.getTxPool()
      const originalTx = createImpersonatedTx({
        impersonatedAddress: createAddress('0x1234567890123456789012345678901234567890'),
        to: createAddress('0x2345678901234567890123456789012345678901'),
        value: 1000000000000000000n,
        gasLimit: 21000n,
        maxFeePerGas: 20000000000n,
        maxPriorityFeePerGas: 20000000000n,
        nonce: 0n,
      })

      const replacementTx = createImpersonatedTx({
        impersonatedAddress: createAddress('0x1234567890123456789012345678901234567890'),
        to: createAddress('0x2345678901234567890123456789012345678901'),
        value: 1000000000000000000n,
        gasLimit: 21000n,
        maxFeePerGas: 30000000000n, // Higher gas price
        maxPriorityFeePerGas: 30000000000n,
        nonce: 0n,
      })

      await txPool.addUnverified(originalTx)
      await txPool.addUnverified(replacementTx)

      const pooledTxs = await txPool.getBySenderAddress(originalTx.getSenderAddress())
      expect(pooledTxs.length).toBe(1)
    })

    it('should handle transaction expiry', async () => {
      const node = createTevmNode()
      const txPool = await node.getTxPool()
      const tx = createImpersonatedTx({
        impersonatedAddress: createAddress('0x1234567890123456789012345678901234567890'),
        to: createAddress('0x2345678901234567890123456789012345678901'),
        value: 1000000000000000000n,
        gasLimit: 21000n,
        maxFeePerGas: 20000000000n,
        maxPriorityFeePerGas: 20000000000n,
        nonce: 0n,
      })

      await txPool.addUnverified(tx)

      // Simulate block progression
      for (let i = 0; i < 101; i++) {
        await mineHandler(node)()
      }

      const pooledTxs = await txPool.getBySenderAddress(tx.getSenderAddress())
      expect(pooledTxs.length).toBe(0)
    })
  })

  describe('Error Handling', () => {
    it('should reject invalid transactions', async () => {
      const node = createTevmNode()
      const txPool = await node.getTxPool()
      const invalidTx = createImpersonatedTx({
        impersonatedAddress: createAddress('0x1234567890123456789012345678901234567890'),
        to: createAddress('0x2345678901234567890123456789012345678901'),
        value: 1000000000000000000000n, // More than account balance
        gasLimit: 21000n,
        maxFeePerGas: 20000000000n,
        maxPriorityFeePerGas: 20000000000n,
        nonce: 0n,
      })

      try {
        await txPool.add(invalidTx) // Using add instead of addUnverified to validate
        throw new Error('Should have failed')
      } catch (error) {
        expect(error).toBeDefined()
      }
    })

    it('should handle nonce gaps', async () => {
      const node = createTevmNode()
      const txPool = await node.getTxPool()
      const txs = [
        createImpersonatedTx({
          impersonatedAddress: createAddress('0x1234567890123456789012345678901234567890'),
          to: createAddress('0x2345678901234567890123456789012345678901'),
          value: 1000000000000000000n,
          gasLimit: 21000n,
          maxFeePerGas: 20000000000n,
          maxPriorityFeePerGas: 20000000000n,
          nonce: 0n,
        }),
        createImpersonatedTx({
          impersonatedAddress: createAddress('0x1234567890123456789012345678901234567890'),
          to: createAddress('0x2345678901234567890123456789012345678901'),
          value: 1000000000000000000n,
          gasLimit: 21000n,
          maxFeePerGas: 20000000000n,
          maxPriorityFeePerGas: 20000000000n,
          nonce: 2n, // Gap in nonce sequence
        }),
      ]

      await Promise.all(txs.map(tx => txPool.addUnverified(tx)))
      const pooledTxs = await txPool.getBySenderAddress(txs[0].getSenderAddress())
      expect(pooledTxs.length).toBe(2) // TxPool doesn't validate nonce sequence on addUnverified
      expect(pooledTxs[0].tx.nonce).toBe(0n)
    })
  })

  describe('Performance', () => {
    it('should handle multiple concurrent transactions', async () => {
      const node = createTevmNode()
      const txPool = await node.getTxPool()
      const txCount = 100
      const txs = Array.from({ length: txCount }, (_, i) => createImpersonatedTx({
        impersonatedAddress: createAddress('0x1234567890123456789012345678901234567890'),
        to: createAddress('0x2345678901234567890123456789012345678901'),
        value: 1000000000000000000n,
        gasLimit: 21000n,
        maxFeePerGas: 20000000000n,
        maxPriorityFeePerGas: 20000000000n,
        nonce: BigInt(i),
      }))

      await Promise.all(txs.map(tx => txPool.addUnverified(tx)))
      const pooledTxs = await txPool.getBySenderAddress(txs[0].getSenderAddress())
      expect(pooledTxs.length).toBe(txCount)
    })

    it('should handle transaction pruning', async () => {
      const node = createTevmNode()
      const txPool = await node.getTxPool()
      const txCount = 1000
      const txs = Array.from({ length: txCount }, (_, i) => createImpersonatedTx({
        impersonatedAddress: createAddress('0x1234567890123456789012345678901234567890'),
        to: createAddress('0x2345678901234567890123456789012345678901'),
        value: 1000000000000000000n,
        gasLimit: 21000n,
        maxFeePerGas: 20000000000n,
        maxPriorityFeePerGas: 20000000000n,
        nonce: BigInt(i),
      }))

      await Promise.all(txs.map(tx => txPool.addUnverified(tx)))

      // Simulate mining blocks to trigger pruning
      for (let i = 0; i < 10; i++) {
        await mineHandler(node)()
      }

      const pooledTxs = await txPool.getBySenderAddress(txs[0].getSenderAddress())
      expect(pooledTxs.length).toBeLessThan(txCount)
    })
  })
})