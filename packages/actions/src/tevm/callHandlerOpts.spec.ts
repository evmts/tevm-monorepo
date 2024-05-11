import { callHandlerOpts } from './callHandlerOpts.js'
import { createBaseClient } from '@tevm/base-client'
import { EthjsAddress } from '@tevm/utils'
import { hexToBytes } from '@tevm/utils'
import { describe, expect, it } from 'bun:test'

describe('callHandlerOpts', () => {
  const client = createBaseClient()
  it('should handle empty params', async () => {
    const result = await callHandlerOpts(client, {})
    expect(result.data).toMatchSnapshot()
  })

  it('should parse caller address correctly', async () => {
    const params = { caller: `0x${'4'.repeat(40)}` } as const
    const result = await callHandlerOpts(client, params)
    expect(result.data?.caller).toEqual(EthjsAddress.fromString(params.caller))
  })

  it('should set both origin and caller to from address if provided', async () => {
    const params = { from: `0x${'4'.repeat(40)}` } as const
    const result = await callHandlerOpts(client, params)
    expect(result.data?.caller).toEqual(EthjsAddress.fromString(params.from))
    expect(result.data?.origin).toEqual(EthjsAddress.fromString(params.from))
  })

  it('origin and caller take presidence over from', async () => {
    const params = {
      from: `0x${'4'.repeat(40)}`,
      origin: `0x${'5'.repeat(40)}`,
      caller: `0x${'6'.repeat(40)}`,
    } as const
    const result = await callHandlerOpts(client, params)
    expect(result.data?.caller).toEqual(EthjsAddress.fromString(params.caller))
    expect(result.data?.origin).toEqual(EthjsAddress.fromString(params.origin))
  })

  it('origin and caller take presidence over from', async () => {
    const params = {
      from: `0x${'4'.repeat(40)}`,
      origin: `0x${'5'.repeat(40)}`,
      caller: `0x${'6'.repeat(40)}`,
    } as const
    const result = await callHandlerOpts(client, params)
    expect(result.data?.caller).toEqual(EthjsAddress.fromString(params.caller))
    expect(result.data?.origin).toEqual(EthjsAddress.fromString(params.origin))
  })

  it('origin and caller take presidence over from', async () => {
    const params = {
      from: `0x${'4'.repeat(40)}`,
      origin: `0x${'5'.repeat(40)}`,
      caller: `0x${'6'.repeat(40)}`,
    } as const
    const result = await callHandlerOpts(client, params)
    expect(result.data?.caller).toEqual(EthjsAddress.fromString(params.caller))
    expect(result.data?.origin).toEqual(EthjsAddress.fromString(params.origin))
  })

  it('should parse transaction to address', async () => {
    const to = `0x${'3'.repeat(40)}` as const
    const result = await callHandlerOpts(client, {
      to,
    })
    expect(result.data?.to).toEqual(EthjsAddress.fromString(to))
  })

  it('should parse data to bytes', async () => {
    const data = `0x${'3'.repeat(40)}` as const
    const result = await callHandlerOpts(client, {
      data,
    })
    expect(result.data?.data).toEqual(hexToBytes(data))
  })

  it('should parse salt to bytes', async () => {
    const salt = `0x${'3'.repeat(40)}` as const
    const result = await callHandlerOpts(client, {
      salt,
    })
    expect(result.data?.salt).toEqual(hexToBytes(salt))
  })

  it('should handle depth', async () => {
    const depth = 5
    const result = await callHandlerOpts(client, {
      depth,
    })
    expect(result.data?.depth).toEqual(depth)
  })

  it('should parse blob versioned hashes to buffers', async () => {
    const versionedHash = `0x${'3'.repeat(40)}` as const
    const result = await callHandlerOpts(client, {
      blobVersionedHashes: [versionedHash],
    })
    expect(result.data?.blobVersionedHashes?.[0]).toEqual(
      hexToBytes(versionedHash),
    )
  })

  it('should handle selfdestruct', async () => {
    const selfdestruct = new Set([
      EthjsAddress.zero().toString() as `0x${string}`,
    ])
    const result = await callHandlerOpts(client, {
      selfdestruct,
    })
    expect(result.data?.selfdestruct).toEqual(selfdestruct)
  })

  it('should handle skipBalance', async () => {
    const skipBalance = true
    const result = await callHandlerOpts(client, {
      skipBalance,
    })
    expect(result.data?.skipBalance).toEqual(skipBalance)
  })

  it('should handle gasRefund', async () => {
    const gasRefund = 100n
    const result = await callHandlerOpts(client, {
      gasRefund,
    })
    expect(result.data?.gasRefund).toEqual(gasRefund)
  })

  it('should handle gasPrice', async () => {
    const gasPrice = 100n
    const result = await callHandlerOpts(client, {
      gasPrice,
    })
    expect(result.data).toMatchObject({ gasPrice })
  })

  it('should handle value', async () => {
    const value = 100n
    const result = await callHandlerOpts(client, {
      value,
    })
    expect(result.data?.value).toEqual(value)
  })

  it('should handle origin', async () => {
    const origin = EthjsAddress.zero().toString() as `0x${string}`
    const result = await callHandlerOpts(client, {
      origin,
    })
    expect(result.data?.origin).toEqual(EthjsAddress.zero())
  })

  it('should handle gasLimit', async () => {
    const gas = 100n
    const result = await callHandlerOpts(client, {
      gas,
    })
    expect(result.data).toMatchObject({ gasLimit: gas })
  })
})
