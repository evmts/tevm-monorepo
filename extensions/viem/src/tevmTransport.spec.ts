import { createMemoryClient } from '@tevm/memory-client'
import { describe, expect, it } from 'bun:test'
import { createPublicClient, numberToHex } from 'viem'
import { tevmTransport } from './tevmTransport.js'
import { createContract } from '@tevm/contract'

const daiContract = createContract({
  name: 'DAI',
  humanReadableAbi: [
    'function balanceOf(address) view returns (uint256)',
  ]
} as const).withAddress('0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1')

describe('memoryTransport', () => {
  it('creates a new transport instance', async () => {
    const tevm = await createMemoryClient({
      fork: { url: 'https://mainnet.optimism.io' }
    })

    const client = createPublicClient({
      transport: tevmTransport(tevm, { name: 'test name', key: 'testkey' })
    })

    expect(client.transport.name).toBe('test name')
    expect(client.transport.key).toBe('testkey')
  })

  it('can be used as backend to publicClient', async () => {
    const tevm = await createMemoryClient({
      fork: { url: 'https://mainnet.optimism.io' }
    })

    const client = createPublicClient({
      transport: tevmTransport(tevm, { name: 'test name', key: 'testkey' })
    })

    expect(client.transport.name).toBe('test name')
    expect(client.transport.key).toBe('testkey')

    expect(
      await client.getChainId()
    ).toBe(10)
    expect(
      await client.getBytecode(daiContract)
    ).toBe('0x0')
    expect(
      await client.readContract(
        daiContract.read.balanceOf(`0x${'69'.repeat(20)}`)
      )
    ).toBe(0n)
  })

  it('can do tevm requests', async () => {
    const tevm = await createMemoryClient({
      fork: { url: 'https://mainnet.optimism.io' }
    })

    const client = createPublicClient({
      transport: tevmTransport(tevm, { name: 'test name', key: 'testkey' })
    })

    expect(client.transport.name).toBe('test name')
    expect(client.transport.key).toBe('testkey')

    expect(
      await client.getChainId()
    ).toBe(10)

    expect(await client.request({
      method: 'tevm_setAccount' as any,
      params: {
        address: `0x${'69'.repeat(20)}`,
        balance: numberToHex(420n),
        deployedBytecode: daiContract.deployedBytecode,
      } as any
    })).toBe({} as any)
    const result: any = await client.request({
      method: 'tevm_getAccount' as any,
      params: {
        address: `0x${'69'.repeat(20)}`,
      } as any
    })
    expect(result.balance).toBe(numberToHex(420n))
    expect(result.deployedBytecode).toBe(daiContract.deployedBytecode)
  })
})
