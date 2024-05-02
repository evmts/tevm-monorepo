import { describe, expect, it } from "bun:test";
import { mineHandler } from "./mineHandler.js";
import { createBaseClient, type BaseClient } from "@tevm/base-client";
import { bytesToHex, hexToBytes } from "@tevm/utils";
import { callHandler } from "./callHandler.js";

const getBlockNumber = (client: BaseClient) => {
  return client
    .getVm()
    .then(vm => vm.blockchain.getCanonicalHeadBlock())
    .then(block => block.header.number)
}

describe(mineHandler.name, () => {
  /**
  it('as a default it should mine 1 block', async () => {
    const client = createBaseClient()
    expect(
      await getBlockNumber(client)
    ).toBe(0n)
    await mineHandler(client)({})
    expect(
      await getBlockNumber(client)
    ).toBe(1n)
  })

  it('should work in forked mode too', async () => {
    const client = createBaseClient({ fork: { url: 'https://mainnet.optimism.io' } })
    const bn = await getBlockNumber(client)
    expect(
      bn
    ).toBeGreaterThan(119504797n)
    await mineHandler(client)({})
    expect(
      await getBlockNumber(client)
    ).toBe(bn + 1n)
  })

  it('can be passed blockCount and interval props', async () => {
    const client = createBaseClient()
    expect(
      await getBlockNumber(client)
    ).toBe(0n)
    await mineHandler(client)({
      interval: 2,
      blockCount: 2,
    })
    expect(
      await getBlockNumber(client)
    ).toBe(2n)
    const latestBlock = await client.getVm().then(vm => vm.blockchain.getCanonicalHeadBlock())
    expect(latestBlock.header.number).toBe(2n)
    const parentBlock = await client.getVm().then(vm => vm.blockchain.getBlock(latestBlock.header.parentHash))
    expect(parentBlock.header.timestamp + 2n).toBe(latestBlock.header.timestamp)
  })
  */

  it('works with transactions in the tx pool', async () => {
    const client = createBaseClient()
    const to = `0x${'69'.repeat(20)}` as const
    // send value
    expect(
      await callHandler(client)({
        createTransaction: true,
        to,
        value: 420n,
        skipBalance: true,
      }),
    ).toEqual({
      executionGasUsed: 0n,
      rawData: '0x',
      txHash: '0xb4df2c67ad5891984ea71d01309d55d4e7ae00c554b78517e861f028c9fbcbfc'
    })
    expect(await client.getTxPool().then(pool => [...pool.pool.keys()].length)).toBe(1)
    await mineHandler(client)({
    })

    expect(
      await getBlockNumber(client)
    ).toBe(1n)

    // receipt should exist now
    const receiptsManager = await client.getReceiptsManager()
    const block = await (await client.getVm()).blockchain.getCanonicalHeadBlock()
    console.log('block receipts', await receiptsManager.getReceipts(block.hash()))
    const receipt = await receiptsManager.getReceiptByTxHash(hexToBytes('0x38dd3a80d0b591b59d425b9492f3ae36251cab5ca27d1c3337e147bb2a40cf1b'))
    expect(
      receipt
    ).toEqual({})
  })
})
