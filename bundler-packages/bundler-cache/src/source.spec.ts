import { describe, expect, it, vi } from 'vitest'

// Mock the wagmi hooks
vi.mock('wagmi', () => ({
  useAccount: vi.fn(() => ({
    address: '0x1234567890123456789012345678901234567890',
    isConnected: true
  })),
  useContractRead: vi.fn(({ enabled }) => ({
    data: enabled ? BigInt(100) : undefined
  }))
}))

// Mock the TestContract
vi.mock('../TestContract.js', () => ({
  TestContract: {
    read: () => ({
      balanceOf: () => ({ abi: [], address: '0x1234', args: [] }),
      totalSupply: () => ({ abi: [], address: '0x1234', args: [] }),
      symbol: () => ({ abi: [], address: '0x1234', args: [] })
    })
  }
}))

import { WagmiReads } from '../source.js'

describe('WagmiReads', () => {
  it('should return contract data when connected', () => {
    const result = WagmiReads()
    
    expect(result).toEqual({
      testBalance: BigInt(100),
      symbol: BigInt(100),
      totalSupply: BigInt(100)
    })
  })
})