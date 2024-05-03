import { describe, expect, it } from 'bun:test'
import { createChain } from '@tevm/blockchain'
import { createCommon } from '@tevm/common'
import { createEvm } from '@tevm/evm'
import { createStateManager } from '@tevm/state'
import { createVm } from './createVm.js'

describe(createVm.name, () => {
	it('wraps ethereumjs vm', async () => {
		const common = createCommon({})
		const stateManager = createStateManager({})
		const blockchain = await createChain({
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
			stateManager,
		})
		const newBlock = await vm
			.buildBlock({
				parentBlock: await blockchain.getCanonicalHeadBlock(),
			})
			.then((b) => b.build())
			.then((b) => b.toJSON())
		expect(newBlock).toMatchObject({
			header: {
				baseFeePerGas: '0x7',
				blobGasUsed: '0x0',
				coinbase: '0x0000000000000000000000000000000000000000',
				difficulty: '0x0',
				excessBlobGas: '0x0',
				extraData: '0x',
				gasLimit: '0x1388',
				gasUsed: '0x0',
				logsBloom:
					'0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
				mixHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
				nonce: '0x0000000000000000',
				number: '0x1',
				parentBeaconBlockRoot: '0x0000000000000000000000000000000000000000000000000000000000000000',
				receiptTrie: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
				parentHash: '0x0a08ff283859233ac6f9a5044053a3d9069cf5254fbe45adad75fb85213b5b96',
				stateRoot: '0xbc36789e7a1e281436464229828f817d6612f7b477d66591ff96a9e064bcc98a',
				// timestamp: "0x663196f1",
				transactionsTrie: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
				uncleHash: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
				withdrawalsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
			},
			transactions: [],
			uncleHeaders: [],
			withdrawals: [],
		})
	})
})
