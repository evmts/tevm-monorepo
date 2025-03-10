import { createAddress } from '@tevm/address'
import { createTevmNode } from '@tevm/node'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { anvilSetNonceJsonRpcProcedure } from './anvilSetNonceProcedure.js'
import { setAccountProcedure } from '../SetAccount/setAccountProcedure.js'

// Mock the setAccountProcedure module
vi.mock('../SetAccount/setAccountProcedure.js', () => ({
  setAccountProcedure: vi.fn()
}))

describe('anvilSetNonceJsonRpcProcedure', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should set nonce for a given address', async () => {
    // Set up mock handler
    const mockProcedure = vi.fn().mockResolvedValue({
      jsonrpc: '2.0',
      method: 'tevm_setAccount',
      result: true
    })
    // @ts-expect-error - Mocking for tests
    setAccountProcedure.mockReturnValue(mockProcedure)
    
    const client = createTevmNode()
    const procedure = anvilSetNonceJsonRpcProcedure(client)
    const address = createAddress('0x1234567890123456789012345678901234567890')
    const nonce = '0x5'

    const result = await procedure({
      jsonrpc: '2.0',
      method: 'anvil_setNonce',
      params: [address.toString(), nonce],
      id: 1,
    })

    expect(result).toEqual({
      jsonrpc: '2.0',
      method: 'anvil_setNonce',
      result: null,
      id: 1,
    })
  })
  
  it('should handle missing ID in request', async () => {
    // Set up mock handler
    const mockProcedure = vi.fn().mockResolvedValue({
      jsonrpc: '2.0',
      method: 'tevm_setAccount',
      result: true
    })
    // @ts-expect-error - Mocking for tests
    setAccountProcedure.mockReturnValue(mockProcedure)
    
    const client = createTevmNode()
    const procedure = anvilSetNonceJsonRpcProcedure(client)
    const address = createAddress('0x1234567890123456789012345678901234567890')
    const nonce = '0x5'

    const result = await procedure({
      jsonrpc: '2.0',
      method: 'anvil_setNonce',
      params: [address.toString(), nonce],
    })

    expect(result).toEqual({
      jsonrpc: '2.0',
      method: 'anvil_setNonce',
      result: null,
    })
  })
  
  it('should propagate errors from setAccountProcedure', async () => {
    // Set up mock handler that returns an error
    const mockProcedure = vi.fn().mockResolvedValue({
      jsonrpc: '2.0',
      method: 'tevm_setAccount',
      error: {
        code: -32000,
        message: 'Test error'
      }
    })
    // @ts-expect-error - Mocking for tests
    setAccountProcedure.mockReturnValue(mockProcedure)
    
    const client = createTevmNode()
    const procedure = anvilSetNonceJsonRpcProcedure(client)
    
    const result = await procedure({
      jsonrpc: '2.0',
      id: 1,
      method: 'anvil_setNonce',
      params: ['0x1234567890123456789012345678901234567890', '0xa']
    })
    
    expect(result).toEqual({
      jsonrpc: '2.0',
      id: 1,
      method: 'anvil_setNonce',
      error: {
        code: -32000,
        message: 'Test error'
      }
    })
  })
})
