import { describe, it, expect, vi } from 'vitest'
import { createTevmNode } from '@tevm/node'
import { bytesToHex } from '@tevm/utils'
import { mineHandler } from './mineHandler.js'

describe('Mine events', () => {
  it('should call event handlers when mining', async () => {
    const client = createTevmNode()
    await client.ready()
    
    // Mock the event handlers
    const onBlock = vi.fn((block, next) => {
      next?.()
    })
    
    const onReceipt = vi.fn((receipt, blockHash, next) => {
      next?.()
    })
    
    const onLog = vi.fn((log, receipt, next) => {
      next?.()
    })
    
    // Call mine with event handlers
    const result = await mineHandler(client)({
      blockCount: 1,
      onBlock,
      onReceipt,
      onLog,
    })
    
    // Verify the result
    expect(result.blockHashes).toBeDefined()
    expect(result.blockHashes.length).toBe(1)
    
    // Verify that the block handler was called
    expect(onBlock).toHaveBeenCalledTimes(1)
    
    // The receipt and log handlers may not be called if there are no transactions
    // but the code structure should be called correctly
  })
})