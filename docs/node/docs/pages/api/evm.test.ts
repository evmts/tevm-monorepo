import { describe, it, expect } from 'vitest'
import { createEvm } from '@tevm/evm'
import { mainnet } from '@tevm/common'
import { createStateManager } from '@tevm/state'
import { createBlockchain } from '@tevm/blockchain'
import { definePrecompile, defineCall } from '@tevm/precompiles'

describe('@tevm/evm', () => {
  describe('Evm Class', () => {
    it('should create an EVM instance', async () => {
      const evm = await createEvm({
        common: mainnet,
        stateManager: createStateManager({}),
        blockchain: await createBlockchain({ common: mainnet }),
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
        blockchain: await createBlockchain({ common: mainnet }),
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
        blockchain: await createBlockchain({ common: mainnet }),
      })

      const MyContract = {
        abi: [],
      }

      const customPrecompile = definePrecompile({
        address: '0xf2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2',
        contract: MyContract,
        call: defineCall(MyContract.abi, {
          myFunction: async ({ args }) => {
            return {
              returnValue: new Uint8Array(),
              executionGasUsed: 0n
            }
          }
        })
      })

      evm.addCustomPrecompile(customPrecompile)
      expect(evm.getPrecompile('0xf2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2')).toBeDefined()
    })
  })

  describe('Events and Debugging', () => {
    it('should enable debug logging and get performance logs', async () => {
      const evm = await createEvm({
        common: mainnet,
        stateManager: createStateManager({}),
        blockchain: await createBlockchain({ common: mainnet }),
        loggingLevel: 'trace'
      })

      const logs = evm.getPerformanceLogs()
      expect(logs.opcodes).toBeDefined()
      expect(logs.precompiles).toBeDefined()
    })
  })
})