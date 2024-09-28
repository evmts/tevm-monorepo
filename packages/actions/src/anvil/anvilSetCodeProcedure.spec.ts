import { describe, it, expect } from 'vitest'
import { createTevmNode } from '@tevm/node'
import { createAddress } from '@tevm/address'
import { anvilSetCodeJsonRpcProcedure } from './anvilSetCodeProcedure.js'
import { getCodeHandler } from '../eth/getCodeHandler.js'

describe('anvilSetCodeJsonRpcProcedure', () => {
  it('should set code for a given address', async () => {
    const client = createTevmNode()
    const procedure = anvilSetCodeJsonRpcProcedure(client)
    const address = createAddress('0x1234567890123456789012345678901234567890')
    const code = '0x60806040'

    const result = await procedure({
      jsonrpc: '2.0',
      method: 'anvil_setCode',
      params: [address.toString(), code],
      id: 1,
    })

    expect(result).toEqual({
      jsonrpc: '2.0',
      method: 'anvil_setCode',
      result: null,
      id: 1,
    })

    const getCodeResult = await getCodeHandler(client)({ address: address.toString() })
    expect(getCodeResult).toEqual(code)
  })
})