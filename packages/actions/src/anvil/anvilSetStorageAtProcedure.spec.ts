import { describe, it, expect } from 'vitest'
import { createTevmNode } from '@tevm/node'
import { createAddress } from '@tevm/address'
import { anvilSetStorageAtJsonRpcProcedure } from './anvilSetStorageAtProcedure.js'

describe('anvilSetStorageAtJsonRpcProcedure', () => {
  it('should set storage at a given address', async () => {
    const client = createTevmNode()
    const procedure = anvilSetStorageAtJsonRpcProcedure(client)
    const address = createAddress('0x1234567890123456789012345678901234567890')
    const slot = '0x0000000000000000000000000000000000000000000000000000000000000001'
    const value = '0x0000000000000000000000000000000000000000000000000000000000000123'

    const result = await procedure({
      jsonrpc: '2.0',
      method: 'anvil_setStorageAt',
      params: [address.toString(), slot, value],
      id: 1,
    })

    expect(result).toEqual({
      jsonrpc: '2.0',
      method: 'anvil_setStorageAt',
      result: null,
      id: 1,
    })
  })
})