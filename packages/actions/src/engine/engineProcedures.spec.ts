import { createTevmNode } from '@tevm/node'
import { bytesToHex } from '@tevm/utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { requestProcedure } from '../requestProcedure.js'

let client: any
beforeEach(async () => {
  client = createTevmNode()
  await client.ready()
})

describe('engine procedures', () => {
  it('handles forkchoice->getPayload lifecycle', async () => {
    const fc = await requestProcedure(client)({ jsonrpc: '2.0', id: 1, method: 'engine_forkchoiceUpdatedV1', params: [{ headBlockHash: '0x1', safeBlockHash: '0x1', finalizedBlockHash: '0x1' }, { timestamp: '0x1', prevRandao: '0x1', suggestedFeeRecipient: '0x0000000000000000000000000000000000000000' }] } as any)
    expect(fc.error).toBeUndefined()
    const payloadId = fc.result.payloadId
    const payload = await requestProcedure(client)({ jsonrpc: '2.0', id: 2, method: 'engine_getPayloadV1', params: [payloadId] } as any)
    expect(payload.error).toBeUndefined()
  })

  it('returns invalid params for unknown payload id', async () => {
    const res = await requestProcedure(client)({ jsonrpc: '2.0', id: 1, method: 'engine_getPayloadV1', params: ['0xdeadbeef'] } as any)
    expect(res.error).toBeDefined()
  })

  it('supports newPayload accepted for unknown parent', async () => {
    const res = await requestProcedure(client)({ jsonrpc: '2.0', id: 1, method: 'engine_newPayloadV3', params: [{ blockHash: '0x2' }] } as any)
    expect(res.result.status).toBe('ACCEPTED')
  })

  it('enforces lookup limits', async () => {
    const many = Array.from({ length: 1025 }, (_, i) => `0x${(i + 1).toString(16)}`)
    const byHash = await requestProcedure(client)({ jsonrpc: '2.0', id: 1, method: 'engine_getPayloadBodiesByHashV1', params: [many] } as any)
    expect(byHash.error).toBeDefined()
    const blobs = await requestProcedure(client)({ jsonrpc: '2.0', id: 2, method: 'engine_getBlobsV1', params: [many] } as any)
    expect(blobs.error).toBeDefined()
  })

  it('builds empty block via testing_buildBlockV1', async () => {
    const vm = await client.getVm()
    const parent = await vm.blockchain.getCanonicalHeadBlock()
    const parentHash = bytesToHex(parent.hash())
    const res = await requestProcedure(client)({
      jsonrpc: '2.0',
      id: 10,
      method: 'testing_buildBlockV1',
      params: [parentHash, { timestamp: '0x1', prevRandao: `0x${'11'.repeat(32)}`, suggestedFeeRecipient: '0x0000000000000000000000000000000000000000' }, null, '0x'],
    } as any)
    expect(res.error).toBeUndefined()
    expect(res.result.executionPayload.parentHash).toBe(parentHash)
  })

  it('rejects malformed testing_buildBlockV1 params', async () => {
    const res = await requestProcedure(client)({ jsonrpc: '2.0', id: 11, method: 'testing_buildBlockV1', params: ['nope', {}, [], '0x'] } as any)
    expect(res.error).toBeDefined()
  })

  it('rejects unknown parent in testing_buildBlockV1', async () => {
    const res = await requestProcedure(client)({
      jsonrpc: '2.0',
      id: 12,
      method: 'testing_buildBlockV1',
      params: ['0x' + '11'.repeat(32), { timestamp: '0x1', prevRandao: `0x${'11'.repeat(32)}`, suggestedFeeRecipient: '0x0000000000000000000000000000000000000000' }, null, '0x'],
    } as any)
    expect(res.error).toBeDefined()
  })

  it('rejects transaction application failure in testing_buildBlockV1', async () => {
    const vm = await client.getVm()
    const parent = await vm.blockchain.getCanonicalHeadBlock()
    const parentHash = bytesToHex(parent.hash())
    const res = await requestProcedure(client)({
      jsonrpc: '2.0',
      id: 13,
      method: 'testing_buildBlockV1',
      params: [parentHash, { timestamp: '0x1', prevRandao: `0x${'11'.repeat(32)}`, suggestedFeeRecipient: '0x0000000000000000000000000000000000000000' }, ['0x01'], '0x'],
    } as any)
    expect(res.error).toBeDefined()
  })
})
