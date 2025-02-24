import { describe, it, expect } from 'vitest'
import { createCommon } from '@tevm/common'
import { mainnet } from 'viem/chains'
import { createMemoryClient } from 'tevm'
import { VM } from '@ethereumjs/vm'

describe('@tevm/common', () => {
  describe('Basic Usage', () => {
    it('should create common instance from preset chain', () => {
      const client = createMemoryClient({
        common: createCommon({ ...mainnet })
      })
      expect(client).toBeDefined()
    })

    it('should create common instance with custom configuration', () => {
      const customCommon = createCommon({
        ...mainnet,
        hardfork: 'london',
        eips: [1559, 4895],
        loggingLevel: 'debug'
      })
      expect(customCommon).toBeDefined()
      expect(customCommon.id).toBe(mainnet.id)
    })
  })

  describe('Custom Chain Configuration', () => {
    it('should create common instance with custom chain', () => {
      const myChainCommon = createCommon({
        id: 1234,
        name: 'My Custom Chain',
        nativeCurrency: {
          name: 'My Token',
          symbol: 'MTK',
          decimals: 18
        },
        rpcUrls: {
          default: {
            http: ['https://my-chain-rpc.example.com']
          }
        },
        hardfork: 'london',
        eips: [1559]
      })

      expect(myChainCommon).toBeDefined()
      expect(myChainCommon.id).toBe(1234)
      expect(myChainCommon.name).toBe('My Custom Chain')
      expect(myChainCommon.nativeCurrency.symbol).toBe('MTK')
    })
  })

  describe('EthereumJS Integration', () => {
    it('should work with EthereumJS VM', () => {
      const common = createCommon({
        ...mainnet
      })

      const vm = new VM({
        common: common.ethjsCommon
      })

      expect(vm).toBeDefined()
    })
  })

  describe('Common Properties', () => {
    it('should have all required properties', () => {
      const common = createCommon({ ...mainnet })

      expect(common.id).toBeDefined()
      expect(common.name).toBeDefined()
      expect(common.nativeCurrency).toBeDefined()
      expect(common.rpcUrls).toBeDefined()
      expect(common.ethjsCommon).toBeDefined()
      expect(typeof common.copy).toBe('function')
    })

    it('should support copying', () => {
      const common = createCommon({ ...mainnet })
      const copy = common.copy()

      expect(copy).toBeDefined()
      expect(copy.id).toBe(common.id)
      expect(copy.name).toBe(common.name)
    })
  })
})