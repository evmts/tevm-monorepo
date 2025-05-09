import { describe, it, expect, beforeAll, vi } from 'vitest'
import { EvmRsWrapper } from './index.js'

// Mock the WASM module since we won't actually compile it during tests
vi.mock('../pkg/evm_rs.js', async () => {
  const mockInterpreter = {
    get_version: () => '0.1.0',
    interpret: (bytecode: string) => `Will interpret bytecode in future: ${bytecode}`
  }

  return {
    default: vi.fn().mockResolvedValue(undefined),
    greet: (name: string) => `Hello, ${name}! This is evm-rs from WASM!`,
    EvmInterpreter: vi.fn().mockImplementation(() => mockInterpreter)
  }
})

describe('EvmRsWrapper', () => {
  let wrapper: EvmRsWrapper

  beforeAll(async () => {
    wrapper = await EvmRsWrapper.init()
  })

  it('should initialize correctly', () => {
    expect(wrapper).toBeInstanceOf(EvmRsWrapper)
  })

  it('should return a greeting', () => {
    const greeting = wrapper.greet('Tevm')
    expect(greeting).toContain('Hello, Tevm')
    expect(greeting).toContain('from WASM')
  })

  it('should return version', () => {
    const version = wrapper.getVersion()
    expect(version).toBe('0.1.0')
  })

  it('should handle bytecode interpretation (placeholder)', () => {
    const result = wrapper.interpret('0x60806040')
    expect(result).toContain('Will interpret bytecode')
    expect(result).toContain('0x60806040')
  })
})