import { describe, it, expect, vi, beforeAll } from 'vitest'
import { createTevmEvm, TevmEvm } from './index'

// Mock the WASM module
vi.mock('../pkg/tevm_revm.js', () => {
  return {
    default: vi.fn().mockResolvedValue(undefined),
    TevmEVM: vi.fn().mockImplementation(() => ({
      set_account_balance: vi.fn().mockResolvedValue(undefined),
      set_account_code: vi.fn().mockResolvedValue(undefined),
      call: vi.fn().mockImplementation((_) => {
        // Simple mock that returns successful result
        return JSON.stringify({
          success: true,
          gas_used: '21000',
          return_value: '0x0000000000000000000000000000000000000000000000000000000000000042',
          error: null
        })
      }),
      reset: vi.fn().mockReturnValue(undefined)
    }))
  }
})

describe('TevmEvm', () => {
  let evm: TevmEvm

  beforeAll(async () => {
    evm = createTevmEvm()
    await evm.init()
  })

  it('should initialize properly', () => {
    expect(evm).toBeInstanceOf(TevmEvm)
  })

  it('should set account balance', async () => {
    await expect(evm.setAccountBalance(
      '0x1234567890123456789012345678901234567890',
      '1000000000000000000'
    )).resolves.not.toThrow()
  })

  it('should set account code', async () => {
    await expect(evm.setAccountCode(
      '0x1234567890123456789012345678901234567890',
      '0x6080604052348015600f57600080fd5b5060948061001e6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c8063771602f714602d575b600080fd5b603c6038366004605c565b604e565b60405190815260200160405180910390f35b6000818301905092915050565b80356001600160a01b0381168114607857600080fd5b919050565b600080604083850312156090576090565b604081013592509050939250505056fea26469706673582212209cef3dd33d8ddd3b560b511ae38bbe8e0a4de2a93b9b04bd4a2bdcf2cb4ca6f264736f6c634300080c0033'
    )).resolves.not.toThrow()
  })

  it('should execute a call', async () => {
    const result = await evm.call({
      from: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      to: '0x1234567890123456789012345678901234567890',
      gasLimit: '1000000',
      value: '0',
      data: '0x771602f7000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000014'
    })

    expect(result).toEqual({
      success: true,
      gasUsed: '21000',
      returnValue: '0x0000000000000000000000000000000000000000000000000000000000000042',
      error: undefined
    })
  })

  it('should reset the EVM state', async () => {
    await expect(evm.reset()).resolves.not.toThrow()
  })
})