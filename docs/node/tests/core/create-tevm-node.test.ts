import { describe, it, expect } from 'vitest'
import { createContract, createTevmNode, http, parseAbi } from 'tevm'
import { definePrecompile } from 'tevm'

describe('Create Tevm Node', () => {
  describe('Basic Node Creation', () => {
    it('should create a basic node instance', async () => {
      const node = createTevmNode()
      await node.ready()
      expect(node).toBeDefined()
    })
  })

  describe('Fork Configuration', () => {
    it('should create a forked node', async () => {
      const node = createTevmNode({
        fork: {
          transport: http('https://mainnet.infura.io/v3/YOUR-KEY')({}),
          blockTag: 17_000_000n,
        },
      })
      await node.ready()
      expect(node).toBeDefined()
    })
  })

  describe('Mining Configuration', () => {
    it('should configure auto mining', async () => {
      const node = createTevmNode({
        miningConfig: {
          type: 'auto', // Mine a block for every transaction
        },
      })
      await node.ready()
      expect(node.miningConfig.type).toBe('auto')
    })

    it('should configure interval mining', async () => {
      const node = createTevmNode({
        miningConfig: {
          type: 'interval',
          interval: 12_000, // Mine every 12 seconds
        },
      })
      await node.ready()
      expect(node.miningConfig.type).toBe('interval')
      expect(node.miningConfig.type === 'interval' && node.miningConfig.interval).toBe(12_000)
    })
  })

  describe('Custom Precompiles', () => {
    it('should add custom precompiles', async () => {
      const myPrecompile = definePrecompile({
        contract: createContract({
          abi: parseAbi([
            'function add(uint256 a, uint256 b) returns (uint256)',
            'function subtract(uint256 a, uint256 b) returns (uint256)'
          ]),
          address: '0xf2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2'
        }),
        call: async ({ data, gasLimit }) => {
          console.log(data, gasLimit)
          return {
            returnValue: new Uint8Array([0x01]),
            executionGasUsed: 200n,
          }
        },
      })

      const node = createTevmNode({
        customPrecompiles: [myPrecompile.precompile()],
      })
      await node.ready()
      expect(node).toBeDefined()
    })
  })

  describe('Performance Profiling', () => {
    it('should enable profiler', async () => {
      const node = createTevmNode({
        profiler: true,
      })
      await node.ready()

      const vm = await node.getVm()
      const logs = vm.evm.getPerformanceLogs()
      expect(logs).toBeDefined()
    })
  })

  describe('Example Configurations', () => {
    it('should create local development node', async () => {
      const devNode = createTevmNode({
        miningConfig: { type: 'auto' },
        loggingLevel: 'debug',
        allowUnlimitedContractSize: true,
      })
      await devNode.ready()
      expect(devNode).toBeDefined()
    })

    it('should create production forked node', async () => {
      const prodNode = createTevmNode({
        fork: {
          transport: http('https://mainnet.infura.io/v3/YOUR-KEY')({}),
          blockTag: 'latest',
        },
        miningConfig: { type: 'interval', interval: 12000 },
        loggingLevel: 'error',
      })
      await prodNode.ready()
      expect(prodNode).toBeDefined()
    })

    it('should create testing node', async () => {
      const testNode = createTevmNode({
        miningConfig: { type: 'auto' },
        profiler: true,
      })
      await testNode.ready()
      expect(testNode).toBeDefined()
    })
  })

  describe('Error Handling', () => {
    it('should handle initialization errors', async () => {
      try {
        const node = createTevmNode()
        await node.ready()
      } catch (error) {
        console.error('Node initialization failed:', error)
      }
    })
  })

})