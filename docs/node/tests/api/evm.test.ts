import { describe, it, expect } from 'vitest'
import { createEvm } from 'tevm/evm'
import { mainnet } from 'tevm/common'
import { createStateManager } from 'tevm/state'
import { createChain } from 'tevm/blockchain'
import { definePrecompile, defineCall, createContract, parseAbi } from 'tevm'
import { createAddress } from 'tevm/address'

describe('@tevm/evm', () => {
  describe('Evm Class', () => {
    it('should create an EVM instance', async () => {
      const evm = await createEvm({
        common: mainnet,
        stateManager: createStateManager({}),
        blockchain: await createChain({ common: mainnet }),
      })

      expect(evm).toBeDefined()
      expect(evm.runCall).toBeDefined()
      expect(evm.addCustomPrecompile).toBeDefined()
      expect(evm.removeCustomPrecompile).toBeDefined()
      expect(evm.getActiveOpcodes).toBeDefined()
      expect(evm.getPrecompile).toBeDefined()
    })

    it('should create an EVM instance with all options', async () => {
      const evm = await createEvm({
        common: mainnet,
        stateManager: createStateManager({}),
        blockchain: await createChain({ common: mainnet }),
        customPrecompiles: [],
        profiler: false,
        loggingLevel: 'warn',
      })

      expect(evm).toBeDefined()
    })
  })

  describe('Custom Precompiles', () => {
    it('should add custom precompiles', async () => {
      const evm = await createEvm({
        common: mainnet,
        stateManager: createStateManager({}),
        blockchain: await createChain({ common: mainnet }),
      })

      const MyContract = createContract({
        address: createAddress(2424).toString(),
        abi: parseAbi([
          'function addTwo(uint256) returns (uint256)',
        ])
      })

      const customPrecompile = definePrecompile({
        contract: MyContract,
        call: defineCall(MyContract.abi, {
          addTwo: async ({ args }) => {
            return {
              returnValue: args[0] + 5n,
              executionGasUsed: 0n
            }
          }
        })
      })

      evm.addCustomPrecompile(customPrecompile.precompile())
      expect(evm.getPrecompile(createAddress('0xf2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2'))).toBeDefined()
    })
  })

  describe('Events and Debugging', () => {
    it('should enable debug logging and get performance logs', async () => {
      const evm = await createEvm({
        common: mainnet,
        stateManager: createStateManager({}),
        blockchain: await createChain({ common: mainnet }),
        loggingLevel: 'trace'
      })

      const logs = evm.getPerformanceLogs()
      expect(logs.opcodes).toBeDefined()
      expect(logs.precompiles).toBeDefined()
    })
  })
})