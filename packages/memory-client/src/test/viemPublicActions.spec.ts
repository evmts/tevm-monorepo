import { beforeEach, describe, expect, it } from 'bun:test'
import { simpleContract } from '@tevm/test-utils'
import { type PublicActions, encodeFunctionData } from 'viem'
import type { MemoryClient } from '../MemoryClient.js'
import { createMemoryClient } from '../createMemoryClient.js'

describe('viemPublicActions', () => {
  let mc: MemoryClient
  let c = {
    simpleContract: simpleContract.withAddress(`0x${'00'.repeat(20)}`),
  }

  beforeEach(async () => {
    mc = createMemoryClient()
    const deployResult = await mc.tevmDeploy({
      bytecode: simpleContract.bytecode,
      abi: simpleContract.abi,
      args: [420n],
    })
    if (!deployResult.createdAddress) {
      throw new Error('contract never deployed')
    }
    c = {
      simpleContract: simpleContract.withAddress(deployResult.createdAddress),
    }
    await mc.tevmMine()
  })

  const tests: Record<keyof PublicActions, () => void> = {
    call: () => {
      it('should work', async () => {
        expect(
          await mc.call({
            to: c.simpleContract.address,
            data: encodeFunctionData(simpleContract.read.get()),
          }),
        ).toEqual({
          data: '0x00000000000000000000000000000000000000000000000000000000000001a4',
        })
      })
    },
    createBlockFilter: () => {
      it.todo('not supported')
    },
    createContractEventFilter: () => {
      it.todo('not supported')
    },
    createEventFilter: () => {
      it.todo('not supported')
    },
    createPendingTransactionFilter: () => {
      it.todo('not supported')
    },
    estimateContractGas: () => {
      it('should work', async () => {
        expect(await mc.estimateContractGas(c.simpleContract.write.set(69n))).toBe(16771823n)
      })
    },
    estimateFeesPerGas: () => { },
    estimateGas: () => { },
    estimateMaxPriorityFeePerGas: () => { },
    getBalance: () => { },
    getBlobBaseFee: () => { },
    getBlock: () => { },
    getBlockNumber: () => { },
    getBlockTransactionCount: () => { },
    getBytecode: () => { },
    getChainId: () => { },
    getContractEvents: () => { },
    getEnsAddress: () => { },
    getEnsAvatar: () => { },
    getEnsName: () => { },
    getEnsResolver: () => { },
    getEnsText: () => { },
    getFeeHistory: () => { },
    getFilterChanges: () => { },
    getFilterLogs: () => { },
    getGasPrice: () => { },
    getLogs: () => { },
    getProof: () => { },
    getStorageAt: () => { },
    getTransaction: () => { },
    getTransactionConfirmations: () => { },
    getTransactionCount: () => { },
    getTransactionReceipt: () => { },
    multicall: () => { },
    prepareTransactionRequest: () => { },
    readContract: () => { },
    sendRawTransaction: () => { },
    simulateContract: () => { },
    uninstallFilter: () => { },
    verifyMessage: () => { },
    verifyTypedData: () => { },
    watchContractEvent: () => { },
    waitForTransactionReceipt: () => { },
    watchBlockNumber: () => { },
    watchBlocks: () => { },
    watchEvent: () => { },
    watchPendingTransactions: () => { },
  }

  Object.entries(tests).forEach(([actionName, actionTests]) => {
    describe(actionName, actionTests)
  })
})
