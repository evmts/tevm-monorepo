import { describe, expect, it } from 'bun:test'
import { createChain } from '@tevm/blockchain'
import { createCommon, optimism } from '@tevm/common'
import { createEvm } from '@tevm/evm'
import { createStateManager } from '@tevm/state'
import { createVm } from './createVm.js'

describe(createVm.name, () => {
	it('creates a VM capable of building blocks', async () => {
		const common = createCommon({ ...optimism, eips: [], hardfork: 'prague', loggingLevel: 'warn' })
		const stateManager = createStateManager({})
		const blockchain = await createChain({
			common,
		})
		const evm = await createEvm({
			stateManager,
			blockchain,
			common,
		})
		const vm = createVm({
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
				gasLimit: '0x1c9c380',
				gasUsed: '0x0',
				logsBloom:
					'0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
				mixHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
				nonce: '0x0000000000000000',
				number: '0x1',
				parentBeaconBlockRoot: '0x0000000000000000000000000000000000000000000000000000000000000000',
				receiptTrie: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
				parentHash: '0x04f3224bc7809708a4b860e9fdd4588b38f4bcadb994f9ae1793a2ed2c38011d',
				transactionsTrie: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
				uncleHash: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
				withdrawalsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
				stateRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
				requestsRoot: '0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
				// timestamp: "0x66384299",
			},
			requests: [],
			transactions: [],
			uncleHeaders: [],
			withdrawals: [],
		})
	})
})
