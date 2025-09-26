import { getBlockFromRpc } from '@tevm/blockchain'
import { optimism } from '@tevm/common'
import { createTevmNode } from '@tevm/node'
import { transports } from '@tevm/test-utils'
import { describe, expect, it } from 'vitest'
import { blockToJsonRpcBlock } from './blockToJsonRpcBlock.js'

describe('blockToJsonRpcBlock', async () => {
	const client = createTevmNode({ common: optimism })
	const vm = await client.getVm()
	const [block] = await getBlockFromRpc(
		vm.blockchain,
		{ blockTag: 141658503n, transport: transports.optimism },
		vm.common,
	)

	it('should convert block to JSON-RPC block format with transactions', async () => {
		expect(await blockToJsonRpcBlock(block, true)).toMatchSnapshot()
	})

	it('should convert block to JSON-RPC block format without transactions', async () => {
		expect(await blockToJsonRpcBlock(block, false)).toMatchSnapshot()
	})
})
