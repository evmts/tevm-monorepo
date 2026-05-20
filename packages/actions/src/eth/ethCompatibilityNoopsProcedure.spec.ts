import { createTevmNode } from '@tevm/node'
import { beforeEach, describe, expect, it } from 'vitest'
import { createHandlers } from '../createHandlers.js'

describe('eth/debug compatibility noops', () => {
  let handlers: any
  beforeEach(async () => {
    const client = createTevmNode()
    await client.ready()
    handlers = createHandlers(client)
  })

  it('returns post-merge empty values for PoW and bad blocks', async () => {
    expect((await handlers.eth_getWork({ jsonrpc: '2.0', method: 'eth_getWork', params: [] })).result).toEqual(['0x0', '0x0', '0x0'])
    expect((await handlers.eth_hashrate({ jsonrpc: '2.0', method: 'eth_hashrate', params: [] })).result).toBe('0x0')
    expect((await handlers.eth_submitHashrate({ jsonrpc: '2.0', method: 'eth_submitHashrate', params: ['0x0', '0x0'] })).result).toBe(false)
    expect((await handlers.eth_submitWork({ jsonrpc: '2.0', method: 'eth_submitWork', params: ['0x0', '0x0', '0x0'] })).result).toBe(false)
    expect((await handlers.debug_getBadBlocks({ jsonrpc: '2.0', method: 'debug_getBadBlocks', params: [] })).result).toEqual([])
  })

  it('handles unknown block tags and uncles explicitly', async () => {
    const unk = await handlers.eth_getUncleCountByBlockNumber({ jsonrpc: '2.0', method: 'eth_getUncleCountByBlockNumber', params: ['0xdeadbeef'] })
    expect(unk.error?.code).toBe(-32602)
    expect((await handlers.eth_getUncleCountByBlockHash({ jsonrpc: '2.0', method: 'eth_getUncleCountByBlockHash', params: ['0x1234'] })).result).toBe('0x0')
    expect((await handlers.eth_getUncleByBlockHashAndIndex({ jsonrpc: '2.0', method: 'eth_getUncleByBlockHashAndIndex', params: ['0x1234', '0x0'] })).result).toBeNull()
    expect((await handlers.eth_getUncleByBlockNumberAndIndex({ jsonrpc: '2.0', method: 'eth_getUncleByBlockNumberAndIndex', params: ['latest', '0x0'] })).result).toBeNull()
  })

  it('preserves storage request order for addresses and slots', async () => {
    const addr = `0x${'00'.repeat(19)}01`
    const res = await handlers.eth_getStorageValues({
      jsonrpc: '2.0',
      method: 'eth_getStorageValues',
      params: [
        [
          [addr, ['0x0', '0x1']],
          [addr, ['0x2']],
        ],
        'latest',
      ],
    })
    expect(res.result).toHaveLength(2)
    expect(res.result[0]).toHaveLength(2)
    expect(res.result[1]).toHaveLength(1)
  })
})
