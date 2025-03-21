import { createAddress } from '@tevm/address'
import { SimpleContract } from '@tevm/contract'
import { createTevmNode } from '@tevm/node'
import { expect, it, describe, vi, beforeEach } from 'vitest'
import { callHandler } from '../Call/callHandler.js'
import { deployHandler } from '../Deploy/deployHandler.js'
import { debugTraceTransactionJsonRpcProcedure } from './debugTraceTransactionProcedure.js'
import { traceCallHandler } from './traceCallHandler.js'

// Mock the traceCallHandler for the prestateTracer test
vi.mock('./traceCallHandler.js', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    traceCallHandler: vi.fn(),
  }
})

describe('debugTraceTransactionJsonRpcProcedure', () => {
  it('should trace a transaction with callTracer and return the expected result', async () => {
    const client = createTevmNode({ miningConfig: { type: 'auto' } })
    const procedure = debugTraceTransactionJsonRpcProcedure(client)

    const contract = SimpleContract.withAddress(createAddress(420).toString())

    await deployHandler(client)(contract.deploy(1n))

    const sendTxResult = await callHandler(client)({
      createTransaction: true,
      ...contract.write.set(69n),
    })

    if (!sendTxResult.txHash) {
      throw new Error('Transaction failed')
    }

    const result = await procedure({
      jsonrpc: '2.0',
      method: 'debug_traceTransaction',
      params: [
        {
          transactionHash: sendTxResult.txHash,
          tracer: 'callTracer',
        },
      ],
      id: 1,
    })

    expect(result).toMatchInlineSnapshot(`
    {
      "id": 1,
      "jsonrpc": "2.0",
      "method": "debug_traceTransaction",
      "result": {
        "failed": false,
        "gas": "0x0",
        "returnValue": "0x",
        "structLogs": [],
      },
    }
    `)
  })

  describe('with prestateTracer', () => {
    const mockClient = {
      getVm: vi.fn(),
      logger: {
        debug: vi.fn(),
        warn: vi.fn(),
      }
    }
    const mockTraceCallHandlerFn = vi.fn()

    beforeEach(() => {
      vi.clearAllMocks()
      vi.mocked(traceCallHandler).mockReturnValue(mockTraceCallHandlerFn)
    })

    it('should handle prestateTracer with diffMode enabled', async () => {
      // Mock getTransactionByHash response
      const mockRequestProcedure = vi.fn().mockResolvedValue({
        result: {
          blockHash: '0x123',
          blockNumber: '0x1',
          from: '0xd2e286c3caa5dcfa12066cf52dd0102542a59200',
          to: '0xeb0329ac1833221883a8644de6765ccec678f312',
          gas: '0x5208',
          gasPrice: '0x3b9aca00',
          value: '0x1',
          data: '0x',
          transactionIndex: '0x0',
        }
      })

      // Setup mock VM and blockchain
      const mockVm = {
        blockchain: {
          getBlock: vi.fn().mockImplementation((hash) => {
            // For block hash
            if (Buffer.isBuffer(hash) && hash.toString('hex') === '123') {
              return {
                header: { parentHash: Buffer.from('parent', 'utf8') },
                transactions: []
              }
            }
            // For parent hash
            return {
              header: { stateRoot: Buffer.from('stateRoot', 'utf8') }
            }
          }),
        },
        stateManager: {
          hasStateRoot: vi.fn().mockResolvedValue(true),
          setStateRoot: vi.fn().mockResolvedValue(undefined)
        },
        deepCopy: vi.fn().mockReturnValue({
          blockchain: {
            getBlock: vi.fn(),
          },
          stateManager: {
            setStateRoot: vi.fn().mockResolvedValue(undefined)
          },
          common: {
            ethjsCommon: {}
          }
        })
      }

      mockClient.getVm.mockResolvedValue(mockVm)

      // Mock the prestateTracer result
      mockTraceCallHandlerFn.mockResolvedValue({
        pre: {
          "0x4200000000000000000000000000000000000011": {
            balance: "0xcb14256436473d124",
            code: "0x60806040526004361061005e5760003560e01c",
          },
          "0xd2e286c3caa5dcfa12066cf52dd0102542a59200": {
            balance: "0x67d880ab2fdc18",
            nonce: 4908,
          }
        },
        post: {
          "0x4200000000000000000000000000000000000011": {
            balance: "0xcb142564364a39f9e",
          },
          "0xd2e286c3caa5dcfa12066cf52dd0102542a59200": {
            balance: "0x67d8439911139c",
            nonce: 4909,
          }
        }
      })

      const procedure = debugTraceTransactionJsonRpcProcedure({ 
        ...mockClient, 
        requestProcedure: () => mockRequestProcedure 
      })

      const result = await procedure({
        jsonrpc: '2.0',
        method: 'debug_traceTransaction',
        params: [
          {
            transactionHash: '0x6c807c8cec03f38e3c9cf460306734c491553a9d089d31c511f6b7ab95fa0f3e',
            tracer: 'prestateTracer',
            tracerConfig: {
              diffMode: true
            }
          }
        ],
        id: 2
      })

      // Assert that we called traceCallHandler with the right params
      expect(traceCallHandler).toHaveBeenCalledWith(expect.anything())
      expect(mockTraceCallHandlerFn).toHaveBeenCalledWith(expect.objectContaining({
        tracer: 'prestateTracer',
        tracerConfig: {
          diffMode: true
        }
      }))

      // Verify result format - it should match the structure from the example
      expect(result).toEqual({
        jsonrpc: '2.0',
        method: 'debug_traceTransaction',
        id: 2,
        result: {
          pre: {
            "0x4200000000000000000000000000000000000011": {
              balance: "0xcb14256436473d124",
              code: "0x60806040526004361061005e5760003560e01c",
            },
            "0xd2e286c3caa5dcfa12066cf52dd0102542a59200": {
              balance: "0x67d880ab2fdc18",
              nonce: 4908,
            }
          },
          post: {
            "0x4200000000000000000000000000000000000011": {
              balance: "0xcb142564364a39f9e",
            },
            "0xd2e286c3caa5dcfa12066cf52dd0102542a59200": {
              balance: "0x67d8439911139c",
              nonce: 4909,
            }
          }
        }
      })
    })
  })
})