import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { createTransaction } from './createTransaction.js'
import { createTevmNode } from '@tevm/node'
import { createAddress } from '@tevm/address'

// Rather than fighting with TypeScript too much, we'll use jest.mock functionality
vi.mock('@tevm/node')
vi.mock('@tevm/address')
vi.mock('@tevm/tx', () => ({
  createImpersonatedTx: vi.fn().mockReturnValue({
    hash: () => new Uint8Array([1, 2, 3, 4, 5]),
    maxFeePerGas: 10n,
    maxPriorityFeePerGas: 0n,
    gasLimit: 21000n,
    value: 0n
  })
}))
vi.mock('@tevm/utils', () => ({
  bytesToHex: vi.fn().mockReturnValue('0x0102030405'),
  EthjsAccount: class {
    constructor() {
      this.balance = 0n
      this.nonce = 0n
      this.storageRoot = '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421'
      this.codeHash = '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
    }
  },
  hexToBytes: vi.fn()
}))

describe('createTransaction', () => {
  // Create simplified mocks and a test client
  const mockPoolAdd = vi.fn().mockResolvedValue({ hash: '0x0102030405' })
  const mockPoolRemoveByHash = vi.fn()
  const mockPoolGetBySenderAddress = vi.fn().mockResolvedValue([])
  
  const mockPool = {
    add: mockPoolAdd,
    removeByHash: mockPoolRemoveByHash,
    getBySenderAddress: mockPoolGetBySenderAddress
  }
  
  const mockStateManagerGetAccount = vi.fn().mockResolvedValue({
    balance: 1000000000000000000n, // 1 ETH
    nonce: 0n,
    storageRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
    codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
  })
  
  const mockVm = {
    stateManager: {
      getAccount: mockStateManagerGetAccount,
      revert: vi.fn()
    },
    blockchain: {
      getCanonicalHeadBlock: vi.fn().mockResolvedValue({
        header: {
          calcNextBaseFee: vi.fn().mockReturnValue(10n),
          baseFeePerGas: 5n
        }
      })
    },
    common: {
      ethjsCommon: {
        param: vi.fn().mockImplementation((type, param) => {
          if (type === 'gasPrices') {
            if (param === 'txDataZero') return 4n
            if (param === 'txDataNonZero') return 16n
            if (param === 'tx') return 21000n
            if (param === 'txCreation') return 32000n
          }
          return 0n
        }),
        gteHardfork: vi.fn().mockReturnValue(true)
      }
    }
  }
  
  // Mock client methods
  const mockClient = {
    getVm: vi.fn().mockResolvedValue(mockVm),
    getTxPool: vi.fn().mockResolvedValue(mockPool),
    logger: {
      debug: vi.fn(),
      error: vi.fn()
    },
    emit: vi.fn()
  }
  
  beforeEach(() => {
    vi.clearAllMocks()
  })
  
  afterEach(() => {
    vi.restoreAllMocks()
  })

  /**
   * Basic Functionality Tests
   */
  test('successfully creates a transaction with valid inputs', async () => {
    const createTx = createTransaction(mockClient)
    
    const testAddress = '0x1234567890123456789012345678901234567890'
    const evmInput = {
      origin: createAddress(testAddress),
      to: createAddress('0xabcdef0123456789abcdef0123456789abcdef01'),
      value: 1000000000000000000n, // 1 ETH
      data: new Uint8Array([1, 2, 3, 4])
    }
    
    const evmOutput = {
      execResult: {
        executionGasUsed: 21000n,
        returnValue: new Uint8Array([]),
        gasRefund: 0n,
        exceptionError: undefined,
        gasUsed: 21000n
      }
    }
    
    const result = await createTx({ evmInput, evmOutput })
    
    // Verify transaction was created with correct parameters
    expect(createImpersonatedTx).toHaveBeenCalledWith(
      expect.objectContaining({
        impersonatedAddress: evmInput.origin,
        to: evmInput.to,
        value: evmInput.value,
        data: evmInput.data
      }),
      expect.any(Object)
    )
    
    // Verify transaction was added to the pool
    expect(mockPool.add).toHaveBeenCalled()
    
    // Verify correct txHash is returned
    expect(result).toEqual({ txHash: '0x0102030405' })
    
    // Verify 'newPendingTransaction' event is emitted
    expect(mockClient.emit).toHaveBeenCalledWith('newPendingTransaction', expect.anything())
  })

  test('creates transaction with minimum required parameters', async () => {
    const createTx = createTransaction(mockClient)
    
    // Only provide the minimum required parameters
    const evmInput = {}
    
    const evmOutput = {
      execResult: {
        executionGasUsed: 21000n,
        returnValue: new Uint8Array([]),
        gasRefund: 0n,
        exceptionError: undefined,
        gasUsed: 21000n
      }
    }
    
    await createTx({ evmInput, evmOutput })
    
    // Verify defaults are applied correctly
    expect(createImpersonatedTx).toHaveBeenCalledWith(
      expect.objectContaining({
        impersonatedAddress: expect.anything(),
        nonce: 0n,
        maxFeePerGas: expect.any(BigInt),
        maxPriorityFeePerGas: 0n
      }),
      expect.any(Object)
    )
  })

  /**
   * Parameter Handling Tests
   */
  test('handles various evmInput parameter combinations', async () => {
    const createTx = createTransaction(mockClient)
    const evmOutput = { 
      execResult: { 
        executionGasUsed: 21000n,
        returnValue: new Uint8Array([]),
        gasRefund: 0n,
        exceptionError: undefined,
        gasUsed: 21000n
      } 
    }
    
    // Test with only 'to' parameter
    await createTx({
      evmInput: { to: createAddress('0xabcdef0123456789abcdef0123456789abcdef01') },
      evmOutput
    })
    
    expect(createImpersonatedTx).toHaveBeenLastCalledWith(
      expect.objectContaining({ to: expect.anything() }),
      expect.any(Object)
    )
    
    // Test with 'to' and 'value' parameters
    await createTx({
      evmInput: {
        to: createAddress('0xabcdef0123456789abcdef0123456789abcdef01'),
        value: 100n
      },
      evmOutput
    })
    
    expect(createImpersonatedTx).toHaveBeenLastCalledWith(
      expect.objectContaining({
        to: expect.anything(),
        value: 100n
      }),
      expect.any(Object)
    )
    
    // Test with 'to', 'value', and 'data' parameters
    await createTx({
      evmInput: {
        to: createAddress('0xabcdef0123456789abcdef0123456789abcdef01'),
        value: 100n,
        data: new Uint8Array([1, 2, 3, 4])
      },
      evmOutput
    })
    
    expect(createImpersonatedTx).toHaveBeenLastCalledWith(
      expect.objectContaining({
        to: expect.anything(),
        value: 100n,
        data: expect.anything()
      }),
      expect.any(Object)
    )
  })

  test('respects custom gas parameters', async () => {
    const createTx = createTransaction(mockClient)
    const evmOutput = { 
      execResult: { 
        executionGasUsed: 21000n,
        returnValue: new Uint8Array([]),
        gasRefund: 0n,
        exceptionError: undefined,
        gasUsed: 21000n
      } 
    }
    
    // Test with custom maxFeePerGas
    await createTx({
      evmInput: {},
      evmOutput,
      maxFeePerGas: 50000n
    })
    
    expect(createImpersonatedTx).toHaveBeenLastCalledWith(
      expect.objectContaining({
        maxFeePerGas: 50000n
      }),
      expect.any(Object)
    )
    
    // Test with custom maxPriorityFeePerGas
    await createTx({
      evmInput: {},
      evmOutput,
      maxPriorityFeePerGas: 2000n
    })
    
    expect(createImpersonatedTx).toHaveBeenLastCalledWith(
      expect.objectContaining({
        maxPriorityFeePerGas: 2000n
      }),
      expect.any(Object)
    )
    
    // Test with custom gasLimit
    await createTx({
      evmInput: { gasLimit: 100000n },
      evmOutput
    })
    
    expect(createImpersonatedTx).toHaveBeenLastCalledWith(
      expect.objectContaining({
        gasLimit: 100000n
      }),
      expect.any(Object)
    )
  })

  test('handles skipBalance flag correctly', async () => {
    const createTx = createTransaction(mockClient)
    
    // Setup an account with insufficient balance
    mockStateManager.getAccount.mockResolvedValue({
      balance: 0n,
      nonce: 0n
    })
    
    const evmInput = {
      skipBalance: true,
      to: createAddress('0xabcdef0123456789abcdef0123456789abcdef01'),
      value: 1000000000000000000n // 1 ETH
    }
    
    const evmOutput = {
      execResult: {
        executionGasUsed: 21000n,
        returnValue: new Uint8Array([]),
        gasRefund: 0n,
        exceptionError: undefined,
        gasUsed: 21000n
      }
    }
    
    const result = await createTx({ evmInput, evmOutput })
    
    // Verify transaction creation succeeds despite insufficient balance
    expect(result).toEqual({ txHash: expect.any(String) })
    
    // Verify skipBalance flag is passed to pool.add
    expect(mockPool.add).toHaveBeenCalledWith(expect.anything(), false, true)
  })

  /**
   * Gas Calculation Tests
   */
  test('calculates gas fees correctly', async () => {
    const createTx = createTransaction(mockClient)
    
    // Test with empty data (all zeros)
    await createTx({
      evmInput: {
        data: new Uint8Array([0, 0, 0, 0])
      },
      evmOutput: {
        execResult: {
          executionGasUsed: 21000n,
          returnValue: new Uint8Array([]),
          gasRefund: 0n,
          exceptionError: undefined,
          gasUsed: 21000n
        }
      }
    })
    
    // Test with non-zero data
    await createTx({
      evmInput: {
        data: new Uint8Array([1, 2, 3, 4])
      },
      evmOutput: {
        execResult: {
          executionGasUsed: 21000n,
          returnValue: new Uint8Array([]),
          gasRefund: 0n,
          exceptionError: undefined,
          gasUsed: 21000n
        }
      }
    })
    
    // Verify that the proper gas calculations were made
    expect(mockCommon.ethjsCommon.param).toHaveBeenCalledWith('gasPrices', 'txDataZero')
    expect(mockCommon.ethjsCommon.param).toHaveBeenCalledWith('gasPrices', 'txDataNonZero')
    expect(mockCommon.ethjsCommon.param).toHaveBeenCalledWith('gasPrices', 'tx')
  })

  test('applies buffer to gas limit correctly', async () => {
    const createTx = createTransaction(mockClient)
    
    // Test with small gas amount
    await createTx({
      evmInput: {},
      evmOutput: {
        execResult: {
          executionGasUsed: 21000n,
          returnValue: new Uint8Array([]),
          gasRefund: 0n,
          exceptionError: undefined,
          gasUsed: 21000n
        }
      }
    })
    
    // The gas limit should be 21000 + intrinsic gas + 10% buffer
    const lastCall = createImpersonatedTx.mock.calls[createImpersonatedTx.mock.calls.length - 1]
    expect(lastCall[0].gasLimit).toBeGreaterThan(21000n)
    
    // Manually verify the calculation is roughly accurate (minimumGasLimit * 1.1)
    const expectedGasLimitWithBuffer = (21000n + 21000n) * 11n / 10n
    expect(lastCall[0].gasLimit).toEqual(expectedGasLimitWithBuffer)
  })

  test('handles manually specified gas limit correctly', async () => {
    // Mock console.warn for warning check
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    
    const createTx = createTransaction(mockClient)
    
    // Test with gasLimit higher than minimum required
    await createTx({
      evmInput: {
        gasLimit: 100000n
      },
      evmOutput: {
        execResult: {
          executionGasUsed: 21000n,
          returnValue: new Uint8Array([]),
          gasRefund: 0n,
          exceptionError: undefined,
          gasUsed: 21000n
        }
      }
    })
    
    // The specified gas limit should be used
    expect(createImpersonatedTx).toHaveBeenLastCalledWith(
      expect.objectContaining({
        gasLimit: 100000n
      }),
      expect.any(Object)
    )
    
    // No warning should be logged
    expect(consoleWarnSpy).not.toHaveBeenCalled()
    
    // Test with gasLimit lower than minimum required
    await createTx({
      evmInput: {
        gasLimit: 1000n
      },
      evmOutput: {
        execResult: {
          executionGasUsed: 21000n,
          returnValue: new Uint8Array([]),
          gasRefund: 0n,
          exceptionError: undefined,
          gasUsed: 21000n
        }
      }
    })
    
    // A warning should be logged
    expect(consoleWarnSpy).toHaveBeenCalled()
    
    consoleWarnSpy.mockRestore()
  })

  /**
   * Nonce Handling Tests
   */
  test('calculates transaction nonce correctly', async () => {
    const createTx = createTransaction(mockClient)
    
    // Test with no existing transactions
    mockPool.getBySenderAddress.mockResolvedValue([])
    mockStateManager.getAccount.mockResolvedValue({
      balance: 1000000000000000000n,
      nonce: 5n
    })
    
    await createTx({
      evmInput: {
        origin: createAddress('0x1234567890123456789012345678901234567890')
      },
      evmOutput: {
        execResult: {
          executionGasUsed: 21000n,
          returnValue: new Uint8Array([]),
          gasRefund: 0n,
          exceptionError: undefined,
          gasUsed: 21000n
        }
      }
    })
    
    // Nonce should be the account nonce
    expect(createImpersonatedTx).toHaveBeenLastCalledWith(
      expect.objectContaining({
        nonce: 5n
      }),
      expect.any(Object)
    )
    
    // Test with existing transactions in pool
    mockPool.getBySenderAddress.mockResolvedValue([{}, {}, {}]) // 3 pending txs
    
    await createTx({
      evmInput: {
        origin: createAddress('0x1234567890123456789012345678901234567890')
      },
      evmOutput: {
        execResult: {
          executionGasUsed: 21000n,
          returnValue: new Uint8Array([]),
          gasRefund: 0n,
          exceptionError: undefined,
          gasUsed: 21000n
        }
      }
    })
    
    // Nonce should be the account nonce + number of pending txs
    expect(createImpersonatedTx).toHaveBeenLastCalledWith(
      expect.objectContaining({
        nonce: 8n // 5n + 3
      }),
      expect.any(Object)
    )
  })

  /**
   * Sender Address Tests
   */
  test('handles different sender address scenarios', async () => {
    const createTx = createTransaction(mockClient)
    const evmOutput = { 
      execResult: { 
        executionGasUsed: 21000n,
        returnValue: new Uint8Array([]),
        gasRefund: 0n,
        exceptionError: undefined,
        gasUsed: 21000n
      } 
    }
    
    // Test with explicit origin
    await createTx({
      evmInput: {
        origin: createAddress('0x1234567890123456789012345678901234567890')
      },
      evmOutput
    })
    
    expect(createImpersonatedTx).toHaveBeenLastCalledWith(
      expect.objectContaining({
        impersonatedAddress: expect.objectContaining({
          toString: expect.any(Function)
        })
      }),
      expect.any(Object)
    )
    
    // Test with explicit caller but no origin
    await createTx({
      evmInput: {
        caller: createAddress('0xabcdef0123456789abcdef0123456789abcdef01')
      },
      evmOutput
    })
    
    // Test with neither origin nor caller (should use zero address)
    await createTx({
      evmInput: {},
      evmOutput
    })
    
    // Verify zero address is used when neither is provided
    expect(createAddress).toHaveBeenCalledWith(0)
  })

  /**
   * Error Handling Tests
   */
  test('handles insufficient balance correctly with throwOnFail=false', async () => {
    const createTx = createTransaction(mockClient)
    
    // Setup an account with zero balance
    mockStateManager.getAccount.mockResolvedValue({
      balance: 0n,
      nonce: 0n
    })
    
    const result = await createTx({
      evmInput: {
        origin: createAddress('0x1234567890123456789012345678901234567890'),
        skipBalance: false // don't skip balance check
      },
      evmOutput: {
        execResult: {
          executionGasUsed: 21000n,
          returnValue: new Uint8Array([]),
          gasRefund: 0n,
          exceptionError: undefined,
          gasUsed: 21000n
        }
      },
      throwOnFail: false
    })
    
    // Verify proper error is returned
    expect(result).toEqual({
      errors: [
        expect.objectContaining({
          _tag: 'InsufficientBalance',
          name: 'InsufficientBalance'
        })
      ]
    })
    
    // Verify transaction is not added to pool
    expect(mockPool.add).not.toHaveBeenCalled()
  })

  test('handles insufficient balance correctly with throwOnFail=true', async () => {
    const createTx = createTransaction(mockClient)
    
    // Setup an account with zero balance
    mockStateManager.getAccount.mockResolvedValue({
      balance: 0n,
      nonce: 0n
    })
    
    // Should throw an error
    await expect(async () => {
      await createTx({
        evmInput: {
          origin: createAddress('0x1234567890123456789012345678901234567890'),
          skipBalance: false // don't skip balance check
        },
        evmOutput: {
          execResult: {
            executionGasUsed: 21000n,
            returnValue: new Uint8Array([]),
            gasRefund: 0n,
            exceptionError: undefined,
            gasUsed: 21000n
          }
        },
        throwOnFail: true
      })
    }).rejects.toThrow(/InsufficientBalance/)
  })

  test('handles account not found error correctly', async () => {
    const createTx = createTransaction(mockClient)
    
    // Mock account not found
    mockStateManager.getAccount.mockRejectedValue({
      _tag: 'AccountNotFoundError',
      message: 'Account not found'
    })
    
    mockPool.add.mockRejectedValue({
      _tag: 'AccountNotFoundError',
      message: 'Account not found'
    })
    
    const result = await createTx({
      evmInput: {
        origin: createAddress('0x1234567890123456789012345678901234567890')
      },
      evmOutput: {
        execResult: {
          executionGasUsed: 21000n,
          returnValue: new Uint8Array([]),
          gasRefund: 0n,
          exceptionError: undefined,
          gasUsed: 21000n
        }
      },
      throwOnFail: false
    })
    
    // Verify NoBalanceError is returned
    expect(result).toEqual(expect.objectContaining({
      errors: [
        expect.objectContaining({
          _tag: 'NoBalanceError',
          name: 'NoBalanceError'
        })
      ]
    }))
  })

  test('handles unexpected errors gracefully', async () => {
    const createTx = createTransaction(mockClient)
    
    // Mock an unexpected error from pool.add
    mockPool.add.mockRejectedValue(new Error('Unexpected error'))
    
    const result = await createTx({
      evmInput: {
        origin: createAddress('0x1234567890123456789012345678901234567890')
      },
      evmOutput: {
        execResult: {
          executionGasUsed: 21000n,
          returnValue: new Uint8Array([]),
          gasRefund: 0n,
          exceptionError: undefined,
          gasUsed: 21000n
        }
      },
      throwOnFail: false
    })
    
    // Verify transaction is removed from pool
    expect(mockPool.removeByHash).toHaveBeenCalled()
    
    // Verify state is reverted
    expect(mockStateManager.revert).toHaveBeenCalled()
    
    // Verify proper error message is returned
    expect(result).toEqual(expect.objectContaining({
      errors: [
        expect.objectContaining({
          name: 'UnexpectedError',
          message: 'Unexpected error'
        })
      ]
    }))
  })

  /**
   * Transaction Creation Tests
   */
  test('handles contract creation transactions correctly', async () => {
    const createTx = createTransaction(mockClient)
    
    // Test a contract creation transaction (no 'to' address)
    await createTx({
      evmInput: {
        data: new Uint8Array([1, 2, 3, 4]),
        value: 0n
      },
      evmOutput: {
        execResult: {
          executionGasUsed: 21000n,
          returnValue: new Uint8Array([]),
          gasRefund: 0n,
          exceptionError: undefined,
          gasUsed: 21000n
        }
      }
    })
    
    // Verify txCreation fee is checked
    expect(mockCommon.ethjsCommon.gteHardfork).toHaveBeenCalledWith('homestead')
    expect(mockCommon.ethjsCommon.param).toHaveBeenCalledWith('gasPrices', 'txCreation')
  })

  /**
   * Block and Fee Calculation Tests
   */
  test('calculates maxFeePerGas correctly', async () => {
    const createTx = createTransaction(mockClient)
    
    // Set up the mock to return different values
    mockHeader.calcNextBaseFee.mockReturnValue(7n)
    mockHeader.baseFeePerGas = 10n
    
    await createTx({
      evmInput: {},
      evmOutput: {
        execResult: {
          executionGasUsed: 21000n,
          returnValue: new Uint8Array([]),
          gasRefund: 0n,
          exceptionError: undefined,
          gasUsed: 21000n
        }
      }
    })
    
    // maxFeePerGas should be at least baseFeePerGas
    expect(createImpersonatedTx).toHaveBeenLastCalledWith(
      expect.objectContaining({
        maxFeePerGas: 10n // should use baseFeePerGas since it's higher than calcNextBaseFee
      }),
      expect.any(Object)
    )
    
    // Now set baseFeePerGas lower
    mockHeader.calcNextBaseFee.mockReturnValue(15n)
    mockHeader.baseFeePerGas = 10n
    
    await createTx({
      evmInput: {},
      evmOutput: {
        execResult: {
          executionGasUsed: 21000n,
          returnValue: new Uint8Array([]),
          gasRefund: 0n,
          exceptionError: undefined,
          gasUsed: 21000n
        }
      }
    })
    
    // maxFeePerGas should be calcNextBaseFee + priorityFee
    expect(createImpersonatedTx).toHaveBeenLastCalledWith(
      expect.objectContaining({
        maxFeePerGas: 15n
      }),
      expect.any(Object)
    )
  })

  /**
   * Edge Cases and Special Scenarios
   */
  test('handles zero-value transfers correctly', async () => {
    const createTx = createTransaction(mockClient)
    
    await createTx({
      evmInput: {
        to: createAddress('0xabcdef0123456789abcdef0123456789abcdef01'),
        value: 0n
      },
      evmOutput: {
        execResult: {
          executionGasUsed: 21000n,
          returnValue: new Uint8Array([]),
          gasRefund: 0n,
          exceptionError: undefined,
          gasUsed: 21000n
        }
      }
    })
    
    // Verify the transaction is created with value=0
    expect(createImpersonatedTx).toHaveBeenLastCalledWith(
      expect.objectContaining({
        value: 0n
      }),
      expect.any(Object)
    )
  })
})