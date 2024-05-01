import { describe, expect, it } from "bun:test";
import { mineHandler } from "./mineHandler.js";
import { createBaseClient, type BaseClient } from "@tevm/base-client";

const getBlockNumber = (client: BaseClient) => {
  return client
    .getVm()
    .then(vm => vm.blockchain.getCanonicalHeadBlock())
    .then(block => block.header.number)
}

describe(mineHandler.name, () => {
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
})
