import { describe, it, expect } from 'vitest'
import { createTevmNode } from '@tevm/node'
import { ethSendRawTransactionJsonRpcProcedure } from './ethSendRawTransactionProcedure.js'
import { TransactionFactory, BlobEIP4844Transaction } from '@tevm/tx'
import { parseEther, bytesToHex, hexToBytes, PREFUNDED_PRIVATE_KEYS } from '@tevm/utils'
import { tevmDefault } from '@tevm/common'
import { createAddress } from '@tevm/address'

describe('ethSendRawTransactionJsonRpcProcedure', () => {
  it('should handle a valid signed transaction', async () => {
    const client = createTevmNode()
    const procedure = ethSendRawTransactionJsonRpcProcedure(client)

    const tx = TransactionFactory.fromTxData({
      nonce: '0x00',
      maxFeePerGas: '0x09184e72a000',
      maxPriorityFeePerGas: '0x09184e72a000',
      gasLimit: '0x2710',
      to: createAddress('0x' + '42'.repeat(20)),
      value: parseEther('1'),
      data: '0x',
      type: 2,
    }, { common: tevmDefault.ethjsCommon })

    const signedTx = tx.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))
    const serializedTx = signedTx.serialize()

    const result = await procedure({
      jsonrpc: '2.0',
      method: 'eth_sendRawTransaction',
      params: [bytesToHex(serializedTx)],
      id: 1,
    })

    expect(result.result).toBe(bytesToHex(signedTx.hash()))
  })

  it('should handle a legacy transaction', async () => {
    const client = createTevmNode()
    const procedure = ethSendRawTransactionJsonRpcProcedure(client)

    const tx = TransactionFactory.fromTxData({
      nonce: '0x00',
      gasPrice: '0x09184e72a000',
      gasLimit: '0x2710',
      to: createAddress('0x' + '42'.repeat(20)),
      value: parseEther('1'),
      data: '0x',
      type: 0,
    }, { common: tevmDefault.ethjsCommon })

    const signedTx = tx.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))
    const serializedTx = signedTx.serialize()

    const result = await procedure({
      jsonrpc: '2.0',
      method: 'eth_sendRawTransaction',
      params: [bytesToHex(serializedTx)],
      id: 1,
    })

    expect(result.result).toBe(bytesToHex(signedTx.hash()))
  })
})