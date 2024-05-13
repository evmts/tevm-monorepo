import { describe, expect, it } from 'bun:test'
import { createL1Client } from '../index.js'

describe('createL1Client', () => {
  it('Should initialize a memory client syncronously with a ready function to see when client is ready', async () => {
    const client = createL1Client()
    expect(client._tevm.mode).toBe('normal')
    expect(await client.tevmReady()).toBeTruthy()
  })

  it('should deploy a lot of contracts', async () => {
    const client = createL1Client()

    expect(await client.tevmReady()).toBeTruthy()

    const accounts = await Promise.all([
      client.tevmGetAccount(client.op.L1Erc721Bridge),
      client.tevmGetAccount(client.op.SuperchainConfig),
      client.tevmGetAccount(client.op.L1CrossDomainMessenger),
      client.tevmGetAccount(client.op.L1StandardBridge),
      client.tevmGetAccount(client.op.L2OutputOracle),
      client.tevmGetAccount(client.op.OptimismPortal2),
      client.tevmGetAccount(client.op.DisputeGameFactory),
      client.tevmGetAccount(client.op.SystemConfig),
      client.tevmGetAccount(client.op.OptimismMintableERC20Factory),
    ])

    // every account should have a contract
    expect(accounts.map((account) => account.isContract).every(Boolean)).toBeTruthy()
  })
})
