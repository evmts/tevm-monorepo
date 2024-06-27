import { describe, expect, it } from 'bun:test'
import { createBaseClient } from '@tevm/base-client'
import { blockToJsonRpcBlock } from './blockToJsonRpcBlock.js'
import { getBlockFromRpc } from '@tevm/blockchain'
import { transports } from '@tevm/test-utils'

describe('blockToJsonRpcBlock', async () => {
	const client = createBaseClient()
	const vm = await client.getVm()
	const block = await getBlockFromRpc({ blockTag: 121960766n, transport: transports.optimism }, vm.common)

	it('should convert block to JSON-RPC block format with transactions', async () => {
		expect(await blockToJsonRpcBlock(block, true)).toMatchSnapshot()
	})

	it('should convert block to JSON-RPC block format without transactions', async () => {
		expect(await blockToJsonRpcBlock(block, false)).toMatchSnapshot()
	})
})
