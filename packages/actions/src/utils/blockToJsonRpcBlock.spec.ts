import { getBlockFromRpc } from '@tevm/blockchain'
import { createCachedOptimismNode } from '@tevm/test-utils'
import { describe, expect, it } from 'vitest'
import { blockToJsonRpcBlock } from './blockToJsonRpcBlock.js'

describe('blockToJsonRpcBlock', async () => {
	const client = createCachedOptimismNode()
	const transport = client.forkTransport
	if (!transport) throw new Error('Transport is not defined')
	const vm = await client.getVm()
	const [block] = await getBlockFromRpc(vm.blockchain, { blockTag: 141866019n, transport }, vm.common)

	it('should convert block to JSON-RPC block format with transactions', async () => {
		expect(await blockToJsonRpcBlock(block, true)).toMatchSnapshot()
	})

	it('should convert block to JSON-RPC block format without transactions', async () => {
		expect(await blockToJsonRpcBlock(block, false)).toMatchSnapshot()
	})
})
