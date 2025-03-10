import { createTevmNode } from '@tevm/node'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { ethNewPendingTransactionFilterProcedure } from './ethNewPendingTransactionFilterProcedure.js'

// Mock the generateRandomId module
vi.mock('./utils/generateRandomId.js', () => ({
  generateRandomId: vi.fn().mockReturnValue('0x123')
}))

describe('ethNewPendingTransactionFilterProcedure', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should create a new pending transaction filter and return its ID', async () => {
    const client = createTevmNode()
    
    // Mock client methods with type assertions
    // @ts-expect-error - Mocking client methods for testing
    client.getFilters = vi.fn().mockReturnValue(new Map())
    // @ts-expect-error - Mocking client methods for testing
    client.setFilter = vi.fn()
    client.on = vi.fn()
    
    const procedure = ethNewPendingTransactionFilterProcedure(client)
    
    const result = await procedure({
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_newPendingTransactionFilter',
      params: []
    })
    
    // Check only the format since we can't guarantee the exact filter ID
    expect(result).toHaveProperty('jsonrpc', '2.0')
    expect(result).toHaveProperty('id', 1)
    expect(result).toHaveProperty('method', 'eth_newPendingTransactionFilter')
    expect(result).toHaveProperty('result')
    
    // Verify that client.on and client.setFilter were called correctly
    expect(client.on).toHaveBeenCalledWith('newPendingTransaction', expect.any(Function))
    expect(client.setFilter).toHaveBeenCalledWith({
      id: expect.any(String),
      type: 'PendingTransaction',
      created: expect.any(Number),
      logs: [],
      tx: [],
      blocks: [],
      installed: {},
      err: undefined,
      registeredListeners: expect.any(Array)
    })
  })

  it('should handle missing ID in request', async () => {
    const client = createTevmNode()
    
    // Mock client methods with type assertions
    // @ts-expect-error - Mocking client methods for testing
    client.getFilters = vi.fn().mockReturnValue(new Map())
    // @ts-expect-error - Mocking client methods for testing
    client.setFilter = vi.fn()
    client.on = vi.fn()
    
    const procedure = ethNewPendingTransactionFilterProcedure(client)
    
    const result = await procedure({
      jsonrpc: '2.0',
      method: 'eth_newPendingTransactionFilter',
      params: []
    })
    
    // Check only the format since we can't guarantee the exact filter ID
    expect(result).toHaveProperty('jsonrpc', '2.0') 
    expect(result).toHaveProperty('method', 'eth_newPendingTransactionFilter')
    expect(result).toHaveProperty('result')
    expect(result).not.toHaveProperty('id')
  })

  it('should invoke listener when new pending transactions are received', async () => {
    const client = createTevmNode()

    // Create a mock filter (we'll capture it later)
    let capturedFilter: any = null
    
    // Mock client's setFilter to capture the filter
    // @ts-expect-error - Mocking client methods for testing
    client.setFilter = vi.fn().mockImplementation((filter) => {
      capturedFilter = filter
    })
    
    // Create a mock event listener that we can directly call
    const mockListener = vi.fn().mockImplementation((tx: any) => {
      // Add transaction to the filter when called
      if (capturedFilter && Array.isArray(capturedFilter.tx)) {
        capturedFilter.tx.push(tx)
      }
    })
    
    // Set up the mock listener on the client
    client.on = vi.fn().mockImplementation((_: string, listener: any) => {
      // Store the provided listener in our mockListener for later use
      mockListener.mockImplementationOnce(listener)
    })
    
    // Mock getFilters to return our filter
    // @ts-expect-error - Mocking client methods for testing
    client.getFilters = vi.fn().mockImplementation(() => {
      const map = new Map()
      if (capturedFilter) {
        map.set(capturedFilter.id, capturedFilter)
      }
      return map
    })
    
    const procedure = ethNewPendingTransactionFilterProcedure(client)
    
    await procedure({
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_newPendingTransactionFilter',
      params: []
    })
    
    // Verify filter was created
    expect(capturedFilter).not.toBeNull()
    expect(capturedFilter?.tx).toEqual([])
    
    // Simulate a new pending transaction
    const mockTx = { hash: '0xabc' }
    mockListener(mockTx)
    
    // Verify the transaction was added to the filter
    expect(capturedFilter?.tx).toContain(mockTx)
  })
})