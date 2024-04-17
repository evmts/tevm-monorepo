import { describe, expect, it } from "bun:test";
import { createVm } from "./createVm.js";
import { createEvm } from "@tevm/evm";
import { createCommon } from "@tevm/common";
import { createTevmStateManager } from "@tevm/state";
import { createBlockchain } from "@tevm/blockchain";

describe(createVm.name, () => {
  it('wraps ethereumjs vm', async () => {
    const common = createCommon({})
    const stateManager = createTevmStateManager({
      normal: {
      }
    })
    const blockchain = await createBlockchain({
      common,
    })
    const evm = await createEvm({
      stateManager,
      blockchain,
      common,
    })
    const vm = await createVm({
      evm,
      common,
      blockchain,
      stateManager
    })
    const newBlock = await vm.buildBlock({
      parentBlock: await blockchain.getCanonicalHeadBlock()
    }).then(b => b.build()).then(b => b.toJSON())
    expect(newBlock).toMatchObject({
      "header": {
        "baseFeePerGas": "0x342770c0",
        "coinbase": "0x0000000000000000000000000000000000000000",
        "difficulty": "0x0",
        "extraData": "0x",
        "gasLimit": "0x1388",
        "gasUsed": "0x0",
        "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        "mixHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "nonce": "0x0000000000000000",
        "number": "0x1",
        "parentHash": "0x72522f54118efed6bcf366976453e1984b9160ea0cbba0e6d575c3f3bc3a6b45",
        "receiptTrie": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
        "stateRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
        // "timestamp": "0x661f3668",
        "transactionsTrie": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
        "uncleHash": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
        "withdrawalsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
      },
      "transactions": [],
      "uncleHeaders": [],
      "withdrawals": [],
    })
  })
})
