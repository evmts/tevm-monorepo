import { bench, describe, expect } from 'vitest'
import { deployContractWithCall, deployContractWithViem } from './deployContract.js'

describe('various methods for deploying contracts', async () => {
  bench('MemoryClient.call using encodeDeploymentArgs', async () => {
    expect(await deployContractWithCall(420n)).toEqual(420n)
  })
  // Uncomment once receipts are available
  // https://github.com/evmts/tevm-monorepo/pulls
  bench.skip('Using viem deployContract action', async () => {
    expect(await deployContractWithViem(420n)).toEqual(420n)
  })
})
