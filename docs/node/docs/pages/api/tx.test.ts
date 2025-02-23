import { describe, it, expect } from 'vitest'
import { TransactionFactory, createImpersonatedTx, LegacyTransaction } from '@tevm/tx'
import { InvalidGasLimitError } from '@tevm/tx'

describe('@tevm/tx', () => {
  describe('TransactionFactory', () => {
    it('should create transactions from various data formats', async () => {
      // Create from serialized data
      const serializedData = new Uint8Array() // This would be actual serialized data
      const tx1 = TransactionFactory.fromSerializedTx(serializedData)
      expect(tx1).toBeDefined()

      // Create from RPC data
      const rpcTxData = {} // This would be actual RPC data
      const tx2 = await TransactionFactory.fromRPC(rpcTxData)
      expect(tx2).toBeDefined()

      // Create from block body data
      const blockData = {} // This would be actual block data
      const tx3 = TransactionFactory.fromBlockBodyData(blockData)
      expect(tx3).toBeDefined()
    })
  })

  describe('Impersonated Transactions', () => {
    it('should create impersonated transactions', () => {
      const address = '0x1234567890123456789012345678901234567890'
      const recipient = '0x0987654321098765432109876543210987654321'

      const tx = createImpersonatedTx({
        impersonatedAddress: address,
        to: recipient,
        value: 1000000000000000000n,
        data: new Uint8Array()
      })

      expect(tx).toBeDefined()
    })
  })

  describe('Transaction Types', () => {
    it('should create legacy transactions', () => {
      const tx = TransactionFactory.fromTxData({
        nonce: 0n,
        gasPrice: 20000000000n,
        gasLimit: 21000n,
        to: '0x1234567890123456789012345678901234567890',
        value: 1000000000000000000n,
        data: new Uint8Array()
      })

      expect(tx).toBeDefined()
    })

    it('should create legacy transactions directly', () => {
      const legacyTx = new LegacyTransaction({
        nonce: 0n,
        gasPrice: 20000000000n,
        gasLimit: 21000n,
        to: '0x1234567890123456789012345678901234567890',
        value: 1000000000000000000n,
        data: new Uint8Array()
      })

      expect(legacyTx).toBeDefined()
    })
  })

  describe('Error Handling', () => {
    it('should handle invalid gas limit errors', () => {
      try {
        const tx = createImpersonatedTx({
          impersonatedAddress: '0x1234567890123456789012345678901234567890',
          to: '0x0987654321098765432109876543210987654321',
          value: 1000000000000000000n,
          data: new Uint8Array(),
          gasLimit: -1n // Invalid gas limit
        })
        expect(true).toBe(false) // Should not reach here
      } catch (e) {
        expect(e).toBeInstanceOf(InvalidGasLimitError)
      }
    })
  })
})