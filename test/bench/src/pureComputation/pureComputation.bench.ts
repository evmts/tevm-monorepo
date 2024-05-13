import { bench, describe, expect } from 'vitest'
import { pureComputationSol, pureComputationTs, tevm } from './pureComputation.js'

const FIB_50 = 12_586_269_025n
const FIB_200 = 280571172992510140037611932413038677189525n

describe('import("@tevm/memory-client").createMemoryClient().script - pure computation no state access', async () => {
  // wait for tevm to initialize so we don't measure that
  await tevm.tevmReady()
  bench('should do fibanci(3) computation in solidity', async () => {
    expect(await pureComputationSol(3n)).toEqual(2n)
  })
  bench('should do fibanci(3) computation in typescript', async () => {
    expect(pureComputationTs(3n)).toEqual(2n)
  })
  bench('should do fibanci(50) computation in solidity', async () => {
    expect(await pureComputationSol(50n)).toEqual(FIB_50)
  })
  bench('should do fibanci(50) computation in typescript', async () => {
    expect(pureComputationTs(50n)).toEqual(FIB_50)
  })
  bench('should do fibanci(420) computation in solidity', async () => {
    expect(await pureComputationSol(200n)).toEqual(FIB_200)
  })
  bench('should do fibanci(420) computation in typescript', async () => {
    expect(pureComputationTs(200n)).toEqual(FIB_200)
  })
})
