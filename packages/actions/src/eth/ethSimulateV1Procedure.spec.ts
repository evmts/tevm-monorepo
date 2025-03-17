import { createTevmNode } from '@tevm/node'
import { hexToBytes } from 'viem'
import { expect, test, vi } from 'vitest'
import { ethSimulateV1Procedure } from './ethSimulateV1Procedure.js'

test('ethSimulateV1Procedure should handle basic simulation request', async () => {
  const client = createTevmNode()
  
  // Mock logger to avoid noise in tests
  client.logger.debug = vi.fn()
  client.logger.warn = vi.fn()
  
  const procedure = ethSimulateV1Procedure(client)

  const response = await procedure({
    jsonrpc: '2.0',
    id: 1,
    method: 'eth_simulateV1',
    params: [
      {
        blockStateCalls: [
          {
            from: '0x1234567890123456789012345678901234567890',
            to: '0x2345678901234567890123456789012345678901',
            data: '0x',
          },
        ],
      },
    ],
  })

  expect(response).toHaveProperty('jsonrpc', '2.0')
  expect(response).toHaveProperty('id', 1)
  expect(response).toHaveProperty('method', 'eth_simulateV1')
  expect(response).toHaveProperty('result')
  expect(response.result).toHaveProperty('results')
  expect(response.result.results).toBeInstanceOf(Array)
  expect(response.result.results.length).toBe(1)
  
  const callResult = response.result.results[0]
  expect(callResult).toHaveProperty('status')
  expect(callResult).toHaveProperty('data')
  expect(callResult).toHaveProperty('gasUsed')
  expect(callResult).toHaveProperty('logs')
})

test('ethSimulateV1Procedure should handle state overrides', async () => {
  const client = createTevmNode()
  
  // Mock logger to avoid noise in tests
  client.logger.debug = vi.fn()
  client.logger.warn = vi.fn()
  
  const procedure = ethSimulateV1Procedure(client)

  const response = await procedure({
    jsonrpc: '2.0',
    id: 1,
    method: 'eth_simulateV1',
    params: [
      {
        blockStateCalls: [
          {
            from: '0x1234567890123456789012345678901234567890',
            to: '0x2345678901234567890123456789012345678901',
            data: '0x',
          },
        ],
        stateOverrides: [
          {
            address: '0x1234567890123456789012345678901234567890',
            balance: '0xde0b6b3a7640000', // 1 ETH
            code: '0x60806040',
          },
        ],
      },
    ],
  })

  expect(response).toHaveProperty('result')
  expect(response.result).toHaveProperty('results')
})

test('ethSimulateV1Procedure should handle errors', async () => {
  const client = createTevmNode()
  
  // Mock logger to handle errors
  client.logger.error = vi.fn()
  
  const procedure = ethSimulateV1Procedure(client)

  // Force an error by providing invalid params
  const response = await procedure({
    jsonrpc: '2.0',
    id: 1,
    method: 'eth_simulateV1',
    params: [null],
  })

  expect(response).toHaveProperty('jsonrpc', '2.0')
  expect(response).toHaveProperty('id', 1)
  expect(response).toHaveProperty('method', 'eth_simulateV1')
  expect(response).toHaveProperty('error')
  expect(response.error).toHaveProperty('code', -32000)
  expect(response.error).toHaveProperty('message')
})

test('ethSimulateV1Procedure should handle block overrides', async () => {
  const client = createTevmNode()
  
  // Mock logger to avoid noise in tests
  client.logger.debug = vi.fn()
  client.logger.warn = vi.fn()
  
  const procedure = ethSimulateV1Procedure(client)

  const response = await procedure({
    jsonrpc: '2.0',
    id: 1,
    method: 'eth_simulateV1',
    params: [
      {
        blockStateCalls: [
          {
            from: '0x1234567890123456789012345678901234567890',
            to: '0x2345678901234567890123456789012345678901',
            data: '0x',
          },
        ],
        blockOverrides: {
          baseFeePerGas: '0x3b9aca00', // 1 Gwei
          timestamp: '0x5f8eeeb0',
        },
      },
    ],
  })

  expect(response).toHaveProperty('result')
})