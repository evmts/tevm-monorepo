import { createAddress } from '@tevm/address'
import { createTevmNode } from '@tevm/node'
import { hexToBytes } from 'viem'
import { expect, test, vi } from 'vitest'
import { ethSimulateV1Handler, SimulateError, NATIVE_TOKEN_ADDRESS } from './ethSimulateV1Handler.js'

test('ethSimulateV1Handler should throw error for empty blockStateCalls', async () => {
  const client = createTevmNode()
  const handler = ethSimulateV1Handler(client)

  await expect(
    handler({
      blockStateCalls: [],
    }),
  ).rejects.toThrow(SimulateError)
})

test('ethSimulateV1Handler should successfully simulate a basic call', async () => {
  const client = createTevmNode()
  
  // Mock logger to avoid noise in tests
  client.logger.debug = vi.fn()
  client.logger.warn = vi.fn()
  
  const handler = ethSimulateV1Handler(client)

  const result = await handler({
    blockStateCalls: [
      {
        from: '0x1234567890123456789012345678901234567890',
        to: '0x2345678901234567890123456789012345678901',
        data: '0x',
        value: '0x0',
      },
    ],
  })

  expect(result).toHaveProperty('results')
  expect(result.results).toBeInstanceOf(Array)
  expect(result.results.length).toBe(1)
  expect(result.results[0]).toHaveProperty('status')
  expect(result.results[0]).toHaveProperty('data')
  expect(result.results[0]).toHaveProperty('gasUsed')
  expect(result.results[0]).toHaveProperty('logs')
})

test('ethSimulateV1Handler should validate inputs', async () => {
  const client = createTevmNode()
  
  // Mock logger to avoid noise in tests
  client.logger.debug = vi.fn()
  client.logger.warn = vi.fn()
  
  const handler = ethSimulateV1Handler(client)

  // Test with valid calls
  const result = await handler({
    blockStateCalls: [
      {
        from: '0x1234567890123456789012345678901234567890',
        to: '0x2345678901234567890123456789012345678901',
        data: '0x',
      },
    ],
  })

  expect(result).toHaveProperty('results')
  expect(result.results.length).toBe(1)
  
  // Warnings should be triggered with blockOverrides
  await handler({
    blockStateCalls: [
      {
        from: '0x1234567890123456789012345678901234567890',
        to: '0x2345678901234567890123456789012345678901',
        data: '0x',
      },
    ],
    blockOverrides: {
      baseFeePerGas: 1000000000n,
    },
  })
  
  expect(client.logger.warn).toHaveBeenCalled()
})

test('ethSimulateV1Handler should handle failing transactions', async () => {
  const client = createTevmNode()
  
  // Mock logger to avoid noise in tests
  client.logger.debug = vi.fn()
  client.logger.warn = vi.fn()
  client.logger.error = vi.fn()
  
  const handler = ethSimulateV1Handler(client)
  
  // Force an error in execution
  const result = await handler({
    blockStateCalls: [
      {
        // Send to a non-existent contract and call a function - should fail
        from: '0x1234567890123456789012345678901234567890',
        to: '0x2345678901234567890123456789012345678901',
        data: '0xcafebabe', // Invalid function signature
      },
    ],
  })

  expect(result).toHaveProperty('results')
  expect(result.results.length).toBe(1)
  expect(result.results[0]).toHaveProperty('status', 'failure')
  
  // Test with a simulated error
  client.logger.error = vi.fn()
  
  // Create a mock call handler for error handling
  vi.spyOn(client, 'getVm').mockImplementation(() => {
    // Force an error when executed
    throw new Error('Unexpected error')
  })
  
  const errorResult = await handler({
    blockStateCalls: [
      {
        from: '0x1234567890123456789012345678901234567890',
        to: '0x2345678901234567890123456789012345678901',
        data: '0x',
      },
    ],
  })
  
  expect(errorResult.results[0]).toHaveProperty('status', 'failure')
  expect(errorResult.results[0]).toHaveProperty('error')
  expect(client.logger.error).toHaveBeenCalled()
})